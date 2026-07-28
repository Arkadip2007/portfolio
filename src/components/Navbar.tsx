import React, { useState } from 'react';
import { Cpu, Volume2, VolumeX, Terminal as TerminalIcon, Atom, Menu, X, Layers, Mail } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(soundFX.isEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const newState = soundFX.toggleSound();
    setAudioEnabled(newState);
  };

  const handleClickLink = () => {
    soundFX.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav px-3 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={handleClickLink}
          className="flex items-center gap-2 group cursor-pointer text-decoration-none min-w-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all shrink-0">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-heading font-bold text-xs sm:text-base tracking-wider text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1 truncate">
              ARKADIP <span className="text-cyan-400">MAHAPATRA</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase truncate">
              Class 12 • AI & Hardware
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
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
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            Hardware Lab
          </a>
          <a
            href="#stack"
            onClick={handleClickLink}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-amber-400" />
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
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

          {/* Desktop Contact CTA */}
          <a
            href="#contact"
            onClick={handleClickLink}
            className="hidden md:inline-flex btn-primary text-xs py-2 px-3.5"
          >
            Connect
          </a>

          {/* Mobile Hamburger Menu Button ("bun option" - 3 lines) */}
          <button
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-lg bg-slate-900/80 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Dropdown Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/95 rounded-2xl p-4 shadow-2xl border border-cyan-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2 font-mono text-sm">
            <a
              href="#lhc"
              onClick={handleClickLink}
              className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-800 hover:border-magenta-500/40 text-slate-200 hover:text-magenta-400 transition-all flex items-center gap-3"
            >
              <Atom className="w-4 h-4 text-magenta-400 shrink-0" />
              <span>LHC Collider</span>
            </a>

            <a
              href="#hardware"
              onClick={handleClickLink}
              className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 transition-all flex items-center gap-3"
            >
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Hardware Lab</span>
            </a>

            <a
              href="#stack"
              onClick={handleClickLink}
              className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-amber-400 transition-all flex items-center gap-3"
            >
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tech Stack</span>
            </a>

            <a
              href="#terminal"
              onClick={handleClickLink}
              className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 transition-all flex items-center gap-3"
            >
              <TerminalIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Terminal</span>
            </a>

            <a
              href="#contact"
              onClick={handleClickLink}
              className="mt-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-400 text-cyan-300 hover:text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Connect</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

