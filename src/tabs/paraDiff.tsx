import { useMemo } from 'react';

/**
 * Naive word-level diff: words in the new text that don't appear in the old
 * version render green (Google-Docs-style additions). Removals stay visible
 * via the old text shown alongside.
 */
export function DiffText({ text, previous }: { text: string; previous?: string }) {
  const oldWords = useMemo(
    () => (previous ? new Set(previous.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []) : null),
    [previous]
  );
  if (!oldWords) return <>{text}</>;
  const parts = text.split(/([\p{L}\p{N}]+)/gu);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 && !oldWords.has(p.toLowerCase()) ? (
          <mark key={i} className="bg-primary/15 text-primary rounded px-[1px]">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
