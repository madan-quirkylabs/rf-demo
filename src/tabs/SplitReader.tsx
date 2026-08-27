import { useMemo, useState } from 'react';
import type { Circular, Clarification, SourceClause } from '../data/types';
import { CHANGE_META } from './changeMeta';
import { DiffText, diffWords } from './paraDiff';

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

const paraNum = (r: string) => Number(baseRef(r).replace(/\D+/g, ''));

/**
 * SplitReader — the trust surface (P1). Left: every para of the circular,
 * verbatim, with track-changes highlighting on amendments. Right: drill-down
 * for the selected para — old vs. new, checklist, partner commentary, and
 * community questions. The para list is always complete.
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
    const n = paraNum(selected.ref);
    return c.commentary.filter((co) =>
      (co.clauseRef.match(/\d+/g) ?? []).map(Number).includes(n)
    );
  }, [c, selected]);

  /** Community Q&A pinned to this para, plus locally asked questions. */
  const [asked, setAsked] = useState<Clarification[]>([]);
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState('');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const paraQuestions = useMemo(() => {
    if (!selected) return [];
    const n = paraNum(selected.ref);
    const base = c.clarifications.filter((q) =>
      (q.clauseRef.match(/\d+/g) ?? []).map(Number).includes(n)
    );
    return [...base, ...asked.filter((q) => q.clauseRef === selected.ref)];
  }, [c, selected, asked]);

  /** The finale: the full circular as an Excel file. Rich formatting via an
   * HTML table (.xls) so the Diff column keeps Devesh's track-changes view:
   * additions bold-green, deletions struck-through red. */
  const downloadExcel = () => {
    const deadline = (d: (typeof c.checklist)[number]['deadline']) =>
      d.kind === 'periodic'
        ? `Recurring — ${d.frequency}`
        : d.kind === 'event'
          ? `Event-based — ${d.trigger}`
          : d.kind === 'fixed'
            ? `By ${d.date}`
            : d.note;

    const h = (v: string) =>
      v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    /** Track-changes cell: LCS word diff rendered with Excel-safe markup. */
    const diffCell = (cl: SourceClause) => {
      if (!cl.previousText) return h(cl.text);
      return diffWords(cl.previousText, cl.text)
        .map((s) =>
          s.kind === 'add'
            ? `<b style="color:#0a6b2d">${h(s.text)}</b>`
            : s.kind === 'del'
              ? `<s style="color:#b3261e">${h(s.text)}</s>`
              : h(s.text)
        )
        .join('');
    };

    const rows = c.clauses
      .flatMap((cl) => {
        const items = c.checklist.filter((i) => baseRef(i.ref) === baseRef(cl.ref));
        return (items.length > 0 ? items : [null]).map((i) => ({ cl, i }));
      })
      .map(
        ({ cl, i }) =>
          `<tr><td>${h(cl.ref)}</td><td>${h(cl.previousText ?? '')}</td><td>${h(cl.text)}</td><td>${diffCell(cl)}</td>` +
          `<td>${i ? h(CATEGORY_LABEL[i.category] ?? i.category) : ''}</td>` +
          `<td>${i ? h(i.action) : ''}</td>` +
          `<td>${i ? h(i.appliesTo.join('; ')) : ''}</td>` +
          `<td>${i ? h(deadline(i.deadline)) : ''}</td>` +
          `<td>${i ? h(i.evidenceExpected) : ''}</td></tr>`
      )
      .join('');

    const html =
      `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>` +
      `<table border="1"><tr>${['Para', 'Previous Verbatim', 'New Verbatim', 'Diff (− removed · + added)', 'Category', 'Action Item', 'Applies To', 'Deadline', 'Expected Evidence']
        .map((t) => `<th style="background:#e8eef7">${t}</th>`)
        .join('')}</tr>${rows}</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RF_${c.regulator}_${c.refNo.replace(/[^\w-]/g, '')}.xls`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="py-5">
      {/* Completeness guarantee */}
      <div className="px-4 pb-3 flex items-center gap-4 flex-wrap">
        {(Object.keys(CHANGE_META) as (keyof typeof CHANGE_META)[]).map((k) => (
          <span key={k} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CHANGE_META[k].chip}`}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {CHANGE_META[k].label}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-3">
          <span className="text-[11px] text-on-surface-variant inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {c.clauses.length} paras · all shown · verbatim from source
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
                  {paraChecklist.length === 0 && c.checklist.length === 0 ? (
                    <p className="text-[12px] italic text-on-surface-variant">
                      Checklist derivation is pending for this circular — every para above is
                      verbatim from the source; nothing is interpreted yet.
                    </p>
                  ) : paraChecklist.length === 0 ? (
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

                {/* Community questions pinned to this para */}
                <div className="rounded-lg border border-outline-variant/20 bg-surface p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">forum</span>
                    Questions on this para
                  </p>

                  {paraQuestions.length === 0 && !askOpen && (
                    <p className="text-[12px] italic text-on-surface-variant mb-2">
                      No questions yet on this para.
                    </p>
                  )}

                  <ul className="space-y-3">
                    {paraQuestions.map((q) => {
                      const v = votes[q.id] ?? q.upvotes;
                      return (
                        <li key={q.id} className="text-[12.5px] leading-relaxed">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => setVotes((s) => ({ ...s, [q.id]: v + 1 }))}
                              className="flex flex-col items-center shrink-0 group"
                              aria-label="Upvote"
                            >
                              <span className="material-symbols-outlined text-[15px] text-on-surface-variant group-hover:text-primary transition-colors">
                                arrow_upward
                              </span>
                              <span className="text-[11px] font-semibold text-on-surface-variant group-hover:text-primary">
                                {v}
                              </span>
                            </button>
                            <div className="min-w-0">
                              <p className="font-medium leading-snug">{q.text}</p>
                              <p className="text-[10.5px] text-on-surface-variant mt-0.5">
                                asked by {q.askedBy}
                              </p>
                              {q.aiAnswer ? (
                                <div className="mt-2 p-2.5 rounded-md bg-primary/[0.06] border border-primary/15">
                                  <p className="text-[12px] leading-relaxed mb-1.5">{q.aiAnswer.text}</p>
                                  <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[11px] text-primary">format_quote</span>
                                    Grounded in {q.aiAnswer.basedOn.map((s) => s.author).join(', ')}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[11px] italic text-on-surface-variant mt-1">
                                  No answer yet — waiting for partner commentary to ground a response.
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Ask inline — no destination, the clause is the context */}
                  {askOpen ? (
                    <div className="mt-3">
                      <textarea
                        value={askText}
                        onChange={(e) => setAskText(e.target.value)}
                        placeholder={`Your question about ${selected.ref}…`}
                        rows={2}
                        className="w-full p-2.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-[12px] focus:outline-none focus:border-primary/60 resize-none"
                      />
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => {
                            if (!askText.trim() || !selected) return;
                            setAsked((a) => [
                              ...a,
                              {
                                id: `local-${Date.now()}`,
                                clauseRef: selected.ref,
                                askedBy: 'You',
                                text: askText.trim(),
                                upvotes: 0,
                              },
                            ]);
                            setAskText('');
                            setAskOpen(false);
                          }}
                          className="px-3 py-1 rounded-lg bg-primary text-on-primary text-[11.5px] font-medium shadow-sm hover:opacity-90"
                        >
                          Post question
                        </button>
                        <button
                          onClick={() => setAskOpen(false)}
                          className="text-[11.5px] text-on-surface-variant hover:text-on-surface"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAskOpen(true)}
                      className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Ask a question about {selected.ref}
                    </button>
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
