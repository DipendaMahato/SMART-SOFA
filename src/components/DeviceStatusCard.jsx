import React from 'react';
import { 
  Cpu, 
  Wifi, 
  Cloud, 
  Radio, 
  Activity, 
  Clock, 
  Network, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function DeviceStatusCard({ deviceStatus, onOpenWifiConfig, onOpenDeviceInfo }) {
  const espA = deviceStatus?.esp32aOnline ?? true;
  const espB = deviceStatus?.esp32bOnline ?? true;
  const wifiConnected = deviceStatus?.wifiConnected ?? true;
  const firebaseConnected = deviceStatus?.firebaseConnected ?? true;
  const ssid = deviceStatus?.wifiSsid || "Home_WiFi_5G";
  const signal = deviceStatus?.signalStrength || -62;
  const uptime = deviceStatus?.uptimeSeconds || 142800;

  // Format uptime
  const hours = Math.floor(uptime / 3600);
  const days = Math.floor(hours / 24);

  const bothOffline = !espA && !espB;

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative space-y-5">
      
      {/* Offline Alert Banner */}
      {bothOffline && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-300">Sofa Controllers Offline</h4>
              <p className="text-xs text-rose-400/80">Configure Wi-Fi credentials via Web Bluetooth (BLE)</p>
            </div>
          </div>

          <button
            onClick={onOpenWifiConfig}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 active:scale-95 whitespace-nowrap"
          >
            Setup Device
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Dual ESP32 Microcontrollers</h3>
            <p className="text-xs text-slate-400">Hardware health, sensor bus telemetry & cloud sync state</p>
          </div>
        </div>

        <button
          onClick={onOpenDeviceInfo}
          className="flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>All Telemetry</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Microcontrollers & Connectivity */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ESP32-A */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            espA ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">ESP32-A Master</span>
            <span className={`text-xs font-bold ${espA ? 'text-emerald-400' : 'text-rose-400'}`}>
              {espA ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>

        {/* ESP32-B */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            espB ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">ESP32-B Slave</span>
            <span className={`text-xs font-bold ${espB ? 'text-emerald-400' : 'text-rose-400'}`}>
              {espB ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>

        {/* Wi-Fi Network */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            wifiConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Wi-Fi Network</span>
            <span className="text-xs font-bold text-white truncate max-w-[100px] block">
              {wifiConnected ? ssid : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Firebase Sync */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            firebaseConnected ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Firebase Sync</span>
            <span className={`text-xs font-bold ${firebaseConnected ? 'text-amber-400' : 'text-rose-400'}`}>
              {firebaseConnected ? 'Synced (Live)' : 'Offline'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
