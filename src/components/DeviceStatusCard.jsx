import React from 'react';
import { Cpu, Wifi, Cloud, AlertTriangle, ChevronRight } from 'lucide-react';

function DeviceChip({ label, sublabel, status, icon: Icon, color }) {
  const colors = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    dot: 'bg-rose-500' },
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    dot: 'bg-blue-400' },
    amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   dot: 'bg-amber-400' },
    slate:   { bg: 'bg-slate-800/60',   border: 'border-slate-700/60',   text: 'text-slate-500',   dot: 'bg-slate-600' },
  };
  const c = colors[color] || colors.slate;
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02]`}>
      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} shrink-0`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold text-slate-400 truncate">{label}</div>
        <div className={`text-xs font-bold ${c.text} flex items-center gap-1.5 mt-0.5`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${color === 'emerald' ? 'animate-pulse' : ''}`} />
          {sublabel}
        </div>
      </div>
    </div>
  );
}

export default function DeviceStatusCard({ deviceStatus }) {
  const espA = deviceStatus?.esp32aOnline ?? true;
  const espB = deviceStatus?.esp32bOnline ?? true;
  const wifiConnected = deviceStatus?.wifiConnected ?? true;
  const firebaseOk = deviceStatus?.firebaseConnected ?? true;
  const ssid = deviceStatus?.wifiSsid || 'Home_WiFi_5G';

  const allOnline = espA && espB && wifiConnected && firebaseOk;

  return (
    <div className={`glass-card rounded-3xl overflow-hidden relative transition-all duration-500 ${allOnline ? 'border-slate-800/60' : 'border-rose-500/20'}`}>
      <div className={`h-0.5 w-full ${allOnline ? 'bg-gradient-to-r from-blue-500/0 via-cyan-400 to-blue-500/0' : 'bg-gradient-to-r from-rose-500/0 via-rose-400 to-rose-500/0'}`} />
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="section-icon bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Device Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">ESP32 controllers & cloud</p>
            </div>
          </div>
        </div>

        {!allOnline && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-300">Connectivity Issue Detected</p>
              <p className="text-[10px] text-rose-400/70 mt-0.5">Configure Wi-Fi via BLE provisioning</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <DeviceChip icon={Cpu} label="ESP32-A Master" sublabel={espA ? 'Online' : 'Offline'} color={espA ? 'emerald' : 'rose'} />
          <DeviceChip icon={Cpu} label="ESP32-B Slave" sublabel={espB ? 'Online' : 'Offline'} color={espB ? 'emerald' : 'rose'} />
          <DeviceChip icon={Wifi} label="Wi-Fi Network" sublabel={wifiConnected ? ssid : 'Disconnected'} color={wifiConnected ? 'blue' : 'rose'} />
          <DeviceChip icon={Cloud} label="Firebase Sync" sublabel={firebaseOk ? 'Live Sync' : 'Offline'} color={firebaseOk ? 'amber' : 'rose'} />
        </div>
      </div>
    </div>
  );
}