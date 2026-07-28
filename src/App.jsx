import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import SofaStatusCard from './components/SofaStatusCard';
import ControlPanel from './components/ControlPanel';
import DeviceStatusCard from './components/DeviceStatusCard';
import ElectricalInfoCard from './components/ElectricalInfoCard';
import EnergyAnalytics from './components/EnergyAnalytics';
import ActivityHistory from './components/ActivityHistory';
import NotificationsModal from './components/NotificationsModal';
import WifiConfigModal from './components/WifiConfigModal';
import DeviceInfoModal from './components/DeviceInfoModal';
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
  DEFAULT_HISTORY,
  DEFAULT_NOTIFICATIONS 
} from './lib/firebase';

import { LayoutDashboard, Sliders, Zap, History, Loader2, Armchair } from 'lucide-react';

export default function App() {
  // ── Auth State ──
  const [user, setUser] = useState(undefined); // undefined=loading, null=logged-out

  // ── App Data State ──
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sofaStatus, setSofaStatus]           = useState(DEFAULT_SOFA_STATUS);
  const [controls, setControls]               = useState(DEFAULT_CONTROLS);
  const [electricalInfo, setElectricalInfo]   = useState(DEFAULT_ELECTRICAL_INFO);
  const [deviceStatus, setDeviceStatus]       = useState(DEFAULT_DEVICE_STATUS);
  const [historyItems, setHistoryItems]       = useState(DEFAULT_HISTORY);
  const [notifications, setNotifications]     = useState(DEFAULT_NOTIFICATIONS);

  // ── Modal State ──
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWifiConfigOpen,    setIsWifiConfigOpen]    = useState(false);
  const [isDeviceInfoOpen,    setIsDeviceInfoOpen]    = useState(false);
  const [isSettingsOpen,      setIsSettingsOpen]      = useState(false);

  // ── Firebase Auth Listener ──
  useEffect(() => {
    const unsub = onAuthChange(firebaseUser => setUser(firebaseUser ?? null));
    return unsub;
  }, []);

  // ── Firebase RTDB Subscriptions (only when logged in) ──
  useEffect(() => {
    if (!user) return;
    const u1 = subscribePath('sofa',          setSofaStatus,     DEFAULT_SOFA_STATUS);
    const u2 = subscribePath('controls',      setControls,       DEFAULT_CONTROLS);
    const u3 = subscribePath('electrical',    setElectricalInfo, DEFAULT_ELECTRICAL_INFO);
    const u4 = subscribePath('devices',       setDeviceStatus,   DEFAULT_DEVICE_STATUS);
    const u5 = subscribePath('history',       (val) => {
      // Firebase returns object keyed by push IDs, convert to array
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        setHistoryItems(Object.values(val).sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setHistoryItems(Array.isArray(val) ? val : DEFAULT_HISTORY);
      }
    }, DEFAULT_HISTORY);
    const u6 = subscribePath('notifications', (val) => {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        setNotifications(Object.values(val).sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setNotifications(Array.isArray(val) ? val : DEFAULT_NOTIFICATIONS);
      }
    }, DEFAULT_NOTIFICATIONS);
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); };
  }, [user]);

  // ── Control Handlers (write to Firebase + update local state optimistically) ──
  const handleControlChange = async (field, value) => {
    setControls(prev => ({ ...prev, [field]: value }));
    await updateControl(field, value);
  };

  const handleSofaStatusChange = async (field, value) => {
    setSofaStatus(prev => ({ ...prev, [field]: value }));
    await updateSofaStatus(field, value);
  };

  // Notification handlers (local-only since RTDB is the source of truth)
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

  // ── Loading Splash ──
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
            <p className="text-white font-black text-xl tracking-tight">SmartSofa <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">PRO</span></p>
            <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              Connecting to Firebase…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Auth Wall ──
  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  // ── Tab Config ──
  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'controls',  label: 'Controls',  icon: Sliders },
    { id: 'energy',    label: 'Energy',    icon: Zap },
    { id: 'history',   label: 'History',   icon: History },
  ];

  return (
    <div className="min-h-screen mesh-bg">

      {/* ── Header ── */}
      <Header
        user={user}
        deviceStatus={deviceStatus}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => { setIsNotificationsOpen(true); handleMarkAllRead(); }}
        onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
        onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── Tab Bar ── */}
      <div className="sticky top-[65px] z-30 border-b border-slate-800/50"
        style={{ background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    active ? 'tab-active text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 pb-12">

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SofaStatusCard
                sofaStatus={sofaStatus}
                onUpdateStatus={handleSofaStatusChange}
              />
              <DeviceStatusCard
                deviceStatus={deviceStatus}
                onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
                onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
              />
            </div>
            <ElectricalInfoCard electricalInfo={electricalInfo} />
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="animate-slide-up">
            <ControlPanel
              controls={controls}
              onToggleFan={() => handleControlChange('fan', !controls.fan)}
              onToggleLight={() => handleControlChange('light', !controls.light)}
              onSetMode={(mode) => handleControlChange('mode', mode)}
              onUpdateControl={handleControlChange}
            />
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="animate-slide-up">
            <EnergyAnalytics electricalInfo={electricalInfo} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-slide-up">
            <ActivityHistory historyItems={historyItems} />
          </div>
        )}

      </main>

      {/* ── Modals ── */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkRead={handleMarkRead}
        onDelete={handleDeleteNotif}
        onClearAll={handleClearAllNotifs}
      />
      <WifiConfigModal
        isOpen={isWifiConfigOpen}
        onClose={() => setIsWifiConfigOpen(false)}
        deviceStatus={deviceStatus}
      />
      <DeviceInfoModal
        isOpen={isDeviceInfoOpen}
        deviceStatus={deviceStatus}
        onClose={() => setIsDeviceInfoOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        user={user}
        onOpenWifiConfig={() => { setIsSettingsOpen(false); setIsWifiConfigOpen(true); }}
        onOpenDeviceInfo={() => { setIsSettingsOpen(false); setIsDeviceInfoOpen(true); }}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
