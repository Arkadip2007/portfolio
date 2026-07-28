import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'whoami',
      output: (
        <div className="space-y-1 text-cyan-300">
          <div>Arkadip Mahapatra [Class 12 Innovator]</div>
          <div className="text-slate-400">Interests: Electronics (Arduino, ESP32, RasPi), AI, Astrophysics, Large Hadron Collider, Full-Stack Monorepo (tRPC, Drizzle).</div>
        </div>
      ),
    },
    {
      command: 'help',
      output: (
        <div className="text-slate-300">
          Available CLI commands: <span className="text-cyan-400">whoami</span>, <span className="text-magenta-400">lhc</span>, <span className="text-emerald-400">arduino</span>, <span className="text-cyan-400">esp32</span>, <span className="text-emerald-400">raspberrypi</span>, <span className="text-amber-400">stack</span>, <span className="text-violet-400">clear</span>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    soundFX.playClick();
    let response: React.ReactNode = null;

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'help':
        response = (
          <div className="text-slate-300">
            Available CLI commands: <span className="text-cyan-400">whoami</span>, <span className="text-magenta-400">lhc</span>, <span className="text-emerald-400">arduino</span>, <span className="text-cyan-400">esp32</span>, <span className="text-emerald-400">raspberrypi</span>, <span className="text-amber-400">stack</span>, <span className="text-violet-400">clear</span>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="space-y-1 text-cyan-300">
            <div>Arkadip Mahapatra • Class 12 Student</div>
            <div className="text-slate-400">Passionate about AI, Microcontrollers, Particle Accelerators, and High-Performance Web Architectures.</div>
          </div>
        );
        break;

      case 'lhc':
        soundFX.playLhcCollisionSound();
        response = (
          <div className="text-magenta-300 space-y-1 font-mono">
            <div>[LHC PROTON BEAM ACCELERATING...]</div>
            <div>[COLLISION EVENT #142 RECORDED: 13.6 TeV Center-of-Mass Energy]</div>
            <div className="text-emerald-400">Higgs Boson Decay (h^0 -&gt; \u03B3\u03B3) Confirmed!</div>
          </div>
        );
        break;

      case 'arduino':
        response = (
          <div className="text-emerald-300 font-mono">
            [ARDUINO UNO R3] Digital Pin 13 LED -&gt; HIGH. AnalogRead(A0) = 512 (2.50V).
          </div>
        );
        break;

      case 'esp32':
        response = (
          <div className="text-cyan-300 font-mono">
            [ESP32 WROOM] Wi-Fi Connected (SSID: &quot;Quantum_Net&quot;). RSSI: -54 dBm. MQTT Telemetry Transmitting...
          </div>
        );
        break;

      case 'raspberrypi':
        response = (
          <div className="text-emerald-400 font-mono">
            [RASPBERRY PI 4] Linux raspberrypi 6.1.21-v8+ #1642 SMP ARM64. CPU Temp: 42.4°C.
          </div>
        );
        break;

      case 'stack':
        response = (
          <div className="text-amber-300 font-mono space-y-1">
            <div>Monorepo Engine: Turborepo</div>
            <div>API Protocol: tRPC (RPC over HTTP)</div>
            <div>Database ORM: Drizzle ORM</div>
            <div>Frontend: Next.js + TypeScript</div>
            <div>Docs: Express + Scalar (OpenAPI Compliant)</div>
          </div>
        );
        break;

      default:
        response = (
          <div className="text-rose-400">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-cyan-400 font-bold">help</span> to list commands.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: input, output: response }]);
    setInput('');
  };

  return (
    <section id="terminal" className="py-20 px-4 lg:px-12 max-w-5xl mx-auto relative z-10">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          INTERACTIVE CLI TERMINAL
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Embedded Command Line <span className="text-emerald-400 glow-emerald">Console</span>
        </h2>
      </div>

      {/* Terminal Container */}
      <div className="glass-panel overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
        
        {/* Terminal Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">arkadip@cosmos-lab:~ (bash)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">v2.4-STABLE</span>
        </div>

        {/* Output Screen */}
        <div className="p-6 bg-slate-950/95 font-mono text-xs sm:text-sm min-h-[320px] max-h-[460px] overflow-y-auto space-y-4 text-slate-200">
          
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>arkadip@cosmos-lab:~$</span>
                <span className="text-white">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}

          {/* Active Prompt Form */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">arkadip@cosmos-lab:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type help, lhc, whoami, stack..."
              className="bg-transparent border-none outline-none text-cyan-300 font-mono text-xs sm:text-sm flex-1 placeholder:text-slate-600"
              autoFocus
            />
            <button type="submit" className="text-slate-500 hover:text-emerald-400">
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>

          <div ref={terminalEndRef} />
        </div>

      </div>

    </section>
  );
};
