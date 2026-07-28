import React from 'react';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  Gauge 
} from 'lucide-react';

export default function ElectricalInfoCard({ electricalInfo }) {
  const voltage = electricalInfo?.voltage ?? 230.4;
  const current = electricalInfo?.current ?? 1.85;
  const power = electricalInfo?.power ?? 426.2;
  const dailyEnergy = electricalInfo?.dailyEnergy ?? 3.42;
  const weeklyEnergy = electricalInfo?.weeklyEnergy ?? 24.8;
  const monthlyEnergy = electricalInfo?.monthlyEnergy ?? 98.5;
  const relayStatus = electricalInfo?.relayStatus ?? true;

  // Rate ₹8 / kWh
  const estimatedCostDaily = (dailyEnergy * 8).toFixed(2);
  const estimatedCostMonthly = (monthlyEnergy * 8).toFixed(2);

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Electrical Telemetry & Energy Usage</h3>
            <p className="text-xs text-slate-400">Real-time voltage, current draw, power consumption & utility cost estimation</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          relayStatus 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          Relay: {relayStatus ? 'ENGAGED (ON)' : 'TRIPPED (OFF)'}
        </span>
      </div>

      {/* Main Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Voltage */}
        <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-blue-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Grid Voltage</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 glow-text-blue">
            {voltage} <span className="text-sm font-bold text-slate-400">V</span>
          </div>
          <p className="text-[10px] text-slate-400">Nominal 230V AC</p>
        </div>

        {/* Current */}
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Current Draw</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 glow-text-emerald">
            {current} <span className="text-sm font-bold text-slate-400">A</span>
          </div>
          <p className="text-[10px] text-slate-400">ACS712 Sensor</p>
        </div>

        {/* Realtime Power */}
        <div className="p-4 rounded-2xl glass-card border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Power</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {power} <span className="text-sm font-bold text-slate-400">W</span>
          </div>
          <p className="text-[10px] text-slate-400">P = V × I × cos(φ)</p>
        </div>

      </div>

      {/* Energy Metrics & Utility Cost Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Daily & Cumulative Energy */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" /> Accumulated Energy (kWh)
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block">Today</span>
              <strong className="text-sm font-bold text-white">{dailyEnergy}</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block">This Week</span>
              <strong className="text-sm font-bold text-white">{weeklyEnergy}</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block">This Month</span>
              <strong className="text-sm font-bold text-white">{monthlyEnergy}</strong>
            </div>
          </div>
        </div>

        {/* Cost Estimation */}
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Estimated Cost (₹8/kWh)
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Today's Cost</span>
              <span className="text-lg font-bold text-emerald-400">₹{estimatedCostDaily}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">Est. Monthly Bill</span>
              <span className="text-lg font-bold text-emerald-300">₹{estimatedCostMonthly}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
