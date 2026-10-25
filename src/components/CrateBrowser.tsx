import React, { useState } from 'react';
import { ZET_CRATES } from '../data/zetData';
import { CRATE_SOURCES } from '../data/crateSources';
import { Folder, FileCode, CheckCircle2, Clock, Sparkles, Copy, Check, Edit3, Save } from 'lucide-react';

export const CrateBrowser: React.FC = () => {
  const [selectedCrate, setSelectedCrate] = useState<string>('zet');
  const [selectedFile, setSelectedFile] = useState<string>('crates/zet/src/main.rs');
  const [codeBuffer, setCodeBuffer] = useState<string>(
    CRATE_SOURCES['crates/zet/src/main.rs']?.content || '// Source file loaded'
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const activeCrateInfo = ZET_CRATES.find((c) => c.name === selectedCrate) || ZET_CRATES[0];

  const handleSelectFile = (filePath: string) => {
    setSelectedFile(filePath);
    setCodeBuffer(CRATE_SOURCES[filePath]?.content || `// File: ${filePath}\n// Content accessible in workspace.`);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBuffer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#0a101a] overflow-hidden font-mono text-xs select-none">
      {/* Left: Crate Catalog & File Tree */}
      <div className="w-full md:w-72 bg-[#0c121c] border-r border-[#1d2a3c] flex flex-col h-auto md:h-full shrink-0">
        <div className="p-3 border-b border-[#1d2a3c] bg-[#090e17] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-[#e8eff7]">
            <Folder className="w-4 h-4 text-[#58e5ce]" />
            <span>Workspace Crates (12)</span>
          </div>
          <span className="text-[10px] text-[#83d9a5] bg-[#83d9a5]/10 px-1.5 py-0.5 rounded font-mono">
            Cargo.toml
          </span>
        </div>

        {/* Crate List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {ZET_CRATES.map((crate) => {
            const isSelected = selectedCrate === crate.name;
            return (
              <div key={crate.name} className="space-y-0.5">
                <button
                  onClick={() => {
                    setSelectedCrate(crate.name);
                    if (crate.files.length > 0) {
                      handleSelectFile(crate.files[0]);
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#1b2635] text-[#58e5ce] font-semibold border border-[#58e5ce]/30'
                      : 'text-[#8b9cad] hover:bg-[#121c2a] hover:text-[#e8eff7]'
                  }`}
                >
                  <span className="truncate">{crate.name}</span>
                  <span
                    className={`text-[9px] px-1 rounded uppercase font-mono ${
                      crate.status === 'implemented'
                        ? 'text-[#83d9a5] bg-[#83d9a5]/10'
                        : crate.status === 'partial'
                        ? 'text-[#f6c478] bg-[#f6c478]/10'
                        : 'text-[#5c6f84] bg-[#5c6f84]/10'
                    }`}
                  >
                    {crate.status}
                  </span>
                </button>

                {/* Sub-files if selected */}
                {isSelected && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5 border-l border-[#1d2a3c] ml-3">
                    {crate.files.map((file) => (
                      <button
                        key={file}
                        onClick={() => handleSelectFile(file)}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] truncate flex items-center gap-1.5 transition-colors ${
                          selectedFile === file
                            ? 'bg-[#223348] text-[#e8eff7] font-medium'
                            : 'text-[#8b9cad] hover:text-[#e8eff7] hover:bg-[#15202e]'
                        }`}
                      >
                        <FileCode className="w-3 h-3 text-[#22d3ee] shrink-0" />
                        <span className="truncate">{file.split('/').pop()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Specs Info */}
        <div className="p-3 border-t border-[#1d2a3c] bg-[#070b12] text-[10px] text-[#8b9cad] space-y-1">
          <div className="font-semibold text-[#e8eff7] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#58e5ce]" />
            <span>{activeCrateInfo.name}</span>
          </div>
          <p className="text-[#5c6f84] line-clamp-2">{activeCrateInfo.description}</p>
        </div>
      </div>

      {/* Right: Code Editor & Viewer */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a101a]">
        {/* Editor Top Bar */}
        <div className="px-4 py-2 border-b border-[#1d2a3c] bg-[#0c121c] flex items-center justify-between text-xs text-[#8b9cad]">
          <div className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-[#58e5ce]" />
            <span className="text-[#e8eff7] font-semibold">{selectedFile}</span>
            <span className="text-[#5c6f84]">({activeCrateInfo.role})</span>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-[11px] text-[#83d9a5] flex items-center gap-1 animate-pulse">
                <Check className="w-3 h-3" /> Saved to build buffer
              </span>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2635] hover:bg-[#2c3c50] text-[#e8eff7] transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#f6c478]" />
              <span>{isEditing ? 'View Mode' : 'Edit Code'}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f5c4f] hover:bg-[#256e5f] text-[#e6fff7] font-semibold transition-colors"
              >
                <Save className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b2635] hover:bg-[#2c3c50] text-[#e8eff7] transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3 text-[#83d9a5]" /> : <Copy className="w-3 h-3 text-[#8b9cad]" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-auto p-4 select-text">
          {isEditing ? (
            <textarea
              value={codeBuffer}
              onChange={(e) => setCodeBuffer(e.target.value)}
              className="w-full h-full bg-[#070b12] text-[#e8eff7] p-3 rounded border border-[#1d2a3c] font-mono text-[12px] leading-relaxed resize-none outline-none focus:border-[#58e5ce]"
              spellCheck={false}
            />
          ) : (
            <pre className="text-[#e8eff7] text-[12px] leading-relaxed font-mono whitespace-pre-wrap">
              {codeBuffer.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-[#3d5266] select-none text-right w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell text-[#e8eff7]">
                    {line.startsWith('//') || line.startsWith('///') || line.startsWith('//!') ? (
                      <span className="text-[#5c6f84] italic">{line}</span>
                    ) : line.includes('pub fn') || line.includes('fn ') ? (
                      <span className="text-[#58e5ce]">{line}</span>
                    ) : line.includes('struct ') || line.includes('enum ') ? (
                      <span className="text-[#f6c478]">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </div>

        {/* Editor Footer */}
        <div className="px-4 py-1.5 border-t border-[#1d2a3c] bg-[#070b12] flex items-center justify-between text-[11px] text-[#5c6f84]">
          <span>Rust 2021 Edition · UTF-8</span>
          <span>Continue build: edit files or test CLI commands in the terminal</span>
        </div>
      </div>
    </div>
  );
};
