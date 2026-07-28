import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import SofaStatusCard from './components/SofaStatusCard';
import ControlPanel from './components/ControlPanel';
import DeviceStatusCard from './components/DeviceStatusCard';
import ElectricalInfoCard from './components/ElectricalInfoCard';
import NotificationsModal from './components/NotificationsModal';
import SettingsModal from './components/SettingsModal';
import DeviceInfoModal from './components/DeviceInfoModal';
import WifiConfigModal from './components/WifiConfigModal';

import {
  subscribePath,
  updateControl,
  updateSofaStatus,
  updateElectricalInfo,
  updateNotifications,
  onAuthChange,
  logoutUser,
  updateUserProfile,
  loadUserProfile,
  changeUserPassword,
  DEFAULT_SOFA_STATUS,
  DEFAULT_CONTROLS,
  DEFAULT_ELECTRICAL_INFO,
  DEFAULT_DEVICE_STATUS,
  DEFAULT_NOTIFICATIONS
} from './lib/firebase';

import { Armchair, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(undefined);
  const [userProfile, setUserProfile] = useState(null);
  const [sofaStatus, setSofaStatus] = useState(DEFAULT_SOFA_STATUS);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [electricalInfo, setElectricalInfo] = useState(DEFAULT_ELECTRICAL_INFO);
  const [deviceStatus, setDeviceStatus] = useState(DEFAULT_DEVICE_STATUS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeviceInfoOpen, setIsDeviceInfoOpen] = useState(false);
  const [isWifiConfigOpen, setIsWifiConfigOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(firebaseUser => setUser(firebaseUser ?? null));
    return unsub;
  }, []);

  // Load user profile whenever user changes
  useEffect(() => {
    if (!user) { setUserProfile(null); return; }
    loadUserProfile(user.uid).then(profile => {
      if (profile) setUserProfile(profile);
      else {
        // Bootstrap profile from Firebase Auth fields
        setUserProfile({
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          location: 'Main Living Room',
          avatarColor: 'from-blue-600 to-cyan-400'
        });
      }
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const u1 = subscribePath('sofa', setSofaStatus, DEFAULT_SOFA_STATUS);
    const u2 = subscribePath('controls', setControls, DEFAULT_CONTROLS);
    const u3 = subscribePath('electrical', setElectricalInfo, DEFAULT_ELECTRICAL_INFO);
    const u4 = subscribePath('devices', setDeviceStatus, DEFAULT_DEVICE_STATUS);
    const u5 = subscribePath('notifications', (val) => {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        setNotifications(Object.values(val).sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setNotifications(Array.isArray(val) ? val : DEFAULT_NOTIFICATIONS);
      }
    }, DEFAULT_NOTIFICATIONS);
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, [user]);

  const handleControlChange = async (field, value) => {
    setControls(prev => ({ ...prev, [field]: value }));
    await updateControl(field, value);
    if (field === 'relayStatus') {
      setElectricalInfo(prev => ({ ...prev, relayStatus: value }));
      await updateElectricalInfo('relayStatus', value);
    }
  };

  const handleSofaStatusChange = async (field, value) => {
    setSofaStatus(prev => ({ ...prev, [field]: value }));
    await updateSofaStatus(field, value);
  };

  const handleUpdateUser = async (profileData) => {
    if (!user) return;
    const updated = { ...profileData, email: user.email }; // keep auth email
    setUserProfile(updated);
    await updateUserProfile(user.uid, updated);
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      updateNotifications(next);
      return next;
    });
  };
  const handleDeleteNotif = (id) => {
    setNotifications(prev => {
      const next = prev.filter(n => n.id !== id);
      updateNotifications(next);
      return next;
    });
  };
  const handleClearAllNotifs = () => {
    setNotifications([]);
    updateNotifications([]);
  };
  const handleMarkAllRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      updateNotifications(next);
      return next;
    });
  };

  const handleLogout = async () => { await logoutUser(); };


  const unreadCount = notifications.filter(n => !n.read).length;

  if (user === undefined) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-2xl glow-blue">
              <Armchair className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/30 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-white font-black text-xl tracking-tight">SmartSofa</p>
            <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              Connecting…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen mesh-bg">
      <Header
        user={user}
        userProfile={userProfile}
        deviceName={controls?.deviceName}
        deviceStatus={deviceStatus}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => { setIsNotificationsOpen(true); handleMarkAllRead(); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 space-y-6 pb-12">
        <div className="animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SofaStatusCard sofaStatus={sofaStatus} onUpdateStatus={handleSofaStatusChange} />
            <DeviceStatusCard
              deviceStatus={deviceStatus}
              onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
              onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
            />
            <ElectricalInfoCard electricalInfo={electricalInfo} />
            <ControlPanel
              controls={controls}
              roomTemp={electricalInfo?.roomTemp ?? 24.5}
              onToggleFan={() => handleControlChange('fan', !controls.fan)}
              onToggleLight={() => handleControlChange('light', !controls.light)}
              onToggleRelay={() => handleControlChange('relayStatus', !(controls?.relayStatus ?? true))}
              onUpdateControl={handleControlChange}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
      </main>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkRead={handleMarkRead}
        onDelete={handleDeleteNotif}
        onClearAll={handleClearAllNotifs}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        userProfile={userProfile}
        controls={controls}
        onUpdateControl={handleControlChange}
        onUpdateUser={handleUpdateUser}
        onChangePassword={changeUserPassword}
        onLogout={handleLogout}
      />
      <DeviceInfoModal
        isOpen={isDeviceInfoOpen}
        onClose={() => setIsDeviceInfoOpen(false)}
        deviceStatus={deviceStatus}
      />
      <WifiConfigModal
        isOpen={isWifiConfigOpen}
        onClose={() => setIsWifiConfigOpen(false)}
        deviceStatus={deviceStatus}
      />
    </div>
  );
}
