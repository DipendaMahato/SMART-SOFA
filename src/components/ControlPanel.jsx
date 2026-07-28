import React from 'react';
import { 
  Fan, 
  Lightbulb, 
  ToggleLeft, 
  ToggleRight, 
  Zap, 
  Sliders, 
  Palette, 
  Sparkles,
  Bot,
  UserCheck
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Royal Blue', color: '#3B82F6' },
  { name: 'Electric Cyan', color: '#06B6D4' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Warm Amber', color: '#F59E0B' },
  { name: 'Neon Purple', color: '#8B5CF6' },
  { name: 'Pure White', color: '#F8FAFC' }
];

export default function ControlPanel({ controls, onToggleFan, onToggleLight, onSetMode, onUpdateControl }) {
  const fanOn = controls?.fan ?? false;
  const lightOn = controls?.light ?? false;
  const isAuto = controls?.mode?.toLowerCase() === 'auto';
  const relayStatus = controls?.relayStatus ?? true;
  const fanSpeed = controls?.fanSpeed ?? 3;
  const lightBrightness = controls?.lightBrightness ?? 80;
  const activeColor = controls?.lightColor ?? '#3B82F6';

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Hardware Control Center</h3>
            <p className="text-xs text-slate-400">Manage ventilation, RGB lighting, smart auto-comfort modes & relay</p>
          </div>
        </div>

        {/* Mode Switch: Manual vs Auto */}
        <div className="flex items-center space-x-2 glass-card p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onSetMode('manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isAuto 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Manual
          </button>
          <button
            onClick={() => onSetMode('auto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAuto 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Auto Mode
          </button>
        </div>
      </div>

      {/* Grid of Main Hardware Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Fan / Ventilation Control */}
        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${
          fanOn ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                fanOn ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                <Fan className={`w-5 h-5 ${fanOn ? 'animate-spin' : ''}`} style={{ animationDuration: `${3 / fanSpeed}s` }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cooling Fan</h4>
                <p className="text-[11px] text-slate-400">{fanOn ? `Speed ${fanSpeed} • Running` : 'Disabled'}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={onToggleFan}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                fanOn ? 'bg-cyan-500' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                fanOn ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Fan Speed Slider */}
          {fanOn && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Speed Intensity</span>
                <span className="text-cyan-400">Level {fanSpeed}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fanSpeed}
                onChange={(e) => onUpdateControl('fanSpeed', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Module 2: Ambient RGB Lighting Control */}
        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${
          lightOn ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  lightOn ? 'text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-400'
                }`}
                style={{ 
                  backgroundColor: lightOn ? activeColor : undefined,
                  boxShadow: lightOn ? `0 0 15px ${activeColor}80` : undefined
                }}
              >
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ambient Light</h4>
                <p className="text-[11px] text-slate-400">{lightOn ? `${lightBrightness}% Brightness` : 'Off'}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={onToggleLight}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                lightOn ? 'bg-amber-400' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                lightOn ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Light Color Presets & Brightness */}
          {lightOn && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Color Presets */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Presets
                </span>
                <div className="flex items-center gap-1.5">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      onClick={() => onUpdateControl('lightColor', p.color)}
                      className={`w-4 h-4 rounded-full transition-all border ${
                        activeColor === p.color ? 'scale-125 border-white ring-2 ring-blue-500/50' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>

              {/* Brightness Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Brightness</span>
                  <span className="text-amber-400">{lightBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={lightBrightness}
                  onChange={(e) => onUpdateControl('lightBrightness', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Module 3: Main Relay Power Gate */}
        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${
          relayStatus ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                relayStatus ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'bg-rose-500 text-white'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Main Relay Gate</h4>
                <p className="text-[11px] text-slate-400">{relayStatus ? 'Relay Energized (Pass-through)' : 'Relay Tripped (Safe Stop)'}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => onUpdateControl('relayStatus', !relayStatus)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                relayStatus ? 'bg-emerald-500' : 'bg-rose-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                relayStatus ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master surge protection and hardware power kill-switch.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
