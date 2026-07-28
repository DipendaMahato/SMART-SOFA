import React, { useState, useEffect } from 'react';
import { 
  Armchair, Wifi, WifiOff, Bell, Settings, Radio, 
  Cpu, LogOut, ChevronDown, User, Shield
} from 'lucide-react';

export default function Header({ 
  user,
  deviceStatus, 
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenWifiConfig,
  onOpenDeviceInfo,
  onOpenSettings,
  onLogout
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
        ' • ' + 
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);

  const isOnline = deviceStatus?.esp32aOnline || deviceStatus?.esp32bOnline;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 backdrop-blur-2xl"
      style={{ background: 'rgba(7,11,20,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg glow-blue">
              <Armchair className="w-5.5 h-5.5 text-white w-[22px] h-[22px]" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#070B14] ${isOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white tracking-tight">SmartSofa</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{currentTime}</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Connection badge */}
          <button
            onClick={onOpenDeviceInfo}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isOnline ? 'ESP32 Online' : 'Offline'}</span>
          </button>

          {/* BLE Config */}
          <button
            onClick={onOpenWifiConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-cyan-500/25 hover:border-cyan-400/50 text-cyan-400 text-xs font-semibold transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden md:inline">BLE Config</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl glass-card border border-slate-800/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#070B14]">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl glass-card border border-slate-800/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-xl glass-card border border-slate-800/80 hover:border-slate-600 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[11px] font-black text-white shadow-md">
                {initials}
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors hidden sm:block max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 auth-card rounded-2xl border border-slate-800 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); onOpenSettings(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <User className="w-4 h-4" /> Account Settings
                </button>
                <button
                  onClick={() => { setShowUserMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
