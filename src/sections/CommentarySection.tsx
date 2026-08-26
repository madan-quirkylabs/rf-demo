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
  const industryBodies = c.commentary.filter((x) => x.official && x.sourceType === 'industry-body');
  const firms = c.commentary.filter((x) => x.official && x.sourceType !== 'industry-body');
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

      {industryBodies.length === 0 && firms.length === 0 && community.length === 0 && (
        <Card>
          <div className="p-5 text-[13px] text-on-surface-variant">
            No partner commentary available for this circular yet.
          </div>
        </Card>
      )}

      {/* Industry-body clarifications — the FACE member-benefit channel */}
      {industryBodies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Industry-body clarifications — monthly journals, injected &amp; attributed
            </p>
            <span className="text-[11px] text-on-surface-variant inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">card_membership</span>
              distributed to members as a benefit — free to read here
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {industryBodies.map((co) => (
              <CommentaryCard key={co.id} id={co.id} circular={c} />
            ))}
          </div>
        </div>
      )}

      {firms.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Official partner commentary — law firms &amp; Big 4
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {firms.map((co) => (
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
  const SOURCE_BADGE = {
    'law-firm': { label: 'Law firm', tone: 'primary' as const },
    big4: { label: 'Big 4', tone: 'secondary' as const },
    'industry-body': { label: 'Industry body', tone: 'tertiary' as const },
  } as const;
  const sb = co.sourceType ? SOURCE_BADGE[co.sourceType] : null;
  return (
    <Card className={co.official ? (co.sourceType === 'industry-body' ? 'border-l-4 border-l-tertiary' : 'border-l-4 border-l-primary') : ''}>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`material-symbols-outlined text-lg ${co.sourceType === 'industry-body' ? 'text-tertiary' : 'text-primary'}`}>
              {co.sourceType === 'industry-body' ? 'groups' : 'person'}
            </span>
            <span className="text-[14px] font-semibold truncate">{co.author}</span>
            {co.official ? <Badge tone="primary">Official</Badge> : <Badge tone="neutral">Community</Badge>}
            {sb && <Badge tone={sb.tone}>{sb.label}</Badge>}
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
