import { useMemo, useState } from 'react';
import type { Circular, Commentary } from '../data/types';

const SOURCE_BADGE: Record<
  NonNullable<Commentary['sourceType']>,
  { label: string; tone: string }
> = {
  'law-firm': { label: 'Law firm', tone: 'bg-primary/10 text-primary border-primary/25' },
  big4: { label: 'Big 4', tone: 'bg-secondary-container text-on-secondary-container border-outline-variant/30' },
  'industry-body': { label: 'Industry body', tone: 'bg-tertiary/10 text-tertiary border-tertiary/25' },
};

/** Base para of a ref: "Para 74(5)" → "Para 74". */
const baseRef = (r: string) => r.split('(')[0].trim();

/**
 * PartnerCommentary — the partner pitch surface. Partners are the headline:
 * a rail of named partners (with commentary counts) on the left, their
 * para-pinned commentary on the right. Each card cites the exact para and
 * jumps into the verbatim text in Read circular. No reader chrome here —
 * no para list, no export; those belong to Read circular.
 */
export function PartnerCommentary({
  circular: c,
  onOpenPara,
}: {
  circular: Circular;
  onOpenPara: (paraRef: string) => void;
}) {
  const partners = useMemo(() => {
    const map = new Map<string, { author: string; sourceType?: Commentary['sourceType']; items: Commentary[] }>();
    for (const co of c.commentary) {
      const key = co.author;
      if (!map.has(key)) map.set(key, { author: co.author, sourceType: co.sourceType, items: [] });
      map.get(key)!.items.push(co);
    }
    return Array.from(map.values());
  }, [c]);

  const [selected, setSelected] = useState<string>('all');
  const visible =
    selected === 'all' ? c.commentary : c.commentary.filter((co) => co.author === selected);

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* ---- Partner rail ---- */}
        <div className="lg:col-span-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
          <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">handshake</span>
            <h3 className="text-[12px] font-semibold">Partners on this circular</h3>
          </div>
          <div className="p-2 space-y-1.5">
            <RailButton
              active={selected === 'all'}
              onClick={() => setSelected('all')}
              title="All partners"
              badge={`${c.commentary.length}`}
            />
            {partners.map((p) => (
              <RailButton
                key={p.author}
                active={selected === p.author}
                onClick={() => setSelected(p.author)}
                title={p.author}
                badge={`${p.items.length}`}
                type={p.sourceType}
              />
            ))}
            {/* The pitch slot — visible to prospective partners */}
            <div className="mt-2 rounded-lg border border-dashed border-tertiary/40 bg-tertiary/[0.04] px-3 py-2.5">
              <p className="text-[11px] text-on-surface-variant leading-snug">
                <span className="font-semibold text-tertiary">Your commentary here.</span>{' '}
                Published analysis attributed to your firm, pinned to the paras you explain.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Commentary cards ---- */}
        <div className="lg:col-span-9 rounded-xl border border-outline-variant/20 bg-surface-container-lowest flex flex-col">
          <div className="px-4 py-2.5 border-b border-outline-variant/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">record_voice_over</span>
            <h3 className="text-[12px] font-semibold">
              {selected === 'all' ? 'All partner commentary' : selected}
            </h3>
            <span className="ml-auto text-[11px] text-on-surface-variant font-mono">{visible.length}</span>
          </div>
          <div className="max-h-[62vh] overflow-y-auto p-3 space-y-2.5">
            {visible.length === 0 && (
              <p className="text-[13px] text-on-surface-variant px-2 py-4">
                No commentary from this partner on this circular.
              </p>
            )}
            {visible.map((co) => {
              const sb = co.sourceType ? SOURCE_BADGE[co.sourceType] : null;
              const paraRefs = co.clauseRef.match(/Para\s*\d+/g) ?? [co.clauseRef];
              return (
                <div
                  key={co.id}
                  className={`rounded-lg border bg-surface p-4 ${
                    co.official ? 'border-l-4 border-l-primary border-outline-variant/20' : 'border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[13px] font-semibold">{co.author}</span>
                    {co.official && (
                      <span className="text-[9px] px-1.5 py-[1px] rounded bg-primary/10 text-primary font-semibold uppercase tracking-wide border border-primary/25">
                        Official
                      </span>
                    )}
                    {sb && (
                      <span className={`text-[9px] px-1.5 py-[1px] rounded font-semibold uppercase tracking-wide border ${sb.tone}`}>
                        {sb.label}
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-on-surface-variant">{co.publishedAt}</span>
                  </div>

                  {/* Para pin — the citation this commentary explains */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      On
                    </span>
                    {paraRefs.map((pr) => (
                      <button
                        key={pr}
                        onClick={() => onOpenPara(baseRef(pr))}
                        className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-primary/10 text-primary text-[11px] font-mono font-semibold border border-primary/20 hover:bg-primary/20 transition-colors"
                        title="Open this para in the circular"
                      >
                        {pr}
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[12.5px] leading-relaxed text-on-surface">{co.text}</p>

                  {co.sourceUrl && (
                    <a
                      href={co.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline mt-2 inline-block"
                    >
                      View official source ↗
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RailButton({
  active,
  onClick,
  title,
  badge,
  type,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  badge: string;
  type?: Commentary['sourceType'];
}) {
  const sb = type ? SOURCE_BADGE[type] : null;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        active ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface-container-low border border-transparent'
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[14px]">
          {type === 'industry-body' ? 'groups' : 'person'}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-medium truncate">{title}</span>
        {sb && <span className="block text-[10px] text-on-surface-variant">{sb.label}</span>}
      </span>
      <span className="text-[11px] font-mono text-on-surface-variant shrink-0">{badge}</span>
    </button>
  );
}
