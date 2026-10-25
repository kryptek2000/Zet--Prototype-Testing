import React, { useState, useEffect } from 'react';
import {
  LayoutMode,
  SessionRow,
  CommandRow,
  TerminalBlock,
  JournalEntry,
  Checkpoint,
  EvidenceNode,
  CIReceipt,
} from './types/zet';
import {
  INITIAL_SESSIONS,
  INITIAL_BLOCKS,
  INITIAL_COMMAND_ROWS,
  INITIAL_JOURNAL,
  INITIAL_CHECKPOINTS,
  INITIAL_EVIDENCE_GRAPH,
  INITIAL_RECEIPT,
} from './data/zetData';
import { HeaderBar } from './components/HeaderBar';
import { MissionRail } from './components/MissionRail';
import { TerminalView } from './components/TerminalView';
import { ContextInspector } from './components/ContextInspector';
import { CrateBrowser } from './components/CrateBrowser';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { RoadmapDocsViewer } from './components/RoadmapDocsViewer';
import { ScenariosBar } from './components/ScenariosBar';

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('MissionControl');
  const [activeView, setActiveView] = useState<'terminal' | 'crates' | 'architecture' | 'docs'>('terminal');

  // Multi-tab support
  const [tabs, setTabs] = useState([
    { id: 1, title: 'tab 1 · bash', shell: '/bin/bash', exitCode: 0 },
    { id: 2, title: 'tab 2 · zsh', shell: '/bin/zsh', exitCode: 0 },
  ]);
  const [activeTab, setActiveTab] = useState(1);

  // Data states
  const [sessions, setSessions] = useState<SessionRow[]>(INITIAL_SESSIONS);
  const [commands, setCommands] = useState<CommandRow[]>(INITIAL_COMMAND_ROWS);
  const [blocks, setBlocks] = useState<TerminalBlock[]>(INITIAL_BLOCKS);
  const [journal, setJournal] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(INITIAL_CHECKPOINTS);
  const [evidenceGraph, setEvidenceGraph] = useState<EvidenceNode[]>(INITIAL_EVIDENCE_GRAPH);
  const [receipt] = useState<CIReceipt>(INITIAL_RECEIPT);

  // Panels collapse toggles
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);

  const [selectedCommand, setSelectedCommand] = useState<string | undefined>();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+1: Focus
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        setLayoutMode('TerminalFocus');
      }
      // Ctrl+2: Workspace
      if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        setLayoutMode('Workspace');
      }
      // Ctrl+3: Mission Control
      if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        setLayoutMode('MissionControl');
      }
      // F12: Undo
      if (e.key === 'F12') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [checkpoints]);

  // Tab management
  const handleAddTab = () => {
    const nextId = tabs.length > 0 ? Math.max(...tabs.map((t) => t.id)) + 1 : 1;
    setTabs((prev) => [...prev, { id: nextId, title: `tab ${nextId} · bash`, shell: '/bin/bash', exitCode: 0 }]);
    setActiveTab(nextId);
  };

  const handleCloseTab = (id: number) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTab === id) {
      setActiveTab(remaining[0].id);
    }
  };

  // Command Execution Engine
  const handleExecuteCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const trimmed = cmd.trim();

    let output = '';
    let exitCode = 0;
    let durationMs = Math.floor(Math.random() * 8) + 2;
    let isAgent = false;

    // Command handlers
    if (trimmed === 'help' || trimmed === '?') {
      output = `ZET — The Outcome-Aware Terminal (Built v0.1.0)
Commands available:
  cargo check                  Run workspace typecheck (all targets)
  cargo test                   Run 12 crates test suite (including text blit ascent)
  cargo clippy                 Run clippy lint gate with -D warnings
  cargo fmt                    Check code formatting across crates
  git status                   Show git working tree and commit status
  git log                      Show recent ZET repository commits
  git diff                     Show current workspace diffs
  zet blocks                   Inspect recorded SQLite blocks
  zet replay <session>         Replay session transcript byte-for-byte
  zet journal                  Display agent audit journal & tier approvals
  zet undo                     One-key rollback of last checkpoint (F12)
  zet runs                     Show active background runs
  zet stats                    Display model token consumption & gateway metrics
  zet update linux             Test T2 risky command approval flow
  zet wipe tmp                 Test T3 critical type-to-confirm safety gate
  ls -la                       List repository files and crate structure
  cat <file>                   Read any file in the workspace
  clear                        Clear terminal screen
  hello                        Inline conversational turn (answered in grid)`;
    } else if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'dir') {
      output = `total 151
drwxr-xr-x 1 root root    400 Oct 25 14:02 .
drwxr-xr-x 1 root root     80 Oct 25 14:00 ..
-rw-r--r-- 1 root root   6485 Oct 25 14:02 AGENTS.md
-rw-r--r-- 1 root root 119344 Oct 25 14:02 Cargo.lock
-rw-r--r-- 1 root root    372 Oct 25 14:02 Cargo.toml
drwxr-xr-x 1 root root    280 Oct 25 14:02 crates/
drwxr-xr-x 1 root root    160 Oct 25 14:02 docs/
-rw-r--r-- 1 root root   1068 Oct 25 14:02 LICENSE
-rw-r--r-- 1 root root   5232 Oct 25 14:02 README.md
drwxr-xr-x 1 root root     80 Oct 25 14:02 shell/
-rw-r--r-- 1 root root  14063 Oct 25 14:02 zet-architecture.html`;
    } else if (trimmed.startsWith('cat ')) {
      const file = trimmed.replace('cat ', '').trim();
      if (file === 'AGENTS.md') {
        output = `CURRENT PRODUCT AUTHORITY (2026-10-22): ZET — The Outcome-Aware Terminal
Build an evidence-connected native terminal and Mission Control, not another Hermes/OpenClaw.
Release gates: startup <300ms, input <3ms, idle RSS <100MB, cat 100k <0.9s.
Safety tiers: T0 read (auto), T1 low-write (auto in repo), T2 risky (ask+diff), T3 critical (type-to-confirm).`;
      } else if (file === 'Cargo.toml') {
        output = `[workspace]
members = [
    "crates/zet",
    "crates/zet-agent",
    "crates/zet-blocks",
    "crates/zet-context",
    "crates/zet-daemon",
    "crates/zet-gpu",
    "crates/zet-mcp",
    "crates/zet-models",
    "crates/zet-policy",
    "crates/zet-pty",
    "crates/zet-suggest",
    "crates/zet-term",
]
resolver = "2"`;
      } else if (file === 'README.md') {
        output = `# ZET — The Outcome-Aware Terminal
Old-school roots. Next-generation intelligence.
A native Linux-first terminal connecting commands, development work, and verifiable outcomes.
Real terminal integrity first · Local-first BYOM · Honest provenance.`;
      } else {
        output = `File ${file} (read via local filesystem context).`;
      }
    } else if (trimmed.startsWith('git status')) {
      output = `On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
	modified:   docs/ROADMAP.md (tracking P2-A Slice 5 Inspector)

no changes added to commit (use "git add" to save changes)`;
    } else if (trimmed.startsWith('git log')) {
      output = `d9bca1b (HEAD -> master, origin/master) Merge pull request #33 from kryptek2000/docs/readme-post-brand-merge-links
19a4d97 docs(readme): link merged ASCII identity spec accurately
6ad676d Merge pull request #32 from kryptek2000/docs/zet-og-brand-readme-20261025
3f4b834 Merge pull request #31 from kryptek2000/docs/p2b-zet-ascii-identity
f40a8b3 Merge pull request #30 from kryptek2000/fix/wayland-clipboard-paste
c6d97aa Merge pull request #28 from kryptek2000/feat/p2a-slice-4b-mission-rail`;
    } else if (trimmed.startsWith('git diff')) {
      output = `diff --git a/docs/ROADMAP.md b/docs/ROADMAP.md
--- a/docs/ROADMAP.md
+++ b/docs/ROADMAP.md
@@ -48,6 +48,7 @@ Exit: playable Linux native prototype with focused tests.
 ### P2-A — Native Vertical Slices
 - [x] Slice 4B: Mission Rail integration over real PTY sessions
+- [ ] Slice 5: Contextual Inspector with Evidence Graph & Receipts`;
    } else if (trimmed === 'cargo check' || trimmed.startsWith('cargo check')) {
      durationMs = 280;
      output = `    Checking zet-term v0.1.0 (/app/applet/crates/zet-term)
    Checking zet-pty v0.1.0 (/app/applet/crates/zet-pty)
    Checking zet-gpu v0.1.0 (/app/applet/crates/zet-gpu)
    Checking zet-blocks v0.1.0 (/app/applet/crates/zet-blocks)
    Checking zet-agent v0.1.0 (/app/applet/crates/zet-agent)
    Checking zet-policy v0.1.0 (/app/applet/crates/zet-policy)
    Checking zet v0.1.0 (/app/applet/crates/zet)
    Finished \`dev\` profile [unoptimized + debuginfo] in 0.28s`;
    } else if (trimmed === 'cargo test' || trimmed.startsWith('cargo test')) {
      durationMs = 460;
      output = `   Compiling zet-gpu v0.1.0 (/app/applet/crates/zet-gpu)
   Compiling zet v0.1.0 (/app/applet/crates/zet)
    Finished test target(s) in 0.46s
     Running tests/text.rs (target/debug/deps/text)
test blit_preserves_caps_and_descenders ... ok
test text_ascent_and_sidebearing_alignment ... ok
test glyph_atlas_cache_hit_ratio ... ok
test zero_width_joiner_handling ... ok
     Running tests/session.rs (target/debug/deps/session)
test pty_fork_exec_environment ... ok
test signal_forwarding_sigwinch ... ok
     Running tests/layout.rs (target/debug/deps/layout)
test layout_min_columns_preservation ... ok
test mission_rail_collapse_expand ... ok

test result: ok. 14 passed; 0 failed; 0 ignored; 0 filtered out`;
    } else if (trimmed.startsWith('cargo clippy')) {
      durationMs = 310;
      output = `    Checking zet-workspace v0.1.0 (/app/applet)
    Finished \`dev\` profile [unoptimized + debuginfo] in 0.31s (0 warnings)`;
    } else if (trimmed.startsWith('cargo fmt')) {
      durationMs = 85;
      output = `All Rust files formatted according to rustfmt rules.`;
    } else if (trimmed === 'zet blocks') {
      output = `[SQLite Store: ~/.local/share/zet/blocks.sqlite (14.2 KB)]
#1 [exit 0, 4ms]   git status
#2 [exit 0, 420ms] cargo test --workspace --test text
#3 [exit 0, 2ms]   zet blocks
Observed via OSC 133 semantic integration hooks. Secrets scrubbed.`;
    } else if (trimmed.startsWith('zet replay')) {
      output = `$ git status
On branch master
Your branch is up to date with 'origin/master'.
[exit 0, 4ms]
$ cargo test --workspace --test text
test result: ok. 4 passed; 0 failed
[exit 0, 420ms]
Transcript reproduced byte-for-byte.`;
    } else if (trimmed === 'zet journal') {
      output = `#1 [T1 exit 0] git rebase --onto master origin/feat/p2a-slice-4b-mission-rail
  Successfully rebased and updated refs/heads/feat/p2a-slice-4b-mission-rail.
#2 [T2 exit 0] sudo apt update && sudo apt upgrade -y
  Hit:1 http://archive.ubuntu.com noble InRelease
  19 packages upgraded.
recent commands:
#1 [exit 0] git status
#2 [exit 0] cargo test --workspace --test text`;
    } else if (trimmed === 'zet undo') {
      handleUndo();
      return;
    } else if (trimmed === 'zet runs') {
      output = `no background runs active`;
    } else if (trimmed === 'zet stats') {
      output = `ZET Gateway Metrics (BYOK / Local):
  openrouter:laguna-s-2.1:free: 8 calls, ~640 in / ~120 out tokens
  Local inline completions: 14 cache hits (<1ms), avg latency 1.8ms`;
    } else if (trimmed.includes('sudo apt update') || trimmed === 'zet update linux') {
      durationMs = 820;
      output = `Hit:1 http://archive.ubuntu.com noble InRelease
Get:2 http://security.ubuntu.com noble-security InRelease [126 kB]
Fetched 126 kB in 0.8s (152 kB/s)
Reading package lists... Done
Building dependency tree... Done
19 packages can be upgraded. Run 'apt list --upgradable' to see them.
agent turn · T2 · journaled · F12 undoes`;
      isAgent = true;
    } else if (trimmed.includes('sudo rm -rf /tmp/*') || trimmed === 'zet wipe tmp') {
      output = `[T3 CONFIRMED] Cleaned /tmp/* temporary directory (0 files remaining).
Checkpoint snapshot recorded in journal: cp-wipe-tmp.`;
      isAgent = true;
    } else if (trimmed === 'hello') {
      output = `agent: Hey! Tell me what to run or what to build. Real terminal is ready.`;
      isAgent = true;
    } else {
      // General agent response / command simulation
      output = `[ZET] Executed "${trimmed}" (exit 0). Recorded in SQLite block store.`;
    }

    const nextIndex = blocks.length + 1;
    const blockId = `blk-${nextIndex}`;

    const newBlock: TerminalBlock = {
      id: blockId,
      index: nextIndex,
      command: trimmed,
      output,
      exitCode,
      durationMs,
      timestamp,
      provenance: 'Observed',
      agentTurn: isAgent,
    };

    setBlocks((prev) => [...prev, newBlock]);

    // Update command row in mission rail
    const newCmdRow: CommandRow = {
      id: `cmd-${nextIndex}`,
      sessionId: 's-1729864800-4819',
      command: trimmed,
      exitCode,
      durationMs,
      provenance: 'Observed',
      timestamp,
      cwd: '~/zet',
      gitBranch: 'master',
    };
    setCommands((prev) => [newCmdRow, ...prev]);
  };

  const handleClear = () => {
    setBlocks([]);
  };

  // Undo implementation
  const handleUndo = () => {
    if (checkpoints.length === 0) {
      handleExecuteCommand('echo "nothing to undo"');
      return;
    }

    const lastCp = checkpoints[0];
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Remove last checkpoint
    setCheckpoints((prev) => prev.slice(1));

    // Record block
    const nextIndex = blocks.length + 1;
    const undoBlock: TerminalBlock = {
      id: `blk-${nextIndex}`,
      index: nextIndex,
      command: 'zet undo (F12)',
      output: `[ONE-KEY UNDO F12] Reverted checkpoint ${lastCp.id}
Restored files:
  ${lastCp.filesChanged.join('\n  ')}
Working tree restored to pristine state.`,
      exitCode: 0,
      durationMs: 3,
      timestamp,
      provenance: 'Observed',
      agentTurn: true,
    };
    setBlocks((prev) => [...prev, undoBlock]);
  };

  // Run Signature Scenarios from docs/zet-vision.html
  const handleRunScenario = (scenario: 'hello' | 'update' | 'danger') => {
    setActiveScenario(scenario);
    if (scenario === 'hello') {
      handleExecuteCommand('hello');
    } else if (scenario === 'update') {
      handleExecuteCommand('zet update linux');
    } else if (scenario === 'danger') {
      handleExecuteCommand('zet wipe tmp');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b12] text-[#e8eff7] overflow-hidden select-none">
      {/* 1. Header Bar: Window controls, Main view tabs, Active model, Layout switcher */}
      <HeaderBar
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        activeView={activeView}
        setActiveView={setActiveView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
      />

      {/* 2. Scenarios Bar (when on Terminal view) */}
      {activeView === 'terminal' && (
        <ScenariosBar
          onRunScenario={handleRunScenario}
          activeScenario={activeScenario}
        />
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* VIEW 1: TERMINAL / MISSION CONTROL */}
        {activeView === 'terminal' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Left: Collapsible Mission Rail (visible in Workspace & MissionControl) */}
            {layoutMode !== 'TerminalFocus' && (
              <MissionRail
                sessions={sessions}
                commands={commands}
                activeSessionId="s-1729864800-4819"
                onSelectSession={(id) => {
                  setSelectedCommand(`zet replay ${id}`);
                }}
                collapsed={railCollapsed}
                onToggleCollapse={() => setRailCollapsed(!railCollapsed)}
                onSelectCommand={(cmd) => setSelectedCommand(cmd)}
              />
            )}

            {/* Center: The Outcome-Aware Terminal */}
            <TerminalView
              blocks={blocks}
              onExecuteCommand={handleExecuteCommand}
              onClear={handleClear}
              onUndo={handleUndo}
              canUndo={checkpoints.length > 0}
              selectedCommand={selectedCommand}
              activeShell={tabs.find((t) => t.id === activeTab)?.shell || '/bin/bash'}
            />

            {/* Right: Contextual Inspector (visible only in MissionControl) */}
            {layoutMode === 'MissionControl' && (
              <ContextInspector
                evidenceGraph={evidenceGraph}
                checkpoints={checkpoints}
                journal={journal}
                receipt={receipt}
                onUndoCheckpoint={(cpId) => handleUndo()}
                collapsed={inspectorCollapsed}
                onToggleCollapse={() => setInspectorCollapsed(!inspectorCollapsed)}
              />
            )}
          </div>
        )}

        {/* VIEW 2: CRATE CODEBASE EXPLORER */}
        {activeView === 'crates' && <CrateBrowser />}

        {/* VIEW 3: ARCHITECTURE SVG EXPLORER */}
        {activeView === 'architecture' && <ArchitectureViewer />}

        {/* VIEW 4: ROADMAP, CHARTER & SPECS */}
        {activeView === 'docs' && <RoadmapDocsViewer />}
      </main>
    </div>
  );
}
