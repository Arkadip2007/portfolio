import React from 'react';
import { Cpu, Atom, Zap, Terminal as TerminalIcon, Sparkles, CircuitBoard } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const Hero: React.FC = () => {
  const handleAction = (sfx: () => void) => {
    sfx();
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 px-4 lg:px-12 flex flex-col justify-center max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Info */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Status Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <span className="badge-tag">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Class 12 Innovator
            </span>
            <span className="badge-tag border-magenta-500/40 text-magenta-400 bg-magenta-500/10">
              <Atom className="w-3.5 h-3.5" />
              Astrophysics & LHC
            </span>
            <span className="badge-tag border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
              <CircuitBoard className="w-3.5 h-3.5" />
              Arduino • ESP32 • RasPi
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Exploring the <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-magenta-400 to-emerald-400 glow-cyan">
                Cosmos, Hardware & AI
              </span>
          </h1>
            <p className="text-xl font-mono text-cyan-300/90 pt-1 font-semibold">
              Hi, I&apos;m <span className="text-white underline decoration-cyan-400 decoration-2 underline-offset-4">Arkadip Mahapatra</span>
            </p>
          </div>

          {/* Bio Description */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
            A high-school student in Class 12 driven by continuous curiosity in <strong className="text-cyan-400">Embedded Electronics</strong> (Arduino, Raspberry Pi, ESP32), <strong className="text-emerald-400">Artificial Intelligence</strong>, <strong className="text-magenta-400">Particle Physics & LHC Colliders</strong>, and full-stack software architectures (tRPC, Drizzle ORM, Turborepo).
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="#lhc"
              onClick={() => handleAction(() => soundFX.playLhcCollisionSound())}
              className="btn-primary"
            >
              <Atom className="w-4.5 h-4.5 text-magenta-300 animate-spin" style={{ animationDuration: '8s' }} />
              Launch LHC Collider
            </a>

            <a
              href="#hardware"
              onClick={() => handleAction(() => soundFX.playBeep(900, 0.05))}
              className="btn-secondary"
            >
              <Cpu className="w-4.5 h-4.5 text-cyan-400" />
              Hardware Simulator
            </a>

            <a
              href="#terminal"
              onClick={() => handleAction(() => soundFX.playClick())}
              className="btn-secondary font-mono text-xs"
            >
              <TerminalIcon className="w-4.5 h-4.5 text-emerald-400" />
              CLI Terminal
            </a>
          </div>

          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
            <div className="glass-panel p-2.5 sm:p-3.5 text-center min-w-0">
              <div className="text-base sm:text-2xl font-black text-cyan-400 font-heading">100%</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">Hardware</div>
            </div>

            <div className="glass-panel p-2.5 sm:p-3.5 text-center min-w-0">
              <div className="text-base sm:text-2xl font-black text-magenta-400 font-heading">13.6 TeV</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">Physics</div>
            </div>

            <div className="glass-panel p-2.5 sm:p-3.5 text-center min-w-0">
              <div className="text-base sm:text-2xl font-black text-emerald-400 font-heading">Full Stack</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">Turborepo</div>
            </div>
          </div>

        </div>

        {/* Right Photo & Hologram Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full overflow-hidden py-6">
          
          {/* Hologram Circle Frame */}
          <div className="relative group cursor-pointer max-w-full flex items-center justify-center" onClick={() => soundFX.playBeep(1400, 0.1)}>
            
            {/* Background SVG Telemetry Rings */}
            <svg className="absolute -inset-4 sm:-inset-10 w-[calc(100%+32px)] sm:w-[calc(100%+80px)] h-[calc(100%+32px)] sm:h-[calc(100%+80px)] pointer-events-none z-0 opacity-60 animate-spin-slow" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="4 6" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#ff00aa" strokeWidth="0.8" strokeDasharray="10 20" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="#00ff88" strokeWidth="0.4" />
            </svg>

            {/* Photo Container */}
            <div className="holo-avatar-container w-48 h-48 sm:w-72 sm:h-72 shrink-0">
              <img
                src="/arkadip_photo.jpg"
                alt="Arkadip Mahapatra"
                className="holo-avatar-img w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                }}
              />
            </div>

            {/* Floating HUD Badges around photo */}
            <div className="absolute -bottom-2 left-0 sm:-left-4 glass-panel px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-cyan-300 shadow-xl border border-cyan-500/40 z-20">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>ESP32 & IoT Dev</span>
            </div>

            <div className="absolute -top-2 right-0 sm:-right-4 glass-panel px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-magenta-300 shadow-xl border border-magenta-500/40 z-20">
              <Atom className="w-3.5 h-3.5 text-magenta-400" />
              <span>Cosmos & Physics</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-mono mt-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Click photo or elements for SFX audio</span>
          </p>

        </div>

      </div>
    </section>
  );
};
