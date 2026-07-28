import React from 'react';
import { Zap, Activity, Gauge, Clock, Car, Calendar, QrCode, ShieldCheck } from 'lucide-react';

export default function ElectricalInfoCard({ electricalInfo }) {
  const voltage = electricalInfo?.voltage ?? 230.4;
  const current = electricalInfo?.current ?? 1.85;
  const power = electricalInfo?.power ?? 426.2;
  const relayStatus = electricalInfo?.relayStatus ?? true;

  return (
    <div className="glass-panel rounded-[28px] p-6 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-full border border-white/10 hover:border-amber-500/30 group">
      
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#261c10] border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Electrical Telemetry</h3>
            <p className="text-xs text-slate-400">Real-time voltage, current draw & power</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[11px] font-black tracking-wider uppercase flex items-center gap-2 shadow-[0_0_18px_rgba(16,185,129,0.3)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#34d399]" />
          {relayStatus ? 'ON' : 'OFF'}
        </div>
      </div>

      {/* Grid Voltage, Current Draw & Active Power Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 relative z-10">
        
        {/* Grid Voltage Box with Live Animated Sparkline Background */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0b1329]/90 to-[#080d1f]/90 border border-blue-500/30 hover:border-blue-400/50 p-4 relative overflow-hidden flex items-center justify-between shadow-md group/v">
          {/* Animated Background Sine Wave Graphic */}
          <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 300 80" className="w-full h-full stroke-blue-400 fill-none" strokeWidth="2.5">
              <path d="M0 40 Q 25 10, 50 40 T 100 40 T 150 40 T 200 40 T 250 40 T 300 40" className="animate-wave" />
            </svg>
          </div>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-300">Grid Voltage</p>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]">
                {voltage}
              </span>
              <span className="text-sm font-black text-blue-400">V</span>
            </div>
          </div>

          <div className="relative z-10 w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner group-hover/v:scale-110 transition-transform">
            <Gauge className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Current Draw Box */}
        <div className="rounded-2xl bg-gradient-to-br from-[#091f24]/90 to-[#06161a]/90 border border-emerald-500/30 hover:border-emerald-400/50 p-4 flex items-center justify-between shadow-md group/c">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-300">Current Draw</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                {current}
              </span>
              <span className="text-sm font-black text-emerald-400">A</span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner group-hover/c:scale-110 transition-transform">
            <Activity className="w-4.5 h-4.5 animate-pulse" />
          </div>
        </div>

        {/* Active Power Box */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1c160a]/90 to-[#141007]/90 border border-amber-500/30 hover:border-amber-400/50 p-4 flex items-center justify-between shadow-md group/p">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-300/90">Active Power</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {power}
              </span>
              <span className="text-sm font-black text-amber-400">W</span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner group-hover/p:scale-110 transition-transform">
            <Zap className="w-4.5 h-4.5 fill-amber-400" />
          </div>
        </div>

      </div>

    </div>
  );
}