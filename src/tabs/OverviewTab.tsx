import type { Circular } from '../data/types';
import { Badge, Card, CardHeader, Pill, StatCard } from '../components/ui';

/**
 * Overview — regulator's requirement, evolution trajectory, and obligations
 * arising. Identity + summary live in the HeroSection above; this pane starts
 * directly at the analysis (no duplicated title block).
 */
export function OverviewTab({ circular: c }: { circular: Circular }) {
  return (
    <div className="py-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="description" label="Obligations" value={c.obligations.length} />
        <StatCard icon="history" label="Evolution nodes" value={c.evolution.length} />
        <StatCard icon="fact_check" label="Traceable" value="100%" accent="text-green-600" />
        <StatCard icon="record_voice_over" label="Expert notes" value={c.commentary.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Regulator's requirement + interpretation basis */}
        <div className="lg:col-span-8 space-y-5">
          <Card>
            <CardHeader icon="gavel" title="Regulator's Requirement" accent="bg-primary/5" />
            <div className="p-5">
              <div className="bg-surface-container rounded-lg p-4 mb-4 border-l-4 border-primary">
                <p className="text-[14px] leading-relaxed">{c.current.summary}</p>
              </div>
              <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-2">
                Interpretation basis
              </p>
              <ul className="space-y-1.5">
                {c.current.interpretationBasis.map((b, i) => (
                  <li key={i} className="text-[13px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">link</span>
                    <span className="font-medium">{b.source}</span>
                    <span className="text-on-surface-variant font-mono">— {b.clause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Evolution trajectory */}
          <Card>
            <CardHeader icon="history" title="Evolution Trajectory" />
            <div className="p-5">
              <div className="relative pl-5 border-l-2 border-surface-variant space-y-6">
                {c.evolution.map((n) => (
                  <div key={n.date} className="relative">
                    <span
                      className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 ${
                        n.current ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant'
                      }`}
                    />
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <span className={`text-[12px] font-semibold ${n.current ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {n.date}
                      </span>
                      {n.current && <Badge tone="green">Current</Badge>}
                    </div>
                    <h4 className="text-sm font-medium">{n.title}</h4>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Obligations arising from this circular */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader icon="rule" title="Obligations arising" right={<span className="text-[11px] font-mono text-on-surface-variant">{c.obligations.length}</span>} />
            <div className="p-3 space-y-2">
              {c.obligations.map((o) => (
                <div key={o.id} className="p-3 rounded-lg bg-surface hover:bg-surface-container-low transition-colors border border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-on-surface-variant">{o.id}</span>
                  </div>
                  <p className="text-[13px] font-medium leading-snug mb-1.5">{o.label}</p>
                  <Pill>
                    <span className="material-symbols-outlined text-[12px] text-primary">link</span>
                    {o.source} · {o.clause}
                  </Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}