import type { Circular } from '../data/types';

/**
 * Hero — identity + applicability + neutral summary. Order mirrors what a
 * compliance reader asks first: what document is this → does it apply to me →
 * what's the one-line gist. No institution-specific state.
 */
export function HeroSection({ circular: c }: { circular: Circular }) {
  return (
    <section className="space-y-4">
      {/* Identity + meta */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <span className="text-[10px] px-1.5 py-[2px] bg-secondary-container text-on-secondary-container rounded font-semibold uppercase tracking-wide">
            {c.regulator}
          </span>
          <span className="text-[11px] font-mono text-on-surface-variant">{c.refNo}</span>
          <span className="text-[11px] text-on-surface-variant">· dated {c.dated}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>
      </div>

      {/* Applies to — the applicability gate */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mr-1">
          Applies to
        </span>
        {c.appliesTo.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-medium border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[14px]">domain</span>
            {a}
          </span>
        ))}
      </div>

      {/* Neutral summary */}
      <p className="text-[14px] text-on-surface-variant leading-relaxed max-w-3xl">{c.summary}</p>
    </section>
  );
}