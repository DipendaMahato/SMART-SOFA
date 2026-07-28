import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import SofaStatusCard from './components/SofaStatusCard';
import ControlPanel from './components/ControlPanel';
import DeviceStatusCard from './components/DeviceStatusCard';
import ElectricalInfoCard from './components/ElectricalInfoCard';
import NotificationsModal from './components/NotificationsModal';
import SettingsModal from './components/SettingsModal';

import {
  subscribePath,
  updateControl,
  updateSofaStatus,
  onAuthChange,
  logoutUser,
  DEFAULT_SOFA_STATUS,
  DEFAULT_CONTROLS,
  DEFAULT_ELECTRICAL_INFO,
  DEFAULT_DEVICE_STATUS,
  DEFAULT_NOTIFICATIONS
} from './lib/firebase';

import { Bell, Settings, LogOut, Armchair, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(undefined);
  const [sofaStatus, setSofaStatus] = useState(DEFAULT_SOFA_STATUS);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [electricalInfo, setElectricalInfo] = useState(DEFAULT_ELECTRICAL_INFO);
  const [deviceStatus, setDeviceStatus] = useState(DEFAULT_DEVICE_STATUS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(firebaseUser => setUser(firebaseUser ?? null));
    return unsub;
  }, []);

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
  };

  const handleSofaStatusChange = async (field, value) => {
    setSofaStatus(prev => ({ ...prev, [field]: value }));
    await updateSofaStatus(field, value);
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const handleDeleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const handleClearAllNotifs = () => {
    setNotifications([]);
  };
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
        deviceStatus={deviceStatus}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => { setIsNotificationsOpen(true); handleMarkAllRead(); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 pb-12">
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SofaStatusCard sofaStatus={sofaStatus} onUpdateStatus={handleSofaStatusChange} />
            <DeviceStatusCard deviceStatus={deviceStatus} />
          </div>
          <ElectricalInfoCard electricalInfo={electricalInfo} />
          <ControlPanel controls={controls} onToggleFan={() => handleControlChange('fan', !controls.fan)} onToggleLight={() => handleControlChange('light', !controls.light)} />
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
        onLogout={handleLogout}
      />
    </div>
  );
}
