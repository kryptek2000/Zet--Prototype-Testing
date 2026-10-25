import {
  SessionRow,
  CommandRow,
  TerminalBlock,
  JournalEntry,
  Checkpoint,
  EvidenceNode,
  CIReceipt,
  CrateInfo,
} from '../types/zet';

export const ZET_ASCII_LOGO = `
 ████████╗███████╗████████╗
 ╚══██╔══╝██╔════╝╚══██╔══╝
    ██║   █████╗     ██║   
    ██║   ██╔══╝     ██║   
    ██║   ███████╗   ██║   
    ╚═╝   ╚══════╝   ╚═╝   
`;

export const ZET_SLOGAN = "Old-school roots. Next-generation intelligence.";
export const ZET_DESCRIPTOR = "The Outcome-Aware Terminal";

export const INITIAL_SESSIONS: SessionRow[] = [
  {
    index: 1,
    id: 's-1729864800-4819',
    cwdTail: '~/zet',
    shell: '/bin/bash',
    state: 'idle',
    exitCode: 0,
    provenance: 'Observed',
  },
  {
    index: 2,
    id: 's-1729865100-5102',
    cwdTail: '~/zet/crates/zet-gpu',
    shell: '/bin/zsh',
    state: 'idle',
    exitCode: 0,
    provenance: 'Observed',
  },
];

export const INITIAL_BLOCKS: TerminalBlock[] = [
  {
    id: 'blk-1',
    index: 1,
    command: 'git status',
    output: `On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   docs/ROADMAP.md (tracking P2-A Slice 5 Inspector)

no changes added to commit (use "git add" to save changes)`,
    exitCode: 0,
    durationMs: 4,
    timestamp: '21:52:03',
    provenance: 'Observed',
  },
  {
    id: 'blk-2',
    index: 2,
    command: 'cargo test --workspace --test text',
    output: `   Compiling zet-gpu v0.1.0 (/app/applet/crates/zet-gpu)
    Finished test [unoptimized + debuginfo] target(s) in 0.42s
     Running tests/text.rs (target/debug/deps/text-39a7b1b)

running 4 tests
test blit_preserves_caps_and_descenders ... ok
test text_ascent_and_sidebearing_alignment ... ok
test glyph_atlas_cache_hit_ratio ... ok
test zero_width_joiner_handling ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out`,
    exitCode: 0,
    durationMs: 420,
    timestamp: '21:52:45',
    provenance: 'Observed',
  },
  {
    id: 'blk-3',
    index: 3,
    command: 'zet blocks',
    output: `[SQLite Store: ~/.local/share/zet/blocks.sqlite (14.2 KB)]
#1 [exit 0, 4ms]  git status (cwd: ~/zet, branch: master)
#2 [exit 0, 420ms] cargo test --workspace --test text (cwd: ~/zet, branch: master)
All entries recorded via OSC 133 integration hooks. Secrets scrubbed.`,
    exitCode: 0,
    durationMs: 2,
    timestamp: '21:53:12',
    provenance: 'Observed',
  },
];

export const INITIAL_COMMAND_ROWS: CommandRow[] = [
  {
    id: 'cmd-1',
    sessionId: 's-1729864800-4819',
    command: 'git status',
    exitCode: 0,
    durationMs: 4,
    provenance: 'Observed',
    timestamp: '21:52:03',
    cwd: '~/zet',
    gitBranch: 'master',
  },
  {
    id: 'cmd-2',
    sessionId: 's-1729864800-4819',
    command: 'cargo test --workspace --test text',
    exitCode: 0,
    durationMs: 420,
    provenance: 'Observed',
    timestamp: '21:52:45',
    cwd: '~/zet',
    gitBranch: 'master',
  },
  {
    id: 'cmd-3',
    sessionId: 's-1729864800-4819',
    command: 'zet blocks',
    exitCode: 0,
    durationMs: 2,
    provenance: 'Observed',
    timestamp: '21:53:12',
    cwd: '~/zet',
    gitBranch: 'master',
  },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 1,
    tier: 'T1',
    command: 'git rebase --onto master origin/feat/p2a-slice-4b-mission-rail',
    approved: true,
    executed: true,
    exitCode: 0,
    output: 'Successfully rebased and updated refs/heads/feat/p2a-slice-4b-mission-rail.',
    checkpoint: 'cp-rebase-4b',
    provenance: 'Observed',
    timestamp: '21:40:11',
  },
  {
    id: 2,
    tier: 'T2',
    command: 'sudo apt update && sudo apt upgrade -y',
    approved: true,
    executed: true,
    exitCode: 0,
    output: 'Hit:1 http://archive.ubuntu.com noble InRelease\n19 packages can be upgraded.\nUpdated linux kernel headers, wayland-protocols-1.34.',
    checkpoint: 'cp-apt-pkg',
    provenance: 'Observed',
    timestamp: '21:48:20',
  },
];

export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-p2a-slice4b',
    timestamp: '21:40:11',
    description: 'Pre-mutation checkpoint: Slice 4B Mission Rail integration',
    filesChanged: [
      'crates/zet/src/window/layout.rs',
      'crates/zet/src/window/panels.rs',
      'crates/zet/src/window/mod.rs',
    ],
    diff: `--- a/crates/zet/src/window/layout.rs
+++ b/crates/zet/src/window/layout.rs
@@ -10,6 +10,14 @@ pub const RAIL_COLS: u32 = 24;
 pub const INSPECTOR_COLS: u32 = 32;
+pub const MIN_TERM_COLS: u32 = 40;
+pub const MIN_TERM_ROWS: u32 = 10;`,
    canUndo: true,
  },
  {
    id: 'cp-wayland-paste',
    timestamp: '20:15:00',
    description: 'Pre-mutation checkpoint: Wayland clipboard paste fix (#30)',
    filesChanged: ['crates/zet-gpu/src/input.rs'],
    diff: `--- a/crates/zet-gpu/src/input.rs
+++ b/crates/zet-gpu/src/input.rs
@@ -45,6 +45,9 @@ pub fn handle_paste(clip: &str) -> Vec<u8> {
+    // Bracketed paste escape sequences for xterm compatibility
+    let mut out = b"\x1b[200~".to_vec();
+    out.extend_from_slice(clip.as_bytes());
+    out.extend_from_slice(b"\x1b[201~");
+    out`,
    canUndo: true,
  },
];

export const INITIAL_EVIDENCE_GRAPH: EvidenceNode[] = [
  {
    id: 'ev-1',
    type: 'failure',
    title: 'Text ascent bug in zet-gpu (PR #13)',
    detail: 'crates/zet-gpu/tests/text.rs:54 (blit_preserves_caps_and_descenders) cap pixels clipped',
    provenance: 'Observed',
    status: 'verified',
    timestamp: '2026-10-22 14:10',
  },
  {
    id: 'ev-2',
    type: 'investigation',
    title: 'Beam independent audit of viewport coordinates',
    detail: 'draw_search offset both X and Y and clip to terminal viewport bounds before implementation.',
    provenance: 'Observed',
    status: 'verified',
    timestamp: '2026-10-23 09:30',
  },
  {
    id: 'ev-3',
    type: 'mutation',
    title: 'Merged PR #28 (Slice 4B Mission Rail)',
    detail: 'crates/zet/src/window/panels.rs and layout.rs: native collapsible Mission Rail with provenance.',
    provenance: 'Observed',
    status: 'verified',
    timestamp: '2026-10-24 16:45',
  },
  {
    id: 'ev-4',
    type: 'receipt',
    title: 'Exact CI Receipt (Run 39717777114)',
    detail: 'Commit 166c204 on master: fmt (pass), check (pass), clippy (pass), tests (pass).',
    provenance: 'Observed',
    status: 'verified',
    timestamp: '2026-10-25 04:00',
  },
];

export const INITIAL_RECEIPT: CIReceipt = {
  commitHash: 'd9bca1b',
  branch: 'master',
  workflow: 'ci.yml',
  status: 'pass',
  runId: '39717777114',
  gates: {
    fmt: true,
    check: true,
    clippy: true,
    test: true,
  },
  metrics: {
    startupMs: 184, // gate < 300ms
    inputLatencyMs: 1.8, // gate < 3.0ms
    idleRssMb: 42, // gate < 100MB
    cat100kSec: 0.61, // gate < 0.9s
  },
};

export const ZET_CRATES: CrateInfo[] = [
  {
    name: 'zet',
    version: '0.1.0',
    role: 'Composition Root & Binary',
    status: 'implemented',
    description: 'Composition root, native window entry, tabs, mode dispatch, and Mission Control chrome.',
    files: [
      'crates/zet/src/main.rs',
      'crates/zet/src/lib.rs',
      'crates/zet/src/mode.rs',
      'crates/zet/src/window/mod.rs',
      'crates/zet/src/window/layout.rs',
      'crates/zet/src/window/panels.rs',
    ],
  },
  {
    name: 'zet-term',
    version: '0.1.0',
    role: 'VT Grid & Terminal Core',
    status: 'implemented',
    description: 'VT parser, grid cells, scrollback, alt-screen, bracketed paste, search, reveal_row.',
    files: ['crates/zet-term/src/lib.rs'],
  },
  {
    name: 'zet-pty',
    version: '0.1.0',
    role: 'Local PTY & Shell Management',
    status: 'implemented',
    description: 'Local fork/exec PTY, shell spawning ($SHELL -i), resize, signals, non-blocking I/O.',
    files: ['crates/zet-pty/src/lib.rs', 'crates/zet-pty/src/shell.rs'],
  },
  {
    name: 'zet-gpu',
    version: '0.1.0',
    role: 'Pure wgpu Renderer & Glyph Atlas',
    status: 'implemented',
    description: 'GPU-accelerated terminal renderer, cosmic-text atlas, tinted quads, ghost overlay, selection.',
    files: [
      'crates/zet-gpu/src/lib.rs',
      'crates/zet-gpu/src/renderer.rs',
      'crates/zet-gpu/src/atlas.rs',
      'crates/zet-gpu/src/quad.rs',
      'crates/zet-gpu/src/text.rs',
      'crates/zet-gpu/src/input.rs',
    ],
  },
  {
    name: 'zet-blocks',
    version: '0.1.0',
    role: 'Observed Command Recorder & Store',
    status: 'implemented',
    description: 'SQLite command block store, OSC 133 parsing, durations, exit codes, secret scrubbing.',
    files: ['crates/zet-blocks/src/lib.rs', 'crates/zet-blocks/src/recorder.rs'],
  },
  {
    name: 'zet-context',
    version: '0.1.0',
    role: 'Git & Environment Context Gathering',
    status: 'partial',
    description: 'Gathers active git branch, dirty files, working directory, and scrubs sensitive secrets.',
    files: ['crates/zet-context/src/lib.rs'],
  },
  {
    name: 'zet-agent',
    version: '0.1.0',
    role: 'Outcome Planner, Executor & Verifier',
    status: 'implemented',
    description: 'Single-lane planner/executor/verifier, journal records, checkpoints, one-key undo.',
    files: ['crates/zet-agent/src/lib.rs', 'crates/zet-agent/src/journal.rs', 'crates/zet-agent/src/tools.rs'],
  },
  {
    name: 'zet-policy',
    version: '0.1.0',
    role: 'Tiered Safety Gates (T0–T3)',
    status: 'implemented',
    description: 'Rule-based safety tiers: T0 auto read, T1 low write, T2 risky ask+diff, T3 critical type-to-confirm.',
    files: ['crates/zet-policy/src/lib.rs'],
  },
  {
    name: 'zet-models',
    version: '0.1.0',
    role: 'Model Gateway & BYOK Routing',
    status: 'implemented',
    description: 'Gateway trait for OpenAI-compatible, Anthropic, or local model endpoints with token metering.',
    files: ['crates/zet-models/src/lib.rs'],
  },
  {
    name: 'zet-suggest',
    version: '0.1.0',
    role: 'Ghost Suggestions & Autocompletion',
    status: 'implemented',
    description: 'Inline ghost suggestions with fast local history lookup and sub-50ms latency target.',
    files: ['crates/zet-suggest/src/lib.rs'],
  },
  {
    name: 'zet-mcp',
    version: '0.1.0',
    role: 'Model Context Protocol & CLI Tools',
    status: 'partial',
    description: 'MCP client/server registry, stdio transport, external tool execution.',
    files: ['crates/zet-mcp/src/lib.rs'],
  },
  {
    name: 'zet-daemon',
    version: '0.1.0',
    role: 'Background Daemon & Notifications',
    status: 'planned',
    description: 'Background worker execution for long-running test suites and system notification dispatch.',
    files: ['crates/zet-daemon/src/lib.rs'],
  },
];
