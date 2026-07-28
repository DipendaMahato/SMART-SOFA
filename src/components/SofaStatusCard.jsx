import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';

export default function SofaStatusCard({ sofaStatus, onUpdateStatus }) {
  const isOccupied = sofaStatus?.occupied ?? false;
  const lastTime = isOccupied ? sofaStatus?.lastOccupiedAt : sofaStatus?.lastEmptyAt;
  const minutesAgo = lastTime ? Math.max(0, Math.floor((Date.now() - lastTime) / 60000)) : 0;

  return (
    <div className={`glass-card rounded-3xl overflow-hidden relative transition-all duration-500 ${isOccupied ? 'border-emerald-500/20' : 'border-slate-800/60'}`}>
      <div className={`h-0.5 w-full transition-all duration-700 ${isOccupied ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0' : 'bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0'}`} />
      <div className="p-6 relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOccupied ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-slate-800/80 border border-slate-700/60 text-slate-400'}`}>
              {isOccupied ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cushion Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Realtime occupancy</p>
            </div>
          </div>
          <span className={`live-badge ${isOccupied ? '' : 'opacity-50'}`}>
            {isOccupied ? 'Occupied' : 'Vacant'}
          </span>
        </div>

        <div className={`rounded-2xl p-5 transition-all duration-500 relative overflow-hidden ${isOccupied ? 'bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/20' : 'bg-slate-900/40 border border-slate-800/60'}`}>
          {isOccupied && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-emerald-400/10 animate-ripple" />
            </div>
          )}
          <div className="flex items-center gap-5 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOccupied ? 'bg-emerald-500/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20' : 'bg-slate-800/60 border border-slate-700/40'}`}>
              {isOccupied ? <UserCheck className="w-7 h-7 text-emerald-400" /> : <UserX className="w-7 h-7 text-slate-500" />}
            </div>
            <div>
              <div className={`text-2xl font-black transition-colors duration-500 ${isOccupied ? 'text-emerald-300' : 'text-slate-300'}`}>
                {isOccupied ? 'Person Sitting' : 'Seat Empty'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400">{minutesAgo === 0 ? 'Just now' : `${minutesAgo} min${minutesAgo !== 1 ? 's' : ''} ago`}</span>
              </div>
              <button onClick={() => { onUpdateStatus('occupied', !isOccupied); onUpdateStatus(isOccupied ? 'lastEmptyAt' : 'lastOccupiedAt', Date.now()); }} className={`mt-2.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${isOccupied ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
                {isOccupied ? 'Vacate' : 'Occupy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}