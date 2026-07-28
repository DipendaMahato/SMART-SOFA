import React from 'react';
import { Cpu, Wifi, Cloud, AlertTriangle, ChevronRight, Signal, Clock, Radio } from 'lucide-react';

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
        <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
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

function SignalBar({ strength }) {
  // Convert dBm to bars (0-4)
  const bars = strength > -50 ? 4 : strength > -65 ? 3 : strength > -75 ? 2 : strength > -85 ? 1 : 0;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1,2,3,4].map(b => (
        <div key={b} className={`w-1 rounded-sm transition-all ${b <= bars ? 'bg-blue-400' : 'bg-slate-700'}`}
          style={{ height: `${b * 4}px` }} />
      ))}
    </div>
  );
}

export default function DeviceStatusCard({ deviceStatus, onOpenWifiConfig, onOpenDeviceInfo }) {
  const espA            = deviceStatus?.esp32aOnline  ?? true;
  const espB            = deviceStatus?.esp32bOnline  ?? true;
  const wifiConnected   = deviceStatus?.wifiConnected ?? true;
  const firebaseOk      = deviceStatus?.firebaseConnected ?? true;
  const ssid            = deviceStatus?.wifiSsid || 'Home_WiFi_5G';
  const signal          = deviceStatus?.signalStrength || -62;
  const uptime          = deviceStatus?.uptimeSeconds || 142800;
  const firmwareVersion = deviceStatus?.firmwareVersion || 'v1.4.2';
  const ipAddress       = deviceStatus?.ipAddress || '—';

  const hours = Math.floor(uptime / 3600);
  const days  = Math.floor(hours / 24);
  const uptimeStr = days > 0 ? `${days}d ${hours % 24}h` : `${hours}h ${Math.floor((uptime % 3600) / 60)}m`;

  const allOnline = espA && espB && wifiConnected && firebaseOk;

  return (
    <div className={`glass-card card-hover rounded-3xl overflow-hidden relative transition-all duration-500
      ${allOnline ? 'border-slate-800/60' : 'border-rose-500/20'}`}>

      {/* Top accent */}
      <div className={`h-0.5 w-full ${allOnline
        ? 'bg-gradient-to-r from-blue-500/0 via-cyan-400 to-blue-500/0'
        : 'bg-gradient-to-r from-rose-500/0 via-rose-400 to-rose-500/0'}`} />

      <div className="p-6 space-y-5">

        {/* ── Header ── */}
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
          <button onClick={onOpenDeviceInfo}
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/10">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Offline Banner ── */}
        {!allOnline && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-300">Connectivity Issue Detected</p>
              <p className="text-[10px] text-rose-400/70 mt-0.5">Configure Wi-Fi via BLE provisioning</p>
            </div>
            <button onClick={onOpenWifiConfig}
              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all whitespace-nowrap">
              Fix Now
            </button>
          </div>
        )}

        {/* ── Device Grid ── */}
        <div className="grid grid-cols-2 gap-2.5">
          <DeviceChip icon={Cpu}   label="ESP32-A Master"  sublabel={espA  ? 'Online'       : 'Offline'}         color={espA  ? 'emerald' : 'rose'} />
          <DeviceChip icon={Cpu}   label="ESP32-B Slave"   sublabel={espB  ? 'Online'       : 'Offline'}         color={espB  ? 'emerald' : 'rose'} />
          <DeviceChip icon={Wifi}  label="Wi-Fi Network"   sublabel={wifiConnected ? ssid   : 'Disconnected'}    color={wifiConnected ? 'blue' : 'rose'} />
          <DeviceChip icon={Cloud} label="Firebase Sync"   sublabel={firebaseOk ? 'Live Sync' : 'Offline'}       color={firebaseOk ? 'amber' : 'rose'} />
        </div>

        {/* ── System Info Row ── */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4">
          <div className="grid grid-cols-3 divide-x divide-slate-800/60">
            <div className="pr-4 space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Signal</p>
              <div className="flex items-center gap-2">
                <SignalBar strength={signal} />
                <span className="text-xs font-bold text-blue-400 metric-num">{signal} dBm</span>
              </div>
            </div>
            <div className="px-4 space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Uptime</p>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-bold text-white metric-num">{uptimeStr}</span>
              </div>
            </div>
            <div className="pl-4 space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Firmware</p>
              <span className="text-xs font-bold text-emerald-400">{firmwareVersion}</span>
            </div>
          </div>
        </div>

        {/* IP row */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-slate-500 font-semibold">IP Address</span>
          <span className="text-[11px] font-mono font-bold text-slate-300">{ipAddress}</span>
        </div>

      </div>
    </div>
  );
}
