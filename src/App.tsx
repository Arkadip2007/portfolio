import React from 'react';
import { CosmosCanvas } from './components/CosmosCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LhcSimulator } from './components/LhcSimulator';
import { HardwareLab } from './components/HardwareLab';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { Projects } from './components/Projects';
import { Terminal } from './components/Terminal';
import { Contact } from './components/Contact';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050714] text-slate-100 relative selection:bg-cyan-400 selection:text-black">
      {/* 1. Spacetime & Particle Canvas */}
      <CosmosCanvas />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* 3. Main Content Sections */}
      <main className="relative z-10 space-y-12">
        <Hero />
        <LhcSimulator />
        <HardwareLab />
        <ArchitectureGraph />
        <Projects />
        <Terminal />
        <Contact />
      </main>

      {/* 4. Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-900 text-center font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Arkadip Mahapatra. Built with Next.js / Vite, React & TypeScript.
          </div>
          <div className="flex items-center gap-4 text-cyan-400">
            <span>Class 12 Innovator</span>
            <span>•</span>
            <span>Arduino / ESP32 / RasPi</span>
            <span>•</span>
            <span>LHC & Cosmos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
