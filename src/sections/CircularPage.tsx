import { useState } from 'react';
import type { Circular } from '../data/types';
import { HeroSection } from './HeroSection';
import { CommentarySection } from './CommentarySection';
import { ClarificationsSection } from './ClarificationsSection';
import { SplitReader } from '../tabs/SplitReader';
import { ChangeSummary } from '../tabs/ChangeSummary';
import { PartnerCommentary } from '../tabs/PartnerCommentary';
import type { CircularLens } from './IndexPage';

type TopTab = 'circular' | 'clarify';
type Lens = 'read' | 'highlights';

const LENSES: { id: Lens; label: string; icon: string }[] = [
  { id: 'read', label: 'Read circular', icon: 'menu_book' },
  { id: 'highlights', label: 'Highlights & Commentaries', icon: 'auto_awesome' },
];

/**
 * CircularPage — one circular, two top-level tabs:
 *   1. Circular & Checklist — understand + act (checklist / source text / diff)
 *   2. Clarify — vetted partner commentary + community questions
 * No search here; the index page owns discovery.
 */
export function CircularPage({
  circular: c,
  onBack,
  initialLens = 'read',
}: {
  circular: Circular;
  onBack: () => void;
  initialLens?: CircularLens;
}) {
  const [tab, setTab] = useState<TopTab>(
    initialLens === 'clarify' ? 'clarify' : 'circular'
  );
  const [lens, setLens] = useState<Lens>('read');
  /** Para ref to focus in Read circular after a jump from commentary. */
  const [readFocus, setReadFocus] = useState<string | undefined>(undefined);

  return (
    <div className="px-8 py-6 max-w-[1440px] w-full mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[15px]">arrow_back</span>
        All circulars
      </button>

      <HeroSection circular={c} />

      {/* Top-level tabs — the two jobs this page does */}
      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
        <div className="border-b border-outline-variant/20 bg-surface px-4 pt-3 flex items-center gap-1">
          <button
            onClick={() => setTab('circular')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-t-lg border-b-2 transition-colors ${
              tab === 'circular'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            Circular &amp; Checklist
          </button>
          <button
            onClick={() => setTab('clarify')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-t-lg border-b-2 transition-colors ${
              tab === 'clarify'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            Clarify
            {(c.commentary.length > 0 || c.clarifications.length > 0) && (
              <span className="text-[10px] text-on-surface-variant">
                {c.commentary.length + c.clarifications.length}
              </span>
            )}
          </button>
        </div>

        {tab === 'circular' && (
          <>
            {/* Sub-lenses within the understanding tab */}
            <div className="px-4 py-2.5 border-b border-outline-variant/20 bg-surface-container-low flex items-center gap-1.5 flex-wrap">
              {LENSES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLens(l.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                    lens === l.id
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{l.icon}</span>
                  {l.label}
                </button>
              ))}
            </div>
            <div className="px-2 pb-2">
              {lens === 'read' && (
                <SplitReader key={`read-${c.id}-${readFocus ?? ''}`} circular={c} focusRef={readFocus} />
              )}
              {lens === 'highlights' && (
                <div key={`hi-${c.id}`}>
                  <ChangeSummary circular={c} />
                  <PartnerCommentary
                    circular={c}
                    onOpenPara={(ref) => {
                      setReadFocus(ref);
                      setLens('read');
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'clarify' && (
          <div className="px-5 py-6 space-y-8">
            <CommentarySection circular={c} />
            <ClarificationsSection circular={c} />
          </div>
        )}
      </section>
    </div>
  );
}
