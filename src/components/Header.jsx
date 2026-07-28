import React, { useState, useEffect } from 'react';
import { 
  Armchair, 
  Wifi, 
  WifiOff, 
  Bell, 
  Settings, 
  Radio, 
  Cpu, 
  RefreshCw, 
  ShieldCheck,
  User
} from 'lucide-react';

export default function Header({ 
  userName = "Dipendra Mahato", 
  deviceStatus, 
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenWifiConfig,
  onOpenDeviceInfo,
  onOpenSettings,
  isFirebaseLive = true
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = deviceStatus?.esp32aOnline || deviceStatus?.esp32bOnline;

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <Armchair className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SmartSofa <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>{currentTime}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Quick Telemetry Badges */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          
          {/* Connection Status Badge */}
          <div 
            onClick={onOpenDeviceInfo}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
            }`}
            title="Click to view Hardware Telemetry"
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`}></span>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnline ? 'ESP32 Online' : 'Device Offline'}</span>
          </div>

          {/* Wi-Fi Provisioning Button */}
          <button
            onClick={onOpenWifiConfig}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-card border border-blue-500/30 hover:border-blue-400 text-blue-400 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="hidden sm:inline">BLE Wi-Fi Config</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl glass-card border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl glass-card border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Tag */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-300 hidden xl:inline">
              {userName}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
