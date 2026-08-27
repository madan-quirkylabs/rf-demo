import { useState } from 'react';
import type { Circular } from '../data/types';
import { HeroSection } from './HeroSection';
import { SplitReader } from '../tabs/SplitReader';
import { ChangeSummary } from '../tabs/ChangeSummary';
import { PartnerCommentary } from '../tabs/PartnerCommentary';
import type { CircularLens } from './IndexPage';

/**
 * CircularPage — one continuous surface, no nested tabs (founder + Devesh:
 * two levels of tabs read as clutter and imply destinations that don't exist).
 * Filter chips above the para list scope the view: All · Changed · Commentary ·
 * Questions. 'Changed' leads with the high-level diff; 'Commentary' surfaces
 * the partner rail below the reader. Everything else is para-pinned.
 */
export function CircularPage({
  circular: c,
  onBack,
  initialLens = 'all',
}: {
  circular: Circular;
  onBack: () => void;
  initialLens?: CircularLens;
}) {
  const [filter, setFilter] = useState<CircularLens>(initialLens);
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
        {filter === 'changed' && (
          <div className="border-b border-outline-variant/20">
            <ChangeSummary circular={c} />
          </div>
        )}

        <SplitReader
          key={`${c.id}-${filter}-${readFocus ?? ''}`}
          circular={c}
          filter={filter}
          focusRef={readFocus}
          onFilterChange={setFilter}
        />

        {filter === 'commentary' && (
          <div className="border-t border-outline-variant/20">
            <PartnerCommentary
              circular={c}
              onOpenPara={(ref) => {
                setReadFocus(ref);
                setFilter('all');
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
