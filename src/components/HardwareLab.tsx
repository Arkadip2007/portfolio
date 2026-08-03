import React, { useState } from 'react';
import { Cpu, Wifi, Radio, Monitor } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { ArduinoSimulator } from './ArduinoSimulator';

export const HardwareLab: React.FC = () => {
  const [activeBoard, setActiveBoard] = useState<'arduino' | 'esp32' | 'raspberry'>('arduino');

  // ESP32 State
  const [wifiTransmitting, setWifiTransmitting] = useState(false);
  const [mqttPackets, setMqttPackets] = useState<string[]>([
    '{"topic":"home/sensors/temp", "val": 26.4}',
    '{"topic":"esp32/status", "rssi": -58}'
  ]);

  // Raspberry Pi State
  const [gpioPins, setGpioPins] = useState<{ [key: number]: boolean }>({
    17: true,
    27: false,
    22: true,
    23: false
  });

  const triggerEspTransmit = () => {
    soundFX.playBeep(1400, 0.05);
    setWifiTransmitting(true);
    setTimeout(() => {
      setWifiTransmitting(false);
      const newPacket = `{"topic":"iot/telemetry", "ts": ${Date.now()}}`;
      setMqttPackets((prev) => [newPacket, ...prev.slice(0, 3)]);
    }, 400);
  };

  const toggleGpio = (pin: number) => {
    soundFX.playClick();
    setGpioPins((prev) => ({ ...prev, [pin]: !prev[pin] }));
  };

  return (
    <section id="hardware" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Cpu className="w-4 h-4 text-cyan-400" />
          INTERACTIVE ELECTRONICS & MICROCONTROLLER LAB
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Arduino, ESP32 & Raspberry Pi <span className="text-cyan-400 glow-cyan">Simulator</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Interactive microcontrollers powered by custom high-detail vector SVG schematics. Test circuits, write C++ sketches, toggle GPIO pins, simulate analog sensors, and transmit MQTT Wi-Fi telemetry packets.
        </p>
      </div>

      {/* Board Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
        <button
          onClick={() => { soundFX.playClick(); setActiveBoard('arduino'); }}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-heading text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
            activeBoard === 'arduino'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Arduino Uno R3
        </button>

        <button
          onClick={() => { soundFX.playClick(); setActiveBoard('esp32'); }}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-heading text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
            activeBoard === 'esp32'
              ? 'bg-magenta-500 text-slate-950 shadow-[0_0_20px_rgba(255,0,170,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ESP32 Wi-Fi / BLE
        </button>

        <button
          onClick={() => { soundFX.playClick(); setActiveBoard('raspberry'); }}
          className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-heading text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
            activeBoard === 'raspberry'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(0,255,136,0.4)]'
              : 'glass-panel text-slate-300 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Raspberry Pi 4
        </button>
      </div>

      {/* Board Content Display */}
      <div className="glass-panel p-6 sm:p-8">
        
        {/* ARDUINO UNO BOARD INTERACTIVE ONLINE SIMULATOR */}
        {activeBoard === 'arduino' && <ArduinoSimulator />}

        {/* ESP32 BOARD DISPLAY */}
        {activeBoard === 'esp32' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Custom SVG ESP32 Schematic */}
            <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/90 p-6 rounded-2xl border border-magenta-500/30 relative overflow-hidden">
              <span className="absolute top-3 left-4 text-xs font-mono text-magenta-400 z-10 bg-slate-900/90 px-3 py-1 rounded border border-magenta-500/30">
                BOARD: ESP32-WROOM-32 (Dual Core Tensilica LX6)
              </span>

              <div className="relative w-full max-w-md my-4 p-2 flex items-center justify-center">
                <img
                  src="/MCU/ESP32.svg"
                  alt="ESP32 Board"
                  className="w-full h-auto max-h-[280px] object-contain drop-shadow-[0_0_20px_rgba(255,0,170,0.25)]"
                />

                {/* Wi-Fi Transmit Wave Overlay */}
                {wifiTransmitting && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-magenta-500 animate-ping opacity-75" />
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-5 space-y-5">
              <h3 className="text-xl font-bold text-white font-heading">ESP32 Wi-Fi & BLE Telemetry</h3>
              <p className="text-xs text-slate-300">
                Simulate Wi-Fi 802.11 b/g/n telemetry packet broadcast to MQTT brokers.
              </p>

              <button
                onClick={triggerEspTransmit}
                disabled={wifiTransmitting}
                className="btn-primary w-full bg-gradient-to-r from-magenta-600 to-cyan-600 text-white font-bold"
              >
                <Radio className={`w-4 h-4 ${wifiTransmitting ? 'animate-spin' : ''}`} />
                {wifiTransmitting ? 'TRANSMITTING MQTT PACKET...' : 'TRANSMIT MQTT TELEMETRY'}
              </button>

              <div className="glass-panel p-4 space-y-2">
                <span className="text-xs font-mono text-magenta-400 block">Live MQTT Broker Stream</span>
                <div className="space-y-1.5 font-mono text-xs text-slate-300">
                  {mqttPackets.map((pkt, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                      {pkt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* RASPBERRY PI 4 DISPLAY */}
        {activeBoard === 'raspberry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/90 p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
              <span className="absolute top-3 left-4 text-xs font-mono text-emerald-400 z-10 bg-slate-900/90 px-3 py-1 rounded border border-emerald-500/30">
                BOARD: RASPBERRY PI 4 MODEL B (8GB RAM)
              </span>

              <div className="relative w-full max-w-md my-4 p-2 flex items-center justify-center">
                <img
                  src="/MCU/raspberrypi.svg"
                  alt="Raspberry Pi Board"
                  className="w-full h-auto max-h-[280px] object-contain drop-shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                />
              </div>
            </div>

            {/* GPIO Controls */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold text-white font-heading">Raspberry Pi GPIO Matrix</h3>
              <p className="text-xs text-slate-300">
                Click pin numbers below to toggle physical GPIO output states in Python (`RPi.GPIO`).
              </p>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(gpioPins).map(([pinStr, state]) => {
                  const pin = Number(pinStr);
                  return (
                    <div
                      key={pin}
                      onClick={() => toggleGpio(pin)}
                      className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between font-mono text-xs ${
                        state
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>GPIO {pin}</span>
                      <strong className={state ? 'text-emerald-400' : 'text-slate-500'}>
                        {state ? 'HIGH (3.3V)' : 'LOW (0V)'}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <span>SoC CPU Temp:</span>
                <strong className="text-cyan-400">42.8 °C (Cool)</strong>
              </div>
            </div>

          </div>
        )}

      </div>

    </section>
  );
};
