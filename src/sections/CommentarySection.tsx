import type { Circular } from '../data/types';
import { Card, Badge } from '../components/ui';

/**
 * Commentary — expert analysis attributable to named partners / SROs.
 *
 * DEMO NOTE: The commentary below is illustrative placeholder content created to
 * show partners (FACE, SROs, law firms, consultancies) where their officially
 * attributed analysis would appear. Nothing here is a real partner publication.
 */
export function CommentarySection({ circular: c }: { circular: Circular }) {
  const official = c.commentary.filter((x) => x.official);
  const community = c.commentary.filter((x) => !x.official);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">record_voice_over</span>
            Partner Commentary
          </h2>
          <p className="text-[13px] text-on-surface-variant mt-1 max-w-2xl">
            Analysis from law firms, consultancies, and industry bodies — attributed to the partner who published it.
          </p>
        </div>
        {/* Illustrative-data banner — the pitch to partners */}
        <div className="shrink-0 rounded-lg border border-dashed border-tertiary/40 bg-tertiary/5 px-4 py-3 max-w-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-tertiary mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Illustrative placeholder
          </p>
          <p className="text-[12px] text-on-surface leading-snug">
            Entries below are AI-generated placeholders. Your organization's official commentary would appear here, attributed to you.
          </p>
        </div>
      </div>

      {official.length === 0 && community.length === 0 && (
        <Card>
          <div className="p-5 text-[13px] text-on-surface-variant">
            No partner commentary available for this circular yet.
          </div>
        </Card>
      )}

      {official.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Official partner commentary
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {official.map((co) => (
              <CommentaryCard key={co.id} id={co.id} circular={c} />
            ))}
          </div>
        </div>
      )}

      {community.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Community contributions
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {community.map((co) => (
              <CommentaryCard key={co.id} id={co.id} circular={c} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CommentaryCard({ id, circular: c }: { id: string; circular: Circular }) {
  const co = c.commentary.find((x) => x.id === id)!;
  return (
    <Card className={co.official ? 'border-l-4 border-l-primary' : ''}>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
            <span className="text-[14px] font-semibold truncate">{co.author}</span>
            {co.official ? <Badge tone="primary">Official</Badge> : <Badge tone="neutral">Community</Badge>}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant shrink-0">
            <span className="font-mono">{co.clauseRef}</span>
            <span>{co.publishedAt}</span>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed text-on-surface">{co.text}</p>
        <div className="mt-3 flex items-center justify-between">
          {co.sourceUrl ? (
            <a href={co.sourceUrl} target="_blank" rel="noreferrer" className="text-[12px] text-primary hover:underline">
              View official source ↗
            </a>
          ) : (
            <span className="text-[11px] text-on-surface-variant italic">illustrative — no live source</span>
          )}
        </div>
      </div>
    </Card>
  );
}
