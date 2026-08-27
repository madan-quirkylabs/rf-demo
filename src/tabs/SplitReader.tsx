import { useMemo, useState } from 'react';
import type { ChangeType, Circular, SourceClause } from '../data/types';
import { CHANGE_META } from './changeMeta';
import { DiffText } from './paraDiff';

const CATEGORY_LABEL: Record<string, string> = {
  reporting: 'Reporting',
  event: 'Event-based',
  actionable: 'Actionable',
  policy: 'Policy & Process',
  appointments: 'Key Appointments',
  info: 'Information-only',
};

/** Base para of a ref: "Para 74(5)" → "Para 74". */
const baseRef = (r: string) => r.split('(')[0].trim();

/**
 * SplitReader — the trust surface (P1). Left: every para of the circular,
 * verbatim, with track-changes highlighting on amendments. Right: drill-down
 * for the selected para — old circular vs. new circular, and the checklist
 * rows derived from it. Nothing is hidden; the para list is always complete.
 */
export function SplitReader({
  circular: c,
  focusRef,
}: {
  circular: Circular;
  /** Para ref to preselect (used when jumping in from commentary). */
  focusRef?: string;
}) {
  const clauses = c.clauses;
  const [selectedId, setSelectedId] = useState<string>(
    (focusRef && clauses.find((cl) => baseRef(cl.ref) === baseRef(focusRef))?.id) ||
      clauses[0]?.id ||
      ''
  );
  const selected = clauses.find((cl) => cl.id === selectedId) ?? clauses[0];
  const paraChecklist = selected
    ? c.checklist.filter((i) => baseRef(i.ref) === baseRef(selected.ref))
    : [];

  /** Commentary is pinned by para number, so "Paras 61, 67" matches Para 61. */
  const paraCommentary = useMemo(() => {
    if (!selected) return [];
    const n = Number(baseRef(selected.ref).replace(/\D+/g, ''));
    return c.commentary.filter((co) =>
      (co.clauseRef.match(/\d+/g) ?? []).map(Number).includes(n)
    );
  }, [c, selected]);

  /** The finale: the full checklist, clause-by-clause, verbatim included. */
  const downloadExcel = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const clauseText = (ref: string) =>
      c.clauses.find((cl) => baseRef(cl.ref) === baseRef(ref))?.text ?? '';
    const deadline = (d: (typeof c.checklist)[number]['deadline']) =>
      d.kind === 'periodic'
        ? `Recurring — ${d.frequency}`
        : d.kind === 'event'
          ? `Event-based — ${d.trigger}`
          : d.kind === 'fixed'
            ? `By ${d.date}`
            : d.note;
    const lines = [
      ['Para', 'Circular Text (verbatim)', 'Category', 'Action Item', 'Applies To', 'Deadline', 'Expected Evidence']
        .map(esc)
        .join(','),
      ...c.checklist.map((i) =>
        [
          i.ref,
          clauseText(i.ref),
          CATEGORY_LABEL[i.category] ?? i.category,
          i.action,
          i.appliesTo.join('; '),
          deadline(i.deadline),
          i.evidenceExpected,
        ]
          .map((v) => esc(String(v)))
          .join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RF_Checklist_${c.regulator}_${c.refNo.replace(/[^\w-]/g, '')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="py-5">
      {/* Legend + completeness guarantee */}
      <div className="px-4 pb-3 flex items-center gap-4 flex-wrap">
        {(Object.keys(CHANGE_META) as ChangeType[]).map((k) => (
          <span key={k} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CHANGE_META[k].chip}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {CHANGE_META[k].label}
          </span>
        ))}
          <span className="ml-auto flex items-center gap-3">
          <span className="text-[11px] text-on-surface-variant inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {clauses.length} paras · all shown · verbatim from source
          </span>
          <button
            onClick={downloadExcel}
            title="Clause-by-clause checklist: verbatim text, category tags, deadlines, evidence — opens in Excel"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Download Complete Checklist as Excel
          </button>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* ---- Left: every para, track-changes view ---- */}
        <div className="lg:col-span-6 xl:col-span-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
          <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
            <h3 className="text-[12px] font-semibold">Circular — verbatim, clause by clause</h3>
          </div>
          <div className="max-h-[68vh] overflow-y-auto divide-y divide-outline-variant/10">
            {clauses.map((cl) => (
              <ParaCard
                key={cl.id}
                clause={cl}
                active={cl.id === selected?.id}
                onSelect={() => setSelectedId(cl.id)}
              />
            ))}
          </div>
        </div>

        {/* ---- Right: drill-down for the selected para ---- */}
        <div className="lg:col-span-6 xl:col-span-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest flex flex-col">
          <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">manage_search</span>
            <h3 className="text-[12px] font-semibold">
              {selected ? `${selected.ref} — old vs. new & checklist` : 'Select a para'}
            </h3>
          </div>

          <div className="max-h-[68vh] overflow-y-auto p-4 space-y-4">
            {!selected && (
              <p className="text-[13px] text-on-surface-variant">Select a para on the left.</p>
            )}
            {selected && (
              <>
                {/* Old circular */}
                <div className="rounded-lg border border-outline-variant/20 bg-surface p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">history</span>
                    Old circular
                  </p>
                  {selected.previousText ? (
                    <p className="text-[13px] leading-relaxed text-on-surface-variant">
                      {selected.previousText}
                    </p>
                  ) : (
                    <p className="text-[13px] italic text-on-surface-variant">
                      New clause — no prior version in the previous instrument.
                    </p>
                  )}
                </div>

                {/* New circular */}
                <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">description</span>
                    New circular — {selected.ref}
                  </p>
                  <p className="text-[13px] leading-relaxed text-on-surface">
                    <DiffText text={selected.text} previous={selected.previousText} />
                  </p>
                  {selected.section && (
                    <p className="text-[11px] text-on-surface-variant mt-2">{selected.section}</p>
                  )}
                </div>

                {/* Checklist for this para */}
                <div className="rounded-lg border border-outline-variant/20 bg-surface p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">checklist</span>
                    Checklist from this para
                  </p>
                  {paraChecklist.length === 0 ? (
                    <p className="text-[12px] italic text-on-surface-variant">
                      No action items derived from this para (information-only).
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {paraChecklist.map((i) => (
                        <li key={i.id} className="text-[12.5px] leading-snug flex gap-2">
                          <span className="font-mono text-[11px] text-primary shrink-0 mt-[2px]">{i.ref}</span>
                          <span>{i.action}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Partner commentary pinned to this para */}
                <div className="rounded-lg border border-tertiary/30 bg-tertiary/[0.04] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">record_voice_over</span>
                    Partner commentary on this para
                  </p>
                  {paraCommentary.length === 0 ? (
                    <p className="text-[12px] italic text-on-surface-variant">
                      No partner commentary cites this para yet.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {paraCommentary.map((co) => (
                        <li key={co.id} className="text-[12.5px] leading-relaxed">
                          <p className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold">{co.author}</span>
                            <span className="text-[11px] text-on-surface-variant">{co.publishedAt}</span>
                            {co.official && (
                              <span className="text-[9px] px-1.5 py-[1px] rounded bg-tertiary/15 text-tertiary font-semibold uppercase tracking-wide border border-tertiary/30">
                                Official
                              </span>
                            )}
                          </p>
                          <p className="text-on-surface">{co.text}</p>
                          {co.sourceUrl && (
                            <a href={co.sourceUrl} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline mt-1 inline-block">
                              View official source ↗
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ParaCard({
  clause: cl,
  active,
  onSelect,
}: {
  clause: SourceClause;
  active: boolean;
  onSelect: () => void;
}) {
  const meta = CHANGE_META[cl.changeType];
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 transition-colors ${
        active ? 'bg-primary/[0.06] border-l-2 border-l-primary' : 'hover:bg-surface-container-low border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-mono text-[11.5px] font-semibold text-primary">{cl.ref}</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${meta.chip}`}>
          {meta.label}
        </span>
        {cl.section && (
          <span className="text-[10.5px] text-on-surface-variant/80 truncate ml-auto">{cl.section}</span>
        )}
      </div>
      <p className="text-[12.5px] leading-relaxed text-on-surface line-clamp-3">
        <DiffText text={cl.text} previous={cl.previousText} />
      </p>
    </button>
  );
}
