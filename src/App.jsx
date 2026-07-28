import React, { useState, useEffect } from 'react';
import Header from './components/Header';
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
  DEFAULT_SOFA_STATUS,
  DEFAULT_CONTROLS,
  DEFAULT_ELECTRICAL_INFO,
  DEFAULT_DEVICE_STATUS,
  DEFAULT_HISTORY,
  DEFAULT_NOTIFICATIONS 
} from './lib/firebase';

import { 
  LayoutDashboard, 
  Sliders, 
  Zap, 
  History, 
  Sparkles,
  Radio,
  Cpu
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'controls', 'energy', 'history'

  // Firebase Realtime State (with fallback initial values)
  const [sofaStatus, setSofaStatus] = useState(DEFAULT_SOFA_STATUS);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [electricalInfo, setElectricalInfo] = useState(DEFAULT_ELECTRICAL_INFO);
  const [deviceStatus, setDeviceStatus] = useState(DEFAULT_DEVICE_STATUS);
  const [historyItems, setHistoryItems] = useState(DEFAULT_HISTORY);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWifiConfigOpen, setIsWifiConfigOpen] = useState(false);
  const [isDeviceInfoOpen, setIsDeviceInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Subscribe to Firebase RTDB paths
  useEffect(() => {
    const unsubSofa = subscribePath('sofa', setSofaStatus, DEFAULT_SOFA_STATUS);
    const unsubControls = subscribePath('controls', setControls, DEFAULT_CONTROLS);
    const unsubElectrical = subscribePath('electrical', setElectricalInfo, DEFAULT_ELECTRICAL_INFO);
    const unsubDevices = subscribePath('devices', setDeviceStatus, DEFAULT_DEVICE_STATUS);
    const unsubHistory = subscribePath('history', setHistoryItems, DEFAULT_HISTORY);
    const unsubNotifications = subscribePath('notifications', setNotifications, DEFAULT_NOTIFICATIONS);

    return () => {
      unsubSofa();
      unsubControls();
      unsubElectrical();
      unsubDevices();
      unsubHistory();
      unsubNotifications();
    };
  }, []);

  // Controls Handlers
  const handleToggleFan = () => {
    const newFanState = !controls.fan;
    setControls(prev => ({ ...prev, fan: newFanState }));
    updateControl('fan', newFanState);
  };

  const handleToggleLight = () => {
    const newLightState = !controls.light;
    setControls(prev => ({ ...prev, light: newLightState }));
    updateControl('light', newLightState);
  };

  const handleSetMode = (mode) => {
    setControls(prev => ({ ...prev, mode }));
    updateControl('mode', mode);
  };

  const handleUpdateControl = (field, value) => {
    setControls(prev => ({ ...prev, [field]: value }));
    updateControl(field, value);
  };

  const handleUpdateSofaStatus = (field, value) => {
    setSofaStatus(prev => ({ ...prev, [field]: value }));
    updateSofaStatus(field, value);
  };

  // Notification Handlers
  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Sticky Top Header */}
      <Header
        userName="Dipendra Mahato"
        deviceStatus={deviceStatus}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
        onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('controls')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'controls'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Hardware Controls
            </button>

            <button
              onClick={() => setActiveTab('energy')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'energy'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Energy Analytics
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <History className="w-4 h-4 text-blue-400" />
              Activity History
            </button>

          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ESP32 Sensor Bus Active</span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Sofa Realtime Ergonomic & Occupancy Card */}
            <SofaStatusCard
              sofaStatus={sofaStatus}
              onUpdateStatus={handleUpdateSofaStatus}
            />

            {/* Quick Microcontroller Status Banner */}
            <DeviceStatusCard
              deviceStatus={deviceStatus}
              onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
              onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
            />

            {/* Control Panel Grid */}
            <ControlPanel
              controls={controls}
              onToggleFan={handleToggleFan}
              onToggleLight={handleToggleLight}
              onSetMode={handleSetMode}
              onUpdateControl={handleUpdateControl}
            />

            {/* Electrical Telemetry */}
            <ElectricalInfoCard
              electricalInfo={electricalInfo}
            />
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-6 animate-fadeIn">
            <SofaStatusCard
              sofaStatus={sofaStatus}
              onUpdateStatus={handleUpdateSofaStatus}
            />
            <ControlPanel
              controls={controls}
              onToggleFan={handleToggleFan}
              onToggleLight={handleToggleLight}
              onSetMode={handleSetMode}
              onUpdateControl={handleUpdateControl}
            />
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="animate-fadeIn">
            <EnergyAnalytics
              electricalInfo={electricalInfo}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <ActivityHistory
              historyItems={historyItems}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          SmartSofa Web App • Built with React, Vite & Tailwind CSS • Firebase RTDB & BLE Support
        </p>
      </footer>

      {/* Modals & Overlays */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />

      <WifiConfigModal
        isOpen={isWifiConfigOpen}
        onClose={() => setIsWifiConfigOpen(false)}
        deviceStatus={deviceStatus}
      />

      <DeviceInfoModal
        isOpen={isDeviceInfoOpen}
        onClose={() => setIsDeviceInfoOpen(false)}
        deviceStatus={deviceStatus}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName="Dipendra Mahato"
        onOpenWifiConfig={() => setIsWifiConfigOpen(true)}
        onOpenDeviceInfo={() => setIsDeviceInfoOpen(true)}
      />

    </div>
  );
}
