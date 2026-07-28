import React from 'react';
import { 
  UserCheck, 
  UserX, 
  Flame, 
  Sparkles, 
  Sliders, 
  Clock, 
  Wind,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

export default function SofaStatusCard({ sofaStatus, onUpdateStatus }) {
  const isOccupied = sofaStatus?.occupied ?? false;
  
  // Calculate state duration in minutes
  const lastTime = isOccupied ? sofaStatus?.lastOccupiedAt : sofaStatus?.lastEmptyAt;
  const minutesAgo = lastTime ? Math.max(0, Math.floor((Date.now() - lastTime) / 60000)) : 12;

  const heatLevel = sofaStatus?.heatLevel ?? 1;
  const reclinerAngle = sofaStatus?.reclinerAngle ?? 110;
  const massageMode = sofaStatus?.massageMode ?? 'off';

  const handleToggleOccupancy = () => {
    onUpdateStatus('occupied', !isOccupied);
    if (!isOccupied) {
      onUpdateStatus('lastOccupiedAt', Date.now());
    } else {
      onUpdateStatus('lastEmptyAt', Date.now());
    }
  };

  return (
    <div className={`glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden transition-all duration-500 border ${
      isOccupied ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/10' : 'border-slate-800'
    }`}>

      {/* Decorative ambient background glow */}
      <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
        isOccupied ? 'bg-emerald-500/15' : 'bg-blue-500/10'
      }`}></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Status Summary */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center justify-center w-3 h-3 rounded-full ${
              isOccupied ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Realtime Cushion Telemetry
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isOccupied 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {isOccupied ? <UserCheck className="w-7 h-7" /> : <UserX className="w-7 h-7" />}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                {isOccupied ? 'Person Sitting' : 'Seat Empty'}
              </h2>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>State duration: <strong className="text-slate-200">{minutesAgo} mins</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <button
            onClick={handleToggleOccupancy}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isOccupied 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isOccupied ? 'Simulate Stand Up (Vacate)' : 'Simulate Sit Down (Occupy)'}
          </button>
        </div>

        {/* Center: Smart Sofa Visualizer */}
        <div className="w-full lg:w-72 glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-950/40 flex flex-col items-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Ergonomic Position & Heat</span>
          </div>

          {/* Sofa Illustration graphic */}
          <div className="relative w-48 h-32 flex items-center justify-center my-2">
            
            {/* Heat radiation waves graphic */}
            {heatLevel > 0 && (
              <div className="absolute top-2 w-32 flex justify-around opacity-75 animate-pulse">
                <Flame className="w-4 h-4 text-amber-400" />
                <Flame className="w-5 h-5 text-orange-500" />
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
            )}

            {/* Sofa Backrest (rotates according to recliner angle) */}
            <div 
              className="absolute left-6 bottom-6 w-8 h-20 bg-gradient-to-b from-blue-600 to-slate-800 rounded-lg border border-blue-400/40 shadow-lg origin-bottom transition-transform duration-500"
              style={{ transform: `rotate(${-(120 - reclinerAngle)}deg)` }}
            />

            {/* Sofa Seat Cushion */}
            <div className={`relative z-10 w-32 h-8 rounded-lg transition-all duration-300 flex items-center justify-center border ${
              isOccupied 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-300 shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                {isOccupied ? 'PRESSURE SENSOR: OK' : 'READY'}
              </span>
            </div>

            {/* Armrest */}
            <div className="absolute right-6 bottom-4 w-6 h-12 bg-slate-700 rounded-md border border-slate-600" />
          </div>

          <div className="w-full flex items-center justify-between text-xs text-slate-400 mt-1 px-2">
            <span>Recline Angle: <strong className="text-blue-400">{reclinerAngle}°</strong></span>
            <span>Heat Level: <strong className="text-amber-400">L{heatLevel}</strong></span>
          </div>
        </div>

        {/* Right Controls: Ergonomics Controls */}
        <div className="w-full lg:w-72 space-y-3">
          
          {/* Recliner Angle Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-blue-400" /> Recliner Angle</span>
              <span className="text-blue-400">{reclinerAngle}°</span>
            </div>
            <input
              type="range"
              min="90"
              max="145"
              value={reclinerAngle}
              onChange={(e) => onUpdateStatus('reclinerAngle', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>90° Upright</span>
              <span>120° Relax</span>
              <span>145° Full Recline</span>
            </div>
          </div>

          {/* Heating Level selector */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-amber-400" /> Climate Heating</span>
              <span className="text-amber-400">{heatLevel === 0 ? 'OFF' : `Level ${heatLevel}`}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onUpdateStatus('heatLevel', lvl)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    heatLevel === lvl
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-700'
                  }`}
                >
                  {lvl === 0 ? 'Off' : `L${lvl}`}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
