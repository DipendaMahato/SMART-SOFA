package com.example.smartsofa.data.bluetooth

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import java.util.UUID

sealed class BleState {
    object Idle : BleState()
    object Scanning : BleState()
    data class DeviceFound(val devices: List<BluetoothDevice>) : BleState()
    object Connecting : BleState()
    object Connected : BleState()
    object DiscoveringServices : BleState()
    object WritingCredentials : BleState()
    object CredentialsWritten : BleState()
    data class Error(val message: String) : BleState()
}

@SuppressLint("MissingPermission")
class BleProvisioningManager(private val context: Context) {

    private val bluetoothAdapter: BluetoothAdapter? by lazy {
        val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as android.bluetooth.BluetoothManager
        bluetoothManager.adapter
    }

    private val bleScanner by lazy { bluetoothAdapter?.bluetoothLeScanner }
    private var bluetoothGatt: BluetoothGatt? = null
    
    private val handler = Handler(Looper.getMainLooper())

    companion object {
        private const val TAG = "BleProvisioningManager"
        
        // Custom Service and Characteristic UUIDs for Smart Sofa Provisioning
        val SERVICE_UUID: UUID = UUID.fromString("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("beb5483e-36e1-4688-b7f5-ea07361b26a8")
    }

    private fun isMatchingDevice(result: ScanResult): Boolean {
        val device = result.device
        val devName = device.name
        val recName = result.scanRecord?.deviceName
        
        val nameMatch = (devName != null && (devName.contains("Smart Sofa", ignoreCase = true) || devName.contains("SS00", ignoreCase = true) || devName.contains("ESP32", ignoreCase = true))) ||
                        (recName != null && (recName.contains("Smart Sofa", ignoreCase = true) || recName.contains("SS00", ignoreCase = true) || recName.contains("ESP32", ignoreCase = true)))

        val serviceMatch = result.scanRecord?.serviceUuids?.any { 
            it.uuid == SERVICE_UUID 
        } == true

        return nameMatch || serviceMatch
    }

    fun scanDevices(): Flow<BleState> = callbackFlow {
        val discoveredDevices = mutableListOf<BluetoothDevice>()
        
        if (bluetoothAdapter == null || !bluetoothAdapter!!.isEnabled) {
            trySend(BleState.Error("Bluetooth is disabled or not supported"))
            close()
            return@callbackFlow
        }

        if (bleScanner == null) {
            trySend(BleState.Error("BLE Scanner is unavailable"))
            close()
            return@callbackFlow
        }

        val scanCallback = object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult) {
                if (isMatchingDevice(result)) {
                    val device = result.device
                    if (!discoveredDevices.any { it.address == device.address }) {
                        discoveredDevices.add(device)
                        trySend(BleState.DeviceFound(discoveredDevices.toList()))
                    }
                }
            }

            override fun onBatchScanResults(results: List<ScanResult>) {
                var updated = false
                for (result in results) {
                    if (isMatchingDevice(result)) {
                        val device = result.device
                        if (!discoveredDevices.any { it.address == device.address }) {
                            discoveredDevices.add(device)
                            updated = true
                        }
                    }
                }
                if (updated) {
                    trySend(BleState.DeviceFound(discoveredDevices.toList()))
                }
            }

            override fun onScanFailed(errorCode: Int) {
                trySend(BleState.Error("Scan failed with error code: $errorCode"))
            }
        }

        trySend(BleState.Scanning)
        
        val settings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()

        try {
            bleScanner?.startScan(null, settings, scanCallback)
            Log.d(TAG, "BLE scan started")
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException during BLE scan", e)
            trySend(BleState.Error("Bluetooth scanning permission missing. Please grant Bluetooth permission."))
            close()
            return@callbackFlow
        } catch (e: Exception) {
            Log.e(TAG, "Exception during BLE scan", e)
            trySend(BleState.Error("Could not start BLE scan: ${e.localizedMessage}"))
            close()
            return@callbackFlow
        }

        // Stop scan automatically after 15 seconds
        val stopScanRunnable = Runnable {
            try {
                bleScanner?.stopScan(scanCallback)
            } catch (e: Exception) {
                Log.e(TAG, "Error stopping scan", e)
            }
            Log.d(TAG, "BLE scan timed out and stopped")
        }
        handler.postDelayed(stopScanRunnable, 15000)

        awaitClose {
            handler.removeCallbacks(stopScanRunnable)
            try {
                bleScanner?.stopScan(scanCallback)
            } catch (e: Exception) {
                Log.e(TAG, "Error in awaitClose stopScan", e)
            }
            Log.d(TAG, "BLE scan stopped in awaitClose")
        }
    }

    fun provisionDevice(
        device: BluetoothDevice,
        ssid: String,
        pass: String
    ): Flow<BleState> = callbackFlow {
        
        trySend(BleState.Connecting)

        val connectTimeoutRunnable = Runnable {
            Log.e(TAG, "GATT Connection timed out")
            trySend(BleState.Error("BLE Connection timed out. Please ensure the ESP32 is powered on and near the sofa."))
            bluetoothGatt?.disconnect()
            bluetoothGatt?.close()
            bluetoothGatt = null
            close()
        }
        // Set 12 second connection timeout
        handler.postDelayed(connectTimeoutRunnable, 12000)

        val gattCallback = object : BluetoothGattCallback() {
            override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
                handler.removeCallbacks(connectTimeoutRunnable)

                if (status != BluetoothGatt.GATT_SUCCESS) {
                    Log.e(TAG, "GATT connection status error: $status")
                    trySend(BleState.Error("Connection failed (GATT Error $status). Retry provisioning."))
                    gatt.close()
                    close()
                    return
                }

                if (newState == BluetoothProfile.STATE_CONNECTED) {
                    Log.i(TAG, "Connected to GATT server.")
                    trySend(BleState.Connected)
                    trySend(BleState.DiscoveringServices)

                    // 200ms delay before discoverServices for ESP32 stability
                    handler.postDelayed({
                        gatt.discoverServices()
                    }, 200)
                } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                    Log.i(TAG, "Disconnected from GATT server.")
                    trySend(BleState.Idle)
                    gatt.close()
                    close()
                }
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                if (status != BluetoothGatt.GATT_SUCCESS) {
                    trySend(BleState.Error("Service discovery failed with status $status"))
                    gatt.disconnect()
                    return
                }

                val service = gatt.getService(SERVICE_UUID)
                if (service == null) {
                    trySend(BleState.Error("Smart Sofa service not found on device"))
                    gatt.disconnect()
                    return
                }

                val characteristic = service.getCharacteristic(CHARACTERISTIC_UUID)
                if (characteristic == null) {
                    trySend(BleState.Error("Provisioning characteristic not found"))
                    gatt.disconnect()
                    return
                }

                // Prepare credentials in format SSID|PASSWORD
                val payload = "$ssid|$pass"
                val payloadBytes = payload.toByteArray(Charsets.UTF_8)
                trySend(BleState.WritingCredentials)

                // Use the API 33+ write overload if available, otherwise use legacy setter
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                    gatt.writeCharacteristic(
                        characteristic,
                        payloadBytes,
                        BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
                    )
                } else {
                    @Suppress("DEPRECATION")
                    characteristic.value = payloadBytes
                    @Suppress("DEPRECATION")
                    characteristic.writeType = BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
                    @Suppress("DEPRECATION")
                    gatt.writeCharacteristic(characteristic)
                }
            }

            override fun onCharacteristicWrite(
                gatt: BluetoothGatt,
                characteristic: BluetoothGattCharacteristic,
                status: Int
            ) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    Log.i(TAG, "Credentials written successfully")
                    trySend(BleState.CredentialsWritten)
                    
                    // Disconnect gracefully after short delay to let device save credentials
                    handler.postDelayed({
                        gatt.disconnect()
                    }, 1000)
                } else {
                    Log.e(TAG, "Characteristic write failed: $status")
                    trySend(BleState.Error("Failed to write Wi-Fi credentials (error $status)"))
                    gatt.disconnect()
                }
            }
        }

        try {
            bluetoothGatt = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                device.connectGatt(context, false, gattCallback, BluetoothDevice.TRANSPORT_LE)
            } else {
                device.connectGatt(context, false, gattCallback)
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException during connectGatt", e)
            trySend(BleState.Error("Bluetooth connection permission missing. Please grant Bluetooth permission."))
            close()
        } catch (e: Exception) {
            Log.e(TAG, "Exception during connectGatt", e)
            trySend(BleState.Error("Could not connect to device: ${e.localizedMessage}"))
            close()
        }

        awaitClose {
            handler.removeCallbacks(connectTimeoutRunnable)
            bluetoothGatt?.disconnect()
            bluetoothGatt?.close()
            bluetoothGatt = null
        }
    }
}
