import { useState } from 'react';
import type { Circular } from '../data/types';
import { HeroSection } from './HeroSection';
import { SplitReader } from '../tabs/SplitReader';
import { ChangeSummary } from '../tabs/ChangeSummary';
import { PartnerCommentary } from '../tabs/PartnerCommentary';
import type { CircularLens } from './IndexPage';

type Tab = 'read' | 'highlights';

/**
 * CircularPage — exactly two tabs: Read Circular (the complete verbatim
 * reader with per-para checklist, commentary, and Q&A) and Highlights &
 * Partner Commentaries (high-level diff + partner rail). Nothing nested.
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
  const [tab, setTab] = useState<Tab>(initialLens === 'highlights' ? 'highlights' : 'read');
  /** Para ref to focus in the reader after a jump from commentary. */
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

      <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
        {/* The two tabs */}
        <div className="border-b border-outline-variant/20 bg-surface px-4 pt-3 flex items-center gap-1">
          <button
            onClick={() => setTab('read')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-t-lg border-b-2 transition-colors ${
              tab === 'read'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Read Circular
          </button>
          <button
            onClick={() => setTab('highlights')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-t-lg border-b-2 transition-colors ${
              tab === 'highlights'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            Highlights &amp; Partner Commentaries
            {c.commentary.length > 0 && (
              <span className="text-[10px] text-on-surface-variant">{c.commentary.length}</span>
            )}
          </button>
        </div>

        {tab === 'read' && (
          <SplitReader key={`read-${c.id}-${readFocus ?? ''}`} circular={c} focusRef={readFocus} />
        )}

        {tab === 'highlights' && (
          <div>
            <ChangeSummary circular={c} />
            <div className="border-t border-outline-variant/20">
              <PartnerCommentary
                circular={c}
                onOpenPara={(ref) => {
                  setReadFocus(ref);
                  setTab('read');
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
