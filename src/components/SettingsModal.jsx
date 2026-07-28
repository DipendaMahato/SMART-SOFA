import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Bell, 
  Moon, 
  Globe, 
  Cloud, 
  Radio, 
  Info, 
  Download, 
  LogOut,
  Code,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  userName = "Dipendra Mahato", 
  userEmail = "dipendra@smartsofa.io",
  onOpenWifiConfig,
  onOpenDeviceInfo
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showFirmwareDialog, setShowFirmwareDialog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Application Settings</h3>
              <p className="text-xs text-slate-400">Preferences, account, hardware links & system information</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* User Profile Summary */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">{userName}</h4>
              <p className="text-slate-400 text-[11px]">{userEmail}</p>
            </div>
          </div>

          {/* Account & Notifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Preferences</h4>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Push Notifications</span>
                    <span className="text-[10px] text-slate-400">Alerts for occupancy, temperature & connectivity</span>
                  </div>
                </div>

                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    notificationsEnabled ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Interface Language</span>
                </div>
                <span className="text-xs text-purple-400 font-semibold">English (US)</span>
              </div>

            </div>
          </div>

          {/* Connection Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Hardware Links</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenWifiConfig();
                }}
                className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-blue-500/40 text-left transition-all space-y-1 group"
              >
                <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">BLE Wi-Fi Config</span>
                <span className="text-[10px] text-slate-400">Provision ESP32</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDeviceInfo();
                }}
                className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/40 text-left transition-all space-y-1 group"
              >
                <Settings className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Device Telemetry</span>
                <span className="text-[10px] text-slate-400">Subsystem Details</span>
              </button>
            </div>
          </div>

          {/* About & Firmware */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">System Info</h4>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
              
              <div 
                onClick={() => setShowFirmwareDialog(true)}
                className="flex items-center justify-between cursor-pointer hover:text-purple-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Download className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Firmware OTA Update</span>
                    <span className="text-[10px] text-slate-400">Current version: v1.4.2</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Up to Date
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Developer</span>
                </div>
                <span className="text-xs text-slate-300">Dipendra Mahato</span>
              </div>

            </div>
          </div>

        </div>

        {/* Firmware Dialog Overlay */}
        {showFirmwareDialog && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-extrabold text-white">Smart Sofa OTA Firmware</h4>
            <p className="text-xs text-slate-300 max-w-xs">Your Smart Sofa ESP32 controller firmware (v1.4.2) is fully up-to-date with latest sensor drivers.</p>
            <button
              onClick={() => setShowFirmwareDialog(false)}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              OK
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
