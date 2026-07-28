import React from 'react';
import { Cpu, ChevronRight, Radio, Activity, Zap, HardDrive, Network, ShieldCheck } from 'lucide-react';

export default function DeviceStatusCard({ deviceStatus, onOpenDeviceInfo, onOpenWifiConfig }) {
  const espA = deviceStatus?.esp32aOnline ?? true;
  const espB = deviceStatus?.esp32bOnline ?? true;

  return (
    <div className="glass-panel rounded-[28px] p-6 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-full border border-white/10 hover:border-cyan-500/40 group">
      
      {/* Ambient Background Radial Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f1930] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Device Status</h3>
            <p className="text-xs text-slate-400">ESP32 dual-core controllers & bus status</p>
          </div>
        </div>

        {/* BLE Wi-Fi Radar Button */}
        <button
          onClick={onOpenWifiConfig}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#11233d] to-[#0e1d33] hover:from-[#183157] hover:to-[#142847] border border-cyan-500/40 text-cyan-300 text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] active:scale-95 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" />
          </div>
          <span>BLE Wi-Fi</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Controller Cards Grid - Filling the Vertical Space Symmetrically */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 flex-1">
        
        {/* ESP32-A Master Card */}
        <div 
          onClick={onOpenDeviceInfo}
          className="rounded-2xl bg-gradient-to-br from-[#0d162a]/95 to-[#081022]/95 hover:from-[#121f3a] hover:to-[#0b162f] border border-emerald-500/35 hover:border-emerald-400/60 p-5 flex flex-col justify-between transition-all cursor-pointer group/card shadow-lg relative overflow-hidden space-y-4"
        >
          {/* Subtle Glow Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner group-hover/card:scale-110 transition-transform">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-base font-black text-white tracking-tight">ESP32-A Master</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-xs font-black text-emerald-400">{espA ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            <div className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-inner">
              14 ms
            </div>
          </div>

          {/* Center Visualizer: Dual Core CPU Utilization HUD & Bus Stream */}
          <div className="p-3.5 rounded-xl bg-[#070d1c]/90 border border-emerald-500/20 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Dual-Core Load
              </span>
              <span className="text-emerald-400 font-extrabold">Core 0: 38% | Core 1: 42%</span>
            </div>

            {/* Core Load Progress Bars */}
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '38%' }} />
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            {/* Mini Oscilloscope I2C Bus Waveform */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>I2C BUS: 400 kHz</span>
              <span className="text-cyan-400 font-bold">UART0 ACTIVE</span>
            </div>
          </div>

          {/* Hardware Specs Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs">
            <div className="p-2.5 rounded-xl bg-[#091124]/80 border border-white/5 space-y-0.5 shadow-sm">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Clock Frequency</p>
              <p className="text-sm font-black text-slate-100">240 MHz</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#091124]/80 border border-white/5 space-y-0.5 shadow-sm">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Free SRAM</p>
              <p className="text-sm font-black text-slate-100">320 KB</p>
            </div>
          </div>

          {/* Bottom Bus Activity Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>System Bus Stream</span>
              <span className="text-emerald-400 font-extrabold">98.4% Active</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full animate-pulse" style={{ width: '98.4%' }} />
            </div>
          </div>
        </div>

        {/* ESP32-B Slave Card */}
        <div 
          onClick={onOpenDeviceInfo}
          className="rounded-2xl bg-gradient-to-br from-[#0d162a]/95 to-[#081022]/95 hover:from-[#121f3a] hover:to-[#0b162f] border border-cyan-500/35 hover:border-cyan-400/60 p-5 flex flex-col justify-between transition-all cursor-pointer group/card shadow-lg relative overflow-hidden space-y-4"
        >
          {/* Subtle Glow Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner group-hover/card:scale-110 transition-transform">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-base font-black text-white tracking-tight">ESP32-B Slave</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span className="text-xs font-black text-emerald-400">{espB ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            <div className="text-xs font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-inner">
              18 ms
            </div>
          </div>

          {/* Center Visualizer: Dual Core CPU Utilization HUD & Bus Stream */}
          <div className="p-3.5 rounded-xl bg-[#070d1c]/90 border border-cyan-500/20 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Dual-Core Load
              </span>
              <span className="text-cyan-400 font-extrabold">Core 0: 29% | Core 1: 34%</span>
            </div>

            {/* Core Load Progress Bars */}
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: '29%' }} />
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            {/* Mini Oscilloscope SPI Bus Waveform */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>SPI BUS: 20 MHz</span>
              <span className="text-emerald-400 font-bold">SLAVE READY</span>
            </div>
          </div>

          {/* Hardware Specs Grid */}
          <div className="grid grid-cols-2 gap-3 py-1 text-xs">
            <div className="p-2.5 rounded-xl bg-[#091124]/80 border border-white/5 space-y-0.5 shadow-sm">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Clock Frequency</p>
              <p className="text-sm font-black text-slate-100">240 MHz</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#091124]/80 border border-white/5 space-y-0.5 shadow-sm">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Free SRAM</p>
              <p className="text-sm font-black text-slate-100">410 KB</p>
            </div>
          </div>

          {/* Bottom Bus Activity Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>System Bus Stream</span>
              <span className="text-cyan-400 font-extrabold">96.8% Active</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '96.8%' }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}