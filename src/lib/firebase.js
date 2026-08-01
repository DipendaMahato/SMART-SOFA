import { initializeApp, getApps } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  remove, 
  off,
  get
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDytaVOCxt1UB2vVN3DBfkUZyMg21rnGfs",
  authDomain: "smartsofa-11154.firebaseapp.com",
  databaseURL: "https://smartsofa-11154-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartsofa-11154",
  storageBucket: "smartsofa-11154.firebasestorage.app",
  messagingSenderId: "827257182992",
  appId: "1:827257182992:android:88fbaafa79dbfc634be395"
};

let app;
let db = null;
let auth = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getDatabase(app);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase initialization warning:", err);
}

export { db, auth };

export const DEFAULT_DEVICE_ID = "SS001";

// ─────────────────────────────────────────────
// AUTH OPERATIONS
// ─────────────────────────────────────────────

export async function registerUser(email, password, fullName) {
  if (!auth) throw new Error("Auth not initialized");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: fullName });
  // Save user profile to RTDB
  if (db) {
    await set(ref(db, `users/${cred.user.uid}/profile`), {
      uid: cred.user.uid,
      fullName,
      name: fullName,
      email,
      createdAt: Date.now()
    });
    // Link default device SS001 to user
    await set(ref(db, `users/${cred.user.uid}/devices/${DEFAULT_DEVICE_ID}`), true);
  }
  return cred.user;
}

export async function loginUser(email, password) {
  if (!auth) throw new Error("Auth not initialized");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

export async function resetPassword(email) {
  if (!auth) throw new Error("Auth not initialized");
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(uid, profileData) {
  if (!auth) throw new Error("Auth not initialized");
  if (auth.currentUser && profileData.displayName) {
    await updateProfile(auth.currentUser, { displayName: profileData.displayName });
  }
  if (db && uid) {
    await set(ref(db, `users/${uid}/profile`), {
      ...profileData,
      uid,
      updatedAt: Date.now()
    });
    try { localStorage.setItem(`smartsofa_profile_${uid}`, JSON.stringify(profileData)); } catch (_) {}
  }
}

export async function loadUserProfile(uid) {
  if (!db || !uid) return null;
  try {
    const cached = localStorage.getItem(`smartsofa_profile_${uid}`);
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  try {
    const snap = await get(ref(db, `users/${uid}/profile`));
    if (snap.exists()) {
      const val = snap.val();
      try { localStorage.setItem(`smartsofa_profile_${uid}`, JSON.stringify(val)); } catch (_) {}
      return val;
    }
  } catch (_) {}
  return null;
}

export async function changeUserPassword(currentPassword, newPassword) {
  if (!auth || !auth.currentUser) throw new Error("Not authenticated");
  const user = auth.currentUser;
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────
// DEFAULT STATE SCHEMAS (Matching ESP32 Hardware + Web App)
// ─────────────────────────────────────────────

export const DEFAULT_SOFA_STATUS = {
  occupied: false,
  lastOccupiedAt: Date.now() - 450000,
  lastEmptyAt: Date.now() - 1200000,
  heatLevel: 2,
  reclinerAngle: 110,
  massageMode: 'wave',
};

export const DEFAULT_CONTROLS = {
  deviceName: "SmartSofa",
  fanName: "Cooling Fan",
  lightName: "Ambient Light",
  relayName: "Main Relay",
  tempName: "Room Temp",
  fan: false,
  light: false,
  mode: "Auto",
  relayStatus: true,
  lightColor: "#3B82F6",
  lightBrightness: 80,
  fanSpeed: 3,
  massagerIntensity: 65,
  heaterTemp: 85
};

export const DEFAULT_ELECTRICAL_INFO = {
  voltage: 230.5,
  current: 0.42,
  power: 96.5,
  roomTemp: 37.9,
  humidity: 71.9,
  dailyEnergy: 1.42,
  weeklyEnergy: 8.25,
  monthlyEnergy: 40.32,
  totalEnergy: 152.45,
  relayStatus: true
};

export const DEFAULT_DEVICE_STATUS = {
  esp32aOnline: true,
  esp32bOnline: true,
  esp32aLastSeen: Date.now(),
  esp32bLastSeen: Date.now(),
  wifiConnected: true,
  firebaseConnected: true,
  internetConnected: true,
  deviceName: "Living Room Smart Sofa",
  deviceId: "SS001",
  firmwareVersion: "1.0.0",
  hardwareVersion: "1.0",
  model: "SS-01",
  serialNumber: "SS001-0001",
  wifiSsid: "Home_WiFi_5G",
  signalStrength: -61,
  ipAddress: "192.168.137.45",
  macAddress: "D4:D4:DA:E5:3E:A0",
  uptimeSeconds: 612
};

export const DEFAULT_COMMANDS_SS001 = {
  ambientLight: false,
  autoMode: true,
  fan: { speed: 3, state: false },
  footRest: false,
  light: { brightness: 80, state: false },
  lumbarSupport: false,
  massage: { enabled: false, intensity: 2, mode: "Relax" },
  readingLamp: false,
  recliner: { angle: 95, enabled: false },
  seatHeating: false,
  usbCharging: false,
  voiceAssistant: false,
  wirelessCharging: false
};

export const DEFAULT_LIVE_DATA_SS001 = {
  charging: false,
  fanRunning: false,
  firebaseConnected: true,
  footRestRunning: false,
  humidity: 71.9,
  internetConnected: true,
  lastUpdate: Date.now(),
  lightRunning: false,
  massageRunning: false,
  personDetected: false,
  reclinerRunning: false,
  relayStatus: true,
  seatOccupied: false,
  temperature: 37.9,
  wifiConnected: true
};

export const DEFAULT_POWER_MONITORING_SS001 = {
  activePower: 96.5,
  apparentPower: 101.2,
  current: 0.42,
  energyMonth: 40.32,
  energyToday: 1.42,
  energyWeek: 8.25,
  estimatedBill: 356.2,
  frequency: 50,
  powerFactor: 0.95,
  reactivePower: 10.4,
  totalEnergy: 152.45,
  voltage: 230.5
};

export const DEFAULT_ALERTS_SS001 = {
  controllerRestarted: false,
  esp32AOffline: false,
  esp32BOffline: false,
  firebaseDisconnected: false,
  highTemperature: false,
  internetDisconnected: false,
  overCurrent: false,
  overVoltage: false,
  powerFailure: false,
  relayFailure: false,
  seatSensorFailure: false,
  wifiDisconnected: false
};

export const DEFAULT_NOTIFICATIONS = [
  { id: "n1", type: "person_sitting", title: "Occupancy Detected", message: "Someone sat down on Smart Sofa 10 minutes ago.", timestamp: Date.now() - 600000, read: false },
  { id: "n2", type: "esp32_offline", title: "Telemetry Warning", message: "ESP32-B secondary module experienced temporary signal drop.", timestamp: Date.now() - 3600000, read: true },
  { id: "n3", type: "firebase_connected", title: "Cloud Sync Active", message: "Realtime Database sync restored successfully.", timestamp: Date.now() - 7200000, read: true }
];

// ─────────────────────────────────────────────
// DATABASE OPERATIONS (Realtime Database + Handshake Sync)
// ─────────────────────────────────────────────

export function subscribePath(path, callback, defaultValue) {
  const localKey = `smartsofa_${path}`;
  let initial = defaultValue;
  try {
    const saved = localStorage.getItem(localKey);
    if (saved !== null) initial = JSON.parse(saved);
  } catch (_) {}

  callback(initial);

  if (!db) return () => {};

  const dbRef = ref(db, path);
  const listener = onValue(dbRef, (snap) => {
    if (snap.exists()) {
      const val = snap.val();
      const merged = (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue))
        ? { ...defaultValue, ...val }
        : val;
      callback(merged);
      try { localStorage.setItem(localKey, JSON.stringify(merged)); } catch (_) {}
    } else {
      // Auto-seed Firebase RTDB if path does not exist yet
      if (defaultValue !== undefined) {
        set(dbRef, defaultValue).catch(() => {});
      }
    }
  }, (err) => {
    console.warn(`Firebase RTDB subscription warning on '${path}':`, err.message);
  });

  return () => off(dbRef, 'value', listener);
}

export function subscribeConnectionState(callback) {
  if (!db) { callback(false); return () => {}; }
  const connectedRef = ref(db, ".info/connected");
  const listener = onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
  });
  return () => off(connectedRef, 'value', listener);
}

/**
 * Update device controls and execute real-time handshake across:
 * - controls/
 * - commands/SS001/
 * - liveData/SS001/
 */
export async function updateControl(fieldOrObj, value) {
  try {
    const saved = localStorage.getItem('smartsofa_controls');
    const controls = saved ? JSON.parse(saved) : { ...DEFAULT_CONTROLS };
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      Object.assign(controls, fieldOrObj);
    } else {
      controls[fieldOrObj] = value;
    }
    localStorage.setItem('smartsofa_controls', JSON.stringify(controls));
  } catch (_) {}

  if (!db) return;

  const deviceId = DEFAULT_DEVICE_ID;

  try {
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      for (const [k, v] of Object.entries(fieldOrObj)) {
        await set(ref(db, `controls/${k}`), v);
        await syncControlToHandshake(deviceId, k, v);
      }
    } else {
      await set(ref(db, `controls/${fieldOrObj}`), value);
      await syncControlToHandshake(deviceId, fieldOrObj, value);
    }
  } catch (e) {
    console.warn("Firebase updateControl error:", e);
  }
}

async function syncControlToHandshake(deviceId, field, value) {
  if (!db) return;
  try {
    if (field === 'fan') {
      await set(ref(db, `commands/${deviceId}/fan/state`), value);
      await set(ref(db, `liveData/${deviceId}/fanRunning`), value);
    } else if (field === 'light') {
      await set(ref(db, `commands/${deviceId}/light/state`), value);
      await set(ref(db, `commands/${deviceId}/ambientLight`), value);
      await set(ref(db, `liveData/${deviceId}/lightRunning`), value);
    } else if (field === 'relayStatus') {
      await set(ref(db, `electrical/relayStatus`), value);
      await set(ref(db, `liveData/${deviceId}/relayStatus`), value);
    } else if (field === 'fanSpeed') {
      await set(ref(db, `commands/${deviceId}/fan/speed`), value);
    } else if (field === 'lightBrightness') {
      await set(ref(db, `commands/${deviceId}/light/brightness`), value);
    } else if (field === 'mode') {
      await set(ref(db, `commands/${deviceId}/autoMode`), value === 'Auto' || value === 'auto');
    }
    await set(ref(db, `liveData/${deviceId}/lastUpdate`), Date.now());
  } catch (_) {}
}

/**
 * Update sofa cushion status and execute real-time handshake with liveData/SS001
 */
export async function updateSofaStatus(fieldOrObj, value) {
  try {
    const saved = localStorage.getItem('smartsofa_sofa');
    const sofa = saved ? JSON.parse(saved) : { ...DEFAULT_SOFA_STATUS };
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      Object.assign(sofa, fieldOrObj);
    } else {
      sofa[fieldOrObj] = value;
    }
    localStorage.setItem('smartsofa_sofa', JSON.stringify(sofa));
  } catch (_) {}

  if (!db) return;

  const deviceId = DEFAULT_DEVICE_ID;

  try {
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      for (const [k, v] of Object.entries(fieldOrObj)) {
        await set(ref(db, `sofa/${k}`), v);
        if (k === 'occupied') {
          await set(ref(db, `liveData/${deviceId}/seatOccupied`), v);
          await set(ref(db, `liveData/${deviceId}/personDetected`), v);
        } else if (k === 'reclinerAngle') {
          await set(ref(db, `commands/${deviceId}/recliner/angle`), v);
          await set(ref(db, `commands/${deviceId}/recliner/enabled`), true);
          await set(ref(db, `liveData/${deviceId}/reclinerRunning`), true);
        } else if (k === 'heatLevel') {
          await set(ref(db, `commands/${deviceId}/seatHeating`), v > 0);
        } else if (k === 'massageMode') {
          await set(ref(db, `commands/${deviceId}/massage/enabled`), v !== 'off');
          await set(ref(db, `commands/${deviceId}/massage/mode`), v);
          await set(ref(db, `liveData/${deviceId}/massageRunning`), v !== 'off');
        }
      }
    } else {
      await set(ref(db, `sofa/${fieldOrObj}`), value);
      if (fieldOrObj === 'occupied') {
        await set(ref(db, `liveData/${deviceId}/seatOccupied`), value);
        await set(ref(db, `liveData/${deviceId}/personDetected`), value);
      } else if (fieldOrObj === 'reclinerAngle') {
        await set(ref(db, `commands/${deviceId}/recliner/angle`), value);
        await set(ref(db, `commands/${deviceId}/recliner/enabled`), true);
        await set(ref(db, `liveData/${deviceId}/reclinerRunning`), true);
      } else if (fieldOrObj === 'heatLevel') {
        await set(ref(db, `commands/${deviceId}/seatHeating`), value > 0);
      } else if (fieldOrObj === 'massageMode') {
        await set(ref(db, `commands/${deviceId}/massage/enabled`), value !== 'off');
        await set(ref(db, `commands/${deviceId}/massage/mode`), value);
        await set(ref(db, `liveData/${deviceId}/massageRunning`), value !== 'off');
      }
    }
  } catch (e) {
    console.warn("Firebase updateSofaStatus error:", e);
  }
}

export async function updateElectricalInfo(fieldOrObj, value) {
  try {
    const saved = localStorage.getItem('smartsofa_electrical');
    const elec = saved ? JSON.parse(saved) : { ...DEFAULT_ELECTRICAL_INFO };
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      Object.assign(elec, fieldOrObj);
    } else {
      elec[fieldOrObj] = value;
    }
    localStorage.setItem('smartsofa_electrical', JSON.stringify(elec));
  } catch (_) {}

  if (!db) return;

  const deviceId = DEFAULT_DEVICE_ID;

  try {
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      for (const [k, v] of Object.entries(fieldOrObj)) {
        await set(ref(db, `electrical/${k}`), v);
        if (k === 'power') await set(ref(db, `powerMonitoring/${deviceId}/activePower`), v);
        if (k === 'voltage') await set(ref(db, `powerMonitoring/${deviceId}/voltage`), v);
        if (k === 'current') await set(ref(db, `powerMonitoring/${deviceId}/current`), v);
        if (k === 'roomTemp') await set(ref(db, `liveData/${deviceId}/temperature`), v);
      }
    } else {
      await set(ref(db, `electrical/${fieldOrObj}`), value);
      if (fieldOrObj === 'power') await set(ref(db, `powerMonitoring/${deviceId}/activePower`), value);
      if (fieldOrObj === 'voltage') await set(ref(db, `powerMonitoring/${deviceId}/voltage`), value);
      if (fieldOrObj === 'current') await set(ref(db, `powerMonitoring/${deviceId}/current`), value);
      if (fieldOrObj === 'roomTemp') await set(ref(db, `liveData/${deviceId}/temperature`), value);
    }
  } catch (e) {
    console.warn("Firebase updateElectricalInfo error:", e);
  }
}

export async function updateDeviceStatus(fieldOrObj, value) {
  try {
    const saved = localStorage.getItem('smartsofa_devices');
    const dev = saved ? JSON.parse(saved) : { ...DEFAULT_DEVICE_STATUS };
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      Object.assign(dev, fieldOrObj);
    } else {
      dev[fieldOrObj] = value;
    }
    localStorage.setItem('smartsofa_devices', JSON.stringify(dev));
  } catch (_) {}

  if (!db) return;
  try {
    if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
      for (const [k, v] of Object.entries(fieldOrObj)) {
        await set(ref(db, `devices/${k}`), v);
      }
    } else {
      await set(ref(db, `devices/${fieldOrObj}`), value);
    }
  } catch (e) {
    console.warn("Firebase updateDeviceStatus error:", e);
  }
}

export async function updateNotifications(notificationsList) {
  try {
    localStorage.setItem('smartsofa_notifications', JSON.stringify(notificationsList));
  } catch (_) {}

  if (!db) return;
  try { await set(ref(db, 'notifications'), notificationsList); }
  catch (e) {
    console.warn("Firebase updateNotifications error:", e);
  }
}
