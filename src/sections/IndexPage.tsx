import { useMemo, useState } from 'react';
import { circulars } from '../data';
import type { Circular } from '../data/types';
import { SearchBar } from '../components/SearchBar';

export type CircularLens = 'read' | 'clarify';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ParsedDate {
  month: number; // 0-11
  year: number;
}

function parseDated(dated: string): ParsedDate | null {
  const m = dated.match(/(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})/);
  if (!m) return null;
  const mi = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
  return mi === -1 ? null : { month: mi, year: Number(m[3]) };
}

/** monthKey = year*12 + month — makes range comparisons trivial. */
const toKey = (y: number, m: number) => y * 12 + m;

/**
 * IndexPage — the landing surface: every tracked circular in one searchable
 * list (the KMT-style index). Search lives here and only here; the circular
 * page itself stays chrome-free. Filters sit in a left rail: regulator
 * (multi-select), affected entities (multi-select), and a month/year picker
 * that defaults to the current month.
 */
export function IndexPage({
  onOpen,
}: {
  onOpen: (circularId: string, lens: CircularLens) => void;
}) {
  // ---- filter state -------------------------------------------------
  const regulators = useMemo(
    () => Array.from(new Set(circulars.map((c) => c.regulator))).sort(),
    []
  );
  const entities = useMemo(
    () => Array.from(new Set(circulars.flatMap((c) => c.appliesTo))).sort(),
    []
  );
  const [selRegulators, setSelRegulators] = useState<Set<string>>(new Set(regulators));
  const [selEntities, setSelEntities] = useState<Set<string>>(new Set(entities));

  const now = new Date();
  // Default to the current month; with stale demo data, fall back to the
  // latest month that actually has a circular so the landing list is never empty.
  const latestDated = useMemo(
    () =>
      circulars
        .map((c) => parseDated(c.dated))
        .filter((d): d is ParsedDate => d !== null)
        .sort((a, b) => toKey(b.year, b.month) - toKey(a.year, a.month))[0],
    []
  );
  const defaultMonth = latestDated ?? {
    month: now.getMonth(),
    year: now.getFullYear(),
  };
  // Default window: the 3 months ending at defaultMonth.
  const lastKey = toKey(defaultMonth.year, defaultMonth.month);
  const [year, setYear] = useState(defaultMonth.year);
  const [monthKeys, setMonthKeys] = useState<Set<number>>(
    new Set([lastKey, lastKey - 1, lastKey - 2])
  );

  const toggle = (set: Set<string>, v: string) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  };

  const toggleMonth = (y: number, m: number) => {
    const k = toKey(y, m);
    setMonthKeys((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };

  const wholeYear = (y: number) =>
    setMonthKeys(new Set(Array.from({ length: 12 }, (_, m) => toKey(y, m))));

  const // ---- filtering ---------------------------------------------------
  filtered = useMemo(() => {
    return circulars.filter((c) => {
      if (selRegulators.size > 0 && !selRegulators.has(c.regulator)) return false;
      if (selEntities.size > 0 && !c.appliesTo.some((a) => selEntities.has(a))) return false;
      if (monthKeys.size > 0) {
        const d = parseDated(c.dated);
        if (!d || !monthKeys.has(toKey(d.year, d.month))) return false;
      }
      return true;
    });
  }, [selRegulators, selEntities, monthKeys]);

  return (
    <div className="px-8 py-8 max-w-6xl w-full mx-auto">
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">account_balance</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Regulatory Index</h1>
        </div>
        <p className="text-[13px] text-on-surface-variant max-w-2xl">
          Every tracked circular, near real-time. Open one to get its compliance
          checklist — clause-by-clause, exportable to Excel. No account needed.
        </p>
        {/* The only search in the app */}
        <SearchBar onSelect={(cid, tab) => onOpen(cid, tab)} />
      </div>

      <div className="flex gap-6 items-start">
        {/* ---- Left filter rail ---- */}
        <aside className="w-60 shrink-0 space-y-5 sticky top-20">
          <FilterGroup title="Regulator">
            {regulators.map((r) => (
              <FilterCheck
                key={r}
                label={r}
                checked={selRegulators.has(r)}
                onToggle={() => setSelRegulators((s) => toggle(s, r))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Affected entities">
            {entities.map((e) => (
              <FilterCheck
                key={e}
                label={e}
                checked={selEntities.has(e)}
                onToggle={() => setSelEntities((s) => toggle(s, e))}
              />
            ))}
          </FilterGroup>

          {/* ---- Month / year picker ---- */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Period
            </p>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => {
                  setYear((y) => y - 1);
                  setMonthKeys(new Set());
                }}
                className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                aria-label="Previous year"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <div className="text-center">
                <span className="text-[13px] font-semibold">{year}</span>
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => setMonthKeys(new Set())}
                    className="text-[9px] uppercase tracking-wide text-primary font-medium hover:underline"
                  >
                    all time
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setYear((y) => y + 1);
                  setMonthKeys(new Set());
                }}
                className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                aria-label="Next year"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((m, i) => {
                const k = toKey(year, i);
                const active = monthKeys.has(k);
                return (
                  <button
                    key={m}
                    onClick={() => toggleMonth(year, i)}
                    className={`px-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => wholeYear(year)}
              className="w-full mt-2 py-1 rounded-md text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
            >
              Whole year {year}
            </button>
            {monthKeys.size === 0 && (
              <p className="text-[10px] text-on-surface-variant mt-2 text-center">
                No month selected — showing all periods
              </p>
            )}
          </div>

          {(selRegulators.size > 0 || selEntities.size > 0 || monthKeys.size > 0) && (
            <button
              onClick={() => {
                setSelRegulators(new Set(regulators));
                setSelEntities(new Set(entities));
                setMonthKeys(new Set([lastKey, lastKey - 1, lastKey - 2]));
                setYear(defaultMonth.year);
              }}
              className="w-full py-1.5 rounded-lg border border-outline-variant/40 text-[11px] font-medium text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors"
            >
              Reset filters
            </button>
          )}
        </aside>

        {/* ---- Circular list ---- */}
        <div className="flex-1 min-w-0 space-y-3">
          <p className="text-[11px] text-on-surface-variant">
            {filtered.length} circular{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden divide-y divide-outline-variant/15">
            {filtered.map((c) => (
              <IndexRow key={c.id} circular={c} onOpen={onOpen} />
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-[13px] text-on-surface-variant">
                No circulars match these filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm p-4 space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterCheck({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-surface-container-low transition-colors text-left group"
    >
      <span
        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-primary border-primary text-on-primary'
            : 'border-outline-variant/60 group-hover:border-primary/60'
        }`}
      >
        {checked && <span className="material-symbols-outlined text-[11px] leading-none">check</span>}
      </span>
      <span className={`text-[12px] ${checked ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </button>
  );
}

function IndexRow({
  circular: c,
  onOpen,
}: {
  circular: Circular;
  onOpen: (circularId: string, lens: CircularLens) => void;
}) {
  return (
    <button
      onClick={() => onOpen(c.id, 'read')}
      className="w-full text-left px-5 py-4 hover:bg-surface-container-low/60 transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="text-[10px] px-1.5 py-[2px] bg-secondary-container text-on-secondary-container rounded font-semibold uppercase tracking-wide">
          {c.regulator}
        </span>
        <span className="text-[11px] font-mono text-on-surface-variant">{c.refNo}</span>
        <span className="text-[11px] text-on-surface-variant">· dated {c.dated}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Open circular
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </span>
      </div>
      <p className="text-[14px] font-medium leading-snug mb-1">{c.title}</p>
      <p className="text-[12px] text-on-surface-variant leading-relaxed line-clamp-2 max-w-3xl mb-1.5">
        {c.summary}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {c.appliesTo.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full bg-secondary-container/60 text-on-secondary-container text-[11px] font-medium border border-outline-variant/25"
          >
            <span className="material-symbols-outlined text-[12px]">domain</span>
            {a}
          </span>
        ))}
      </div>
    </button>
  );
}
