import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  CornerDownLeft, 
  Copy, 
  Check, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ShieldAlert
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

const AVAILABLE_COMMANDS = [
  'whoami',
  'projects',
  'skills',
  'contact',
  'lhc',
  'matrix',
  'arduino',
  'esp32',
  'raspberrypi',
  'stack',
  'sudo',
  'quote',
  'date',
  'theme',
  'clear',
  'help',
];

const QUOTES = [
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman" },
  { text: "The present is theirs; the future, for which I really worked, is mine.", author: "Nikola Tesla" },
  { text: "God does not play dice with the universe, but he sure loves microcontrollers.", author: "Albert Einstein (adapted)" },
  { text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Alan Turing" },
  { text: "Imagination is more important than knowledge. Knowledge is limited.", author: "Albert Einstein" },
];

const THEME_ACCENTS: Record<string, { label: string; text: string; border: string; bg: string; glow: string; prompt: string }> = {
  emerald: {
    label: 'Emerald',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    prompt: 'text-emerald-400',
  },
  cyan: {
    label: 'Cyber Cyan',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    prompt: 'text-cyan-400',
  },
  violet: {
    label: 'Neon Violet',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    prompt: 'text-violet-400',
  },
  amber: {
    label: 'Solar Amber',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    prompt: 'text-amber-400',
  },
};

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [submittedCommandsHistory, setSubmittedCommandsHistory] = useState<string[]>(['whoami', 'help']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentTheme, setCurrentTheme] = useState<string>('emerald');
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  const [startTime] = useState<number>(Date.now());

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'whoami',
      output: (
        <div className="space-y-1.5 text-cyan-300">
          <div className="font-bold text-emerald-400 flex items-center gap-2">
            <span>Arkadip Mahapatra</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Class 12 Innovator</span>
          </div>
          <div className="text-slate-300">Passionate about Hardware Electronics (Arduino, ESP32, RasPi), AI Models, Astrophysics &amp; High-Performance Web Architectures.</div>
          <div className="text-slate-400 text-xs">Type <span className="text-cyan-400 font-bold">help</span> to view available CLI commands.</div>
        </div>
      ),
    },
    {
      command: 'help',
      output: (
        <div className="text-slate-300 space-y-1">
          <div>Available CLI commands:</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono text-xs">
            <span className="text-cyan-400">whoami</span>
            <span className="text-emerald-400">projects</span>
            <span className="text-amber-400">skills</span>
            <span className="text-violet-400">contact</span>
            <span className="text-fuchsia-400">lhc</span>
            <span className="text-emerald-400">matrix</span>
            <span className="text-cyan-400">arduino</span>
            <span className="text-emerald-400">esp32</span>
            <span className="text-rose-400">sudo</span>
            <span className="text-amber-400">quote</span>
            <span className="text-sky-400">date</span>
            <span className="text-violet-400">theme</span>
            <span className="text-slate-400">clear</span>
          </div>
        </div>
      ),
    },
  ]);

  const outputContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstRender = useRef(true);

  // Auto scroll to bottom
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [history, isMatrixActive, matrixLines]);

  // Matrix Rain Simulation Effect
  useEffect(() => {
    if (!isMatrixActive) return;
    const glyphs = '0110101001100101010100101101001001010111010101001010101010101010101';
    const interval = setInterval(() => {
      setMatrixLines((prev) => {
        const line = Array.from({ length: 32 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join(' ');
        const next = [...prev, line];
        if (next.length > 12) next.shift();
        return next;
      });
    }, 120);

    const timer = setTimeout(() => {
      setIsMatrixActive(false);
      clearInterval(interval);
      setHistory((prev) => [
        ...prev,
        {
          command: 'matrix',
          output: <div className="text-emerald-400 font-mono">[MATRIX SIMULATION COMPLETE - ACCESS GRANTED TO COSMOS CORE]</div>,
        },
      ]);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isMatrixActive]);

  const themeConfig = THEME_ACCENTS[currentTheme] || THEME_ACCENTS.emerald;

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    soundFX.playClick();
    let response: React.ReactNode = null;

    // Track command in history for up/down arrows
    setSubmittedCommandsHistory((prev) => [...prev, rawCmd.trim()]);
    setHistoryIndex(-1);

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'help':
        response = (
          <div className="text-slate-300 space-y-1">
            <div className="font-semibold text-emerald-400">Available CLI Commands:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div><span className="text-cyan-400 font-bold">whoami</span> - About me</div>
              <div><span className="text-emerald-400 font-bold">projects</span> - Top builds</div>
              <div><span className="text-amber-400 font-bold">skills</span> - Tech stack</div>
              <div><span className="text-violet-400 font-bold">contact</span> - Social links</div>
              <div><span className="text-fuchsia-400 font-bold">lhc</span> - Accelerator</div>
              <div><span className="text-emerald-400 font-bold">matrix</span> - Digital rain</div>
              <div><span className="text-cyan-400 font-bold">arduino</span> - MCU status</div>
              <div><span className="text-emerald-400 font-bold">esp32</span> - Wi-Fi node</div>
              <div><span className="text-slate-300 font-bold">raspberrypi</span> - Linux node</div>
              <div><span className="text-rose-400 font-bold">sudo</span> - Root access</div>
              <div><span className="text-amber-300 font-bold">quote</span> - Random quote</div>
              <div><span className="text-sky-300 font-bold">date</span> - Uptime &amp; time</div>
              <div><span className="text-violet-300 font-bold">theme</span> - Toggle colors</div>
              <div><span className="text-slate-400 font-bold">clear</span> - Wipes log</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="space-y-1.5 text-cyan-300">
            <div className="font-bold text-emerald-400">Arkadip Mahapatra • Class 12 Innovator</div>
            <div className="text-slate-300">Passionate about Hardware Electronics (Arduino, ESP32, RasPi), AI Models, Astrophysics &amp; Full-Stack Systems.</div>
            <div className="text-slate-400 text-xs">Exploring physics simulations, quantum concepts, and micro-controller automation.</div>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-2 text-slate-200">
            <div className="text-emerald-400 font-bold">⚡ Featured Projects &amp; Innovations:</div>
            <div className="space-y-1.5 border-l-2 border-emerald-500/40 pl-3">
              <div>
                <span className="text-cyan-300 font-bold">1. Particle Collision Visualizer</span>
                <span className="text-slate-400 text-xs block">Interactive 3D decay simulation inspired by CERN LHC detectors.</span>
              </div>
              <div>
                <span className="text-cyan-300 font-bold">2. ESP32 Sensor Telemetry Hub</span>
                <span className="text-slate-400 text-xs block">Real-time IoT dashboard communicating via MQTT &amp; WebSockets.</span>
              </div>
              <div>
                <span className="text-cyan-300 font-bold">3. Monorepo Web Application</span>
                <span className="text-slate-400 text-xs block">Full-Stack architecture built with Next.js, TypeScript, &amp; Drizzle ORM.</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-2 text-slate-200">
            <div className="text-amber-300 font-bold">🛠️ Skill Matrix:</div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-emerald-400 font-semibold mb-1">⚡ Microcontrollers &amp; Hardware</div>
                <div className="text-slate-300">Arduino C++, ESP32 Wi-Fi/BLE, Raspberry Pi, GPIO, I2C, SPI, MQTT</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-cyan-400 font-semibold mb-1">🌐 Web &amp; Full-Stack</div>
                <div className="text-slate-300">React, Next.js, TypeScript, Tailwind CSS, Node.js, Express</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-violet-400 font-semibold mb-1">🔬 Physics &amp; Research</div>
                <div className="text-slate-300">Astrophysics, LHC Collision Data, Quantum Physics Basics</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-fuchsia-400 font-semibold mb-1">🧰 Tools &amp; Platforms</div>
                <div className="text-slate-300">Git, Vite, Linux Bash CLI, VS Code, Vercel</div>
              </div>
            </div>
          </div>
        );
        break;

      case 'contact':
        response = (
          <div className="space-y-1 text-slate-200">
            <div className="text-cyan-400 font-bold">📬 Connect &amp; Reach Out:</div>
            <div className="text-xs space-y-1 pl-2">
              <div>🐙 GitHub: <a href="https://github.com/Arkadip2007" target="_blank" rel="noreferrer" className="text-emerald-300 underline hover:text-emerald-200">github.com/Arkadip2007</a></div>
              <div>✉️ Email: <a href="#contact" className="text-emerald-300 underline hover:text-emerald-200">Scroll to Contact Section</a></div>
              <div>⚡ Status: <span className="text-emerald-400 font-bold">Open for collaborations &amp; tech discussions</span></div>
            </div>
          </div>
        );
        break;

      case 'lhc':
        soundFX.playLhcCollisionSound();
        response = (
          <div className="text-fuchsia-300 space-y-1 font-mono">
            <div className="text-cyan-400">[LHC PROTON BEAM INJECTED...]</div>
            <div>[BEAM ACCELERATING TO 0.999999991c ENERGY LEVEL]</div>
            <div className="text-amber-300">[COLLISION EVENT #142 RECORDED: 13.6 TeV Center-of-Mass Energy]</div>
            <div className="text-emerald-400 font-bold">✨ Higgs Boson Decay (h^0 -&gt; γγ) Confirmed at ATLAS Detector!</div>
          </div>
        );
        break;

      case 'matrix':
        setIsMatrixActive(true);
        setMatrixLines([]);
        response = <div className="text-emerald-400 font-mono animate-pulse">[INITIALIZING DIGITAL RAIN MATRIX SIMULATION...]</div>;
        break;

      case 'arduino':
        response = (
          <div className="text-emerald-300 font-mono space-y-1">
            <div>[ARDUINO UNO R3 INITIALIZED]</div>
            <div>Digital Pin 13 LED -&gt; HIGH</div>
            <div>AnalogRead(A0) = 512 (2.50V)</div>
            <div>Baud Rate: 115200 bps | Status: RUNNING</div>
          </div>
        );
        break;

      case 'esp32':
        response = (
          <div className="text-cyan-300 font-mono space-y-1">
            <div>[ESP32 WROOM DUAL-CORE]</div>
            <div>Wi-Fi Connected (SSID: &quot;Quantum_Mesh_5G&quot;)</div>
            <div>RSSI: -54 dBm | IP: 192.168.1.104</div>
            <div>MQTT Telemetry: Transmitting sensor metrics to cloud...</div>
          </div>
        );
        break;

      case 'raspberrypi':
        response = (
          <div className="text-emerald-400 font-mono space-y-1">
            <div>[RASPBERRY PI 4 MODEL B]</div>
            <div>Linux raspberrypi 6.1.21-v8+ #1642 SMP ARM64</div>
            <div>CPU Temp: 41.8°C | RAM: 1.4 GB / 4.0 GB used</div>
          </div>
        );
        break;

      case 'stack':
        response = (
          <div className="text-amber-300 font-mono space-y-1">
            <div>Monorepo Architecture: Turborepo / Vite</div>
            <div>Frontend Core: React 18 + TypeScript</div>
            <div>Styling Engine: Tailwind CSS + Glassmorphic Design System</div>
            <div>Sound Synthesis: Custom Web Audio API Oscillator</div>
          </div>
        );
        break;

      case 'sudo':
        response = (
          <div className="text-rose-400 font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Permission denied: Arkadip is the root superuser of this lab 🔒</span>
          </div>
        );
        break;

      case 'quote': {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        response = (
          <div className="text-amber-200 italic space-y-1 border-l-2 border-amber-500/50 pl-3">
            <div>&quot;{randomQuote.text}&quot;</div>
            <div className="text-xs text-amber-400 not-italic font-bold">— {randomQuote.author}</div>
          </div>
        );
        break;
      }

      case 'date':
      case 'time': {
        const now = new Date();
        const elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
        response = (
          <div className="text-sky-300 font-mono space-y-1">
            <div>📅 System Date: {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>⏰ Local Time: {now.toLocaleTimeString()}</div>
            <div className="text-xs text-slate-400">⏱️ Terminal Session Uptime: {elapsedSecs} seconds</div>
          </div>
        );
        break;
      }

      case 'theme': {
        const themeKeys = Object.keys(THEME_ACCENTS);
        const nextIdx = (themeKeys.indexOf(currentTheme) + 1) % themeKeys.length;
        const newThemeKey = themeKeys[nextIdx];
        setCurrentTheme(newThemeKey);
        const newTheme = THEME_ACCENTS[newThemeKey];
        response = (
          <div className="text-violet-300 font-mono">
            🎨 Terminal Theme updated to: <span className={`${newTheme.text} font-bold`}>{newTheme.label}</span>
          </div>
        );
        break;
      }

      default:
        response = (
          <div className="text-rose-400">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-cyan-400 font-bold">help</span> for command list or press <span className="text-emerald-400 font-bold">Tab</span> to auto-complete.
          </div>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: response }]);
    setInput('');
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (submittedCommandsHistory.length === 0) return;
      const nextIdx = historyIndex < submittedCommandsHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInput(submittedCommandsHistory[submittedCommandsHistory.length - 1 - nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(submittedCommandsHistory[submittedCommandsHistory.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;
      const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(trimmed));
      if (matches.length === 1) {
        setInput(matches[0]);
        soundFX.playBeep(800, 0.03);
      } else if (matches.length > 1) {
        soundFX.playBeep(600, 0.04);
        setHistory((prev) => [
          ...prev,
          {
            command: input,
            output: (
              <div className="text-slate-400 font-mono text-xs">
                Suggestions: <span className="text-cyan-300">{matches.join(', ')}</span>
              </div>
            ),
          },
        ]);
      }
    }
  };

  const copyTerminalHistory = () => {
    const text = history
      .map((item) => `arkadip@cosmos-lab:~$ ${item.command}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFX.playBeep(1000, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSound = () => {
    const enabled = soundFX.toggleSound();
    setIsAudioOn(enabled);
  };

  return (
    <section id="terminal" className="py-20 px-4 lg:px-12 max-w-5xl mx-auto relative z-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeConfig.bg} border ${themeConfig.border} ${themeConfig.text} text-xs font-mono`}>
          <TerminalIcon className="w-4 h-4" />
          INTERACTIVE CLI TERMINAL
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Embedded Command Line <span className={`${themeConfig.text} glow-emerald`}>Console</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Type commands or click quick chips below to explore projects, hardware telemetry, and interactive physics simulations.
        </p>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6">
        {['whoami', 'projects', 'skills', 'lhc', 'matrix', 'contact', 'sudo', 'quote', 'theme'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-mono transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1 shadow-sm"
          >
            <span className="text-emerald-500/80">&gt;</span>
            <span>{cmd}</span>
          </button>
        ))}
      </div>

      {/* Terminal Container */}
      <div className={`glass-panel overflow-hidden border ${themeConfig.border} ${themeConfig.glow} transition-all duration-300`}>
        
        {/* Terminal Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Window Buttons & Title */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
            <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
              <span>arkadip@cosmos-lab:~</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">bash</span>
            </span>
          </div>

          {/* Action Toolbar Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={toggleSound}
              title={isAudioOn ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
            >
              {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            <button
              onClick={copyTerminalHistory}
              title="Copy session output"
              className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setHistory([])}
              title="Clear terminal history"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">
              v2.5-ADVANCED
            </span>
          </div>
        </div>

        {/* Terminal Screen Container */}
        <div 
          ref={outputContainerRef} 
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-6 bg-slate-950/95 font-mono text-xs sm:text-sm min-h-[340px] max-h-[480px] overflow-y-auto space-y-4 text-slate-200 break-words cursor-text relative"
        >
          {/* Matrix Rain Stream Overlay */}
          {isMatrixActive && (
            <div className="absolute inset-0 bg-slate-950/90 p-4 font-mono text-xs text-emerald-400 overflow-hidden flex flex-col justify-end pointer-events-none z-20">
              <div className="text-xs text-emerald-300 font-bold mb-2 animate-pulse">[RUNNING QUANTUM MATRIX STREAM...]</div>
              {matrixLines.map((line, i) => (
                <div key={i} className="opacity-80 text-emerald-400 leading-tight select-none">
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Terminal Output Logs */}
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 text-emerald-400">
                <span className={`text-[11px] sm:text-xs ${themeConfig.prompt}`}>arkadip@cosmos-lab:~$</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
              <div className="pl-2 sm:pl-4">{item.output}</div>
            </div>
          ))}

          {/* Command Prompt Form */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 min-w-0">
            <span className={`${themeConfig.prompt} font-bold shrink-0 text-[11px] sm:text-xs flex items-center gap-1`}>
              <span className="hidden sm:inline">arkadip@cosmos-lab:~$</span>
              <span className="sm:hidden">arkadip:~$</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type help, lhc, projects... (↑↓ history, Tab complete)"
              className="bg-transparent border-none outline-none text-cyan-300 font-mono text-xs sm:text-sm flex-1 min-w-0 placeholder:text-slate-600 focus:ring-0"
            />
            <button type="submit" className="text-slate-500 hover:text-emerald-400 shrink-0 p-1 transition-colors">
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer Hint Bar */}
        <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">↓</kbd> for history</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Tab</kbd> auto-complete</span>
          </div>
          <div className="hidden sm:block text-emerald-400/70">
            Node: ESP32-Ready • CERN Physics Sim
          </div>
        </div>

      </div>

    </section>
  );
};
