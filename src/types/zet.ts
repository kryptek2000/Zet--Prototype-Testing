/**
 * Core type definitions for ZET — The Outcome-Aware Terminal
 * Reflecting the architecture from Rust crates and Mission Control specs.
 */

export type LayoutMode = 'TerminalFocus' | 'Workspace' | 'MissionControl';

export type Provenance = 'Observed' | 'Inferred' | 'Unknown';

export type SafetyTier = 'T0' | 'T1' | 'T2' | 'T3';

export interface SessionRow {
  index: number;
  id: string;
  cwdTail: string;
  shell: string;
  state: 'idle' | 'running' | 'exited';
  exitCode: number;
  provenance: Provenance;
}

export interface CommandRow {
  id: string;
  sessionId: string;
  command: string;
  exitCode: number;
  durationMs: number;
  provenance: Provenance;
  timestamp: string;
  cwd: string;
  gitBranch: string;
}

export interface TerminalBlock {
  id: string;
  index: number;
  command: string;
  output: string;
  exitCode: number;
  durationMs: number;
  timestamp: string;
  tier?: SafetyTier;
  agentTurn?: boolean;
  provenance: Provenance;
  checkpointId?: string;
}

export interface JournalEntry {
  id: number;
  tier: SafetyTier;
  command: string;
  approved: boolean;
  executed: boolean;
  exitCode?: number;
  output: string;
  checkpoint?: string;
  provenance: Provenance;
  timestamp: string;
}

export interface Checkpoint {
  id: string;
  timestamp: string;
  description: string;
  filesChanged: string[];
  diff: string;
  canUndo: boolean;
}

export interface EvidenceNode {
  id: string;
  type: 'command' | 'failure' | 'investigation' | 'mutation' | 'receipt';
  title: string;
  detail: string;
  provenance: Provenance;
  status: 'verified' | 'failed' | 'pending' | 'observed';
  timestamp: string;
}

export interface CIReceipt {
  commitHash: string;
  branch: string;
  workflow: string;
  status: 'pass' | 'fail' | 'running';
  runId: string;
  gates: {
    fmt: boolean;
    check: boolean;
    clippy: boolean;
    test: boolean;
  };
  metrics: {
    startupMs: number;
    inputLatencyMs: number;
    idleRssMb: number;
    cat100kSec: number;
  };
}

export interface CrateInfo {
  name: string;
  version: string;
  role: string;
  status: 'implemented' | 'partial' | 'planned';
  description: string;
  files: string[];
}
