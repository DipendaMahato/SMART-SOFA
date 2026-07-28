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
      fullName,
      email,
      createdAt: Date.now()
    });
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
  // Update Firebase Auth display name
  if (auth.currentUser && profileData.displayName) {
    await updateProfile(auth.currentUser, { displayName: profileData.displayName });
  }
  // Save extended profile to RTDB
  if (db && uid) {
    await set(ref(db, `users/${uid}/profile`), {
      ...profileData,
      updatedAt: Date.now()
    });
    // Also cache to localStorage
    try { localStorage.setItem(`smartsofa_profile_${uid}`, JSON.stringify(profileData)); } catch (_) {}
  }
}

export async function loadUserProfile(uid) {
  if (!db || !uid) return null;
  // Try localStorage first for instant load
  try {
    const cached = localStorage.getItem(`smartsofa_profile_${uid}`);
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  // Then fetch from RTDB
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
// DEFAULT STATE (Fallback/Demo)
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
  light: true,
  mode: "manual",
  relayStatus: true,
  lightColor: "#3B82F6",
  lightBrightness: 80,
  fanSpeed: 3,
  massagerIntensity: 65,
  heaterTemp: 85
};

export const DEFAULT_ELECTRICAL_INFO = {
  voltage: 230.4,
  current: 1.85,
  power: 426.2,
  roomTemp: 24.5,
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
  { id: "h1", type: "person_sitting", title: "Person Sitting", description: "Occupancy sensor detected presence on main cushion.", timestamp: Date.now() - 300000 },
  { id: "h2", type: "light_on", title: "Ambient Light On", description: "Light mode adjusted to Royal Blue preset.", timestamp: Date.now() - 900000 },
  { id: "h3", type: "fan_on", title: "Ventilation Active", description: "Auto cooling fan turned on due to ambient temp threshold.", timestamp: Date.now() - 1800000 },
  { id: "h4", type: "esp32_connected", title: "ESP32 Connected", description: "Main controller ESP32-A synchronized telemetry.", timestamp: Date.now() - 3600000 }
];

export const DEFAULT_NOTIFICATIONS = [
  { id: "n1", type: "person_sitting", title: "Occupancy Detected", message: "Someone sat down on Smart Sofa 10 minutes ago.", timestamp: Date.now() - 600000, read: false },
  { id: "n2", type: "esp32_offline", title: "Telemetry Warning", message: "ESP32-B secondary module experienced temporary signal drop.", timestamp: Date.now() - 3600000, read: true },
  { id: "n3", type: "firebase_connected", title: "Cloud Sync Active", message: "Realtime Database sync restored successfully.", timestamp: Date.now() - 7200000, read: true }
];

// ─────────────────────────────────────────────
// DATABASE OPERATIONS (With localStorage Fallback)
// ─────────────────────────────────────────────

export function subscribePath(path, callback, defaultValue) {
  // Load initial value from localStorage if present
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
      callback(val);
      try { localStorage.setItem(localKey, JSON.stringify(val)); } catch (_) {}
    }
  }, (err) => {
    // Quiet warning if permission denied or network offline
  });

  return () => off(dbRef, 'value', listener);
}

export async function updateControl(field, value) {
  try {
    const saved = localStorage.getItem('smartsofa_controls');
    const controls = saved ? JSON.parse(saved) : { ...DEFAULT_CONTROLS };
    controls[field] = value;
    localStorage.setItem('smartsofa_controls', JSON.stringify(controls));
  } catch (_) {}

  if (!db) return;
  try { await set(ref(db, `controls/${field}`), value); }
  catch (_) {}
}

export async function updateSofaStatus(field, value) {
  try {
    const saved = localStorage.getItem('smartsofa_sofa');
    const sofa = saved ? JSON.parse(saved) : { ...DEFAULT_SOFA_STATUS };
    sofa[field] = value;
    localStorage.setItem('smartsofa_sofa', JSON.stringify(sofa));
  } catch (_) {}

  if (!db) return;
  try { await set(ref(db, `sofa/${field}`), value); }
  catch (_) {}
}

export async function updateElectricalInfo(field, value) {
  try {
    const saved = localStorage.getItem('smartsofa_electrical');
    const elec = saved ? JSON.parse(saved) : { ...DEFAULT_ELECTRICAL_INFO };
    elec[field] = value;
    localStorage.setItem('smartsofa_electrical', JSON.stringify(elec));
  } catch (_) {}

  if (!db) return;
  try { await set(ref(db, `electrical/${field}`), value); }
  catch (_) {}
}

export async function updateNotifications(notificationsList) {
  try {
    localStorage.setItem('smartsofa_notifications', JSON.stringify(notificationsList));
  } catch (_) {}

  if (!db) return;
  try { await set(ref(db, 'notifications'), notificationsList); }
  catch (_) {}
}

