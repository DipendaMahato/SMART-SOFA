import React, { useState } from 'react';
import { 
  X, Settings, User, Bell, Moon, Globe, Cloud, 
  Radio, Download, LogOut, Code, CheckCircle2, Shield
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, onClose, user, onOpenWifiConfig, onOpenDeviceInfo, onLogout
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showFirmwareDialog, setShowFirmwareDialog] = useState(false);

  if (!isOpen) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const email = user?.email || '';

  const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${on ? 'bg-blue-600' : 'bg-slate-700'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  const handleLogout = () => { onClose(); onLogout(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Settings</h3>
              <p className="text-xs text-slate-400">Account, preferences & hardware</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">

          {/* User Profile */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 to-blue-950/40 border border-slate-800/60 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg glow-blue shrink-0">
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

          {/* Preferences */}
          <section className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Preferences</h4>
            <div className="rounded-2xl border border-slate-800/60 overflow-hidden divide-y divide-slate-800/60">
              <div className="flex items-center justify-between p-4 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Push Notifications</span>
                    <span className="text-[10px] text-slate-400">Occupancy, temp & connectivity alerts</span>
                  </div>
                </div>
                <Toggle on={notificationsEnabled} onToggle={() => setNotificationsEnabled(v => !v)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Interface Language</span>
                </div>
                <span className="text-xs text-blue-400 font-semibold">English (US)</span>
              </div>
            </div>
          </section>

          {/* Hardware Links */}
          <section className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hardware</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Radio, color: 'text-cyan-400', border: 'hover:border-cyan-500/40', title: 'BLE Wi-Fi Config', sub: 'Provision ESP32', onClick: () => { onClose(); onOpenWifiConfig?.(); } },
                { icon: Cloud, color: 'text-purple-400', border: 'hover:border-purple-500/40', title: 'Device Telemetry', sub: 'Subsystem details', onClick: () => { onClose(); onOpenDeviceInfo?.(); } }
              ].map(b => (
                <button key={b.title} onClick={b.onClick}
                  className={`p-4 rounded-2xl glass-card border border-slate-800/60 ${b.border} text-left transition-all group`}>
                  <b.icon className={`w-4 h-4 ${b.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-bold text-white block">{b.title}</span>
                  <span className="text-[10px] text-slate-400">{b.sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* System Info */}
          <section className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System</h4>
            <div className="rounded-2xl border border-slate-800/60 overflow-hidden divide-y divide-slate-800/60">
              <div onClick={() => setShowFirmwareDialog(true)} className="flex items-center justify-between p-4 bg-slate-900/40 cursor-pointer hover:bg-slate-800/40 transition-all">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Firmware OTA Update</span>
                    <span className="text-[10px] text-slate-400">Current: v1.4.2</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Up to date</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Developer</span>
                </div>
                <span className="text-xs text-slate-300">Dipendra Mahato</span>
              </div>
            </div>
          </section>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of SmartSofa
          </button>

        </div>

        {/* Firmware Dialog Overlay */}
        {showFirmwareDialog && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center gap-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Firmware Up to Date</h4>
            <p className="text-sm text-slate-300 max-w-xs">Your ESP32 controller firmware (v1.4.2) is the latest available version with all sensor drivers current.</p>
            <button onClick={() => setShowFirmwareDialog(false)}
              className="btn-primary px-8 py-2.5 rounded-xl text-white text-sm">
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
