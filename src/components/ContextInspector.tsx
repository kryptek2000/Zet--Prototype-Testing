import React, { useState } from 'react';
import { EvidenceNode, Checkpoint, JournalEntry, CIReceipt } from '../types/zet';
import {
  ShieldAlert,
  GitCommit,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  FileCode,
  Gauge,
  Sparkles,
  Link,
  Workflow,
} from 'lucide-react';

interface ContextInspectorProps {
  evidenceGraph: EvidenceNode[];
  checkpoints: Checkpoint[];
  journal: JournalEntry[];
  receipt: CIReceipt;
  onUndoCheckpoint: (cpId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onApproveTierRequest?: (entryId: number) => void;
  onRejectTierRequest?: (entryId: number) => void;
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({
  evidenceGraph,
  checkpoints,
  journal,
  receipt,
  onUndoCheckpoint,
  collapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'approvals' | 'checkpoints' | 'receipts'>('evidence');
  const [expandedDiff, setExpandedDiff] = useState<string | null>(null);

  if (collapsed) {
    return (
      <div className="w-10 bg-[#0c121c] border-l border-[#1d2a3c] flex flex-col items-center py-3 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#8b9cad] hover:text-[#58e5ce] hover:bg-[#1b2635] rounded transition-colors"
          title="Expand Context Inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="mt-6 [writing-mode:vertical-rl] text-[10px] tracking-widest text-[#5c6f84] uppercase font-mono flex items-center gap-2">
          <Workflow className="w-3 h-3 text-[#58e5ce]" />
          <span>Inspector</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 sm:w-96 bg-[#0c121c] border-l border-[#1d2a3c] flex flex-col h-full text-xs select-none shrink-0 overflow-hidden">
      {/* Inspector Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1d2a3c] bg-[#0a0f18]">
        <div className="flex items-center gap-2 font-semibold text-[#e8eff7]">
          <Workflow className="w-3.5 h-3.5 text-[#58e5ce]" />
          <span className="tracking-wide">Context Inspector (Slice 5)</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-[#8b9cad] hover:text-[#58e5ce] hover:bg-[#1b2635] rounded transition-colors"
          title="Collapse Inspector"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1d2a3c] bg-[#070b12] text-[11px]">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 py-1.5 text-center transition-colors font-medium ${
            activeTab === 'evidence'
              ? 'text-[#58e5ce] border-b-2 border-[#58e5ce] bg-[#121c2a]'
              : 'text-[#8b9cad] hover:text-[#e8eff7]'
          }`}
        >
          Evidence
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex-1 py-1.5 text-center transition-colors font-medium ${
            activeTab === 'approvals'
              ? 'text-[#58e5ce] border-b-2 border-[#58e5ce] bg-[#121c2a]'
              : 'text-[#8b9cad] hover:text-[#e8eff7]'
          }`}
        >
          Tiers
        </button>
        <button
          onClick={() => setActiveTab('checkpoints')}
          className={`flex-1 py-1.5 text-center transition-colors font-medium ${
            activeTab === 'checkpoints'
              ? 'text-[#58e5ce] border-b-2 border-[#58e5ce] bg-[#121c2a]'
              : 'text-[#8b9cad] hover:text-[#e8eff7]'
          }`}
        >
          Undo (F12)
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex-1 py-1.5 text-center transition-colors font-medium ${
            activeTab === 'receipts'
              ? 'text-[#58e5ce] border-b-2 border-[#58e5ce] bg-[#121c2a]'
              : 'text-[#8b9cad] hover:text-[#e8eff7]'
          }`}
        >
          CI Receipt
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* TAB 1: EVIDENCE GRAPH */}
        {activeTab === 'evidence' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#8b9cad] bg-[#070b12] p-2 rounded border border-[#1d2a3c]">
              <span className="flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#58e5ce]" />
                <span className="text-[#e8eff7] font-semibold">Provenance Chain</span>
              </span>
              <span className="text-[10px] text-[#83d9a5] bg-[#83d9a5]/10 px-1.5 py-0.5 rounded border border-[#83d9a5]/20 font-mono">
                Verified
              </span>
            </div>

            <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1d2a3c]">
              {evidenceGraph.map((node) => (
                <div
                  key={node.id}
                  className="relative bg-[#070b12] border border-[#1d2a3c] rounded p-2.5 space-y-1.5 hover:border-[#2c3c50] transition-colors"
                >
                  <div className="absolute -left-[19px] top-3 w-2.5 h-2.5 rounded-full border-2 border-[#0c121c] bg-[#58e5ce]" />

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-[#58e5ce] uppercase tracking-wider">{node.type}</span>
                    <span className="text-[#5c6f84] font-mono">{node.timestamp}</span>
                  </div>

                  <h4 className="font-semibold text-[#e8eff7] text-[11px]">{node.title}</h4>
                  <p className="text-[10px] text-[#8b9cad] leading-relaxed font-mono bg-[#05080f] p-1.5 rounded border border-[#162232]">
                    {node.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY TIERS (T0 - T3) */}
        {activeTab === 'approvals' && (
          <div className="space-y-3">
            <div className="bg-[#070b12] border border-[#1d2a3c] p-2.5 rounded-lg space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1 text-[#f6c478]">
                  <ShieldAlert className="w-3 h-3" /> Safety Tiers Policy
                </span>
                <span className="text-[#83d9a5] font-mono text-[9px]">Spec §6.4</span>
              </div>
              <p className="text-[10px] text-[#8b9cad]">
                Tiered safety rules prevent unauthorized writes or destruction. Actions are classified before execution.
              </p>
            </div>

            <div className="space-y-2">
              {/* T0 */}
              <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono font-medium">
                  <span className="text-[#83d9a5]">T0 · Read Only</span>
                  <span className="text-[10px] text-[#8b9cad] bg-[#83d9a5]/10 px-1 rounded">Auto-pass</span>
                </div>
                <div className="text-[10px] text-[#5c6f84] mt-0.5">cat, ls, git status, cargo check</div>
              </div>

              {/* T1 */}
              <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono font-medium">
                  <span className="text-[#22d3ee]">T1 · Low Write</span>
                  <span className="text-[10px] text-[#8b9cad] bg-[#22d3ee]/10 px-1 rounded">Auto in repo</span>
                </div>
                <div className="text-[10px] text-[#5c6f84] mt-0.5">file edit, cargo fmt, git commit</div>
              </div>

              {/* T2 */}
              <div className="bg-[#070b12] border border-[#f6c478]/30 p-2 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono font-medium">
                  <span className="text-[#f6c478]">T2 · Risky Write</span>
                  <span className="text-[10px] text-[#f6c478] bg-[#f6c478]/10 px-1 rounded border border-[#f6c478]/30">
                    Always Ask + Diff
                  </span>
                </div>
                <div className="text-[10px] text-[#5c6f84] mt-0.5">git push, docker run, db migrate, rm -rf</div>
              </div>

              {/* T3 */}
              <div className="bg-[#171307] border border-[#5c4f33] p-2 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono font-medium">
                  <span className="text-[#ef8f94]">T3 · Critical Gate</span>
                  <span className="text-[10px] text-[#ef8f94] bg-[#ef8f94]/10 px-1 rounded border border-[#ef8f94]/30">
                    Type to Confirm
                  </span>
                </div>
                <div className="text-[10px] text-[#5c6f84] mt-0.5">sudo, production kubectl, mass wipe</div>
              </div>
            </div>

            {/* Recent Audit Journal */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold">
                Journal Audit Log
              </div>
              {journal.map((item) => (
                <div key={item.id} className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#f6c478] font-bold">#{item.id} [{item.tier}]</span>
                    <span className="text-[#83d9a5]">approved</span>
                  </div>
                  <div className="text-[#e8eff7] text-[11px] truncate">❯ {item.command}</div>
                  <div className="text-[9px] text-[#5c6f84] truncate">{item.output.split('\n')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CHECKPOINTS & ONE-KEY UNDO */}
        {activeTab === 'checkpoints' && (
          <div className="space-y-3">
            <div className="bg-[#070b12] border border-[#1d2a3c] p-2.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#e8eff7] flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#58e5ce]" />
                  <span>One-Key Undo</span>
                </span>
                <span className="bg-[#1b2635] text-[#58e5ce] border border-[#2c3c50] px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">
                  F12
                </span>
              </div>
              <p className="text-[10px] text-[#8b9cad]">
                Every mutating agent turn takes an atomic filesystem snapshot. Press F12 or click below to restore.
              </p>
            </div>

            <div className="space-y-2">
              {checkpoints.map((cp) => (
                <div key={cp.id} className="bg-[#070b12] border border-[#1d2a3c] rounded p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#58e5ce] text-[11px] font-bold">{cp.id}</span>
                    <span className="text-[10px] text-[#5c6f84] font-mono">{cp.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-[#e8eff7]">{cp.description}</p>

                  <div className="space-y-1 text-[10px]">
                    <span className="text-[#5c6f84] uppercase tracking-wider text-[9px]">Modified files:</span>
                    {cp.filesChanged.map((f) => (
                      <div key={f} className="flex items-center gap-1 text-[#8b9cad] font-mono truncate">
                        <FileCode className="w-3 h-3 text-[#22d3ee] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Toggle Diff */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedDiff(expandedDiff === cp.id ? null : cp.id)}
                      className="text-[10px] text-[#58e5ce] hover:underline font-mono"
                    >
                      {expandedDiff === cp.id ? 'Hide Diff' : 'View Diff'}
                    </button>

                    <button
                      onClick={() => onUndoCheckpoint(cp.id)}
                      className="flex items-center gap-1 bg-[#1b2635] hover:bg-[#2c3c50] text-[#e8eff7] px-2 py-1 rounded text-[10px] font-medium border border-[#3a4a5c] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-[#f6c478]" />
                      <span>Undo Step</span>
                    </button>
                  </div>

                  {expandedDiff === cp.id && (
                    <pre className="bg-[#05080f] p-2 rounded border border-[#162232] text-[9px] font-mono text-[#8b9cad] overflow-x-auto whitespace-pre">
                      {cp.diff}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CI RECEIPTS */}
        {activeTab === 'receipts' && (
          <div className="space-y-3">
            <div className="bg-[#070b12] border border-[#1d2a3c] p-2.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#e8eff7] flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#58e5ce]" />
                  <span>CI Receipt (Commit {receipt.commitHash})</span>
                </span>
                <span className="text-[10px] text-[#83d9a5] bg-[#83d9a5]/10 px-1.5 py-0.5 rounded border border-[#83d9a5]/20 font-mono">
                  ALL GREEN
                </span>
              </div>
              <div className="text-[10px] text-[#5c6f84] font-mono">
                Workflow run: #{receipt.runId} on {receipt.branch}
              </div>
            </div>

            {/* 4 Strict Gates */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold">
                The 4 Strict CI Gates
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded flex items-center justify-between">
                  <span>cargo fmt</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#83d9a5]" />
                </div>
                <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded flex items-center justify-between">
                  <span>cargo check</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#83d9a5]" />
                </div>
                <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded flex items-center justify-between">
                  <span>clippy (-D)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#83d9a5]" />
                </div>
                <div className="bg-[#070b12] border border-[#1d2a3c] p-2 rounded flex items-center justify-between">
                  <span>cargo test</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#83d9a5]" />
                </div>
              </div>
            </div>

            {/* Performance Gates */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#58e5ce]" />
                <span>Performance Release Gates (Spec §7)</span>
              </div>

              <div className="bg-[#070b12] border border-[#1d2a3c] rounded p-2.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cad]">Cold Startup:</span>
                  <span className="text-[#83d9a5] font-semibold">{receipt.metrics.startupMs} ms &lt; 300ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cad]">Input Latency:</span>
                  <span className="text-[#83d9a5] font-semibold">{receipt.metrics.inputLatencyMs} ms &lt; 3ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cad]">Idle RSS:</span>
                  <span className="text-[#83d9a5] font-semibold">{receipt.metrics.idleRssMb} MB &lt; 100MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cad]">cat 100k lines:</span>
                  <span className="text-[#83d9a5] font-semibold">{receipt.metrics.cat100kSec} s &lt; 0.9s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inspector Footer */}
      <div className="p-2 border-t border-[#1d2a3c] bg-[#070b12] text-[10px] text-[#5c6f84] font-mono text-center">
        Audited provenance · Gate verified
      </div>
    </aside>
  );
};
