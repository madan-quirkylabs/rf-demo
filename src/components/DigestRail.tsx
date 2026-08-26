import type { Circular } from '../data/types';

/**
 * DigestRail — the daily regulatory digest Devesh showed on 2026-08-25
 * (00:57): what moved across regulators, at a glance. The difference: each
 * entry opens a ready clause-by-clause checklist, not a verbatim dump.
 * Entries render from tracked instruments only — nothing invented.
 */
export function DigestRail({
  circulars,
  activeId,
  onSelect,
}: {
  circulars: Circular[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const sorted = [...circulars].sort((a, b) => {
    const da = new Date(a.dated.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'));
    const db = new Date(b.dated.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'));
    return db.getTime() - da.getTime();
  });

  return (
    <section aria-label="Regulatory digest">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">mark_email_unread</span>
          <h3 className="text-[13px] font-semibold">What moved — digest</h3>
        </div>
        <span className="text-[11px] text-on-surface-variant hidden md:inline">
          every entry opens its checklist, not a verbatim dump
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {sorted.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`shrink-0 w-[300px] text-left rounded-xl border px-4 py-3 transition-all ${
              activeId === c.id
                ? 'border-primary/50 bg-primary/[0.05] shadow-sm'
                : 'border-outline-variant/25 bg-surface-container-lowest hover:border-primary/40 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-1.5 py-[2px] bg-secondary-container text-on-secondary-container rounded font-semibold uppercase tracking-wide">
                {c.regulator}
              </span>
              <span className="text-[11px] text-on-surface-variant">{c.dated}</span>
              {activeId === c.id && (
                <span className="ml-auto text-[10px] font-semibold text-primary uppercase tracking-wide">viewing</span>
              )}
            </div>
            <p className="text-[12.5px] font-medium leading-snug line-clamp-2 mb-1.5">{c.title}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <span className="material-symbols-outlined text-[13px]">checklist</span>
                {c.checklist.length} checklist items ready
              </span>
              <span className="text-[11px] text-on-surface-variant">·</span>
              <span className="text-[11px] text-on-surface-variant inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">difference</span>
                {c.clauses.filter((x) => x.changeType !== 'unchanged').length} clauses moved
              </span>
            </div>
          </button>
        ))}
        {/* Corpus expansion — explicitly illustrative */}
        <div className="shrink-0 w-[220px] rounded-xl border border-dashed border-outline-variant/40 px-4 py-3 flex flex-col justify-center">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant mb-1">library_add</span>
          <p className="text-[11.5px] text-on-surface-variant leading-snug">
            Corpus expanding — RBI, SEBI, and industry-body feeds (FACE, Big 4 briefs) ship next.
          </p>
        </div>
      </div>
    </section>
  );
}
