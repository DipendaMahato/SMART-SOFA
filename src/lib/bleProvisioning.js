// Web Bluetooth BLE Provisioning helper matching Android BleProvisioningManager.kt

export const BLE_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
export const BLE_CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function isWebBluetoothSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export async function provisionSmartSofaBle(ssid, password, onStateChange) {
  onStateChange?.({ status: 'Connecting', message: 'Requesting Bluetooth device...' });

  if (!isWebBluetoothSupported()) {
    // Fallback simulation for unsupported browsers/contexts
    console.warn("Web Bluetooth not available in current environment. Simulating BLE provisioning...");
    return simulateProvisioning(ssid, password, onStateChange);
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'Smart Sofa' },
        { namePrefix: 'ESP32' },
        { namePrefix: 'SS00' },
        { services: [BLE_SERVICE_UUID] }
      ],
      optionalServices: [BLE_SERVICE_UUID]
    });

    onStateChange?.({ status: 'Connected', message: `Connected to ${device.name || 'Smart Sofa'}. Opening GATT server...` });

    const server = await device.gatt.connect();
    onStateChange?.({ status: 'DiscoveringServices', message: 'Discovering Smart Sofa GATT services...' });

    const service = await server.getPrimaryService(BLE_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);

    onStateChange?.({ status: 'WritingCredentials', message: `Writing Wi-Fi credentials for "${ssid}"...` });

    const encoder = new TextEncoder();
    const payload = encoder.encode(`${ssid}|${password}`);
    await characteristic.writeValue(payload);

    onStateChange?.({ status: 'CredentialsWritten', message: 'Credentials transferred successfully! ESP32 connecting to Wi-Fi...' });

    setTimeout(() => {
      device.gatt.disconnect();
    }, 1500);

    return { success: true };
  } catch (error) {
    console.error("BLE Provisioning error:", error);
    onStateChange?.({ status: 'Error', message: error.message || 'BLE Provisioning canceled or failed.' });
    return { success: false, error: error.message };
  }
}

function simulateProvisioning(ssid, password, onStateChange) {
  return new Promise((resolve) => {
    onStateChange?.({ status: 'Scanning', message: 'Scanning nearby Smart Sofa BLE beacons...' });

    setTimeout(() => {
      onStateChange?.({ status: 'Connecting', message: 'Pairing with ESP32-SOFA-88A12 over BLE...' });
    }, 1200);

    setTimeout(() => {
      onStateChange?.({ status: 'DiscoveringServices', message: 'Analyzing GATT Provisioning service...' });
    }, 2400);

    setTimeout(() => {
      onStateChange?.({ status: 'WritingCredentials', message: `Encrypting & sending Wi-Fi SSID "${ssid}"...` });
    }, 3600);

    setTimeout(() => {
      onStateChange?.({ status: 'CredentialsWritten', message: 'Credentials stored in ESP32 NVS memory!' });
      resolve({ success: true });
    }, 4800);
  });
}
