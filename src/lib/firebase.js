import { initializeApp, getApps } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  remove, 
  update,
  off 
} from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://smartsofa-11154-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

let db = null;
try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getDatabase(app);
} catch (err) {
  console.warn("Firebase initialization warning (running in fallback demo mode):", err);
}

export { db };

// Default initial state matching Kotlin models
export const DEFAULT_SOFA_STATUS = {
  occupied: false,
  lastOccupiedAt: Date.now() - 450000,
  lastEmptyAt: Date.now() - 1200000,
  heatLevel: 2, // 0: Off, 1: Low, 2: Med, 3: High
  reclinerAngle: 110, // 90deg (upright) to 150deg (recline)
  massageMode: 'wave', // 'off', 'gentle', 'wave', 'intense'
};

export const DEFAULT_CONTROLS = {
  fan: false,
  light: true,
  mode: "manual", // 'manual' or 'auto'
  relayStatus: true,
  heating: false,
  lightColor: "#3B82F6",
  lightBrightness: 80,
  fanSpeed: 3
};

export const DEFAULT_ELECTRICAL_INFO = {
  voltage: 230.4,
  current: 1.85,
  power: 426.2,
  dailyEnergy: 3.42,
  weeklyEnergy: 24.8,
  monthlyEnergy: 98.5,
  relayStatus: true
};

export const DEFAULT_DEVICE_STATUS = {
  esp32aOnline: true,
  esp32bOnline: true,
  esp32aLastSeen: Date.now(),
  esp32bLastSeen: Date.now(),
  wifiConnected: true,
  firebaseConnected: true,
  deviceName: "Smart Sofa SS-001",
  deviceId: "ESP32-SOFA-88A12",
  firmwareVersion: "v1.4.2",
  wifiSsid: "Home_WiFi_5G",
  signalStrength: -62,
  ipAddress: "192.168.1.145",
  macAddress: "24:6F:28:AB:88:A1",
  uptimeSeconds: 142800
};

export const DEFAULT_HISTORY = [
  {
    id: "h1",
    type: "person_sitting",
    title: "Person Sitting",
    description: "Occupancy sensor detected presence on main cushion.",
    timestamp: Date.now() - 300000
  },
  {
    id: "h2",
    type: "light_on",
    title: "Ambient Light On",
    description: "Light mode adjusted to Royal Blue preset.",
    timestamp: Date.now() - 900000
  },
  {
    id: "h3",
    type: "fan_on",
    title: "Ventilation Active",
    description: "Auto cooling fan turned on due to ambient temp threshold.",
    timestamp: Date.now() - 1800000
  },
  {
    id: "h4",
    type: "esp32_connected",
    title: "ESP32 Connected",
    description: "Main controller ESP32-A synchronized telemetry.",
    timestamp: Date.now() - 3600000
  }
];

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "n1",
    type: "person_sitting",
    title: "Occupancy Detected",
    message: "Someone sat down on Smart Sofa 10 minutes ago.",
    timestamp: Date.now() - 600000,
    read: false
  },
  {
    id: "n2",
    type: "esp32_offline",
    title: "Telemetry Warning",
    message: "ESP32-B secondary module experienced temporary signal drop.",
    timestamp: Date.now() - 3600000,
    read: true
  },
  {
    id: "n3",
    type: "firebase_connected",
    title: "Cloud Sync Active",
    message: "Realtime Database sync restored successfully.",
    timestamp: Date.now() - 7200000,
    read: true
  }
];

// Database operations with fallback
export function subscribePath(path, callback, defaultValue) {
  if (!db) {
    callback(defaultValue);
    return () => {};
  }
  const dbRef = ref(db, path);
  const listener = onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(defaultValue);
      }
    },
    (error) => {
      console.warn(`Firebase read error for ${path}:`, error);
      callback(defaultValue);
    }
  );
  return () => off(dbRef, 'value', listener);
}

export async function updateControl(field, value) {
  if (!db) return;
  try {
    const dbRef = ref(db, `controls/${field}`);
    await set(dbRef, value);
  } catch (e) {
    console.warn("Failed to update control on Firebase:", e);
  }
}

export async function updateSofaStatus(field, value) {
  if (!db) return;
  try {
    const dbRef = ref(db, `sofa/${field}`);
    await set(dbRef, value);
  } catch (e) {
    console.warn("Failed to update sofa status on Firebase:", e);
  }
}
