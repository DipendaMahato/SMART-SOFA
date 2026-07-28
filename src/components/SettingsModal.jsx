import React, { useState } from 'react';
import {
  X, Settings, User, Bell, LogOut, Shield
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, user, onLogout }) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  if (!isOpen) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const email = user?.email || '';

  const handleLogout = () => { onClose(); onLogout(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Settings</h3>
              <p className="text-xs text-slate-400">Account & preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 to-blue-950/40 border border-slate-800/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg glow-blue shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
              <p className="text-xs text-slate-400 truncate">{email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-semibold">Firebase Auth Verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {showLogoutDialog && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <LogOut className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Sign Out</h4>
            <p className="text-sm text-slate-300 max-w-xs">Are you sure you want to sign out of your SmartSofa account?</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowLogoutDialog(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-all">Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}