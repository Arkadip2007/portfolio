import React, { useState } from 'react';
import { Cpu, Volume2, VolumeX, Terminal as TerminalIcon, Atom } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(soundFX.isEnabled());

  const toggleAudio = () => {
    const newState = soundFX.toggleSound();
    setAudioEnabled(newState);
  };

  const handleClickLink = () => {
    soundFX.playClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <a
        href="#hero"
        onClick={handleClickLink}
        className="flex items-center gap-2.5 group cursor-pointer text-decoration-none"
      >
        <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-base tracking-wider text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            ARKADIP <span className="text-cyan-400">MAHAPATRA</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
            Class 12 • AI & Hardware Hacker
          </span>
        </div>
      </a>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <a
          href="#lhc"
          onClick={handleClickLink}
          className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <Atom className="w-4 h-4 text-magenta-400" />
          LHC Collider
        </a>
        <a
          href="#hardware"
          onClick={handleClickLink}
          className="hover:text-cyan-400 transition-colors"
        >
          Hardware Lab
        </a>
        <a
          href="#stack"
          onClick={handleClickLink}
          className="hover:text-cyan-400 transition-colors"
        >
          Tech Stack
        </a>
        <a
          href="#terminal"
          onClick={handleClickLink}
          className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          Terminal
        </a>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ONLINE
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          title={audioEnabled ? 'Mute SFX' : 'Unmute SFX'}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Contact CTA */}
        <a
          href="#contact"
          onClick={handleClickLink}
          className="btn-primary text-xs py-2 px-3.5"
        >
          Connect
        </a>
      </div>
    </header>
  );
};
