import type { Circular, RegulationRef } from '../data/types';
import { Card } from '../components/ui';

/**
 * Traceability — the source → requirement → obligation lineage.
 * Rendered as a flowing horizontal chain (with a wrapping fallback) so every
 * obligation visibly traces back to its source instrument + clause.
 */
export function TraceabilityTab({ circular: c }: { circular: Circular }) {
  const basis: RegulationRef[] = c.current.interpretationBasis;

  return (
    <div className="py-6 space-y-5">
      <p className="text-[13px] text-on-surface-variant">
        Every obligation maps to a source instrument and clause. Nothing floats free — the lineage is provable.
      </p>

      {/* The lineage chain */}
      <Card className="overflow-hidden">
        <ChainRow
          left="Source instrument"
          leftTag={c.instrumentType}
          center="Requirement / clause"
          centerTag={basis.map((b) => b.clause).join(' · ')}
          right="Obligations"
          rightTag={`${c.obligations.length}`}
        />

        <div className="border-t border-outline-variant/20">
          {/* Obligations → source mapping table */}
          <div className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
              Obligation → source mapping
            </p>
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20">
                <tr>
                  <th className="py-2 pr-2 font-semibold">Obligation</th>
                  <th className="py-2 px-2 font-semibold hidden sm:table-cell">Source</th>
                  <th className="py-2 pl-2 font-semibold">Clause</th>
                </tr>
              </thead>
              <tbody>
                {c.obligations.map((o) => (
                  <tr key={o.id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low">
                    <td className="py-2.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-on-surface-variant shrink-0">{o.id}</span>
                        <span className="font-medium">{o.label}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-on-surface-variant hidden sm:table-cell">{o.source}</td>
                    <td className="py-2.5 pl-2 font-mono text-primary">{o.clause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Source card at top of lineage */}
      <Card>
        <div className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-3">Source evidence</p>
          {basis.map((b, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 text-[13px] last:mb-0">
              <span className="material-symbols-outlined text-primary text-lg">description</span>
              <div>
                <p className="font-medium">{b.source}</p>
                <p className="text-on-surface-variant font-mono text-[11px]">{b.clause}</p>
              </div>
              {b.url && (
                <a href={b.url} target="_blank" rel="noreferrer" className="ml-auto text-[12px] text-primary hover:underline shrink-0">
                  open source ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ChainRow({
  left,
  leftTag,
  center,
  centerTag,
  right,
  rightTag,
}: {
  left: string;
  leftTag: string;
  center: string;
  centerTag: string;
  right: string;
  rightTag: string;
}) {
  const nodes = [
    { tone: 'bg-surface border-outline-variant/40 text-on-surface', icon: 'description', label: left, tag: leftTag },
    { tone: 'bg-primary/5 border-primary/20', icon: 'rule', label: center, tag: centerTag },
    { tone: 'bg-surface border-outline-variant/40 text-on-surface', icon: 'fact_check', label: right, tag: rightTag },
  ];
  return (
    <div className="p-5 bg-surface-container-lowest">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
        Obligation lineage — source → requirement → obligation
      </p>
      <div className="flex items-stretch gap-2 flex-wrap">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`py-3 px-4 rounded-lg border ${n.tone} min-w-[180px]`}>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-[14px] text-primary">{n.icon}</span>
                <span className="font-semibold">{n.label}</span>
              </div>
              <p className="text-[13px] font-medium">{n.tag}</p>
            </div>
            {i < nodes.length - 1 && (
              <span className="material-symbols-outlined text-primary shrink-0">arrow_forward</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
