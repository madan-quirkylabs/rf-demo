import { useState } from 'react';
import { circulars } from './data';
import type { Circular } from './data/types';
import { HeroSection } from './sections/HeroSection';
import { AnalysisPane } from './sections/AnalysisPane';
import { CommentarySection } from './sections/CommentarySection';
import { ClarificationsSection } from './sections/ClarificationsSection';

export default function App() {
  const [circularId, setCircularId] = useState<string>(circulars[0].id);
  const c: Circular = circulars.find((x) => x.id === circularId) ?? circulars[0];

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* App chrome — regulator/circular selector only; no top-level content tabs */}
      <header className="bg-surface border-b border-outline-variant/10 px-8 py-3 flex items-center justify-between gap-4 z-10 flex-wrap sticky top-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">account_balance</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">Regulatory Analysis Workspace</h2>
            <p className="text-[11px] text-on-surface-variant truncate">source-traceable obligations &amp; change</p>
          </div>
        </div>

        {/* Regulator / circular selector */}
        <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 flex-wrap">
          {circulars.map((x) => (
            <button
              key={x.id}
              onClick={() => setCircularId(x.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                circularId === x.id
                  ? 'bg-surface-container-highest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="font-mono">{x.regulator}</span>
              <span className="hidden xl:inline"> · {x.dated}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Single-page flow: applicability + summary → analysis → commentary → clarifications */}
      <div className="px-8 py-6 max-w-[1440px] w-full mx-auto space-y-8">
        <HeroSection circular={c} />
        <AnalysisPane circular={c} />
        <CommentarySection circular={c} />
        <ClarificationsSection circular={c} />
      </div>
    </main>
  );
}
