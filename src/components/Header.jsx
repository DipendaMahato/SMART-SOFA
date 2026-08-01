import React, { useState } from 'react';
import { Armchair, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Header({
  user,
  userProfile,
  deviceName = 'SmartSofa',
  deviceStatus,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSettings,
  onLogout
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const rawName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
  const truncatedName = displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName;

  return (
    <header className="w-full py-4 px-4 lg:px-8 z-40 sticky top-0 backdrop-blur-xl bg-[#060813]/70 border-b border-white/5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Left: Brand Pill Badge & Firebase RTDB Sync */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-[#11192e]/90 border border-white/10 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md">
              <Armchair className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight">{deviceName || 'SmartSofa'}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#11192e]/90 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#34d399]" />
            <span>Firebase RTDB Sync</span>
          </div>
        </div>

        {/* Right Actions: Notifications, Settings & User Profile Pill */}
        <div className="flex items-center gap-3">
          
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-[#11192e]/80 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white transition-all shadow-md group"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#3b82f6]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-[#11192e]/80 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white transition-all shadow-md group"
            title="Settings"
          >
            <Settings className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* User Profile Pill with glowing blue aura border matching screenshot */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-[#11192e]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner overflow-hidden border border-cyan-400/50">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{displayName[0]?.toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors max-w-[130px] truncate">
                {truncatedName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0c1222] border border-white/10 shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-2xl">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Connected User'}</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
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