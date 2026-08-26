import type { Circular, ReaderProfile } from '../data/types';
import { Badge } from '../components/ui';

const LICENSES = [
  'Commercial Bank',
  'NBFC',
  'Payments Bank',
  'Small Finance Bank',
  'Mutual Fund / AMC',
  'Stock Broking',
] as const;

type License = (typeof LICENSES)[number];

interface Assessment {
  verdict: 'applies' | 'not-applicable' | 'watch' | 'indirect';
  headline: string;
  detail: string;
}

/**
 * Mock assessment of an anonymous reader profile against one instrument.
 * Deliberately conservative: derived only from the instrument's own
 * applicability clause — no entity data leaves the browser.
 */
function assess(p: ReaderProfile, c: Circular): Assessment {
  const has = (l: License) => p.licenses.includes(l);
  if (c.regulator === 'RBI') {
    if (has('Commercial Bank'))
      return {
        verdict: 'applies',
        headline: 'Directly applicable',
        detail: 'You are a covered commercial bank under these Directions.',
      };
    if (has('Payments Bank') || has('Small Finance Bank'))
      return {
        verdict: 'not-applicable',
        headline: 'Outside stated scope',
        detail: 'Instrument covers Commercial Banks excl. SFBs, Payments Banks, LABs.',
      };
    if (has('NBFC'))
      return {
        verdict: 'watch',
        headline: 'Watchlist',
        detail: 'These Directions cover banks; the parallel RBI framework extended the CCO regime to Middle/Upper-layer NBFCs (Apr 2022). Expect convergence.',
      };
  }
  if (c.regulator === 'SEBI') {
    if (has('Mutual Fund / AMC'))
      return {
        verdict: 'applies',
        headline: 'Directly applicable',
        detail: 'Offer-document obligations bind AMCs / Mutual Funds and their distributors.',
      };
    return {
      verdict: 'not-applicable',
      headline: 'Outside stated scope',
      detail: 'Applies to Mutual Funds, AMCs, Distributors / ISCs and Trustees.',
    };
  }
  return {
    verdict: 'not-applicable',
    headline: 'No match computed',
    detail: 'Add a licence to see applicability against this instrument.',
  };
}

const VERDICT_TONE: Record<Assessment['verdict'], 'green' | 'neutral' | 'tertiary'> = {
  applies: 'green',
  'not-applicable': 'neutral',
  watch: 'tertiary',
  indirect: 'tertiary',
};

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
        active
          ? 'bg-primary text-on-primary border-primary shadow-sm'
          : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-primary/50 hover:text-on-surface'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

/**
 * PersonalizeBar — the no-signup applicability questionnaire (value
 * frontloading). Three questions, anonymous, browser-local; pays off with a
 * per-instrument relevance verdict instead of an account wall.
 */
export function PersonalizeBar({
  circulars,
  profile,
  onChange,
  onSelectCircular,
}: {
  circulars: Circular[];
  profile: ReaderProfile;
  onChange: (p: ReaderProfile) => void;
  onSelectCircular: (id: string) => void;
}) {
  const answered = profile.regulated !== null;
  const anyLicense = profile.licenses.length > 0;

  return (
    <section className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
          <h3 className="text-sm font-semibold">Make it relevant — tell us your regulatory shape</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          No signup · answers never leave this browser
        </span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Q1 */}
        <div className="flex items-start gap-3 flex-wrap">
          <span className="text-[12px] font-medium text-on-surface-variant w-56 shrink-0 pt-1.5">
            Are you a regulated / licensed entity?
          </span>
          <div className="flex gap-2">
            <Chip
              active={profile.regulated === 'yes'}
              onClick={() => onChange({ ...profile, regulated: 'yes' })}
            >
              Yes
            </Chip>
            <Chip
              active={profile.regulated === 'no'}
              onClick={() => onChange({ regulated: 'no', licenses: [], worksWithRegulatedEntities: null })}
            >
              No
            </Chip>
          </div>
        </div>

        {/* Q2 */}
        {profile.regulated === 'yes' && (
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-[12px] font-medium text-on-surface-variant w-56 shrink-0 pt-1.5">
              Which licences do you hold?
            </span>
            <div className="flex gap-2 flex-wrap">
              {LICENSES.map((l) => (
                <Chip
                  key={l}
                  active={profile.licenses.includes(l)}
                  onClick={() =>
                    onChange({
                      ...profile,
                      licenses: profile.licenses.includes(l)
                        ? profile.licenses.filter((x) => x !== l)
                        : [...profile.licenses, l],
                    })
                  }
                >
                  {l}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Q3 */}
        {answered && (
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-[12px] font-medium text-on-surface-variant w-56 shrink-0 pt-1.5">
              Do you work with regulated entities (bank / NBFC partners)?
            </span>
            <div className="flex gap-2">
              <Chip
                active={profile.worksWithRegulatedEntities === true}
                onClick={() => onChange({ ...profile, worksWithRegulatedEntities: true })}
              >
                Yes — indirectly exposed
              </Chip>
              <Chip
                active={profile.worksWithRegulatedEntities === false}
                onClick={() => onChange({ ...profile, worksWithRegulatedEntities: false })}
              >
                No
              </Chip>
            </div>
          </div>
        )}

        {/* Payoff */}
        {answered && (anyLicense || profile.worksWithRegulatedEntities !== null) && (
          <div className="pt-2 grid gap-2 md:grid-cols-2">
            {circulars.map((c) => {
              const a = assess(profile, c);
              const clickable = a.verdict === 'applies';
              return (
                <button
                  key={c.id}
                  onClick={() => clickable && onSelectCircular(c.id)}
                  className={`text-left rounded-lg bg-surface-container-lowest border px-4 py-3 flex items-start justify-between gap-3 ${
                    clickable
                      ? 'border-primary/40 hover:border-primary hover:shadow-sm transition-all cursor-pointer'
                      : 'border-outline-variant/25'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] px-1.5 py-[2px] bg-secondary-container text-on-secondary-container rounded font-semibold uppercase tracking-wide">
                        {c.regulator}
                      </span>
                      <Badge tone={VERDICT_TONE[a.verdict]}>{a.headline}</Badge>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-snug">{a.detail}</p>
                    <p className="text-[11px] mt-1 text-on-surface">
                      <span className="font-semibold">{a.verdict === 'applies' ? c.checklist.length : '—'}</span>
                      {' '}checklist items ready{clickable ? ' · open its checklist' : ''}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 mt-0.5">
                    {clickable
                      ? 'task_alt'
                      : a.verdict === 'watch'
                        ? 'visibility'
                        : 'do_not_disturb_on'}
                  </span>
                </button>
              );
            })}

            {profile.regulated === 'no' && profile.worksWithRegulatedEntities === true && (
              <div className="md:col-span-2 rounded-lg bg-tertiary/10 border border-tertiary/20 px-4 py-3 flex items-start gap-3">
                <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">link</span>
                <p className="text-[12px] text-on-surface leading-snug">
                  <span className="font-semibold">Indirect applicability:</span> you may not hold a licence, but your
                  partners' regulators reach you through contracts and due-diligence questionnaires. The checklists
                  below show what will be asked of you.
                </p>
              </div>
            )}

            <p className="md:col-span-2 text-[11px] text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              Want sharper filtering (entity-level mapping)? That comes later — after value, not before.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
