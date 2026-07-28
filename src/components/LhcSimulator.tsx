import React, { useState } from 'react';
import { Atom, Zap, Activity, Flame, Gauge } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ParticleEvent {
  id: number;
  type: string;
  energy: string;
  color: string;
  angle: number;
  length: number;
}

export const LhcSimulator: React.FC = () => {
  const [colliding, setColliding] = useState(false);
  const [eventCount, setEventCount] = useState(142);
  const [higgsDetected, setHiggsDetected] = useState(false);
  const beamEnergy = 6.8; // 6.8 TeV per beam = 13.6 TeV total
  const [events, setEvents] = useState<ParticleEvent[]>([
    { id: 1, type: 'Higgs Boson (h⁰ → γγ)', energy: '125.1 GeV', color: '#ff00aa', angle: 45, length: 110 },
    { id: 2, type: 'Gluon Jet', energy: '450 GeV', color: '#00f3ff', angle: 135, length: 140 },
    { id: 3, type: 'Top Quark Pair', energy: '173 GeV', color: '#00ff88', angle: 220, length: 95 },
    { id: 4, type: 'Muon Track (μ⁺)', energy: '85 GeV', color: '#8a2be2', angle: 310, length: 160 }
  ]);

  const handleCollide = () => {
    soundFX.playLhcCollisionSound();
    setColliding(true);
    setHiggsDetected(false);

    setTimeout(() => {
      setColliding(false);
      setEventCount((prev) => prev + 1);

      // Generate new subatomic collision event data
      const isHiggs = Math.random() > 0.4;
      setHiggsDetected(isHiggs);

      const newEvents: ParticleEvent[] = [
        {
          id: Date.now() + 1,
          type: isHiggs ? 'Higgs Boson (H → ZZ* → 4l)' : 'Z Boson Decay',
          energy: isHiggs ? '125.09 GeV' : '91.19 GeV',
          color: isHiggs ? '#ff00aa' : '#00f3ff',
          angle: Math.floor(Math.random() * 360),
          length: 120 + Math.random() * 40,
        },
        {
          id: Date.now() + 2,
          type: 'High-pT Quark Jet',
          energy: (300 + Math.random() * 400).toFixed(1) + ' GeV',
          color: '#00ff88',
          angle: Math.floor(Math.random() * 360),
          length: 100 + Math.random() * 60,
        },
        {
          id: Date.now() + 3,
          type: 'Electroweak W⁺ Boson',
          energy: '80.38 GeV',
          color: '#8a2be2',
          angle: Math.floor(Math.random() * 360),
          length: 90 + Math.random() * 50,
        },
        {
          id: Date.now() + 4,
          type: 'Photon Track (γ)',
          energy: (150 + Math.random() * 200).toFixed(1) + ' GeV',
          color: '#ffb700',
          angle: Math.floor(Math.random() * 360),
          length: 130 + Math.random() * 30,
        },
      ];
      setEvents(newEvents);
    }, 600);
  };

  return (
    <section id="lhc" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-500/10 border border-magenta-500/30 text-magenta-400 text-xs font-mono">
          <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          PARTICLE PHYSICS & ASTROPHYSICS LAB
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Large Hadron Collider <span className="text-magenta-400 glow-magenta">(LHC)</span> Simulator
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Simulating high-energy proton collisions inside the 27-kilometer superconducting LHC ring at CERN to study quantum electrodynamics, dark matter, and spacetime structure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Interactive Collision Chamber */}
        <div className="lg:col-span-7 glass-panel p-6 relative overflow-hidden flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-magenta-400" />
              ATLAS / CMS DETECTOR CHAMBER
            </span>
            <span className="text-xs font-mono text-slate-400">
              Beam Energy: <strong className="text-white">{(beamEnergy * 2).toFixed(1)} TeV</strong>
            </span>
          </div>

          {/* SVG LHC Collision Chamber Ring */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            <svg className="w-full h-full" viewBox="0 0 400 400">
              
              {/* Outer Accelerator Tunnel Ring */}
              <circle cx="200" cy="200" r="170" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(0, 243, 255, 0.2)" strokeWidth="2" strokeDasharray="8 8" />

              {/* Superconducting Magnet Coils */}
              <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255, 0, 170, 0.25)" strokeWidth="1" strokeDasharray="12 12" />

              {/* Proton Counter Beams */}
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="#00f3ff"
                strokeWidth="3"
                strokeDasharray="40 300"
                className={colliding ? 'animate-spin' : ''}
                style={{ animationDuration: '0.4s', transformOrigin: 'center' }}
              />
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="#ff00aa"
                strokeWidth="3"
                strokeDasharray="40 300"
                className={colliding ? 'animate-spin-reverse' : ''}
                style={{ animationDuration: '0.4s', transformOrigin: 'center' }}
              />

              {/* Interaction Center Point */}
              <circle cx="200" cy="200" r="14" fill="#050714" stroke="#00f3ff" strokeWidth="2" />
              <circle cx="200" cy="200" r="6" fill={colliding ? '#ffffff' : '#ff00aa'} className={colliding ? 'animate-ping' : ''} />

              {/* Render Subatomic Particle Decay Tracks */}
              {events.map((ev) => {
                const rad = (ev.angle * Math.PI) / 180;
                const endX = 200 + Math.cos(rad) * ev.length;
                const endY = 200 + Math.sin(rad) * ev.length;

                return (
                  <g key={ev.id}>
                    <line
                      x1="200"
                      y1="200"
                      x2={endX}
                      y2={endY}
                      stroke={ev.color}
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      className="transition-all duration-500"
                    />
                    <circle cx={endX} cy={endY} r="4" fill={ev.color} />
                  </g>
                );
              })}
            </svg>

            {/* Central Impact Flash */}
            {colliding && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-white blur-xl opacity-90 animate-ping" />
              </div>
            )}

            {/* Higgs Detection Alert Overlay */}
            {higgsDetected && !colliding && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-magenta-950/90 border border-magenta-500 text-magenta-300 text-xs font-mono px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,0,170,0.6)] flex items-center gap-2 animate-bounce">
                <Flame className="w-4 h-4 text-magenta-400" />
                HIGGS BOSON DECAY EVENT DETECTED!
              </div>
            )}
          </div>

          {/* Trigger Collision Button */}
          <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={handleCollide}
              disabled={colliding}
              className="btn-primary w-full sm:w-auto bg-gradient-to-r from-magenta-600 to-violet-600 hover:from-magenta-500 hover:to-violet-500 border-magenta-400 text-white font-bold"
            >
              <Zap className={`w-4 h-4 text-yellow-300 ${colliding ? 'animate-bounce' : ''}`} />
              {colliding ? 'ACCELERATING BEAMS...' : 'COLLIDE BEAMS (13.6 TeV)'}
            </button>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
              <span>Events Logged: <strong className="text-cyan-400">{eventCount}</strong></span>
              <span>Velocity: <strong className="text-emerald-400">0.999999991 c</strong></span>
            </div>
          </div>

        </div>

        {/* Right Telemetry & Scientific Data */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Accelerator Status Panel */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                LHC Telemetry & Optics
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                BEAM INJECTED
              </span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                <span>Superconducting Magnets Temp</span>
                <strong className="text-cyan-400">1.9 K (-271.25°C)</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                <span>Luminosity (L)</span>
                <strong className="text-magenta-400">2.0 × 10³⁴ cm⁻²s⁻¹</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-800">
                <span>Superconducting RF Cavities</span>
                <strong className="text-emerald-400">400 MHz (Active)</strong>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Beam Crossing Interval</span>
                <strong className="text-amber-400">25 Nanoseconds</strong>
              </div>
            </div>
          </div>

          {/* Subatomic Particle Tracks Breakdown */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 font-heading">Recent Collision Tracks</h4>
            <div className="space-y-2">
              {events.map((ev) => (
                <div key={ev.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ev.color }} />
                    <span className="text-slate-200">{ev.type}</span>
                  </div>
                  <span className="text-slate-400">{ev.energy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Theoretical Physics Note */}
          <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 space-y-1">
            <strong className="text-violet-300 block font-heading">Cosmic Spacetime & Quantum Field Theory</strong>
            <p className="text-slate-300 leading-relaxed">
              At 13.6 TeV collision energies, the LHC recreates conditions existing just 1 picosecond after the Big Bang, probing electroweak symmetry breaking and quantum gravity.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};
