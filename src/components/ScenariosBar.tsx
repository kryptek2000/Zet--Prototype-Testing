import React from 'react';
import { Play, Sparkles, ShieldAlert, AlertOctagon } from 'lucide-react';

interface ScenariosBarProps {
  onRunScenario: (scenario: 'hello' | 'update' | 'danger') => void;
  activeScenario: string | null;
}

export const ScenariosBar: React.FC<ScenariosBarProps> = ({
  onRunScenario,
  activeScenario,
}) => {
  return (
    <div className="bg-[#0b111b] border-b border-[#1d2a3c] px-3 py-1.5 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2 text-[#8b9cad]">
        <Play className="w-3.5 h-3.5 text-[#58e5ce]" />
        <span className="font-semibold text-[#e8eff7] text-[11px] hidden sm:inline">
          ZET Vision Interactive Scenarios:
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => onRunScenario('hello')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
            activeScenario === 'hello'
              ? 'bg-[#1b2635] text-[#58e5ce] border-[#58e5ce]/40 font-semibold'
              : 'bg-[#070b12] text-[#8b9cad] border-[#1d2a3c] hover:text-[#e8eff7] hover:border-[#2c3c50]'
          }`}
          title="1 · Plain words are answered, never 127. No mode entered."
        >
          <Sparkles className="w-3 h-3 text-[#58e5ce]" />
          <span>1 · hello</span>
        </button>

        <button
          onClick={() => onRunScenario('update')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
            activeScenario === 'update'
              ? 'bg-[#1b2635] text-[#f6c478] border-[#f6c478]/40 font-semibold'
              : 'bg-[#070b12] text-[#8b9cad] border-[#1d2a3c] hover:text-[#e8eff7] hover:border-[#2c3c50]'
          }`}
          title="2 · zet is a verb: command translates, passes T2 gate, and runs."
        >
          <ShieldAlert className="w-3 h-3 text-[#f6c478]" />
          <span>2 · zet update linux (T2)</span>
        </button>

        <button
          onClick={() => onRunScenario('danger')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
            activeScenario === 'danger'
              ? 'bg-[#171307] text-[#ef8f94] border-[#ef8f94]/40 font-semibold'
              : 'bg-[#070b12] text-[#8b9cad] border-[#1d2a3c] hover:text-[#e8eff7] hover:border-[#2c3c50]'
          }`}
          title="3 · T3 never auto-passes: type-to-confirm critical gate."
        >
          <AlertOctagon className="w-3 h-3 text-[#ef8f94]" />
          <span>3 · zet wipe tmp (T3)</span>
        </button>
      </div>
    </div>
  );
};
