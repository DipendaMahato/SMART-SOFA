import React from 'react';
import { User, SlidersHorizontal, Clock, Sparkles } from 'lucide-react';

export default function SofaStatusCard({ sofaStatus, onUpdateStatus }) {
  const isOccupied = sofaStatus?.occupied ?? false; // Default matching screenshot
  const lastTime = isOccupied ? (sofaStatus?.lastOccupiedAt || Date.now() - 20 * 60 * 1000) : (sofaStatus?.lastEmptyAt || Date.now() - 20 * 60 * 1000);
  const minutesAgo = lastTime ? Math.max(1, Math.floor((Date.now() - lastTime) / 60000)) : 20;

  return (
    <div className="glass-panel rounded-[28px] p-6 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-full border border-white/10 hover:border-cyan-500/40 group">
      
      {/* Background Ambient Radial Glowing Nebulae */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header & Top Right Concentric Ring HUD */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f1930] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              Cushion Status
            </h3>
            <p className="text-xs text-slate-400">Realtime occupancy & pressure heatmaps</p>
          </div>
        </div>

        {/* Dual Concentric Spinning Ring HUD with Status */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          {/* Outer Cyan Spinning Ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="44" stroke="#06B6D4" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.8" />
            <circle cx="50" cy="50" r="48" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 12" fill="none" opacity="0.6" />
          </svg>
          
          {/* Inner Magenta Spinning Ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-reverse">
            <circle cx="50" cy="50" r="38" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="14 10" fill="none" opacity="0.9" />
          </svg>

          {/* Status Badge in Ring Center */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className={`w-2 h-2 rounded-full mb-0.5 shadow-md ${
              isOccupied ? 'bg-emerald-400 animate-ping shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]'
            }`} />
            <span className={`text-[10px] font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] ${
              isOccupied ? 'text-emerald-400' : 'text-cyan-300'
            }`}>
              • {isOccupied ? 'OCCUPIED' : 'VACANT'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mt-3 relative z-10">
        
        {/* Left Column: User Status, Override Button & Binary Matrix Rain */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Vacant / Occupied Big Pill Box */}
          <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-[#0c152b]/80 border border-white/10 shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-[#111e3b] border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {isOccupied ? 'Occupied' : 'Vacant'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{minutesAgo} mins ago</span>
              </div>
            </div>
          </div>

          {/* Override Status Button */}
          <button
            onClick={() => {
              const next = !isOccupied;
              onUpdateStatus('occupied', next);
              onUpdateStatus(next ? 'lastOccupiedAt' : 'lastEmptyAt', Date.now());
            }}
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2c1554] via-[#24174a] to-[#1c143e] hover:from-[#3a1a70] hover:to-[#251954] border border-purple-500/40 text-xs font-extrabold text-purple-200 hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Override Status</span>
          </button>

          {/* Glowing Binary Matrix Data Stream Rain */}
          <div className="h-20 rounded-2xl bg-[#070d1e]/90 border border-blue-500/20 p-2.5 relative overflow-hidden font-mono text-[10px] text-cyan-400/80 leading-tight select-none shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-[#070d1e] pointer-events-none z-10" />
            <div className="animate-matrix space-y-0.5 font-bold tracking-wider">
              <div>000 1010011000 10 01 110 10100010</div>
              <div>101 0011010011 01 10 001 10000011</div>
              <div>010 1101001100 11 00 111 01010001</div>
              <div>110 0100110101 00 11 010 11001010</div>
              <div>001 1110001010 10 10 100 00110100</div>
              <div>100 0101100011 01 01 011 10101100</div>
              <div>000 1010011000 10 01 110 10100010</div>
              <div>101 0011010011 01 10 001 10000011</div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Swirling Energy Vortex Mannequin & L-Shape 3D Sectional Wireframe Sofa with Callouts */}
        <div className="lg:col-span-8 relative h-72 flex items-center justify-center">
          
          {/* Swirling Particle Vortex Spirals around Mannequin Silhouette */}
          <div className="absolute left-2 sm:left-6 bottom-4 w-32 h-44 z-10 flex items-center justify-center">
            {/* Rotating Cyan/Magenta Energy Spiral Vectors */}
            <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full animate-vortex pointer-events-none">
              <path d="M 10 70 Q 50 10, 90 70 T 10 70" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.8" strokeDasharray="4 4" />
              <path d="M 20 70 Q 50 130, 80 70 T 20 70" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.8" strokeDasharray="6 3" />
              <circle cx="50" cy="70" r="35" stroke="#38BDF8" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="2 8" />
            </svg>

            {/* Standing Human Mannequin Vector Silhouette */}
            <svg width="45" height="110" viewBox="0 0 45 110" fill="none" className="relative z-10 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              <circle cx="22.5" cy="15" r="8.5" fill="#38BDF8" opacity="0.9" />
              <path d="M12 32 C12 26, 33 26, 33 32 L30 62 L15 62 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" opacity="0.95" />
              <rect x="15" y="62" width="6" height="42" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" opacity="0.9" />
              <rect x="24" y="62" width="6" height="42" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" opacity="0.9" />
            </svg>
          </div>

          {/* L-Shape 3D Sectional Wireframe Sofa & Heatmap HUD */}
          <div className="w-full max-w-[460px] h-full relative flex items-center justify-center">
            
            {/* SVG L-Shape Sectional Wireframe Sofa */}
            <svg viewBox="0 0 520 320" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] overflow-visible">
              <defs>
                <radialGradient id="heatCoreHot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="20%" stopColor="#FFEE00" stopOpacity="1" />
                  <stop offset="55%" stopColor="#FF3300" stopOpacity="0.9" />
                  <stop offset="85%" stopColor="#06B6D4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#818CF8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                
                <filter id="glowHeatL" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 3D L-Shaped Sectional Sofa High Resolution Grid Lines */}
              <g stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.55" fill="none">
                
                {/* Backrest Structure */}
                <path d="M120 70 L340 10 L480 70 L260 130 Z" fill="rgba(14, 165, 233, 0.05)" />
                <path d="M120 70 L120 150 L260 210 L260 130 Z" fill="rgba(14, 165, 233, 0.08)" />
                <path d="M340 10 L340 90 L480 150 L480 70 Z" fill="rgba(14, 165, 233, 0.04)" />

                {/* Sectional L-Extension Structure */}
                <path d="M260 130 L480 70 L510 83 L290 143 Z" fill="rgba(14, 165, 233, 0.06)" />
                <path d="M290 143 L510 83 L510 163 L290 223 Z" fill="rgba(14, 165, 233, 0.09)" />

                {/* Seat Cushion Frames */}
                <polygon points="150,140 280,85 360,118 230,173" fill="rgba(15, 23, 42, 0.85)" strokeOpacity="0.8" />
                <polygon points="230,173 360,118 360,148 230,203" fill="rgba(15, 23, 42, 0.9)" strokeOpacity="0.8" />

                <polygon points="280,85 410,30 490,63 360,118" fill="rgba(15, 23, 42, 0.85)" strokeOpacity="0.8" />
                <polygon points="360,118 490,63 490,93 360,148" fill="rgba(15, 23, 42, 0.9)" strokeOpacity="0.8" />

                {/* Grid Subdivision Mesh */}
                <line x1="180" y1="127" x2="180" y2="187" strokeOpacity="0.3" />
                <line x1="210" y1="114" x2="210" y2="174" strokeOpacity="0.3" />
                <line x1="310" y1="72" x2="310" y2="132" strokeOpacity="0.3" />
                <line x1="340" y1="59" x2="340" y2="119" strokeOpacity="0.3" />
                <line x1="410" y1="60" x2="410" y2="120" strokeOpacity="0.3" />

                <line x1="190" y1="123" x2="320" y2="68" strokeOpacity="0.3" />
                <line x1="210" y1="150" x2="340" y2="95" strokeOpacity="0.3" />
                <line x1="320" y1="102" x2="450" y2="47" strokeOpacity="0.3" />

                {/* Base Support Frames */}
                <path d="M120 150 L260 210 L510 103" strokeOpacity="0.8" strokeWidth="1.5" />
                <line x1="125" y1="152" x2="125" y2="230" strokeWidth="2" stroke="#38BDF8" />
                <line x1="265" y1="212" x2="265" y2="260" strokeWidth="2" stroke="#38BDF8" />
                <line x1="505" y1="105" x2="505" y2="180" strokeWidth="2" stroke="#38BDF8" />
              </g>

              {/* Dynamic Cushion Heatmap Glow matching reference image */}
              <g filter="url(#glowHeatL)" className="animate-heat-pulse">
                <ellipse cx="310" cy="115" rx="65" ry="24" fill="url(#heatCoreHot)" transform="rotate(-22 310 115)" />
                <ellipse cx="380" cy="85" rx="50" ry="18" fill="url(#heatAura)" transform="rotate(-22 380 85)" />
              </g>

              {/* HUD Callout Tag 1: SEAT A (Top-Left) */}
              <g className="transition-transform hover:scale-105">
                <line x1="200" y1="70" x2="250" y2="105" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="250" cy="105" r="3" fill="#38BDF8" className="animate-ping" />
                <foreignObject x="110" y="45" width="120" height="36">
                  <div className="bg-[#0b152b]/95 border border-cyan-500/50 rounded-lg px-2 py-1 text-[9px] font-black text-cyan-300 tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.4)] flex flex-col">
                    <span>SEAT A:</span>
                    <span className="text-cyan-400 font-bold">VACANT</span>
                  </div>
                </foreignObject>
              </g>

              {/* HUD Callout Tag 2: SEAT B (Top-Right) */}
              <g className="transition-transform hover:scale-105">
                <line x1="440" y1="45" x2="390" y2="80" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="390" cy="80" r="3" fill="#EF4444" className="animate-ping" />
                <foreignObject x="430" y="25" width="130" height="36">
                  <div className="bg-[#1a0c1a]/95 border border-rose-500/60 rounded-lg px-2 py-1 text-[9px] font-black text-rose-300 tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.4)] flex flex-col">
                    <span>SEAT B:</span>
                    <span className="text-amber-400 font-bold">HEAT DETECTED</span>
                  </div>
                </foreignObject>
              </g>

              {/* HUD Callout Tag 3: SEAT C (Bottom-Left) */}
              <g className="transition-transform hover:scale-105">
                <line x1="280" y1="230" x2="270" y2="170" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="270" cy="170" r="3" fill="#10B981" className="animate-ping" />
                <foreignObject x="220" y="225" width="145" height="36">
                  <div className="bg-[#0a1c18]/95 border border-emerald-500/60 rounded-lg px-2 py-1 text-[9px] font-black text-emerald-300 tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.4)] flex flex-col">
                    <span>SEAT C:</span>
                    <span className="text-emerald-400 font-bold">OCCUPIED (TESTING)</span>
                  </div>
                </foreignObject>
              </g>

              {/* HUD Callout Tag 4: SENSOR 1S-B (Bottom-Right) */}
              <g className="transition-transform hover:scale-105">
                <line x1="430" y1="210" x2="420" y2="150" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="420" cy="150" r="3" fill="#38BDF8" className="animate-ping" />
                <foreignObject x="410" y="200" width="115" height="36">
                  <div className="bg-[#0b152b]/95 border border-cyan-500/50 rounded-lg px-2 py-1 text-[9px] font-black text-cyan-300 tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.4)] flex flex-col">
                    <span>SENSOR 1S-B:</span>
                    <span className="text-cyan-400 font-bold">ACTIVE</span>
                  </div>
                </foreignObject>
              </g>

            </svg>

          </div>

        </div>

      </div>

      {/* Footer Caption Telemetry Line */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 relative z-10 text-[10px] font-mono text-slate-400 tracking-widest">
        <span>TEST SEQUENCE 7.4 | OPERATOR: ALEX CHEN | CUSHION #84210</span>
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
      </div>

    </div>
  );
}