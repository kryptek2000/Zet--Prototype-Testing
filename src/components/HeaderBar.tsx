import React from 'react';
import { LayoutMode } from '../types/zet';
import { Terminal, Code2, Network, BookOpen, Layers, Plus, X } from 'lucide-react';

interface HeaderBarProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  activeView: 'terminal' | 'crates' | 'architecture' | 'docs';
  setActiveView: (view: 'terminal' | 'crates' | 'architecture' | 'docs') => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  tabs: { id: number; title: string; shell: string; exitCode: number }[];
  onAddTab: () => void;
  onCloseTab: (id: number) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  layoutMode,
  setLayoutMode,
  activeView,
  setActiveView,
  activeTab,
  setActiveTab,
  tabs,
  onAddTab,
  onCloseTab,
}) => {
  return (
    <header className="bg-[#0b111b] border-b border-[#1d2a3c] text-xs select-none sticky top-0 z-40">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#162232]">
        {/* Left: Window Dots & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ef8f94]/80 inline-block hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#f6c478]/80 inline-block hover:opacity-100 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#83d9a5]/80 inline-block hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center gap-2 pl-2">
            <span className="font-black text-[#58e5ce] tracking-widest text-sm uppercase">ZET</span>
            <span className="text-[#5c6f84]">|</span>
            <span className="text-[#8b9cad] font-medium hidden sm:inline">The Outcome-Aware Terminal</span>
          </div>
        </div>

        {/* Center: Main View Navigation */}
        <div className="flex items-center bg-[#070b12] p-0.5 rounded-lg border border-[#1d2a3c]">
          <button
            onClick={() => setActiveView('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeView === 'terminal'
                ? 'bg-[#1b2635] text-[#58e5ce] font-medium shadow-sm'
                : 'text-[#8b9cad] hover:text-[#e8eff7]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => setActiveView('crates')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeView === 'crates'
                ? 'bg-[#1b2635] text-[#58e5ce] font-medium shadow-sm'
                : 'text-[#8b9cad] hover:text-[#e8eff7]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Crates (12)</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeView === 'architecture'
                ? 'bg-[#1b2635] text-[#58e5ce] font-medium shadow-sm'
                : 'text-[#8b9cad] hover:text-[#e8eff7]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActiveView('docs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeView === 'docs'
                ? 'bg-[#1b2635] text-[#58e5ce] font-medium shadow-sm'
                : 'text-[#8b9cad] hover:text-[#e8eff7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Roadmap & Spec</span>
          </button>
        </div>

        {/* Right: Model Status & Safety Tier */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 bg-[#070b12] border border-[#1d2a3c] rounded-full px-2.5 py-1 text-[11px] text-[#8b9cad]">
            <span className="w-2 h-2 rounded-full bg-[#83d9a5] animate-pulse" />
            <span className="text-[#e8eff7] font-medium">openrouter:laguna-s-2.1:free</span>
          </div>

          <div className="bg-[#1b2635] border border-[#2d3f56] text-[#58e5ce] px-2 py-0.5 rounded text-[10px] font-mono">
            v0.1.0-alpha
          </div>
        </div>
      </div>

      {/* Sub Bar: Tabs & Layout Modes (when on terminal view) */}
      {activeView === 'terminal' && (
        <div className="flex items-center justify-between px-3 py-1 bg-[#090e17] text-[11px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-t border-t border-x cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0a101a] border-[#2c3c50] text-[#e8eff7] font-semibold'
                    : 'bg-[#0e1624] border-transparent text-[#8b9cad] hover:text-[#e8eff7]'
                }`}
              >
                <span>{tab.title}</span>
                <span className="text-[9px] text-[#5c6f84] font-normal font-mono">
                  (exit {tab.exitCode})
                </span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="hover:text-[#ef8f94] p-0.5"
                    title="Close tab (Ctrl+W)"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={onAddTab}
              className="p-1 text-[#5c6f84] hover:text-[#58e5ce] hover:bg-[#1b2635] rounded transition-colors ml-1"
              title="New terminal tab (Ctrl+T)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Layout Mode Presets (TerminalFocus, Workspace, MissionControl) */}
          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-[#5c6f84] text-[10px] hidden sm:inline flex items-center gap-1">
              <Layers className="w-3 h-3" /> Layout:
            </span>

            <div className="flex items-center bg-[#070b12] border border-[#1d2a3c] rounded p-0.5">
              <button
                onClick={() => setLayoutMode('TerminalFocus')}
                title="Terminal Focus: pure terminal (Ctrl+1)"
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  layoutMode === 'TerminalFocus'
                    ? 'bg-[#1b2635] text-[#58e5ce] font-medium'
                    : 'text-[#8b9cad] hover:text-[#e8eff7]'
                }`}
              >
                Focus
              </button>

              <button
                onClick={() => setLayoutMode('Workspace')}
                title="Workspace: terminal + Mission Rail (Ctrl+2)"
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  layoutMode === 'Workspace'
                    ? 'bg-[#1b2635] text-[#58e5ce] font-medium'
                    : 'text-[#8b9cad] hover:text-[#e8eff7]'
                }`}
              >
                Workspace
              </button>

              <button
                onClick={() => setLayoutMode('MissionControl')}
                title="Mission Control: rail + terminal + inspector (Ctrl+3)"
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  layoutMode === 'MissionControl'
                    ? 'bg-[#58e5ce]/20 text-[#58e5ce] border border-[#58e5ce]/40 font-semibold'
                    : 'text-[#8b9cad] hover:text-[#e8eff7]'
                }`}
              >
                Mission Control
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
