import { useMemo, useState } from 'react';

interface Screen {
  id: string;
  circularId: string;
  regulator: string;
  /** lowercase keywords that trigger this screen */
  keywords: string[];
  question: string;
  verdict: 'action-required' | 'conditional' | 'no-match-found';
  headline: string;
  explanation: string;
  refs: { clause: string; tab: 'change' | 'reader' | 'checklist'; note: string }[];
}

const SCREENS: Screen[] = [
  {
    id: 'SCR-R1',
    circularId: 'rbi-compliance-dirs-2026',
    regulator: 'RBI',
    keywords: ['appoint', 'hire', 'new cco', 'cco appointment', 'chief compliance officer', 'onboard'],
    question: 'Are you appointing a Chief Compliance Officer?',
    verdict: 'action-required',
    headline: 'Yes — a regulated appointment with RBI touchpoints',
    explanation:
      'The appointment carries three binding requirements: minimum fixed tenure of three years, no dual-hatting with business roles, and PRIOR intimation to RBI before the appointment takes effect.',
    refs: [
      { clause: 'Para 61', tab: 'checklist', note: 'Min 3-year fixed tenure' },
      { clause: 'Para 67', tab: 'checklist', note: 'No dual hatting' },
      { clause: 'Para 70', tab: 'checklist', note: 'Prior intimation + fit-and-proper cert' },
    ],
  },
  {
    id: 'SCR-R2',
    circularId: 'rbi-compliance-dirs-2026',
    regulator: 'RBI',
    keywords: ['remov', 'exit', 'prematur', 'resign', 'let go', 'terminat', 'step down'],
    question: 'Are you removing or prematurely exiting a CCO?',
    verdict: 'action-required',
    headline: 'Restricted — RBI must be told before you act',
    explanation:
      'Premature transfer or removal of the CCO requires prior intimation to the Senior Supervisory Manager, RBI, supported by a detailed profile and MD & CEO fit-and-proper certification. Board approval is required for premature removal.',
    refs: [
      { clause: 'Para 70', tab: 'checklist', note: 'Prior intimation before removal' },
      { clause: 'Para 61', tab: 'checklist', note: 'Tenure protection context' },
    ],
  },
  {
    id: 'SCR-R3',
    circularId: 'rbi-compliance-dirs-2026',
    regulator: 'RBI',
    keywords: ['dashboard', 'compliance tool', 'software', 'vendor', 'rfp', 'workflow tool', 'monitoring tool'],
    question: 'Are you procuring or building compliance tooling?',
    verdict: 'action-required',
    headline: 'Yes — the tool itself is regulated, not just the buy',
    explanation:
      'The Directions mandate enterprise-wide, workflow-based compliance solutions with five minimum capabilities — collaboration, compliance-lifecycle management, escalation, recorded deviation approvals, and a unified senior-management dashboard. Your RFP should test vendors against all five.',
    refs: [
      { clause: 'Para 74(1)–(5)', tab: 'checklist', note: 'Mandatory tool capabilities' },
      { clause: 'Para 74', tab: 'reader', note: 'Full published text' },
    ],
  },
  {
    id: 'SCR-R4',
    circularId: 'rbi-compliance-dirs-2026',
    regulator: 'RBI',
    keywords: ['internal audit', 'merge', 'combine', 'one team', 'audit compliance together'],
    question: 'Are you combining Compliance with Internal Audit?',
    verdict: 'no-match-found',
    headline: 'No — the Board must keep them separate',
    explanation:
      'Combining the two functions into one team or reporting line would breach the separation mandate. Structural separation (charters, reporting lines) is required; physical office separation is not.',
    refs: [{ clause: 'Para 10', tab: 'checklist', note: 'Separation mandate' }],
  },
  {
    id: 'SCR-S1',
    circularId: 'sebi-sid-2024',
    regulator: 'SEBI',
    keywords: ['launch', 'new scheme', 'new fund', 'equity scheme', 'offer document', 'sid'],
    question: 'Are you launching a scheme / issuing an offer document?',
    verdict: 'action-required',
    headline: 'Yes — the SID must follow the simplified uniform format',
    explanation:
      'New schemes prepare the SID in SEBI\u2019s simplified uniform format; existing schemes must migrate within the transition window. At each periodic updation, the change relative to the prior SID must be explicitly surfaced.',
    refs: [
      { clause: 'Para 10.1', tab: 'checklist', note: 'Simplified format + updation' },
      { clause: 'Circular 2024/179', tab: 'checklist', note: 'Transition window' },
    ],
  },
  {
    id: 'SCR-S2',
    circularId: 'sebi-sid-2024',
    regulator: 'SEBI',
    keywords: ['distributor', 'isc', 'availability', 'investor access'],
    question: 'Are you changing how offer documents reach distributors?',
    verdict: 'conditional',
    headline: 'Conditional — current SID/SAI must stay readily available',
    explanation:
      'Whatever the channel, the current SID and SAI must be readily available with all distributors and ISCs, confirmed to SEBI in the half-yearly trustee report.',
    refs: [{ clause: 'Para 10', tab: 'checklist', note: 'Availability + trustee confirmation' }],
  },
];

const EXAMPLES = [
  'Appointing a new CCO',
  'Removing our CCO mid-tenure',
  'RFP for a compliance dashboard',
  'Merging compliance with internal audit',
  'Launching a new equity scheme',
];

function screen(input: string): Screen[] {
  const q = input.toLowerCase();
  const scored = SCREENS.map((s) => {
    const hits = s.keywords.filter((k) => q.includes(k)).length;
    return { s, hits };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2);
  return scored.map((x) => x.s);
}

const VERDICT_STYLE = {
  'action-required': { label: 'Action required', tone: 'bg-primary/10 text-primary border-primary/20', icon: 'task_alt' },
  conditional: { label: 'Conditional', tone: 'bg-tertiary/10 text-tertiary border-tertiary/20', icon: 'rule' },
  'no-match-found': { label: 'Not permitted', tone: 'bg-error-container text-on-error-container border-error/20', icon: 'block' },
} as const;

/**
 * PreScreen — Devesh's "first line of defense": describe a project or question,
 * get a preliminary regulatory read with exact clause references. Demo engine
 * matches keywords against a curated screen set for the tracked instruments —
 * the production version runs the same shape against the full corpus.
 */
export function PreScreen({
  onSelect,
}: {
  onSelect: (circularId: string, tab: 'change' | 'reader' | 'checklist') => void;
}) {
  const [q, setQ] = useState('');
  const results = useMemo(() => screen(q), [q]);

  return (
    <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">policy</span>
          <div>
            <h3 className="text-sm font-semibold">Pre-screen a project — your first line of defense</h3>
            <p className="text-[11px] text-on-surface-variant">
              Describe what you're planning; get a preliminary read with clause references. Compresses "search 100 guidelines" to the few that matter.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-[13px]">lock_open</span>
          No login
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. We want to replace our CCO six months into the tenure…"
          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-[13px] placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/60"
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-on-surface-variant mr-1">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQ(ex)}
              className="px-2.5 py-1 rounded-full text-[11px] border border-outline-variant/40 text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {q.trim().length >= 3 && (
          <div className="space-y-2 pt-1">
            {results.length === 0 ? (
              <div className="rounded-lg bg-surface-container border border-outline-variant/25 px-4 py-3 flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">search_off</span>
                <p className="text-[12px] text-on-surface-variant leading-snug">
                  No screen matched in the 2 tracked instruments. The production corpus covers 600+ guidelines — this
                  question would route to the relevant regulator's set automatically.
                </p>
              </div>
            ) : (
              results.map((r) => {
                const v = VERDICT_STYLE[r.verdict];
                return (
                  <div key={r.id} className="rounded-lg border border-outline-variant/25 bg-surface-container-low px-4 py-3.5">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${v.tone}`}>
                        <span className="material-symbols-outlined text-[13px]">{v.icon}</span>
                        {v.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-[1px] rounded bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wide">
                        {r.regulator}
                      </span>
                      <span className="text-[11px] text-on-surface-variant italic">{r.question}</span>
                    </div>
                    <p className="text-[13px] font-medium mb-1">{r.headline}</p>
                    <p className="text-[12px] text-on-surface-variant leading-snug mb-2.5 max-w-4xl">{r.explanation}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {r.refs.map((ref) => (
                        <button
                          key={ref.clause + ref.note}
                          onClick={() => onSelect(r.circularId, ref.tab)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-[11px] hover:border-primary/50 transition-colors"
                          title={`Open ${ref.clause} in ${ref.tab}`}
                        >
                          <span className="font-mono text-primary">{ref.clause}</span>
                          <span className="text-on-surface-variant">{ref.note}</span>
                          <span className="material-symbols-outlined text-[12px] text-on-surface-variant">arrow_outward</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
            <p className="text-[10.5px] text-on-surface-variant/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">info</span>
              Preliminary keyword-matched screen — not legal advice. Verify against the cited clauses; every claim traces to published text.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
