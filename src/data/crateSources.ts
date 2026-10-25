/**
 * Source code inventory for the 12 ZET Rust crates.
 * Allows developers in Google AI Studio to explore, inspect, and continue building.
 */

export interface SourceFile {
  path: string;
  crate: string;
  language: string;
  content: string;
}

export const CRATE_SOURCES: Record<string, SourceFile> = {
  'crates/zet/src/main.rs': {
    path: 'crates/zet/src/main.rs',
    crate: 'zet',
    language: 'rust',
    content: `//! ZET composition root and CLI entry point.
//! Connects commands, development work, and verifiable outcomes.

use std::path::PathBuf;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let env = zet::mode::Env::current();
    let mode = zet::mode::plan(&args, &env);

    match mode {
        zet::mode::Mode::Cli => run_cli(&args),
        zet::mode::Mode::Window { goal } => {
            println!("Launching ZET Outcome-Aware Terminal window...");
            zet::run(goal);
        }
        zet::mode::Mode::Usage => {
            eprintln!("Usage: zet [COMMAND | --window | <goal>]");
            std::process::exit(2);
        }
    }
}

fn run_cli(args: &[String]) {
    let sub = args.first().map(String::as_str).unwrap_or("");
    match sub {
        "blocks" => println!("[SQLite Store: blocks.sqlite]"),
        "replay" => println!("Replaying session transcript..."),
        "journal" => println!("Journal audit log..."),
        "undo" => println!("Rolling back latest checkpoint..."),
        "runs" => println!("Active background runs..."),
        _ => eprintln!("Unknown CLI subcommand: {}", sub),
    }
}
`,
  },
  'crates/zet/src/mode.rs': {
    path: 'crates/zet/src/mode.rs',
    crate: 'zet',
    language: 'rust',
    content: `//! Argument parsing and mode planning (Window vs CLI).
//! First match wins:
//! 1. --help / --version -> CLI
//! 2. --window / --gui -> Window with tail goal
//! 3. Known CLI group -> CLI
//! 4. Internal arms -> CLI
//! 5. Bare zet -> Window
//! 6. Multi-word phrases -> Window with goal
//! 7. Single unknown word -> Usage (exit 2)

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Mode {
    Cli,
    Window { goal: Option<String> },
    Usage,
}

pub struct Env {
    pub display: bool,
    pub window_allowed: bool,
}

impl Env {
    pub fn current() -> Self {
        let display = std::env::var("DISPLAY").is_ok() || std::env::var("WAYLAND_DISPLAY").is_ok();
        let window_allowed = std::env::var("ZET_NO_WINDOW").is_err();
        Self { display, window_allowed }
    }

    pub fn can_open_window(&self) -> bool {
        self.display && self.window_allowed
    }
}
`,
  },
  'crates/zet/src/window/layout.rs': {
    path: 'crates/zet/src/window/layout.rs',
    crate: 'zet',
    language: 'rust',
    content: `//! Pure, deterministic layout resolution for the Mission Control chrome.
//! Transforms cell dimensions + visibility toggles into non-overlapping Viewports.

pub const RAIL_COLS: u32 = 24;
pub const INSPECTOR_COLS: u32 = 32;
pub const MIN_TERM_COLS: u32 = 40;
pub const MIN_TERM_ROWS: u32 = 10;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Layout {
    pub rail: bool,
    pub inspector: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LayoutMode {
    TerminalFocus,
    Workspace,
    MissionControl,
}

impl LayoutMode {
    pub fn layout(self) -> Layout {
        match self {
            Self::TerminalFocus => Layout { rail: false, inspector: false },
            Self::Workspace => Layout { rail: true, inspector: false },
            Self::MissionControl => Layout { rail: true, inspector: true },
        }
    }
}
`,
  },
  'crates/zet/src/window/panels.rs': {
    path: 'crates/zet/src/window/panels.rs',
    crate: 'zet',
    language: 'rust',
    content: `//! Mission Rail data model (Slice 4B).
//! Read-only view over real PTY sessions and observed commands.
//! Every row carries a provenance: Observed, Inferred, Unknown (—).

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Provenance {
    Observed,
    Inferred,
    Unknown,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SessionRow {
    pub index: usize,
    pub cwd_tail: String,
    pub shell: String,
    pub state: String,
    pub exit: String,
    pub provenance: Provenance,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommandRow {
    pub command: String,
    pub exit: String,
    pub duration: String,
    pub provenance: Provenance,
}
`,
  },
  'crates/zet-policy/src/lib.rs': {
    path: 'crates/zet-policy/src/lib.rs',
    crate: 'zet-policy',
    language: 'rust',
    content: `//! Tiered command policy: classify shell commands T0-T3.
//! Maps tiers to approval decisions: Auto, Ask, ConfirmType.

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Tier {
    T0, // Read-only: cat, ls, git status (auto)
    T1, // Low-write: file edit, git commit (auto in repo)
    T2, // Risky: git push, docker run, rm -rf (ask + diff)
    T3, // Critical: sudo, prod kubectl (type to confirm)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Approval {
    Auto,
    Ask,
    ConfirmType,
}

pub fn decide(tier: Tier, in_repo: bool) -> Approval {
    match tier {
        Tier::T0 => Approval::Auto,
        Tier::T1 if in_repo => Approval::Auto,
        Tier::T1 => Approval::Ask,
        Tier::T2 => Approval::Ask,
        Tier::T3 => Approval::ConfirmType,
    }
}
`,
  },
  'crates/zet-agent/src/lib.rs': {
    path: 'crates/zet-agent/src/lib.rs',
    crate: 'zet-agent',
    language: 'rust',
    content: `//! Single-lane agent: one shell step per model turn.
//! Every step gated by zet-policy tiers. Tool output is data,
//! never instructions (prompt-injection immune).

pub const SYSTEM_PROMPT: &str = "You are ZET, a terminal agent. Single lane: \\
request exactly ONE run_shell call per turn. Smallest step that advances \\
the goal. Read before writing. Never repeat a denied command.";
`,
  },
  'crates/zet-blocks/src/lib.rs': {
    path: 'crates/zet-blocks/src/lib.rs',
    crate: 'zet-blocks',
    language: 'rust',
    content: `//! Command block recording and SQLite storage.
//! Captures OSC 133 boundaries, exit codes, durations, git branch,
//! and scrubs sensitive credentials.

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Block {
    pub id: i64,
    pub session: String,
    pub command: String,
    pub output: String,
    pub exit_code: i32,
    pub cwd: String,
    pub git_branch: String,
    pub duration_ms: u64,
}
`,
  },
  'crates/zet-gpu/src/renderer.rs': {
    path: 'crates/zet-gpu/src/renderer.rs',
    crate: 'zet-gpu',
    language: 'rust',
    content: `//! Pure wgpu terminal renderer with cosmic-text glyph atlas.
//! Delivers <3ms key-to-pixel input latency and 120fps steady rendering.
`,
  },
};
