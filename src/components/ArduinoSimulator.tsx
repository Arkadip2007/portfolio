import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCw, Terminal, Zap, Layers, Code, Send } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { ArduinoEngine } from '../utils/arduinoEngine';
import type { PinStateMap } from '../utils/arduinoEngine';
import arduinoSvgRaw from '../../public/MCU/arduino-2.svg?raw';

const CODE_TEMPLATES = {
  chaser: `// 1. Rainbow Wave LED Chaser (Pins 6 to 13 - 1 Second Delay)
void setup() {
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("Rainbow LED Chaser Booted!");
}

void loop() {
  digitalWrite(6, HIGH); Serial.println("Pin 6 -> HIGH (5V)"); delay(1000); digitalWrite(6, LOW);
  digitalWrite(7, HIGH); Serial.println("Pin 7 -> HIGH (5V)"); delay(1000); digitalWrite(7, LOW);
  digitalWrite(8, HIGH); Serial.println("Pin 8 -> HIGH (5V)"); delay(1000); digitalWrite(8, LOW);
  digitalWrite(9, HIGH); Serial.println("Pin 9 -> HIGH (5V)"); delay(1000); digitalWrite(9, LOW);
  digitalWrite(10, HIGH); Serial.println("Pin 10 -> HIGH (5V)"); delay(1000); digitalWrite(10, LOW);
  digitalWrite(11, HIGH); Serial.println("Pin 11 -> HIGH (5V)"); delay(1000); digitalWrite(11, LOW);
  digitalWrite(12, HIGH); Serial.println("Pin 12 -> HIGH (5V)"); delay(1000); digitalWrite(12, LOW);
  digitalWrite(13, HIGH); Serial.println("Pin 13 -> HIGH (5V)"); delay(1000); digitalWrite(13, LOW);
}`
};

export const ArduinoSimulator: React.FC = () => {
  const [code, setCode] = useState<string>(CODE_TEMPLATES.chaser);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [serialInput, setSerialInput] = useState<string>('');
  const [pinStates, setPinStates] = useState<PinStateMap>({
    6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false
  });
  const [txPulse, setTxPulse] = useState<boolean>(false);

  const engineRef = useRef<ArduinoEngine | null>(null);

  useEffect(() => {
    engineRef.current = new ArduinoEngine({
      onPinChange: (pin) => {
        if (pin === 0 || pin === 1) {
          setTxPulse(true);
          setTimeout(() => setTxPulse(false), 150);
        }
      },
      onSerialOutput: (msg) => {
        setTxPulse(true);
        setTimeout(() => setTxPulse(false), 150);
        const time = new Date().toLocaleTimeString();
        setSerialLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
      },
      onStateUpdate: (pins) => {
        setPinStates({ ...pins });
      }
    });

    return () => {
      engineRef.current?.stop();
    };
  }, []);

  const handleRunCode = () => {
    soundFX.playBeep(1200, 0.08);
    setIsRunning(true);
    setSerialLogs((prev) => [`[${new Date().toLocaleTimeString()}] --- SIMULATION STARTED ---`, ...prev]);
    engineRef.current?.runCode(code);
  };

  const handleStopCode = () => {
    soundFX.playBeep(600, 0.08);
    setIsRunning(false);
    engineRef.current?.stop();
    setSerialLogs((prev) => [`[${new Date().toLocaleTimeString()}] --- SIMULATION STOPPED ---`, ...prev]);
  };

  const handleResetBoard = () => {
    soundFX.playClick();
    engineRef.current?.stop();
    setIsRunning(false);
    setPinStates({
      6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false
    });
    setSerialLogs([]);
  };

  // Toggle LED manually on click (for interactive testing)
  const togglePinState = (pin: number) => {
    soundFX.playClick();
    const nextState = !pinStates[pin];
    setPinStates((prev) => ({ ...prev, [pin]: nextState }));
    engineRef.current?.setPinInput(pin, nextState);
  };

  // Serial Command Input Sender
  const handleSendSerialCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serialInput.trim()) return;

    soundFX.playBeep(1500, 0.04);
    const cmd = serialInput.trim().toUpperCase();
    const time = new Date().toLocaleTimeString();
    setSerialLogs((prev) => [`[${time}] RX > ${cmd}`, ...prev]);
    setSerialInput('');

    // Process commands: ALL ON, ALL OFF, PIN 8 ON, etc.
    if (cmd === 'ALL ON' || cmd === 'ON') {
      const newState: PinStateMap = {};
      for (let p = 6; p <= 13; p++) newState[p] = true;
      setPinStates((prev) => ({ ...prev, ...newState }));
    } else if (cmd === 'ALL OFF' || cmd === 'OFF') {
      const newState: PinStateMap = {};
      for (let p = 6; p <= 13; p++) newState[p] = false;
      setPinStates((prev) => ({ ...prev, ...newState }));
    } else {
      const pinMatch = cmd.match(/(\d+)/);
      if (pinMatch) {
        const pinNum = parseInt(pinMatch[1], 10);
        if (pinNum >= 6 && pinNum <= 13) {
          const isOff = cmd.includes('OFF') || cmd.includes('0');
          setPinStates((prev) => ({ ...prev, [pinNum]: !isOff }));
        }
      }
    }
  };

  // Helper to replace fill color and glow style of SVG rect elements
  const replaceRectFill = (svgStr: string, rectId: string, fillHex: string, styleFilter: string = '') => {
    const regex = new RegExp(`(id="${rectId}"[\\s\\S]*?fill=")([^"]*)(")`);
    let updated = svgStr.replace(regex, `$1${fillHex}$3`);
    if (styleFilter) {
      const filterRegex = new RegExp(`(id="${rectId}"[\\s\\S]*?)(style="[^"]*")?(\\s*\\/?>)`);
      updated = updated.replace(filterRegex, (_match, p1, _p2, p3) => `${p1}style="${styleFilter}"${p3}`);
    }
    return updated;
  };

  const getProcessedArduinoSvg = () => {
    if (!arduinoSvgRaw) return '';
    let svg = arduinoSvgRaw;
    svg = svg.replace('<svg', '<svg width="100%" height="100%"');
    // PWR LED (rect110): Always Green (#00ff6a) with glow
    svg = replaceRectFill(svg, 'rect110', '#00ff6a', 'filter: drop-shadow(0px 0px 4px #00ff6a)');
    // L LED (rect106 - Pin 13): #f80404 when HIGH, #272727 when LOW
    const lState = !!pinStates[13];
    svg = replaceRectFill(
      svg,
      'rect106',
      lState ? '#f80404' : '#272727',
      lState ? 'filter: drop-shadow(0px 0px 5px #f80404)' : 'filter: none'
    );
    // TX LED (rect102): #ffaa00 when active, #272727 when idle
    svg = replaceRectFill(
      svg,
      'rect102',
      txPulse ? '#ffaa00' : '#272727',
      txPulse ? 'filter: drop-shadow(0px 0px 4px #ffaa00)' : 'filter: none'
    );
    // RX LED (rect114): #ffaa00 when active, #272727 when idle
    svg = replaceRectFill(
      svg,
      'rect114',
      txPulse ? '#ffaa00' : '#272727',
      txPulse ? 'filter: drop-shadow(0px 0px 4px #ffaa00)' : 'filter: none'
    );
    return svg;
  };

  // 7 Vibrant External LEDs configuration (Pins 6, 7, 8, 9, 10, 11, 12)
  const extLeds = [
    { pin: 6, label: 'PIN 6', bgOn: 'bg-red-500', shadowOn: 'shadow-[0_0_15px_#f80404]' },
    { pin: 7, label: 'PIN 7', bgOn: 'bg-orange-500', shadowOn: 'shadow-[0_0_15px_#f97316]' },
    { pin: 8, label: 'PIN 8', bgOn: 'bg-yellow-500', shadowOn: 'shadow-[0_0_15px_#eab308]' },
    { pin: 9, label: 'PIN 9', bgOn: 'bg-emerald-500', shadowOn: 'shadow-[0_0_15px_#22c55e]' },
    { pin: 10, label: 'PIN 10', bgOn: 'bg-cyan-400', shadowOn: 'shadow-[0_0_15px_#06b6d4]' },
    { pin: 11, label: 'PIN 11', bgOn: 'bg-blue-500', shadowOn: 'shadow-[0_0_15px_#3b82f6]' },
    { pin: 12, label: 'PIN 12', bgOn: 'bg-fuchsia-500', shadowOn: 'shadow-[0_0_15px_#d946ef]' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Controls Toolbar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleRunCode}
                className="btn-primary bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-4 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" />
                START SIMULATION
              </button>
            ) : (
              <button
                onClick={handleStopCode}
                className="btn-primary bg-red-500 hover:bg-red-400 text-slate-950 font-bold py-2 px-4 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(248,4,4,0.3)] animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                STOP SIMULATION
              </button>
            )}

            <button
              onClick={handleResetBoard}
              className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 text-slate-300 hover:text-white"
              title="Reset Board"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RESET
            </button>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Active Sketch Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">SKETCH:</span>
            <span className="bg-slate-900 border border-cyan-500/40 text-cyan-400 font-bold rounded-lg py-1.5 px-3 text-xs">
              1. 7-LED Rainbow Wave Chaser (Pins 6-13, 1s Delay)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            9V POWER OK
          </span>
          <span className={isRunning ? "text-cyan-400 font-bold" : "text-slate-500"}>
            {isRunning ? "STATUS: EXECUTING" : "STATUS: IDLE"}
          </span>
        </div>
      </div>

      {/* Main Workspace Split: Left Circuit Canvas, Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CANVAS: 7 External LEDs Array & Huge Center Stage Arduino Board */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-4 sm:p-5 bg-slate-950/90 border border-cyan-500/30 space-y-4">
            
            {/* 1. TOP MODULE BAR: 7 VIBRANT EXTERNAL LEDs ARRAY (Pins 6, 7, 8, 9, 10, 11, 12) */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  7-LED EXTERNAL MATRIX ARRAY (PINS 6, 7, 8, 9, 10, 11, 12)
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">220Ω GND BUS</span>
              </div>

              {/* 7 Vibrant External LEDs Grid */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {extLeds.map((led) => {
                  const isOn = !!pinStates[led.pin];
                  return (
                    <button
                      key={led.pin}
                      onClick={() => togglePinState(led.pin)}
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-between gap-1 shadow-inner hover:border-cyan-500/50 transition-all cursor-pointer"
                      title="Click to toggle LED"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          isOn ? `${led.bgOn} border-white ${led.shadowOn}` : 'bg-slate-900 border-slate-700'
                        }`}
                      />
                      <span className="text-xs font-mono text-slate-100 font-black tracking-wide">{led.label}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                        isOn
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        {isOn ? 'HIGH' : 'LOW'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. CENTER STAGE: Huge High-Detail Arduino Board View */}
            <div className="flex flex-col items-center bg-slate-900/60 p-5 rounded-xl border border-slate-800 relative">
              <div className="w-full flex items-center justify-between mb-3 text-xs font-mono text-cyan-400 font-bold">
                <span className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  BOARD: ARDUINO UNO R3 (ATmega328P)
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 9V POWER OK
                </span>
              </div>
              
              {/* Huge Prominent Arduino Vector Board */}
              <div
                className="w-full max-w-xl max-h-[380px] min-h-[300px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[380px] [&>svg]:drop-shadow-[0_0_30px_rgba(0,243,255,0.35)]"
                dangerouslySetInnerHTML={{ __html: getProcessedArduinoSvg() }}
              />

              {/* Status Bar */}
              <div className="w-full grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">PWR LED</span>
                  <span className="text-emerald-400 font-bold">ALWAYS ON</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">ONBOARD L (PIN 13)</span>
                  <span className={pinStates[13] ? "text-red-500 font-bold" : "text-slate-500"}>
                    {pinStates[13] ? 'HIGH (5V)' : 'LOW (0V)'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">SERIAL TX</span>
                  <span className={txPulse ? "text-amber-400 font-bold" : "text-slate-500"}>
                    {txPulse ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">SERIAL RX</span>
                  <span className={txPulse ? "text-amber-400 font-bold" : "text-slate-500"}>
                    {txPulse ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: C++ Arduino Code Editor & Interactive Serial Monitor Console */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* C++ Code Editor Box */}
          <div className="glass-panel p-4 bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                <Code className="w-4 h-4 text-cyan-400" />
                ARDUINO C++ SKETCH EDITOR
              </span>
              <span className="text-[10px] font-mono text-slate-500">sketch.ino</span>
            </div>

            <div className="relative font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full bg-slate-900/90 text-cyan-300 p-3 rounded-xl border border-slate-800 font-mono text-xs focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Interactive Serial Monitor Terminal with Command Input */}
          <div className="glass-panel p-4 bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                SERIAL MONITOR CONSOLE (9600 BAUD)
              </span>
              <button
                onClick={() => setSerialLogs([])}
                className="text-[10px] font-mono text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
              >
                CLEAR LOGS
              </button>
            </div>

            {/* Log Terminal Window */}
            <div className="h-32 bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] overflow-y-auto space-y-1">
              {serialLogs.length === 0 ? (
                <div className="text-slate-600 italic">Serial Monitor idle. Click START SIMULATION...</div>
              ) : (
                serialLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('RX >') ? "text-cyan-400 font-bold" : "text-emerald-400"}>
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Serial Command Input Form */}
            <form onSubmit={handleSendSerialCommand} className="flex gap-2">
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                placeholder="Type command e.g. 'ALL ON', 'ALL OFF', 'PIN 8 ON'..."
                className="flex-1 bg-slate-900 border border-slate-800 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="btn-primary bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 text-xs flex items-center gap-1 font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                SEND
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
