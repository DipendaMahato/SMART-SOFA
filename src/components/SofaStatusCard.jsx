import React, { useState, useEffect } from 'react';
import {
  UserCheck, UserX, Flame, Sliders, Clock, Wind,
  SlidersHorizontal, Thermometer, Activity, Zap, ChevronRight
} from 'lucide-react';

function StatPill({ label, value, accent }) {
  const cls = {
    blue:    'stat-chip-blue',
    amber:   'stat-chip-amber',
    cyan:    'stat-chip-cyan',
    emerald: 'stat-chip-emerald',
  }[accent] || 'stat-chip-blue';
  return (
    <div className={`${cls} rounded-xl px-3 py-2 flex flex-col gap-0.5`}>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
      <span className="text-sm font-black metric-num">{value}</span>
    </div>
  );
}

function HeatButton({ level, active, onClick }) {
  const labels = ['Off', 'Low', 'Med', 'High'];
  const colors = {
    0: active ? 'bg-slate-700 text-white border-slate-600'       : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:border-slate-700',
    1: active ? 'bg-amber-500/30 text-amber-300 border-amber-500': 'bg-slate-900/60 text-slate-500 border-slate-800 hover:border-amber-800',
    2: active ? 'bg-orange-500/30 text-orange-300 border-orange-500': 'bg-slate-900/60 text-slate-500 border-slate-800 hover:border-orange-800',
    3: active ? 'bg-rose-500/30 text-rose-300 border-rose-500'   : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:border-rose-800',
  };
  return (
    <button onClick={onClick} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${colors[level]}`}>
      {level > 0 && <Flame className="w-3 h-3 inline mr-1 opacity-80" />}
      {labels[level]}
    </button>
  );
}

export default function SofaStatusCard({ sofaStatus, onUpdateStatus }) {
  const isOccupied    = sofaStatus?.occupied ?? false;
  const heatLevel     = sofaStatus?.heatLevel ?? 0;
  const reclinerAngle = sofaStatus?.reclinerAngle ?? 110;

  const lastTime  = isOccupied ? sofaStatus?.lastOccupiedAt : sofaStatus?.lastEmptyAt;
  const minutesAgo = lastTime ? Math.max(0, Math.floor((Date.now() - lastTime) / 60000)) : 0;

  const reclinePercent = Math.round(((reclinerAngle - 90) / (145 - 90)) * 100);

  return (
    <div className={`glass-card card-hover rounded-3xl overflow-hidden relative transition-all duration-500
      ${isOccupied ? 'border-emerald-500/20' : 'border-slate-800/60'}`}>

      {/* Ambient top glow bar */}
      <div className={`h-0.5 w-full transition-all duration-700 ${
        isOccupied
          ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0'
          : 'bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0'
      }`} />

      {/* Background ambient */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isOccupied ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/6 rounded-full blur-3xl" />
      </div>

      <div className="p-6 relative z-10 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`section-icon transition-all duration-500 ${
              isOccupied
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/80 border border-slate-700/60 text-slate-400'
            }`}>
              {isOccupied ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cushion Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Realtime pressure telemetry</p>
            </div>
          </div>
          <div className={`live-badge ${isOccupied ? '' : 'opacity-50'}`}>
            {isOccupied ? 'Occupied' : 'Vacant'}
          </div>
        </div>

        {/* ── Occupancy Hero ── */}
        <div className={`rounded-2xl p-5 transition-all duration-500 relative overflow-hidden ${
          isOccupied
            ? 'bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/20'
            : 'bg-slate-900/40 border border-slate-800/60'
        }`}>
          {isOccupied && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-emerald-400/10 animate-ripple" />
            </div>
          )}
          <div className="flex items-center gap-5 relative z-10">
            {/* Big occupancy icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isOccupied
                ? 'bg-emerald-500/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/60 border border-slate-700/40'
            }`}>
              {isOccupied
                ? <UserCheck className="w-8 h-8 text-emerald-400" />
                : <UserX className="w-8 h-8 text-slate-500" />
              }
            </div>
            <div>
              <div className={`text-2xl font-black transition-colors duration-500 ${isOccupied ? 'text-emerald-300' : 'text-slate-300'}`}>
                {isOccupied ? 'Person Sitting' : 'Seat Empty'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">
                  {minutesAgo === 0 ? 'Just now' : `${minutesAgo} min${minutesAgo !== 1 ? 's' : ''} ago`}
                </span>
              </div>
              <button
                onClick={() => {
                  onUpdateStatus('occupied', !isOccupied);
                  onUpdateStatus(isOccupied ? 'lastEmptyAt' : 'lastOccupiedAt', Date.now());
                }}
                className={`mt-2.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isOccupied
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}>
                {isOccupied ? '↑ Simulate Vacate' : '↓ Simulate Occupy'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Controls Row ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Recliner Angle */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-300">Recline</span>
              </div>
              <span className="text-sm font-black text-blue-400 metric-num">{reclinerAngle}°</span>
            </div>
            <input
              type="range" min="90" max="145" value={reclinerAngle}
              onChange={e => onUpdateStatus('reclinerAngle', parseInt(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-blue-500"
              style={{ background: `linear-gradient(to right, #3B82F6 ${reclinePercent}%, #1e293b ${reclinePercent}%)` }}
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
              <span>90°</span><span>120°</span><span>145°</span>
            </div>
          </div>

          {/* Heat Level */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-300">Heat</span>
              </div>
              <span className={`text-xs font-black metric-num ${
                heatLevel === 0 ? 'text-slate-500' : heatLevel === 1 ? 'text-amber-300' : heatLevel === 2 ? 'text-orange-300' : 'text-rose-300'
              }`}>{['Off','Low','Med','High'][heatLevel]}</span>
            </div>
            <div className="flex gap-1.5">
              {[0,1,2,3].map(l => (
                <HeatButton key={l} level={l} active={heatLevel === l} onClick={() => onUpdateStatus('heatLevel', l)} />
              ))}
            </div>
            {/* Heat bar */}
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${heatLevel * 33.3}%`,
                background: ['transparent','#F59E0B','#F97316','#EF4444'][heatLevel]
              }} />
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatPill label="Angle" value={`${reclinerAngle}°`} accent="blue" />
          <StatPill label="Heat" value={['Off','L1','L2','L3'][heatLevel]} accent="amber" />
          <StatPill label="Duration" value={minutesAgo > 0 ? `${minutesAgo}m` : '—'} accent="emerald" />
        </div>

      </div>
    </div>
  );
}
