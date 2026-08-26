import { useMemo, useState, useRef, useEffect } from 'react';
import { circulars } from '../data';


type HitKind = 'clause' | 'checklist' | 'commentary' | 'clarification';

interface Hit {
  circularId: string;
  regulator: string;
  kind: HitKind;
  ref: string;
  title: string;
  snippet: string;
  /** Which analysis tab surfaces this content */
  tab: 'change' | 'overview' | 'reader' | 'trace' | 'checklist';
}

const KIND_META: Record<HitKind, { label: string; icon: string }> = {
  clause: { label: 'Clause', icon: 'menu_book' },
  checklist: { label: 'Checklist item', icon: 'checklist' },
  commentary: { label: 'Expert commentary', icon: 'forum' },
  clarification: { label: 'Clarification', icon: 'help' },
};

/** Flatten every searchable surface of every circular into scored hits. */
function buildIndex(): Hit[] {
  const hits: Hit[] = [];
  for (const c of circulars) {
    for (const cl of c.clauses) {
      hits.push({
        circularId: c.id,
        regulator: c.regulator,
        kind: 'clause',
        ref: cl.ref,
        title: cl.section ?? cl.ref,
        snippet: cl.text,
        tab: 'reader',
      });
    }
    for (const ck of c.checklist) {
      hits.push({
        circularId: c.id,
        regulator: c.regulator,
        kind: 'checklist',
        ref: ck.ref,
        title: ck.action,
        snippet: ck.evidenceExpected,
        tab: 'checklist',
      });
    }
    for (const com of c.commentary) {
      hits.push({
        circularId: c.id,
        regulator: c.regulator,
        kind: 'commentary',
        ref: com.clauseRef,
        title: `${com.author} — ${com.publishedAt}`,
        snippet: com.text,
        tab: 'change',
      });
    }
    for (const q of c.clarifications) {
      hits.push({
        circularId: c.id,
        regulator: c.regulator,
        kind: 'clarification',
        ref: q.clauseRef,
        title: q.text,
        snippet: q.aiAnswer?.text ?? 'Open question — awaiting partner commentary.',
        tab: 'change',
      });
    }
  }
  return hits;
}

function score(hit: Hit, q: string): number {
  const needle = q.toLowerCase();
  const hay = `${hit.title} ${hit.snippet} ${hit.ref}`.toLowerCase();
  if (!hay.includes(needle)) {
    // naive word-AND match as fallback
    const words = needle.split(/\s+/).filter(Boolean);
    if (!words.every((w) => hay.includes(w))) return 0;
  }
  let s = 1;
  if (hit.title.toLowerCase().includes(needle)) s += 3;
  if (hit.ref.toLowerCase().includes(needle)) s += 2;
  return s;
}

/**
 * SearchBar — global search across every indexed surface of every circular.
 * Free, instant, no login: the habit KMT charges ₹1.5L/yr for, given away.
 */
export function SearchBar({
  onSelect,
}: {
  onSelect: (circularId: string, tab: Hit['tab']) => void;
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    return index
      .map((h) => ({ h, s: score(h, q.trim()) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.h);
  }, [q, index]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const pick = (h: Hit) => {
    onSelect(h.circularId, h.tab);
    setOpen(false);
    setQ('');
  };

  return (
    <div ref={boxRef} className="relative min-w-[220px] flex-1 max-w-md">
      <span className="material-symbols-outlined text-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
        search
      </span>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search clauses, checklists, commentary…"
        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-[12px] placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/60"
      />
      {open && q.trim().length >= 2 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-lg border border-outline-variant/25 bg-surface shadow-lg overflow-hidden max-h-[420px] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-[12px] text-on-surface-variant">
              No matches across the tracked instruments.
            </p>
          ) : (
            results.map((h, i) => (
              <button
                key={i}
                onClick={() => pick(h)}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 last:border-0"
              >
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-[1px] rounded bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wide">
                    {h.regulator}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[12px]">{KIND_META[h.kind].icon}</span>
                    {KIND_META[h.kind].label}
                  </span>
                  <span className="text-[10px] font-mono text-primary">{h.ref}</span>
                </div>
                <p className="text-[12px] leading-snug line-clamp-2">{h.title}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export type { Hit };
