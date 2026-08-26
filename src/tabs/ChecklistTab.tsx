import { useMemo, useState } from 'react';
import type { ChecklistCategory, ChecklistDeadline, ChecklistItem, Circular } from '../data/types';
import { Badge } from '../components/ui';

const CATEGORY_META: Record<ChecklistCategory, { label: string; icon: string }> = {
  reporting: { label: 'Reporting', icon: 'assignment_turned_in' },
  event: { label: 'Event-based', icon: 'event_upcoming' },
  actionable: { label: 'Actionable', icon: 'construction' },
  policy: { label: 'Policy & Process', icon: 'gavel' },
  appointments: { label: 'Key Appointments', icon: 'person_pin' },
  info: { label: 'Information-only', icon: 'info' },
};

function deadlineChip(d: ChecklistDeadline) {
  const m = (() => {
    switch (d.kind) {
      case 'periodic':
        return { icon: 'event_repeat', text: d.frequency };
      case 'event':
        return { icon: 'event_upcoming', text: d.trigger };
      case 'fixed':
        return { icon: 'event', text: d.date };
      case 'none':
        return { icon: 'all_inclusive', text: d.note };
    }
  })();
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-[11px] text-on-surface-variant">
      <span className="material-symbols-outlined text-[13px]">{m.icon}</span>
      {m.text}
    </span>
  );
}

/** Merged groups behave like merged Excel cells: many clauses, one evidence item. */
type MergeGroup = string[];

/**
 * ChecklistSection — the auto-derived, categorized compliance checklist for
 * the open instrument. General by design: every row traces to its clause and
 * describes what regulated entities must do — never any company's state.
 * Interactions mirror the practitioner workflow: filter by header, mark N/A,
 * merge sub-clauses into one evidence item, and take it away as CSV.
 */
export function ChecklistTab({ circular: c }: { circular: Circular }) {
  const [cat, setCat] = useState<ChecklistCategory | 'all'>('all');
  const [naIds, setNaIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [merges, setMerges] = useState<MergeGroup[]>([]);

  const counts = useMemo(() => {
    const m = new Map<ChecklistCategory | 'all', number>();
    m.set('all', c.checklist.length);
    for (const item of c.checklist) m.set(item.category, (m.get(item.category) ?? 0) + 1);
    return m;
  }, [c]);

  const visible = c.checklist.filter((i) => (cat === 'all' || i.category === cat) && !naIds.has(i.id));
  const mergeOf = (id: string) => merges.find((g) => g.includes(id));

  /** Render list: merged groups collapse to their first visible member. */
  const rows: (ChecklistItem | { group: MergeGroup })[] = [];
  const skipped = new Set<string>();
  for (const item of visible) {
    if (skipped.has(item.id)) continue;
    const g = mergeOf(item.id);
    if (g && g[0] === item.id) {
      rows.push({ group: g });
      for (const mid of g.slice(1)) skipped.add(mid);
    } else if (!g) {
      rows.push(item);
    }
  }

  const toggleNa = (id: string) => {
    setNaIds((s) => new Set([...s].filter((x) => x !== id).concat(naIds.has(id) ? [] : [id])));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  const canMerge =
    selected.size >= 2 &&
    [...selected].every((id) => {
      const item = c.checklist.find((x) => x.id === id);
      return item && !naIds.has(item.id) && !mergeOf(item.id);
    });

  const doMerge = () => setMerges((ms) => [...ms, [...selected].sort()]);
  const unmerge = (g: MergeGroup) => setMerges((ms) => ms.filter((x) => x !== g));

  const downloadCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      ['Clause Ref', 'Section', 'Category', 'Requirement (Action Item)', 'Applies To', 'Deadline', 'Expected Evidence'].map(esc).join(','),
      ...visible.map((i) =>
        [
          i.ref,
          i.section ?? '',
          CATEGORY_META[i.category].label,
          i.action,
          i.appliesTo.join('; '),
          i.deadline.kind === 'periodic'
            ? `Recurring — ${i.deadline.frequency}`
            : i.deadline.kind === 'event'
              ? `Event-based — ${i.deadline.trigger}`
              : i.deadline.kind === 'fixed'
                ? `By ${i.deadline.date}`
                : i.deadline.note,
          i.evidenceExpected,
        ]
          .map((v) => esc(String(v)))
          .join(','),
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RF-Live_Checklist_${c.regulator}_${c.refNo.replace(/[^\w-]/g, '')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="px-4 py-1 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Compliance Checklist — auto-derived from this circular</h3>
            <p className="text-[11px] text-on-surface-variant truncate">
              Clause-by-clause action items with applicability &amp; deadlines — not a verbatim dump. Every row traces to its published clause.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-medium shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Download Excel-ready CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-on-surface-variant text-[12px] font-medium hover:border-primary/50 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">print</span>
            Print
          </button>
        </div>
      </div>

      {/* Category chips — the month-end triage workflow */}
      <div className="px-4 py-3 mt-3 border-y border-outline-variant/20 flex items-center gap-2 flex-wrap bg-surface-container-low">
        {(Object.keys(CATEGORY_META) as ChecklistCategory[])
          .filter((k) => (counts.get(k) ?? 0) > 0)
          .map((k) => (
          <button
            key={k}
            onClick={() => setCat(cat === k ? 'all' : k)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
              cat === k
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{CATEGORY_META[k].icon}</span>
            {CATEGORY_META[k].label}
            <span className={`text-[10px] ${cat === k ? 'opacity-80' : 'text-on-surface-variant'}`}>
              {counts.get(k) ?? 0}
            </span>
          </button>
        ))}
        {cat !== 'all' && (
          <button onClick={() => setCat('all')} className="text-[11px] text-primary font-medium ml-1 inline-flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[13px]">close</span> Clear
          </button>
        )}
        <span className="ml-auto text-[11px] text-on-surface-variant hidden md:flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">merge_type</span>Select rows to merge</span>
          <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">visibility_off</span>N/A hides an item</span>
        </span>
      </div>

      {/* Selection toolbar */}
      {selected.size > 0 && (
        <div className="px-4 py-2.5 border-b border-outline-variant/20 bg-secondary-container/60 flex items-center gap-3 flex-wrap">
          <span className="text-[12px] font-medium">{selected.size} selected</span>
          <button
            onClick={doMerge}
            disabled={!canMerge}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-medium ${
              canMerge
                ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">merge_type</span>
            Merge into one evidence item
          </button>
          {merges.length > 0 && (
            <button onClick={() => setMerges([])} className="text-[12px] text-primary font-medium">
              Unmerge all ({merges.length})
            </button>
          )}
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[12px] text-on-surface-variant">
            Clear selection
          </button>
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-outline-variant/15">
        {rows.map((r) =>
          'group' in r ? (
            (() => {
              const members = r.group.map((id) => c.checklist.find((x) => x.id === id)!);
              return (
                <div key={r.group.join('+')} className="px-4 py-4 bg-tertiary/[0.06] relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge tone="tertiary">
                          <span className="material-symbols-outlined text-[12px]">merge_type</span>
                          Merged · one evidence item
                        </Badge>
                        {members.map((m) => (
                          <span key={m.id} className="text-[11px] font-mono text-on-surface-variant">{m.ref}</span>
                        ))}
                      </div>
                      <ul className="space-y-1 mb-1.5">
                        {members.map((m) => (
                          <li key={m.id} className="text-[13px] leading-snug flex gap-2">
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant mt-[2px]">subdirectory_arrow_right</span>
                            {m.action}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-on-surface-variant flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[13px] mt-[1px]">fact_check</span>
                        Combined evidence: {members.map((m) => m.evidenceExpected.split(' ')[0]).join(' + ')}… packaged as one artefact.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={members.every((m) => selected.has(m.id))}
                        onChange={() => toggleSelect(members[0].id)}
                        title="Select group"
                        className="accent-[var(--color-primary)] w-3.5 h-3.5"
                      />
                      <button onClick={() => unmerge(r.group)} className="text-[11px] text-tertiary font-medium whitespace-nowrap">
                        Unmerge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            (() => {
              const item = r;
              return (
                <div key={item.id} className="px-4 py-4 group/row hover:bg-surface-container-low/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      title="Select to merge"
                      className="mt-1 accent-[var(--color-primary)] w-3.5 h-3.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-mono px-1.5 py-[2px] rounded bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold">
                          {item.ref}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
                          <span className="material-symbols-outlined text-[13px]">{CATEGORY_META[item.category].icon}</span>
                          {CATEGORY_META[item.category].label}
                        </span>
                        {item.section && <span className="text-[11px] text-on-surface-variant/70 truncate hidden lg:inline">· {item.section}</span>}
                      </div>
                      <p className="text-[13.5px] leading-snug mb-1.5">{item.action}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {deadlineChip(item.deadline)}
                        <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
                          <span className="material-symbols-outlined text-[13px]">domain</span>
                          {item.appliesTo.join(', ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1.5 flex items-start gap-1.5 max-w-3xl">
                        <span className="material-symbols-outlined text-[13px] mt-[1px]">fact_check</span>
                        <span><span className="font-semibold">Evidence expected:</span> {item.evidenceExpected}</span>
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => toggleNa(item.id)}
                        title="Mark N/A — hidden from this view"
                        className="p-1.5 rounded-md text-on-surface-variant/60 hover:text-error hover:bg-error-container/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ),
        )}
        {rows.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px] text-on-surface-variant">
            No items in this view.
          </div>
        )}
      </div>

      {/* N/A footer */}
      {naIds.size > 0 && (
        <div className="px-4 py-2.5 border-t border-outline-variant/20 bg-surface-container flex items-center gap-2 flex-wrap">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">visibility_off</span>
          <span className="text-[12px] text-on-surface-variant">
            {naIds.size} item{naIds.size > 1 ? 's' : ''} marked N/A — hidden here and in every export.
          </span>
          <button onClick={() => setNaIds(new Set())} className="text-[12px] text-primary font-medium ml-auto">
            Restore all
          </button>
        </div>
      )}

      {/* Free-tier boundary */}
      <div className="px-4 py-3 border-t border-outline-variant/20 bg-gradient-to-r from-primary/[0.05] to-transparent flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-primary">workspace_premium</span>
          Working the checklist inside RF — evidence slots per item, assignments, audit trail — comes when you bring your entity. The checklist itself stays free.
        </p>
        <span className="text-[11px] font-medium text-primary inline-flex items-center gap-1 whitespace-nowrap">
          Free · no account needed
          <span className="material-symbols-outlined text-[13px]">lock_open</span>
        </span>
      </div>
    </div>
  );
}
