import React from 'react';
import { 
  X, 
  Cpu, 
  Wifi, 
  Cloud, 
  Activity, 
  Clock, 
  Network, 
  Hash, 
  ShieldCheck, 
  HardDrive 
} from 'lucide-react';

export default function DeviceInfoModal({ isOpen, onClose, deviceStatus }) {
  if (!isOpen) return null;

  const uptime = deviceStatus?.uptimeSeconds || 142800;
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hardware & Telemetry Information</h3>
              <p className="text-xs text-slate-400">ESP32 system metrics, MAC/IP specs and sensor bus status</p>
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
          
          {/* Header Summary */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              SS
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{deviceStatus?.deviceName || "Smart Sofa SS-001"}</h4>
              <p className="text-slate-400 text-[11px]">Device ID: {deviceStatus?.deviceId || "ESP32-SOFA-88A12"} • Firmware {deviceStatus?.firmwareVersion || "v1.4.2"}</p>
            </div>
          </div>

          {/* Hardware Subsystems */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Microcontroller Status</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl glass-card border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">ESP32-A Master</span>
                <strong className={deviceStatus?.esp32aOnline ? 'text-emerald-400' : 'text-rose-400'}>
                  {deviceStatus?.esp32aOnline ? '● Online' : '○ Offline'}
                </strong>
              </div>
              <div className="p-3 rounded-xl glass-card border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">ESP32-B Slave</span>
                <strong className={deviceStatus?.esp32bOnline ? 'text-emerald-400' : 'text-rose-400'}>
                  {deviceStatus?.esp32bOnline ? '● Online' : '○ Offline'}
                </strong>
              </div>
            </div>
          </div>

          {/* Network Metrics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Network & Cloud Telemetry</h4>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Wi-Fi Network (SSID)</span>
                <strong className="text-white">{deviceStatus?.wifiSsid || "Home_WiFi_5G"}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Signal Strength (RSSI)</span>
                <strong className="text-blue-400">{deviceStatus?.signalStrength || -62} dBm</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Local IP Address</span>
                <strong className="text-white">{deviceStatus?.ipAddress || "192.168.1.145"}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Hardware MAC Address</span>
                <strong className="text-slate-300 font-mono">{deviceStatus?.macAddress || "24:6F:28:AB:88:A1"}</strong>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">System Continuous Uptime</span>
                <strong className="text-emerald-400">{hours} hours {minutes} mins</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
