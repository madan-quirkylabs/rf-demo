import type { Circular } from '../data/types';
import { ChangeTab } from '../tabs/ChangeTab';
import { CircularReaderTab } from '../tabs/CircularReaderTab';
import { TraceabilityTab } from '../tabs/TraceabilityTab';
import { OverviewTab } from '../tabs/OverviewTab';
import { ChecklistTab } from '../tabs/ChecklistTab';

export type AnalysisTab = 'change' | 'overview' | 'reader' | 'trace' | 'checklist';

const TABS: { id: AnalysisTab; label: string; icon: string }[] = [
  { id: 'change', label: 'What Changed', icon: 'difference' },
  { id: 'overview', label: 'Overview', icon: 'description' },
  { id: 'reader', label: 'Circular Reader', icon: 'menu_book' },
  { id: 'trace', label: 'Traceability', icon: 'account_tree' },
  { id: 'checklist', label: 'Compliance Checklist', icon: 'checklist' },
];

/**
 * AnalysisPane — the analytical views of the circular, folded into an in-page
 * tab bar (not top-level navigation). What Changed is the default lens: the
 * #1 question a compliance reader asks is "what must I now do differently."
 * The other lenses are overview, the raw source text, and the lineage proof.
 * Tab state is controlled from App so search results can deep-link into a lens.
 */
export function AnalysisPane({
  circular: c,
  tab,
  onTabChange,
}: {
  circular: Circular;
  tab: AnalysisTab;
  onTabChange: (t: AnalysisTab) => void;
}) {
  const setTab = onTabChange;

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
      {/* In-page tab bar */}
      <div className="border-b border-outline-variant/20 bg-surface px-4 pt-3 flex items-center gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-t-lg border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Pane content — reuse existing tab bodies; strip their standalone py so they sit inside the card */}
      <div className="px-2 pb-2">
        {tab === 'change' && <ChangeTab circular={c} />}
        {tab === 'overview' && <OverviewTab circular={c} />}
        {tab === 'reader' && <CircularReaderTab key={c.id} circular={c} />}
        {tab === 'trace' && <TraceabilityTab circular={c} />}
        {tab === 'checklist' && <ChecklistTab key={c.id} circular={c} />}
      </div>
    </section>
  );
}
