import { useState } from 'react';
import type { Circular, ChangeType, Obligation } from '../data/types';
import { Card } from '../components/ui';

const CHANGE_META: Record<ChangeType, { label: string; chip: string }> = {
  new: { label: 'New', chip: 'bg-primary/10 text-primary border-primary/20' },
  amended: { label: 'Amended', chip: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  withdrawn: { label: 'Withdrawn', chip: 'bg-error-container text-on-error-container border-error/20' },
  unchanged: { label: 'Unchanged', chip: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30' },
};

/**
 * CircularReader — the "reading the circular" surface.
 * Left: the source clauses as published. Right: the obligations each clause
 * pins, with change-type color coding. Selecting a clause filters the right
 * pane — proof that every obligation traces to an exact source clause.
 */
export function CircularReaderTab({ circular: c }: { circular: Circular }) {
  const [selectedId, setSelectedId] = useState<string | null>(c.clauses[0]?.id ?? null);
  const selected = c.clauses.find((cl) => cl.id === selectedId) ?? null;
  const visible: Obligation[] = selected
    ? c.obligations.filter((o) => selected.obligationIds.includes(o.id))
    : c.obligations;

  return (
    <div className="py-6 space-y-5">
      <p className="text-[13px] text-on-surface-variant">
        The source document itself, clause by clause, with the obligations each clause creates. Change-type color coding shows what moved relative to the prior instrument.
      </p>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(Object.keys(CHANGE_META) as ChangeType[]).map((k) => (
          <span key={k} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CHANGE_META[k].chip}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {CHANGE_META[k].label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Source clauses */}
        <div className="lg:col-span-7 space-y-3">
          {c.clauses.map((cl) => {
            const meta = CHANGE_META[cl.changeType];
            const active = cl.id === selectedId;
            return (
              <button
                key={cl.id}
                onClick={() => setSelectedId(cl.id)}
                className={`w-full text-left rounded-xl border bg-surface-container-lowest shadow-sm p-4 transition-colors ${
                  active ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/20 hover:border-outline-variant/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono text-[12px] font-semibold text-primary">{cl.ref}</span>
                  {cl.section && <span className="text-[11px] text-on-surface-variant">{cl.section}</span>}
                  <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${meta.chip}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-on-surface">{cl.text}</p>
              </button>
            );
          })}
        </div>

        {/* Obligations pinned to the selected clause */}
        <div className="lg:col-span-5">
          <Card className="sticky top-4">
            <div className="px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">fact_check</span>
                <h3 className="text-sm font-semibold">
                  {selected ? `Obligations from ${selected.ref}` : 'Obligations from this circular'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant">{visible.length}</span>
            </div>
            <div className="p-3 space-y-2">
              {visible.length === 0 && (
                <p className="text-[13px] text-on-surface-variant px-2 py-3">
                  Select a clause on the left to see the obligations it creates.
                </p>
              )}
              {visible.map((o) => (
                <div key={o.id} className="p-3 rounded-lg bg-surface hover:bg-surface-container-low transition-colors border border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-on-surface-variant">{o.id}</span>
                  </div>
                  <p className="text-[13px] font-medium leading-snug">{o.label}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {o.source} · <span className="font-mono">{o.clause}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
