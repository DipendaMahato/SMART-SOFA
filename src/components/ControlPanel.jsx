import React from 'react';
import { Fan, Lightbulb, Zap } from 'lucide-react';

export default function ControlPanel({ controls, onToggleFan, onToggleLight }) {
  const fanOn = controls?.fan ?? false;
  const lightOn = controls?.light ?? false;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 relative overflow-hidden space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Control Panel</h3>
            <p className="text-xs text-slate-400">Fan, light & relay controls</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${fanOn ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${fanOn ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                <Fan className={`w-5 h-5 ${fanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cooling Fan</h4>
                <p className="text-[11px] text-slate-400">{fanOn ? 'Running' : 'Disabled'}</p>
              </div>
            </div>
            <button onClick={onToggleFan} className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${fanOn ? 'bg-cyan-500' : 'bg-slate-800 border border-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fanOn ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${lightOn ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${lightOn ? 'text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-400'}`} style={{ backgroundColor: lightOn ? '#F59E0B' : undefined, boxShadow: lightOn ? '0 0 15px rgba(245,158,11,0.5)' : undefined }}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ambient Light</h4>
                <p className="text-[11px] text-slate-400">{lightOn ? 'On' : 'Off'}</p>
              </div>
            </div>
            <button onClick={onToggleLight} className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${lightOn ? 'bg-amber-400' : 'bg-slate-800 border border-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${lightOn ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl glass-card border transition-all space-y-4 ${controls?.relayStatus !== false ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${controls?.relayStatus !== false ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'bg-rose-500 text-white'}`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Main Relay</h4>
                <p className="text-[11px] text-slate-400">{controls?.relayStatus !== false ? 'Energized' : 'Tripped'}</p>
              </div>
            </div>
            <button onClick={() => {}} className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${controls?.relayStatus !== false ? 'bg-emerald-500' : 'bg-rose-600'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${controls?.relayStatus !== false ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}