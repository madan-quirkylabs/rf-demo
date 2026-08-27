import { useMemo } from 'react';
import type { ChangeType } from '../data/types';

export const CHANGE_META: Record<ChangeType, { label: string; chip: string }> = {
  new: { label: 'New', chip: 'bg-primary/10 text-primary border-primary/20' },
  amended: { label: 'Amended', chip: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  withdrawn: { label: 'Withdrawn', chip: 'bg-error-container text-on-error-container border-error/20' },
  unchanged: { label: 'Unchanged', chip: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30' },
};

export interface DiffSeg {
  kind: 'same' | 'add' | 'del';
  text: string;
}

function tokenize(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

/**
 * Word-level LCS diff between old and new text. Returns segments in new-text
 * order: unchanged runs, additions (in new, not old), deletions (in old, not
 * new) placed where they occurred. O(n·m) on token counts — fine for paras.
 */
export function diffWords(oldText: string, newText: string): DiffSeg[] {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const an = a.map(norm);
  const bn = b.map(norm);

  // LCS table (guard: cap to avoid pathological blowup on huge paras)
  if (a.length * b.length > 4_000_000) return [{ kind: 'same', text: newText }];
  const dp: Uint32Array[] = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = an[i] === bn[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const segs: DiffSeg[] = [];
  const push = (kind: DiffSeg['kind'], text: string) => {
    const last = segs[segs.length - 1];
    if (last && last.kind === kind) last.text += text;
    else segs.push({ kind, text });
  };
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (an[i] === bn[j]) {
      push('same', b[j]);
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push('del', a[i]);
      i++;
    } else {
      push('add', b[j]);
      j++;
    }
  }
  while (i < a.length) push('del', a[i++]);
  while (j < b.length) push('add', b[j++]);
  return segs;
}

/** DiffText — Devesh's track-changes view: additions green, deletions struck. */
export function DiffText({ text, previous }: { text: string; previous?: string }) {
  const segs = useMemo(
    () => (previous ? diffWords(previous, text) : null),
    [previous, text]
  );
  if (!segs) return <>{text}</>;
  return (
    <>
      {segs.map((s, i) =>
        s.kind === 'add' ? (
          <mark key={i} className="bg-primary/15 text-primary rounded px-[1px] font-medium">
            {s.text}
          </mark>
        ) : s.kind === 'del' ? (
          <s key={i} className="text-on-surface-variant/50">
            {s.text}
          </s>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </>
  );
}
