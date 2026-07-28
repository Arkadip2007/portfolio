import React from 'react';
import { Cpu, Atom, Wifi, Layers, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
}

export const Projects: React.FC = () => {
  const projectList: Project[] = [
    {
      title: 'AI ESP32 Autonomous Vision Rover',
      category: 'Electronics & AI',
      description: 'Dual-core ESP32 micro-rover equipped with OV2640 camera streaming real-time object detection and obstacle avoidance algorithms.',
      tags: ['ESP32', 'Arduino C++', 'Computer Vision', 'MicroPython'],
      color: 'cyan',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />
    },
    {
      title: 'LHC Particle Collision & Spacetime Simulator',
      category: 'Physics & Graphics',
      description: 'Web-based particle physics accelerator visualizing 13.6 TeV proton beam collisions, Higgs boson decays, and spacetime grid warping.',
      tags: ['Canvas 2D', 'Particle Physics', 'Astrophysics', 'TypeScript'],
      color: 'magenta',
      icon: <Atom className="w-6 h-6 text-magenta-400" />
    },
    {
      title: 'Raspberry Pi IoT Smart Automation',
      category: 'Embedded Systems',
      description: 'Raspberry Pi 4 central hub orchestrating wireless MQTT sensor nodes, GPIO relay controllers, and telemetry analytics dashboard.',
      tags: ['Raspberry Pi', 'Python', 'MQTT', 'GPIO'],
      color: 'emerald',
      icon: <Wifi className="w-6 h-6 text-emerald-400" />
    },
    {
      title: 'Turborepo + tRPC + Drizzle Monorepo Engine',
      category: 'Software Architecture',
      description: 'Ultra-fast full-stack monorepo featuring end-to-end type safety, Express RPC OpenAPI adapter, and Scalar interactive docs.',
      tags: ['Turborepo', 'tRPC', 'Drizzle ORM', 'Next.js', 'Express'],
      color: 'amber',
      icon: <Layers className="w-6 h-6 text-amber-400" />
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto relative z-10">
      
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          FEATURED PROJECTS & HARDWARE BUILDS
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Innovations & <span className="text-cyan-400 glow-cyan">Hardware Prototypes</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          A selection of hands-on electronics projects, AI integrations, physics visualizers, and monorepo web software.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectList.map((proj, idx) => (
          <div
            key={idx}
            onClick={() => soundFX.playClick()}
            className="glass-panel p-6 sm:p-8 space-y-4 hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
                {proj.icon}
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {proj.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-heading group-hover:text-cyan-400 transition-colors">
              {proj.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              {proj.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
              {proj.tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900/90 text-cyan-300 border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
