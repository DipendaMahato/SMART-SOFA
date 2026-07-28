import React from 'react';
import { Zap, Activity, Gauge } from 'lucide-react';

export default function ElectricalInfoCard({ electricalInfo }) {
  const voltage = electricalInfo?.voltage ?? 230.4;
  const current = electricalInfo?.current ?? 1.85;
  const power = electricalInfo?.power ?? 426.2;
  const relayStatus = electricalInfo?.relayStatus ?? true;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Electrical Telemetry</h3>
            <p className="text-xs text-slate-400">Real-time voltage, current draw & power</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${relayStatus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
          {relayStatus ? 'ON' : 'OFF'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-blue-500/20 bg-blue-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Grid Voltage</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400">{voltage} <span className="text-sm font-bold text-slate-400">V</span></div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Current Draw</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{current} <span className="text-sm font-bold text-slate-400">A</span></div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{power} <span className="text-sm font-bold text-slate-400">W</span></div>
        </div>
      </div>
    </div>
  );
}