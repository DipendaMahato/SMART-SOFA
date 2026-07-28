import React, { useState } from 'react';
import { 
  Zap, 
  Fan, 
  Lightbulb, 
  Thermometer, 
  LayoutGrid, 
  Sun, 
  SlidersHorizontal, 
  Clock,
  Sparkles,
  Settings
} from 'lucide-react';

export default function ControlPanel({ 
  controls, 
  roomTemp = 24.5,
  onToggleFan, 
  onToggleLight, 
  onToggleRelay,
  onUpdateControl,
  onOpenSettings
}) {
  const fanOn = controls?.fan ?? false;
  const lightOn = controls?.light ?? true;
  const relayOn = controls?.relayStatus ?? true;

  const [activeTab, setActiveTab] = useState('grid');
  const [selectedColor, setSelectedColor] = useState(controls?.lightColor || '#3B82F6');
  const [fanSpeed, setFanSpeed] = useState(controls?.fanSpeed || 3);

  const lightPresets = [
    { name: 'Amber', color: '#F59E0B' },
    { name: 'Cyan', color: '#06B6D4' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#A855F7' }
  ];

  return (
    <div className="glass-panel rounded-[28px] p-6 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-full border border-white/10 hover:border-blue-500/40 group">
      
      {/* Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header with Direct Link Button to Settings Modal */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f1f38] border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Control Panel</h3>
            <p className="text-xs text-slate-400">Fan, light, relay & ambient temperature</p>
          </div>
        </div>

        {/* Direct Link to Settings Modal */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-400/40 text-blue-300 text-xs font-black transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_22px_rgba(37,99,235,0.4)] active:scale-95 cursor-pointer"
          title="Open Settings to Customize Names"
        >
          <Settings className="w-3.5 h-3.5 text-blue-400" />
          <span>Edit Controls</span>
        </button>
      </div>

      {/* Main Content Layout with Left Inner Sidebar Icons & 2x2 Grid */}
      <div className="flex gap-4 relative z-10 flex-1 my-auto">
        
        {/* Left Vertical Inner Sidebar Icons - Balanced Height Distribution */}
        <div className="flex flex-col justify-between p-2 rounded-2xl bg-[#0c1426]/90 border border-white/5 shadow-inner shrink-0 my-auto h-full max-h-[220px]">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'grid' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400/50 scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title="Dashboard Grid"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>

          <button 
            onClick={() => setActiveTab('light')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'light' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400/50 scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title="Light Presets"
          >
            <Sun className="w-4.5 h-4.5" />
          </button>

          <button 
            onClick={() => setActiveTab('sliders')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'sliders' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400/50 scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title="Tuning & Controls"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>

          <button 
            onClick={() => setActiveTab('timer')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'timer' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400/50 scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title="Timers & Schedules"
          >
            <Clock className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* 2x2 Rich Control Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
          
          {/* Tile 1: Cooling Fan */}
          <div className="rounded-2xl bg-[#0f172a]/85 hover:bg-[#131d36]/95 border border-white/10 p-4.5 flex flex-col justify-between shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                  fanOn ? 'bg-[#152a42] border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-[#121929] border border-white/10 text-slate-400'
                }`}>
                  <Fan className={`w-5 h-5 ${fanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-white truncate max-w-[110px]">{controls?.fanName || 'Cooling Fan'}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{fanOn ? '2400 RPM Active' : 'Relay Off'}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={onToggleFan}
                className={`w-11 h-6 rounded-full transition-all relative flex items-center px-1 cursor-pointer ${
                  fanOn ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fanOn ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Speed Presets Indicator */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 mt-2 font-bold">
              <span>Speed: Turbo</span>
              <span className="text-cyan-400 font-extrabold">{fanOn ? '100% PWM' : 'Standby'}</span>
            </div>
          </div>

          {/* Tile 2: Ambient Light */}
          <div className="rounded-2xl bg-[#0f172a]/85 hover:bg-[#131d36]/95 border border-white/10 p-4.5 flex flex-col justify-between shadow-md transition-all relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md border"
                  style={{
                    backgroundColor: lightOn ? `${selectedColor}22` : '#121929',
                    borderColor: lightOn ? `${selectedColor}66` : 'rgba(255,255,255,0.1)',
                    color: lightOn ? selectedColor : '#94A3B8',
                    boxShadow: lightOn ? `0 0 18px ${selectedColor}55` : 'none'
                  }}
                >
                  <Lightbulb className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-black text-white truncate max-w-[110px]">{controls?.lightName || 'Ambient Light'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {lightPresets.map(preset => (
                      <span 
                        key={preset.name} 
                        onClick={() => { setSelectedColor(preset.color); if (onUpdateControl) onUpdateControl('lightColor', preset.color); }}
                        className="w-2.5 h-2.5 rounded-full cursor-pointer hover:scale-125 transition-transform"
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={onToggleLight}
                className="w-11 h-6 rounded-full transition-all relative flex items-center px-1 cursor-pointer"
                style={{
                  backgroundColor: lightOn ? selectedColor : '#334155',
                  boxShadow: lightOn ? `0 0 15px ${selectedColor}66` : 'none'
                }}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${lightOn ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Brightness Subtext */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 mt-2 font-bold">
              <span>Mode: RGB Sync</span>
              <span className="text-blue-400 font-extrabold">{lightOn ? '80% Brightness' : 'Off'}</span>
            </div>
          </div>

          {/* Tile 3: Main Relay */}
          <div className="rounded-2xl bg-[#0f172a]/85 hover:bg-[#131d36]/95 border border-white/10 p-4.5 flex flex-col justify-between shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                  relayOn ? 'bg-[#0b2b1e] border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#2b0b14] border border-rose-500/50 text-rose-400'
                }`}>
                  <Zap className="w-5 h-5 fill-emerald-400/20" />
                </div>
                <div>
                  <p className="text-xs font-black text-white truncate max-w-[110px]">{controls?.relayName || 'Main Relay'}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{relayOn ? 'Energized' : 'Disabled'}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button 
                onClick={onToggleRelay}
                className={`w-11 h-6 rounded-full transition-all relative flex items-center px-1 cursor-pointer ${
                  relayOn ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${relayOn ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Voltage Output Line */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 mt-2 font-bold">
              <span>Output: AC Main</span>
              <span className="text-emerald-400 font-extrabold">{relayOn ? '230V AC Active' : '0V Cutoff'}</span>
            </div>
          </div>

          {/* Tile 4: Room Temperature Card */}
          <div className="rounded-2xl bg-[#0f172a]/85 hover:bg-[#131d36]/95 border border-teal-500/30 p-4.5 flex flex-col justify-between shadow-md transition-all relative overflow-hidden group/temp">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#082b2b] border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover/temp:scale-105 transition-transform">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white truncate max-w-[110px]">{controls?.tempName || 'Room Temp'}</p>
                  <p className="text-[11px] font-semibold text-teal-300/80 mt-0.5">Ambient Climate</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/30 shadow-inner">
                <span className="text-base font-black text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
                  {roomTemp}
                </span>
                <span className="text-xs font-bold text-teal-400">°C</span>
              </div>
            </div>

            {/* Temperature Range Indicator Line */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 mt-2 font-bold">
              <span>Comfort Gauge</span>
              <span className="text-teal-400 font-extrabold">{roomTemp}°C Ideal</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}