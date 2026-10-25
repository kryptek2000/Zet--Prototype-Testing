import React, { useState } from 'react';
import { BookOpen, Milestone, CheckCircle2, AlertCircle, FileText, Compass, Terminal, Shield } from 'lucide-react';

export const RoadmapDocsViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'roadmap' | 'charter' | 'agents' | 'shortcuts' | 'readme'>('roadmap');

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0a101a] overflow-hidden font-mono text-xs select-none">
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 bg-[#0c121c] border-r border-[#1d2a3c] flex flex-col h-auto md:h-full shrink-0">
        <div className="p-3 border-b border-[#1d2a3c] bg-[#090e17] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-[#e8eff7]">
            <BookOpen className="w-4 h-4 text-[#58e5ce]" />
            <span>Project Authorities</span>
          </div>
        </div>

        <div className="p-2 space-y-1">
          <button
            onClick={() => setActiveDoc('roadmap')}
            className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2 transition-colors ${
              activeDoc === 'roadmap'
                ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-[#f6c478]" />
            <span>ROADMAP.md</span>
          </button>

          <button
            onClick={() => setActiveDoc('charter')}
            className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2 transition-colors ${
              activeDoc === 'charter'
                ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>Product Charter</span>
          </button>

          <button
            onClick={() => setActiveDoc('agents')}
            className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2 transition-colors ${
              activeDoc === 'agents'
                ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#ef8f94]" />
            <span>AGENTS.md (Gates)</span>
          </button>

          <button
            onClick={() => setActiveDoc('shortcuts')}
            className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2 transition-colors ${
              activeDoc === 'shortcuts'
                ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#83d9a5]" />
            <span>SHORTCUTS.md</span>
          </button>

          <button
            onClick={() => setActiveDoc('readme')}
            className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2 transition-colors ${
              activeDoc === 'readme'
                ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>README.md</span>
          </button>
        </div>

        <div className="mt-auto p-3 border-t border-[#1d2a3c] bg-[#070b12] text-[10px] text-[#5c6f84]">
          Authority Hierarchy: Charter → Roadmap → Code & Engineering Rules
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 select-text">
        {/* ROADMAP DOC */}
        {activeDoc === 'roadmap' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[#e8eff7] mb-1">ZET — Delivery Roadmap</h1>
              <p className="text-[#8b9cad] text-[11px]">
                Updated 2026-10-25 · Authority: Product Charter · No false promises: release when gates pass.
              </p>
            </div>

            {/* Milestones cards */}
            <div className="space-y-4">
              {/* P0 */}
              <div className="bg-[#0c121c] border border-[#1d2a3c] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#83d9a5]" />
                    <h3 className="font-bold text-[#e8eff7]">P0 — Restore and Protect Foundation</h3>
                  </div>
                  <span className="text-[10px] bg-[#83d9a5]/10 text-[#83d9a5] px-2 py-0.5 rounded font-mono">
                    Completed & Green
                  </span>
                </div>
                <p className="text-[#8b9cad] leading-relaxed">
                  Close renderer clipping/sidebearing CI repair (PR #13); confirm master green; capture reproducible baseline: cold startup &lt;300ms, input latency &lt;3ms, idle RSS &lt;100MB.
                </p>
              </div>

              {/* P1-A */}
              <div className="bg-[#0c121c] border border-[#1d2a3c] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#83d9a5]" />
                    <h3 className="font-bold text-[#e8eff7]">P1 — UX and Technical Contract</h3>
                  </div>
                  <span className="text-[10px] bg-[#83d9a5]/10 text-[#83d9a5] px-2 py-0.5 rounded font-mono">
                    Merged (PR #14 & #16)
                  </span>
                </div>
                <p className="text-[#8b9cad] leading-relaxed">
                  Reconcile old design with charter. Specify terminal/workspace/mission layouts and discoverable mode switcher. Define semantics of “observed”, “inferred”, and “verified”.
                </p>
              </div>

              {/* P2-A */}
              <div className="bg-[#0c121c] border border-[#58e5ce]/40 rounded-lg p-4 space-y-2 bg-[#0c121c]/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Milestone className="w-4 h-4 text-[#58e5ce]" />
                    <h3 className="font-bold text-[#58e5ce]">P2-A — Native Vertical Slices</h3>
                  </div>
                  <span className="text-[10px] bg-[#58e5ce]/20 text-[#58e5ce] px-2 py-0.5 rounded font-mono font-bold">
                    Active Development
                  </span>
                </div>
                <ul className="text-[#8b9cad] space-y-1 pl-4 list-disc">
                  <li><strong className="text-[#83d9a5]">Slice 4B (Merged PR #28):</strong> Native collapsible Mission Rail view over real PTY sessions.</li>
                  <li><strong className="text-[#f6c478]">Slice 5 (In Progress):</strong> Contextual Inspector with Evidence Graph and one-key undo.</li>
                  <li><strong className="text-[#83d9a5]">Wayland Paste (Merged PR #30):</strong> High performance bracketed paste integration.</li>
                </ul>
              </div>

              {/* P2-B */}
              <div className="bg-[#0c121c] border border-[#1d2a3c] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#83d9a5]" />
                    <h3 className="font-bold text-[#e8eff7]">P2-B — Signature ASCII Identity</h3>
                  </div>
                  <span className="text-[10px] bg-[#83d9a5]/10 text-[#83d9a5] px-2 py-0.5 rounded font-mono">
                    Merged (PR #31, #32, #33)
                  </span>
                </div>
                <p className="text-[#8b9cad] leading-relaxed">
                  Preserve approved native composition—Mission Rail | Living Terminal Workstream | Contextual Inspector. Add monospace ASCII-style ZET wordmark to welcome/startup states.
                </p>
              </div>

              {/* P3 */}
              <div className="bg-[#0c121c] border border-[#1d2a3c] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#f6c478]" />
                    <h3 className="font-bold text-[#e8eff7]">P3 — Evidence-Linked Commands</h3>
                  </div>
                  <span className="text-[10px] bg-[#f6c478]/10 text-[#f6c478] px-2 py-0.5 rounded font-mono">
                    Planned Next
                  </span>
                </div>
                <p className="text-[#8b9cad] leading-relaxed">
                  Associate real shell commands with captured output/exit/duration, cwd/git identity and session IDs. Link command → failure → raw output → real diff refs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT CHARTER */}
        {activeDoc === 'charter' && (
          <div className="max-w-4xl space-y-4">
            <h1 className="text-xl font-bold text-[#e8eff7]">ZET Product Charter</h1>
            <div className="bg-[#0c121c] p-4 rounded-lg border border-[#1d2a3c] space-y-3 text-[#8b9cad] leading-relaxed">
              <h2 className="text-[#58e5ce] font-bold text-sm">Core Identity</h2>
              <p>
                ZET is a native Linux-first terminal connecting commands, development work, and verifiable outcomes.
                Its slogan is: <span className="text-[#e8eff7] font-semibold">"Old-school roots. Next-generation intelligence."</span>
              </p>
              <h2 className="text-[#58e5ce] font-bold text-sm">The 8 Non-Negotiable Principles</h2>
              <ol className="list-decimal pl-5 space-y-1.5 text-[11px]">
                <li><strong>Real terminal integrity first</strong> — Mission Control is optional chrome around canonical PTY; AI must never hijack it.</li>
                <li><strong>Speed is a feature</strong> — cold startup &lt;300ms, input latency &lt;3ms, cat 100k &lt;0.9s.</li>
                <li><strong>Agent accountability</strong> — actions must be auditable and show available evidence; zero synthetic metrics.</li>
                <li><strong>Local-first, BYOM</strong> — no account required to open a shell.</li>
                <li><strong>Tiered approvals</strong> — T0–T3 safety classifications, not Y/N spam.</li>
                <li><strong>Keyboard everything</strong> — fast shortcuts, no forced mouse usage.</li>
                <li><strong>Standards over lock-in</strong> — xterm, OSC 133, MCP, TOML, SQLite.</li>
                <li><strong>No silent writes</strong> — no mutation without a recorded checkpoint.</li>
              </ol>
            </div>
          </div>
        )}

        {/* AGENTS.MD */}
        {activeDoc === 'agents' && (
          <div className="max-w-4xl space-y-4">
            <h1 className="text-xl font-bold text-[#e8eff7]">AGENTS.md — Authoritative Engineering Guide</h1>
            <div className="bg-[#0c121c] p-4 rounded-lg border border-[#1d2a3c] space-y-3 text-[#8b9cad] leading-relaxed">
              <h2 className="text-[#ef8f94] font-bold text-sm">The 4 Strict CI Gates</h2>
              <p>CI runs exactly these four on every push and PR. All four must pass before any change is done:</p>
              <pre className="bg-[#070b12] p-3 rounded text-[#83d9a5] border border-[#162232] text-[11px]">
cargo fmt --all -- --check
cargo check --workspace --all-targets
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
              </pre>

              <h2 className="text-[#ef8f94] font-bold text-sm pt-2">Safety Tiers (Spec §6.4)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-[#070b12] rounded border border-[#1d2a3c]">
                  <span className="text-[#83d9a5] font-bold">T0 Read:</span> cat, ls, git status (auto pass)
                </div>
                <div className="p-2.5 bg-[#070b12] rounded border border-[#1d2a3c]">
                  <span className="text-[#22d3ee] font-bold">T1 Low-write:</span> file edits in repo, git commit (auto in repo)
                </div>
                <div className="p-2.5 bg-[#070b12] rounded border border-[#f6c478]/40">
                  <span className="text-[#f6c478] font-bold">T2 Risky:</span> git push, docker run, rm -rf (ask + diff)
                </div>
                <div className="p-2.5 bg-[#070b12] rounded border border-[#ef8f94]/40">
                  <span className="text-[#ef8f94] font-bold">T3 Critical:</span> sudo, prod cluster (type to confirm)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHORTCUTS.MD */}
        {activeDoc === 'shortcuts' && (
          <div className="max-w-4xl space-y-4">
            <h1 className="text-xl font-bold text-[#e8eff7]">ZET Shortcuts & Interaction Guide</h1>
            <div className="bg-[#0c121c] p-4 rounded-lg border border-[#1d2a3c] space-y-3 text-[#8b9cad]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1d2a3c] text-[#58e5ce]">
                      <th className="py-2">Shortcut</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162232]">
                    <tr><td className="py-2 font-mono text-[#f6c478]">Tab</td><td>Accept ghost suggestion (history completion)</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">F12</td><td>One-key undo of last checkpointed mutation</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">Ctrl+G</td><td>Agent turn mode / natural language goal</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">Ctrl+1 / 2 / 3</td><td>Switch Focus / Workspace / Mission Control</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">Ctrl+Shift+T</td><td>Open new terminal tab</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">Ctrl+Shift+W</td><td>Close active tab</td></tr>
                    <tr><td className="py-2 font-mono text-[#f6c478]">Esc</td><td>Dismiss ghost / cancel in-flight action</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* README.MD */}
        {activeDoc === 'readme' && (
          <div className="max-w-4xl space-y-4">
            <h1 className="text-xl font-bold text-[#e8eff7]">ZET — The Outcome-Aware Terminal</h1>
            <div className="bg-[#0c121c] p-4 rounded-lg border border-[#1d2a3c] space-y-3 text-[#8b9cad] leading-relaxed">
              <p className="text-sm text-[#e8eff7] font-semibold">
                A native Linux-first terminal connecting commands, development work, and verifiable outcomes.
              </p>
              <p>
                A failed test is more than red text: ZET lets you follow its original command and output, related files, subsequent investigation, exact approved changes, and evidence that a fix actually worked.
              </p>
              <div className="p-3 bg-[#070b12] rounded border border-[#1d2a3c] text-[11px] font-mono text-[#58e5ce]">
                Native Rust + wgpu · Demand-driven frames · Local-first
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
