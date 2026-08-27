import type { Circular } from '../data/types';
import { Card, CardHeader } from '../components/ui';

/**
 * ChangeSummary — the high-level diff: previous vs. new requirement at the
 * instrument level, plus the key-change callout. Sits at the top of the
 * Highlights & Commentaries lens; the para-level drill-down follows below.
 */
export function ChangeSummary({ circular: c }: { circular: Circular }) {
  return (
    <div className="py-5 space-y-4">
      {/* Previous vs Current */}
      <Card>
        <CardHeader icon="difference" title="Change vs the prior position" />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Previous */}
          <div className="bg-error-container/25 rounded-lg p-4 border border-error/10">
            <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold uppercase tracking-wider text-on-error-container">
              <span className="material-symbols-outlined text-[16px]">remove_circle</span>
              Previous state
            </div>
            <ul className="space-y-2">
              {c.changeDiff.previous.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]">
                  <span className="material-symbols-outlined text-[16px] text-error/60 mt-[1px]">close</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Current */}
          <div className="bg-primary-container/15 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              New requirement
            </div>
            <ul className="space-y-2">
              {c.changeDiff.current.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]">
                  <span className="material-symbols-outlined text-[16px] text-primary/80 mt-[1px]">check</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
