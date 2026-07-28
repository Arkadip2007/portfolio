import React, { useState } from 'react';
import { Layers, Network, Database, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const ArchitectureGraph: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('turborepo');
  const [trpcQueryStatus, setTrpcQueryStatus] = useState<'idle' | 'querying' | 'success'>('idle');

  const testTrpcCall = () => {
    soundFX.playBeep(1100, 0.06);
    setTrpcQueryStatus('querying');
    setTimeout(() => {
      setTrpcQueryStatus('success');
    }, 450);
  };

  return (
    <section id="stack" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Layers className="w-4 h-4 text-emerald-400" />
          FULL-STACK MONOREPO ARCHITECTURE
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Modern Monorepo & <span className="text-emerald-400 glow-emerald">tRPC / Drizzle Stack</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Interactive architecture map highlighting end-to-end type safety, RPC protocol design, Drizzle ORM schemas, and OpenAPI Scalar documentation.
        </p>
      </div>

      {/* Monorepo Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-8">
        
        {/* Turborepo */}
        <div
          onClick={() => { soundFX.playClick(); setActiveNode('turborepo'); }}
          className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all ${
            activeNode === 'turborepo'
              ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,243,255,0.3)]'
              : 'glass-panel text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 truncate">ORCHESTRATOR</span>
          </div>
          <h3 className="font-heading font-bold text-xs sm:text-sm truncate">Turborepo</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Monorepo Engine</p>
        </div>

        {/* Next.js + TS */}
        <div
          onClick={() => { soundFX.playClick(); setActiveNode('nextjs'); }}
          className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all ${
            activeNode === 'nextjs'
              ? 'bg-magenta-950/80 border-magenta-400 text-white shadow-[0_0_20px_rgba(255,0,170,0.3)]'
              : 'glass-panel text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-magenta-400 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono text-magenta-400 truncate">FRONTEND</span>
          </div>
          <h3 className="font-heading font-bold text-xs sm:text-sm truncate">Next.js + TS</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Reactive UI Client</p>
        </div>

        {/* tRPC */}
        <div
          onClick={() => { soundFX.playClick(); setActiveNode('trpc'); }}
          className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all ${
            activeNode === 'trpc'
              ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]'
              : 'glass-panel text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 truncate">API LAYER</span>
          </div>
          <h3 className="font-heading font-bold text-xs sm:text-sm truncate">tRPC (RPC)</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Type-Safe API</p>
        </div>

        {/* Drizzle ORM */}
        <div
          onClick={() => { soundFX.playClick(); setActiveNode('drizzle'); }}
          className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all ${
            activeNode === 'drizzle'
              ? 'bg-amber-950/80 border-amber-400 text-white shadow-[0_0_20px_rgba(255,183,0,0.3)]'
              : 'glass-panel text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 truncate">DATABASE</span>
          </div>
          <h3 className="font-heading font-bold text-xs sm:text-sm truncate">Drizzle ORM</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">SQL Mapper</p>
        </div>

        {/* Express + Scalar */}
        <div
          onClick={() => { soundFX.playClick(); setActiveNode('scalar'); }}
          className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all col-span-2 sm:col-span-1 ${
            activeNode === 'scalar'
              ? 'bg-violet-950/80 border-violet-400 text-white shadow-[0_0_20px_rgba(138,43,226,0.3)]'
              : 'glass-panel text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono text-violet-400 truncate">OPENAPI</span>
          </div>
          <h3 className="font-heading font-bold text-xs sm:text-sm truncate">Express + Scalar</h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">Interactive Docs</p>
        </div>

      </div>

      {/* Detail Inspector Card */}
      <div className="glass-panel p-4 sm:p-8">
        
        {activeNode === 'turborepo' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-cyan-400 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">Turborepo Monorepo Architecture</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Turborepo handles incremental builds, remote caching, and shared TypeScript configuration across our apps (`web`, `docs`, `hardware-gateway`) and packages (`@repo/api`, `@repo/db`, `@repo/ui`).
            </p>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs text-cyan-300 border border-slate-800 space-y-1 overflow-x-auto break-words">
              <div>// turbo.json</div>
              <div className="text-slate-400">&quot;pipeline&quot;: &#123; &quot;build&quot;: &#123; &quot;outputs&quot;: [&quot;.next/**&quot;, &quot;dist/**&quot;] &#125;, &quot;lint&quot;: &#123;&#125; &#125;</div>
            </div>
          </div>
        )}

        {activeNode === 'trpc' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-emerald-400 shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-white font-heading">tRPC RPC Router (No REST Overhead)</h3>
              </div>
              <button onClick={testTrpcCall} className="btn-primary text-xs py-1.5 px-3 self-start sm:self-auto">
                {trpcQueryStatus === 'querying' ? 'Querying...' : 'Test tRPC Query'}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Provides strict end-to-end type safety between the Next.js frontend and Express RPC backend server without codegen or REST endpoint clutter.
            </p>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs text-emerald-300 border border-slate-800 space-y-2 overflow-x-auto break-words">
              <div>const telemetryRouter = router(&#123; getHardwareStatus: publicProcedure.query(async () =&gt; &#123; return &#123; board: &apos;ESP32&apos;, temp: 24.5 &#125;; &#125;) &#125;);</div>
              {trpcQueryStatus === 'success' && (
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Response: &#123;&quot;result&quot;:&#123;&quot;data&quot;:&#123;&quot;board&quot;:&quot;ESP32&quot;,&quot;temp&quot;:24.5&#125;&#125;&#125; [Type Verified]</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeNode === 'drizzle' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-amber-400 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">Drizzle ORM Lightweight SQL Models</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              High-performance TypeScript-first ORM mapping directly to PostgreSQL/SQLite databases for telemetry logging and project metrics.
            </p>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs text-amber-300 border border-slate-800 space-y-1 overflow-x-auto break-words">
              <div>export const sensorLogs = pgTable(&apos;sensor_logs&apos;, &#123;</div>
              <div className="pl-4 text-slate-400">id: serial(&apos;id&apos;).primaryKey(),</div>
              <div className="pl-4 text-slate-400">device: text(&apos;device&apos;).notNull(),</div>
              <div className="pl-4 text-slate-400">voltage: real(&apos;voltage&apos;),</div>
              <div className="pl-4 text-slate-400">created_at: timestamp(&apos;created_at&apos;).defaultNow()</div>
              <div>&#125;);</div>
            </div>
          </div>
        )}

        {activeNode === 'scalar' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-violet-400 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading">Express Adapter & Scalar OpenAPI Docs</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Translates tRPC router procedures into OpenAPI 3.1 compliant endpoints served via Express with beautiful interactive Scalar API documentation interface.
            </p>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs text-violet-300 border border-slate-800 overflow-x-auto break-words">
              app.use(&apos;/api/docs&apos;, scalarExpress(&#123; spec: &#123; url: &apos;/api/openapi.json&apos; &#125; &#125;));
            </div>
          </div>
        )}

        {activeNode === 'nextjs' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-magenta-400" />
              <h3 className="text-xl font-bold text-white font-heading">Next.js + TypeScript Frontend</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Provides server-rendered reactive views with instant layout hydration and smooth Canvas/WebGL graphics integration.
            </p>
          </div>
        )}

      </div>

    </section>
  );
};
