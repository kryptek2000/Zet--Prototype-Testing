import React, { useState, useRef, useEffect } from 'react';
import { TerminalBlock, Provenance, SafetyTier } from '../types/zet';
import { ZET_ASCII_LOGO, ZET_SLOGAN, ZET_DESCRIPTOR } from '../data/zetData';
import { Terminal, ShieldAlert, Sparkles, Check, AlertOctagon, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface TerminalViewProps {
  blocks: TerminalBlock[];
  onExecuteCommand: (cmd: string) => void;
  onClear: () => void;
  onUndo: () => void;
  canUndo: boolean;
  selectedCommand?: string;
  activeShell: string;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  blocks,
  onExecuteCommand,
  onClear,
  onUndo,
  canUndo,
  selectedCommand,
  activeShell,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showAsciiBanner, setShowAsciiBanner] = useState(true);
  const [showHeroArt, setShowHeroArt] = useState(false);
  const [ghostSuggestion, setGhostSuggestion] = useState('');

  // T2 / T3 Gate Modals
  const [t2Pending, setT2Pending] = useState<{ command: string; diff: string } | null>(null);
  const [t3Pending, setT3Pending] = useState<{ command: string } | null>(null);
  const [t3ConfirmText, setT3ConfirmText] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ghost autocomplete suggestions
  const commonCommands = [
    'cargo test --workspace',
    'cargo check --workspace --all-targets',
    'cargo clippy --workspace --all-targets -- -D warnings',
    'git status',
    'git log -n 5 --oneline',
    'git diff',
    'zet blocks',
    'zet replay s-1729864800-4819',
    'zet journal',
    'zet undo',
    'zet update linux',
    'zet wipe tmp',
    'zet runs',
    'zet stats',
    'ls -la',
    'cat AGENTS.md',
    'cat README.md',
    'cat Cargo.toml',
    'hello',
    'clear',
    'help',
  ];

  useEffect(() => {
    if (selectedCommand) {
      setInputVal(selectedCommand);
      inputRef.current?.focus();
    }
  }, [selectedCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blocks, t2Pending, t3Pending]);

  // Handle typing & ghost suggestion
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim()) {
      const match = commonCommands.find((cmd) => cmd.startsWith(val) && cmd !== val);
      if (match) {
        setGhostSuggestion(match.slice(val.length));
      } else {
        setGhostSuggestion('');
      }
    } else {
      setGhostSuggestion('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab autocompletion
    if (e.key === 'Tab') {
      e.preventDefault();
      if (ghostSuggestion) {
        setInputVal((prev) => prev + ghostSuggestion);
        setGhostSuggestion('');
      }
      return;
    }

    // F12 Undo
    if (e.key === 'F12') {
      e.preventDefault();
      if (canUndo) {
        onUndo();
      }
      return;
    }

    // Enter submission
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (!trimmed) return;

      // Update history
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      // Check for Tier 2 gate
      if (trimmed === 'zet update linux' || trimmed.startsWith('git push') || trimmed.startsWith('rm -r')) {
        setT2Pending({
          command: trimmed === 'zet update linux' ? 'sudo apt update && sudo apt upgrade -y' : trimmed,
          diff: 'Updating core package repositories and kernel headers (19 packages)',
        });
        setInputVal('');
        setGhostSuggestion('');
        return;
      }

      // Check for Tier 3 gate
      if (trimmed === 'zet wipe tmp' || trimmed.includes('rm -rf /') || trimmed.includes('wipe')) {
        setT3Pending({
          command: 'sudo rm -rf /tmp/*',
        });
        setInputVal('');
        setGhostSuggestion('');
        return;
      }

      if (trimmed === 'clear') {
        onClear();
      } else {
        onExecuteCommand(trimmed);
      }

      setInputVal('');
      setGhostSuggestion('');
      return;
    }

    // Arrow Up / Down for history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
      setGhostSuggestion('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
      setGhostSuggestion('');
    }
  };

  const handleT2Approve = () => {
    if (t2Pending) {
      onExecuteCommand(t2Pending.command);
      setT2Pending(null);
    }
  };

  const handleT2Reject = () => {
    setT2Pending(null);
  };

  const handleT3Approve = () => {
    if (t3Pending && t3ConfirmText.trim() === t3Pending.command) {
      onExecuteCommand(t3Pending.command);
      setT3Pending(null);
      setT3ConfirmText('');
    }
  };

  const handleT3Reject = () => {
    setT3Pending(null);
    setT3ConfirmText('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-1 bg-[#0a101a] flex flex-col h-full overflow-hidden font-mono text-[13px] relative cursor-text select-text"
    >
      {/* Top Banner & Control Affordance */}
      <div className="bg-[#0c121c] px-4 py-2 border-b border-[#1d2a3c] flex items-center justify-between text-xs text-[#8b9cad] select-none">
        <div className="flex items-center gap-3">
          <span className="text-[#58e5ce] font-bold">ZET Terminal</span>
          <span className="text-[#5c6f84]">|</span>
          <span className="text-[#8b9cad] text-[11px]">{activeShell} (OSC 133 integration)</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            onClick={() => setShowAsciiBanner(!showAsciiBanner)}
            className="hover:text-[#58e5ce] transition-colors"
          >
            {showAsciiBanner ? 'Hide ASCII Logo' : 'Show ASCII Logo'}
          </button>
          <span className="text-[#1d2a3c]">|</span>
          <button
            onClick={() => setShowHeroArt(!showHeroArt)}
            className="flex items-center gap-1 hover:text-[#58e5ce] transition-colors"
          >
            <ImageIcon className="w-3 h-3 text-[#f6c478]" />
            <span>Brand Hero</span>
          </button>
          <span className="text-[#1d2a3c]">|</span>
          <button
            onClick={onClear}
            className="hover:text-[#ef8f94] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* P2-B ASCII Logo Banner */}
        {showAsciiBanner && (
          <div className="border border-[#1d2a3c] rounded-lg p-3 bg-[#070b12]/80 space-y-1">
            <pre className="text-[#58e5ce] text-[11px] leading-tight select-none font-bold">
              {ZET_ASCII_LOGO}
            </pre>
            <div className="flex items-center justify-between pt-1 border-t border-[#162232] text-[11px]">
              <span className="text-[#e8eff7] font-semibold">{ZET_SLOGAN}</span>
              <span className="text-[#58e5ce] font-mono">{ZET_DESCRIPTOR}</span>
            </div>
            <div className="text-[10px] text-[#5c6f84] flex items-center justify-between pt-0.5">
              <span>Native Rust + wgpu · Linux-first · Strict Provenance</span>
              <span>Type <code className="text-[#f6c478]">help</code> or run <code className="text-[#f6c478]">cargo test</code></span>
            </div>
          </div>
        )}

        {/* Brand Hero Artwork Drawer */}
        {showHeroArt && (
          <div className="border border-[#1d2a3c] rounded-lg overflow-hidden bg-[#070b12] p-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8b9cad] px-1">
              <span className="font-semibold text-[#e8eff7]">Primary Brand Artwork (Planetary Horizon)</span>
              <button onClick={() => setShowHeroArt(false)} className="text-[#5c6f84] hover:text-[#ef8f94]">✕</button>
            </div>
            <img
              src="/zet-hero.png"
              alt="ZET Hero"
              className="w-full max-h-56 object-cover rounded border border-[#1d2a3c]"
            />
            <div className="text-[10px] text-[#5c6f84] text-center">
              Owner-selected primary brand artwork. Concept illustration for ZET native flagship identity.
            </div>
          </div>
        )}

        {/* Terminal Blocks */}
        {blocks.map((block) => (
          <div key={block.id} className="space-y-1">
            {/* Block Metadata row (OSC 133 boundary) */}
            <div className="flex items-center gap-3 text-[10px] text-[#5c6f84] select-none">
              <span className="text-[#8b9cad] font-mono">#{block.index.toString().padStart(2, '0')}</span>
              <span
                className={`font-semibold font-mono ${
                  block.exitCode === 0 ? 'text-[#83d9a5]' : 'text-[#ef8f94]'
                }`}
              >
                exit {block.exitCode}
              </span>
              <span>{block.timestamp}</span>
              <span>· {block.durationMs}ms</span>
              {block.tier && (
                <span className="text-[#f6c478] bg-[#f6c478]/10 px-1 rounded font-mono">
                  {block.tier}
                </span>
              )}
              {block.provenance && (
                <span className="text-[#83d9a5] bg-[#83d9a5]/10 px-1 rounded font-mono text-[9px]">
                  {block.provenance}
                </span>
              )}
            </div>

            {/* Command Line */}
            <div className="flex items-center gap-2 text-[#e8eff7]">
              <span className="text-[#58e5ce] select-none">~/zet ❯</span>
              <span className="font-semibold">{block.command}</span>
            </div>

            {/* Output */}
            {block.output && (
              <pre className="text-[#8b9cad] whitespace-pre-wrap pl-6 leading-relaxed text-[12px] font-mono select-text bg-[#070b12]/40 p-2 rounded border border-[#162232]/60">
                {block.output}
              </pre>
            )}

            {/* Agent Notice if present */}
            {block.agentTurn && (
              <div className="pl-6 text-[#58e5ce] text-[11px] flex items-center gap-1.5 pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#58e5ce]" />
                <span>agent: Outcome verified. Checked against Rust workspace gates.</span>
              </div>
            )}
          </div>
        ))}

        {/* T2 Risky Gate Card */}
        {t2Pending && (
          <div className="my-3 p-3 bg-[#121c2a] border border-[#f6c478] rounded-lg max-w-xl space-y-2.5">
            <div className="flex items-center gap-2 text-[#f6c478] text-[11px] font-bold tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#f6c478]" />
              <span>T2 · RISKY COMMAND REVIEW (Spec §6.4)</span>
            </div>
            <p className="text-[12px] text-[#e8eff7]">
              Command will perform system updates or package mutations:
            </p>
            <div className="bg-[#070b12] p-2 rounded border border-[#1d2a3c] text-[11px] text-[#f6c478] font-mono">
              ❯ {t2Pending.command}
            </div>
            <div className="text-[10px] text-[#8b9cad] bg-[#070b12]/50 p-1.5 rounded">
              <span className="text-[#5c6f84]">Diff / impact:</span> {t2Pending.diff}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleT2Approve}
                className="bg-[#1f5c4f] hover:bg-[#256e5f] text-[#e6fff7] px-3 py-1 rounded text-[11px] font-semibold border border-[#3a9586] transition-colors"
              >
                Approve & Run (T2)
              </button>
              <button
                onClick={handleT2Reject}
                className="bg-[#1b2635] hover:bg-[#2c3c50] text-[#8b9cad] px-3 py-1 rounded text-[11px] border border-[#3a4a5c] transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* T3 Critical Gate Card */}
        {t3Pending && (
          <div className="my-3 p-3 bg-[#171307] border border-[#ef8f94] rounded-lg max-w-xl space-y-2.5">
            <div className="flex items-center gap-2 text-[#ef8f94] text-[11px] font-bold tracking-wider">
              <AlertOctagon className="w-4 h-4 text-[#ef8f94]" />
              <span>T3 · CRITICAL GATE — TYPE TO CONFIRM</span>
            </div>
            <p className="text-[12px] text-[#e8eff7]">
              Destructive action requested. You must type the exact command to execute:
            </p>
            <div className="bg-[#070b12] p-2 rounded border border-[#ef8f94]/40 text-[11px] text-[#ef8f94] font-mono">
              {t3Pending.command}
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={t3ConfirmText}
                onChange={(e) => setT3ConfirmText(e.target.value)}
                placeholder={`Type "${t3Pending.command}" to confirm`}
                className="w-full bg-[#0a101a] border border-[#5c4f33] rounded px-2.5 py-1 text-xs text-[#e8eff7] outline-none focus:border-[#ef8f94]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleT3Approve}
                disabled={t3ConfirmText.trim() !== t3Pending.command}
                className={`px-3 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  t3ConfirmText.trim() === t3Pending.command
                    ? 'bg-[#8b2635] text-[#ffebee] border-[#ef8f94] cursor-pointer'
                    : 'bg-[#2c2020] text-[#705555] border-[#443333] cursor-not-allowed'
                }`}
              >
                Confirm Critical Execution
              </button>
              <button
                onClick={handleT3Reject}
                className="bg-[#1b2635] hover:bg-[#2c3c50] text-[#8b9cad] px-3 py-1 rounded text-[11px] border border-[#3a4a5c] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Prompt Input Line */}
        <div className="flex items-center gap-2 relative pt-1">
          <span className="text-[#58e5ce] select-none font-semibold">~/zet ❯</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-[#e8eff7] font-mono text-[13px] p-0 caret-[#58e5ce]"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {/* Ghost suggestion overlay */}
            {ghostSuggestion && (
              <span className="absolute left-[var(--ghost-left,0)] text-[#3d5266] pointer-events-none select-none">
                <span className="invisible">{inputVal}</span>
                {ghostSuggestion}
              </span>
            )}
          </div>
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Bar */}
      <div className="bg-[#070b12] border-t border-[#1d2a3c] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#5c6f84] select-none">
        <div className="flex items-center gap-4">
          <span className="text-[#83d9a5] flex items-center gap-1">
            <Check className="w-3 h-3" /> PTY Ready
          </span>
          <span>⎇ master</span>
          <span>{blocks.length} blocks recorded</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Tab: ghost complete</span>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 transition-colors ${
              canUndo ? 'text-[#f6c478] hover:underline cursor-pointer' : 'text-[#3d5266] cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>F12 undo</span>
          </button>
          <span className="text-[#58e5ce]">Ctrl+G agent</span>
        </div>
      </div>
    </div>
  );
};
