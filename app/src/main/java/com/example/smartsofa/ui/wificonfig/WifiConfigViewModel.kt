package com.example.smartsofa.ui.wificonfig

import android.app.Application
import android.bluetooth.BluetoothDevice
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.bluetooth.BleProvisioningManager
import com.example.smartsofa.data.bluetooth.BleState
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.DeviceStatus
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class WifiConfigViewModel(application: Application) : AndroidViewModel(application) {

    private val bleManager = BleProvisioningManager(application.applicationContext)
    
    // Wi-Fi inputs
    var ssid by mutableStateOf("")
        private set
    var password by mutableStateOf("")
        private set
    var isPasswordVisible by mutableStateOf(false)
        private set

    // Validations
    var ssidError by mutableStateOf<String?>(null)
        private set
    var passwordError by mutableStateOf<String?>(null)
        private set

    // BLE and Provisioning status states
    private val _bleState = MutableStateFlow<BleState>(BleState.Idle)
    val bleState: StateFlow<BleState> = _bleState.asStateFlow()

    private val _provisioningSuccess = MutableStateFlow(false)
    val provisioningSuccess: StateFlow<Boolean> = _provisioningSuccess.asStateFlow()

    // Database state observer
    private val _deviceStatus = MutableStateFlow(DeviceStatus())
    val deviceStatus: StateFlow<DeviceStatus> = _deviceStatus.asStateFlow()

    private var scanJob: Job? = null
    private var provisionJob: Job? = null
    private var firebaseObserverJob: Job? = null

    init {
        // Observe real-time device connection from Firebase RTDB
        viewModelScope.launch {
            FirebaseDatabaseManager.observeDeviceStatus().collectLatest { status ->
                _deviceStatus.value = status
                
                // If we are currently provisioning and the device comes online in Firebase
                if (_bleState.value is BleState.CredentialsWritten && status.wifiConnected && status.firebaseConnected) {
                    _provisioningSuccess.value = true
                    _bleState.value = BleState.Idle
                    cancelProvisioningJobs()
                }
            }
        }
    }

    fun updateSsid(value: String) {
        ssid = value
        ssidError = null
    }

    fun updatePassword(value: String) {
        password = value
        passwordError = null
    }

    fun togglePasswordVisibility() {
        isPasswordVisible = !isPasswordVisible
    }

    fun startScanning() {
        scanJob?.cancel()
        scanJob = viewModelScope.launch {
            bleManager.scanDevices().collectLatest { state ->
                _bleState.value = state
            }
        }
    }

    fun stopScanning() {
        scanJob?.cancel()
        if (_bleState.value is BleState.Scanning) {
            _bleState.value = BleState.Idle
        }
    }

    fun provision(device: BluetoothDevice) {
        var isValid = true
        if (ssid.trim().isEmpty()) {
            ssidError = "SSID cannot be empty"
            isValid = false
        }
        if (password.length < 8) {
            passwordError = "Password must be at least 8 characters"
            isValid = false
        }

        if (!isValid) return

        provisionJob?.cancel()
        _provisioningSuccess.value = false
        
        provisionJob = viewModelScope.launch {
            bleManager.provisionDevice(device, ssid.trim(), password).collectLatest { state ->
                _bleState.value = state
                
                // If credentials are successfully written, start a timeout check to wait for Firebase connection
                if (state is BleState.CredentialsWritten) {
                    startFirebaseTimeoutObserver()
                }
            }
        }
    }

    private fun startFirebaseTimeoutObserver() {
        firebaseObserverJob?.cancel()
        firebaseObserverJob = viewModelScope.launch {
            // Wait up to 30 seconds for the device to connect to Wi-Fi and report to Firebase
            val startTime = System.currentTimeMillis()
            while (System.currentTimeMillis() - startTime < 30000) {
                if (deviceStatus.value.wifiConnected && deviceStatus.value.firebaseConnected) {
                    _provisioningSuccess.value = true
                    _bleState.value = BleState.Idle
                    return@launch
                }
                kotlinx.coroutines.delay(1000)
            }
            // Timeout reached
            if (!_provisioningSuccess.value) {
                _bleState.value = BleState.Error("Device provisioning timed out. Verify Wi-Fi credentials and check ESP32 ranges.")
            }
        }
    }

    fun resetState() {
        cancelProvisioningJobs()
        _bleState.value = BleState.Idle
        _provisioningSuccess.value = false
    }

    private fun cancelProvisioningJobs() {
        scanJob?.cancel()
        provisionJob?.cancel()
        firebaseObserverJob?.cancel()
    }

    override fun onCleared() {
        super.onCleared()
        cancelProvisioningJobs()
    }
}
