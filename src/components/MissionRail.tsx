import React from 'react';
import { SessionRow, CommandRow, Provenance } from '../types/zet';
import { GitBranch, Terminal, Clock, ShieldCheck, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface MissionRailProps {
  sessions: SessionRow[];
  commands: CommandRow[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectCommand: (cmd: string) => void;
}

export const MissionRail: React.FC<MissionRailProps> = ({
  sessions,
  commands,
  activeSessionId,
  onSelectSession,
  collapsed,
  onToggleCollapse,
  onSelectCommand,
}) => {
  const getProvenanceBadge = (prov: Provenance) => {
    switch (prov) {
      case 'Observed':
        return (
          <span className="text-[9px] px-1 py-0.2 bg-[#83d9a5]/10 text-[#83d9a5] border border-[#83d9a5]/20 rounded font-mono">
            Observed
          </span>
        );
      case 'Inferred':
        return (
          <span className="text-[9px] px-1 py-0.2 bg-[#f6c478]/10 text-[#f6c478] border border-[#f6c478]/20 rounded font-mono">
            Inferred
          </span>
        );
      default:
        return (
          <span className="text-[9px] px-1 py-0.2 bg-[#5c6f84]/10 text-[#5c6f84] border border-[#5c6f84]/20 rounded font-mono">
            —
          </span>
        );
    }
  };

  if (collapsed) {
    return (
      <div className="w-10 bg-[#0c121c] border-r border-[#1d2a3c] flex flex-col items-center py-3 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#8b9cad] hover:text-[#58e5ce] hover:bg-[#1b2635] rounded transition-colors"
          title="Expand Mission Rail"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="mt-6 [writing-mode:vertical-rl] text-[10px] tracking-widest text-[#5c6f84] uppercase font-mono flex items-center gap-2">
          <Activity className="w-3 h-3 text-[#58e5ce]" />
          <span>Mission Rail</span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 sm:w-72 bg-[#0c121c] border-r border-[#1d2a3c] flex flex-col h-full text-xs select-none shrink-0 overflow-hidden">
      {/* Rail Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1d2a3c] bg-[#0a0f18]">
        <div className="flex items-center gap-2 font-semibold text-[#e8eff7]">
          <Activity className="w-3.5 h-3.5 text-[#58e5ce]" />
          <span className="tracking-wide">Mission Rail (Slice 4B)</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-[#8b9cad] hover:text-[#58e5ce] hover:bg-[#1b2635] rounded transition-colors"
          title="Collapse Rail"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rail Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Workstream Context */}
        <div className="bg-[#070b12] border border-[#1d2a3c] rounded-lg p-2.5 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center justify-between">
            <span>Workstream Context</span>
            {getProvenanceBadge('Observed')}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#8b9cad]">
              <GitBranch className="w-3 h-3 text-[#58e5ce]" />
              <span className="font-mono text-[#e8eff7]">master</span>
            </span>
            <span className="text-[#83d9a5] text-[10px] font-mono">1 uncommitted</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#5c6f84] pt-1 border-t border-[#162232]">
            <span>Secret Scrubbing</span>
            <span className="text-[#83d9a5] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> active
            </span>
          </div>
        </div>

        {/* Real Open Sessions */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center justify-between px-1">
            <span>Open PTY Sessions</span>
            <span className="text-[#8b9cad]">{sessions.length}</span>
          </div>

          <div className="space-y-1">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  activeSessionId === sess.id
                    ? 'bg-[#1b2635] border-[#58e5ce]/40 text-[#e8eff7] shadow-sm'
                    : 'bg-[#070b12] border-[#1d2a3c] text-[#8b9cad] hover:border-[#2c3c50]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Terminal className="w-3 h-3 text-[#58e5ce]" />
                    <span>#{sess.index} {sess.shell}</span>
                  </div>
                  {getProvenanceBadge(sess.provenance)}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#5c6f84]">
                  <span>{sess.cwdTail}</span>
                  <span className="text-[#83d9a5]">exit {sess.exitCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observed Command History */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-[#5c6f84] font-semibold flex items-center justify-between px-1">
            <span>Observed Commands</span>
            <span className="text-[#8b9cad]">OSC 133</span>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {commands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => onSelectCommand(cmd.command)}
                className="p-1.5 bg-[#070b12] border border-[#1d2a3c] hover:border-[#2c3c50] hover:bg-[#121c2a] rounded cursor-pointer transition-colors"
                title={`Click to populate in terminal: ${cmd.command}`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#e8eff7] truncate">
                  <span className="truncate pr-1">❯ {cmd.command}</span>
                  <span
                    className={`text-[9px] shrink-0 font-mono px-1 rounded ${
                      cmd.exitCode === 0 ? 'text-[#83d9a5]' : 'text-[#ef8f94]'
                    }`}
                  >
                    {cmd.exitCode === 0 ? '✓' : `exit ${cmd.exitCode}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#5c6f84] mt-0.5 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {cmd.durationMs}ms
                  </span>
                  <span>{cmd.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rail Footer */}
      <div className="p-2 border-t border-[#1d2a3c] bg-[#070b12] text-[10px] text-[#5c6f84] font-mono text-center">
        SQLite block store · zero hallucinated relationships
      </div>
    </aside>
  );
};
