import React, { useState } from 'react';
import { Network, Cpu, ShieldCheck, Zap, Database, Terminal, ArrowRight, Layers } from 'lucide-react';

interface SubsystemInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  perfBudget: string;
  crates: string[];
  role: string;
}

const SUBSYSTEMS: SubsystemInfo[] = [
  {
    id: 'gpu',
    name: 'zet-gpu + shell',
    category: 'Rendering & Input',
    description: 'Hardware accelerated terminal surface using wgpu with cosmic-text glyph atlas and tinted quad renderer.',
    perfBudget: '<3ms key-to-pixel input latency, 120fps steady',
    crates: ['crates/zet-gpu'],
    role: 'Paints VT cells, ghost suggestions, selection box, cursor, tab bar, and search overlays.',
  },
  {
    id: 'term',
    name: 'zet-term / pty',
    category: 'Terminal Core',
    description: 'Canonical PTY fork/exec process with VT escape sequence parsing and OSC 133 semantic markers.',
    perfBudget: '<300ms startup to first prompt frame',
    crates: ['crates/zet-term', 'crates/zet-pty'],
    role: 'Runs real user shells ($SHELL -i), tracks terminal dimensions, scrollback, alt-screen, and signal forwarding.',
  },
  {
    id: 'blocks',
    name: 'zet-blocks',
    category: 'Persistence',
    description: 'SQLite command block recording and historical transcript replay engine.',
    perfBudget: '<5ms write commit, zero blocking on PTY path',
    crates: ['crates/zet-blocks'],
    role: 'Records every executed command with cwd, git branch, exit code, duration ms, and scrubbed secrets.',
  },
  {
    id: 'policy',
    name: 'zet-policy',
    category: 'Security & Safety',
    description: 'Deterministic tiered safety policy classifying commands into T0 (read), T1 (low write), T2 (risky), T3 (critical).',
    perfBudget: '<1ms pure function evaluation',
    crates: ['crates/zet-policy'],
    role: 'Prevents unauthorized file overwrites, requires diff approvals for risky operations, and type-to-confirm for critical.',
  },
  {
    id: 'agent',
    name: 'zet-agent',
    category: 'Intelligence',
    description: 'Single-lane planner, executor, and verifier loop with checkpoint capture and one-key undo.',
    perfBudget: '<4s cloud TTFT, atomic checkpoint snapshots',
    crates: ['crates/zet-agent'],
    role: 'Executes small, verify-first steps. Records atomic undo snapshots in journal before any mutation.',
  },
  {
    id: 'context',
    name: 'zet-context',
    category: 'Context Gathering',
    description: 'Scans repository tree, active git status, dirty counts, and provides secret scrubbing.',
    perfBudget: '<20ms git state gathering',
    crates: ['crates/zet-context'],
    role: 'Injects known provenance context into agent requests while ensuring API keys and passwords are scrubbed.',
  },
  {
    id: 'models',
    name: 'zet-models',
    category: 'Model Gateway',
    description: 'BYOK (Bring Your Own Key) model abstraction supporting local models, OpenAI-compatible, and Anthropic APIs.',
    perfBudget: 'Streamed tokens, zero user credential leaks',
    crates: ['crates/zet-models'],
    role: 'Routes inference requests, enforces token bounds, and maintains token count accounting.',
  },
];

export const ArchitectureViewer: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemInfo>(SUBSYSTEMS[0]);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0a101a] overflow-hidden font-mono text-xs select-none">
      {/* Left: Interactive Diagram & Flow Canvas */}
      <div className="flex-1 flex flex-col h-full border-r border-[#1d2a3c] overflow-y-auto p-4 space-y-4">
        {/* Architecture Header */}
        <div className="bg-[#0c121c] border border-[#1d2a3c] p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#58e5ce]" />
            <span className="font-semibold text-[#e8eff7] text-sm">ZET System Architecture (v0.1 Draft)</span>
          </div>
          <span className="text-[10px] text-[#8b9cad] bg-[#1b2635] px-2 py-0.5 rounded border border-[#2c3c50]">
            Rust Workspace + wgpu
          </span>
        </div>

        {/* Visual Architecture Map */}
        <div className="border border-[#1d2a3c] rounded-xl p-4 bg-[#070b12] space-y-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center justify-between">
            <span>Core Dataflow Topology</span>
            <span className="text-[#83d9a5]">Demand-driven frames</span>
          </div>

          {/* Layer 1: User & Interface */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[#5c6f84]">1. User & Rendering Surface</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'gpu')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'gpu'
                    ? 'bg-[#083344] border-[#22d3ee] shadow-lg shadow-[#22d3ee]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#22d3ee]/60'
                }`}
              >
                <div className="text-[#22d3ee] font-semibold">zet-gpu + shell</div>
                <div className="text-[10px] text-[#8b9cad]">wgpu 120fps &lt;3ms</div>
              </button>

              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'term')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'term'
                    ? 'bg-[#064e3b] border-[#34d399] shadow-lg shadow-[#34d399]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#34d399]/60'
                }`}
              >
                <div className="text-[#34d399] font-semibold">zet-term / pty</div>
                <div className="text-[10px] text-[#8b9cad]">VT grid, OSC 133</div>
              </button>

              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'blocks')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'blocks'
                    ? 'bg-[#3b0764] border-[#a78bfa] shadow-lg shadow-[#a78bfa]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#a78bfa]/60'
                }`}
              >
                <div className="text-[#a78bfa] font-semibold">zet-blocks</div>
                <div className="text-[10px] text-[#8b9cad]">SQLite + replay</div>
              </button>
            </div>
          </div>

          {/* Layer 2: Outcome-Aware Agent & Policy */}
          <div className="space-y-1.5 pt-2 border-t border-[#162232]">
            <span className="text-[10px] text-[#5c6f84]">2. Verification & Safety Pipeline</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'agent')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'agent'
                    ? 'bg-[#064e3b] border-[#34d399] shadow-lg shadow-[#34d399]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#34d399]/60'
                }`}
              >
                <div className="text-[#34d399] font-semibold">zet-agent</div>
                <div className="text-[10px] text-[#8b9cad]">Plan → Exec → Verify</div>
              </button>

              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'policy')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'policy'
                    ? 'bg-[#4c0519] border-[#fb7185] shadow-lg shadow-[#fb7185]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#fb7185]/60'
                }`}
              >
                <div className="text-[#fb7185] font-semibold">zet-policy</div>
                <div className="text-[10px] text-[#8b9cad]">T0–T3 safety gates</div>
              </button>

              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'context')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'context'
                    ? 'bg-[#064e3b] border-[#34d399] shadow-lg shadow-[#34d399]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#34d399]/60'
                }`}
              >
                <div className="text-[#34d399] font-semibold">zet-context</div>
                <div className="text-[10px] text-[#8b9cad]">git, scrub, diffs</div>
              </button>
            </div>
          </div>

          {/* Layer 3: Model Gateway & Runtime */}
          <div className="space-y-1.5 pt-2 border-t border-[#162232]">
            <span className="text-[10px] text-[#5c6f84]">3. Gateway & Execution Environments</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedSubsystem(SUBSYSTEMS.find((s) => s.id === 'models')!)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedSubsystem.id === 'models'
                    ? 'bg-[#1e293b] border-[#94a3b8] shadow-lg shadow-[#94a3b8]/10'
                    : 'bg-[#0c121c] border-[#1d2a3c] hover:border-[#94a3b8]/60'
                }`}
              >
                <div className="text-[#e8eff7] font-semibold">zet-models</div>
                <div className="text-[10px] text-[#8b9cad]">Local 1B &lt;50ms / Cloud BYOK</div>
              </button>

              <div className="p-3 rounded-lg border border-[#1d2a3c] bg-[#0c121c] text-left">
                <div className="text-[#f6c478] font-semibold">OS Sandbox Boundary</div>
                <div className="text-[10px] text-[#5c6f84]">bubblewrap / seatbelt (T2+T3 gated)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Principle Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-[#0c121c] border border-[#1d2a3c] p-2.5 rounded-lg space-y-1">
            <div className="text-[#58e5ce] font-semibold text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Speed is a Feature</span>
            </div>
            <p className="text-[10px] text-[#8b9cad]">
              All latency budgets are hard release gates. PTY output never blocks on LLM inference.
            </p>
          </div>

          <div className="bg-[#0c121c] border border-[#1d2a3c] p-2.5 rounded-lg space-y-1">
            <div className="text-[#83d9a5] font-semibold text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Honest Provenance</span>
            </div>
            <p className="text-[10px] text-[#8b9cad]">
              Evidence is marked Observed, Inferred, or Unknown (—). Zero fabricated telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Subsystem Detail Panel */}
      <div className="w-full md:w-80 bg-[#0c121c] p-4 flex flex-col h-auto md:h-full shrink-0 space-y-4">
        <div className="border-b border-[#1d2a3c] pb-3 space-y-1">
          <span className="text-[10px] text-[#58e5ce] uppercase tracking-wider font-semibold">
            {selectedSubsystem.category}
          </span>
          <h3 className="text-sm font-bold text-[#e8eff7]">{selectedSubsystem.name}</h3>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] text-[#5c6f84] uppercase tracking-wider">Role & Description:</span>
            <p className="text-[#8b9cad] text-[11px] leading-relaxed bg-[#070b12] p-2.5 rounded border border-[#1d2a3c]">
              {selectedSubsystem.description}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#5c6f84] uppercase tracking-wider">Performance Gate:</span>
            <div className="text-[#83d9a5] text-[11px] bg-[#070b12] p-2 rounded border border-[#1d2a3c] font-semibold">
              ⚡ {selectedSubsystem.perfBudget}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#5c6f84] uppercase tracking-wider">Associated Crates:</span>
            <div className="space-y-1">
              {selectedSubsystem.crates.map((c) => (
                <div key={c} className="text-[#22d3ee] bg-[#070b12] px-2 py-1 rounded border border-[#1d2a3c] text-[11px]">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#5c6f84] uppercase tracking-wider">Responsibility:</span>
            <p className="text-[#8b9cad] text-[11px] leading-relaxed">
              {selectedSubsystem.role}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1d2a3c] text-[10px] text-[#5c6f84] text-center">
          Defined in docs/ZET-DESIGN.md & zet-architecture.html
        </div>
      </div>
    </div>
  );
};
