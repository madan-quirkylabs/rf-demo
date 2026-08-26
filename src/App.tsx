import { useState } from 'react';
import { circulars } from './data';
import type { Circular, ReaderProfile } from './data/types';
import { HeroSection } from './sections/HeroSection';
import { AnalysisPane } from './sections/AnalysisPane';
import { PersonalizeBar } from './sections/PersonalizeBar';
import { CommentarySection } from './sections/CommentarySection';
import { ClarificationsSection } from './sections/ClarificationsSection';
import { SearchBar } from './components/SearchBar';
import type { AnalysisTab } from './sections/AnalysisPane';

const EMPTY_PROFILE: ReaderProfile = {
  regulated: null,
  licenses: [],
  worksWithRegulatedEntities: null,
};

export default function App() {
  const [circularId, setCircularId] = useState<string>(circulars[0].id);
  const [tab, setTab] = useState<AnalysisTab>('change');
  const [profile, setProfile] = useState<ReaderProfile>(EMPTY_PROFILE);
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

        {/* Free / no-login signal + global search */}
        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar
            onSelect={(cid, t) => {
              setCircularId(cid);
              setTab(t);
            }}
          />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[13px]">lock_open</span>
            Full value · no account needed
          </span>
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
        </div>
      </header>

      {/* Single-page flow: applicability + summary → personalize → analysis (incl. checklist) → commentary → clarifications */}
      <div className="px-8 py-6 max-w-[1440px] w-full mx-auto space-y-8">
        <HeroSection circular={c} />
        <PersonalizeBar
          circulars={circulars}
          profile={profile}
          onChange={setProfile}
          onSelectCircular={setCircularId}
        />
        <AnalysisPane circular={c} tab={tab} onTabChange={setTab} />
        <CommentarySection circular={c} />
        <ClarificationsSection circular={c} />
      </div>
    </main>
  );
}
