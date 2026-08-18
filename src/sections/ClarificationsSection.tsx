import { useState } from 'react';
import type { Circular, Clarification } from '../data/types';
import { Card, Badge } from '../components/ui';

/**
 * Clarifications — community questions with optional AI answers grounded in
 * partner commentary. AI-answered questions on top; open questions below,
 * sorted by upvotes. StackOverflow-style.
 */
export function ClarificationsSection({ circular: c }: { circular: Circular }) {
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(c.clarifications.map((q) => [q.id, q.upvotes]))
  );

  const answered = c.clarifications
    .filter((q) => q.aiAnswer)
    .sort((a, b) => (votes[b.id] ?? b.upvotes) - (votes[a.id] ?? a.upvotes));
  const open = c.clarifications
    .filter((q) => !q.aiAnswer)
    .sort((a, b) => (votes[b.id] ?? b.upvotes) - (votes[a.id] ?? a.upvotes));

  const upvote = (id: string, base: number) =>
    setVotes((v) => ({ ...v, [id]: (v[id] ?? base) + 1 }));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">question_answer</span>
          Clarifications
        </h2>
        <p className="text-[13px] text-on-surface-variant mt-1 max-w-2xl">
          Community questions about specific clauses. AI answers are grounded in published partner
          commentary and cite their sources. Upvote to surface what matters.
        </p>
      </div>

      {c.clarifications.length === 0 && (
        <Card>
          <div className="p-5 text-[13px] text-on-surface-variant">
            No clarification questions yet for this circular.
          </div>
        </Card>
      )}

      {answered.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Answered
          </p>
          {answered.map((q) => (
            <QA key={q.id} q={q} votes={votes[q.id] ?? q.upvotes} onUpvote={() => upvote(q.id, q.upvotes)} />
          ))}
        </div>
      )}

      {open.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Open questions
          </p>
          {open.map((q) => (
            <QA key={q.id} q={q} votes={votes[q.id] ?? q.upvotes} onUpvote={() => upvote(q.id, q.upvotes)} />
          ))}
        </div>
      )}
    </section>
  );
}

function QA({ q, votes, onUpvote }: { q: Clarification; votes: number; onUpvote: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const hasAi = !!q.aiAnswer;

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Upvote */}
          <button onClick={onUpvote} className="flex flex-col items-center gap-0.5 shrink-0 group" aria-label="Upvote">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
              arrow_upward
            </span>
            <span className="text-[13px] font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              {votes}
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[11px] text-primary">{q.clauseRef}</span>
              <span className="text-[11px] text-on-surface-variant">asked by {q.askedBy}</span>
            </div>
            <p className="text-[14px] font-medium leading-snug">{q.text}</p>

            {hasAi && q.aiAnswer && (
              <div className="mt-4">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-2 text-[12px] font-semibold text-primary hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {expanded ? 'expand_less' : 'expand_more'}
                  </span>
                  {expanded ? 'Hide AI answer' : 'Show AI answer'}
                  <Badge tone="green">Grounded in partner sources</Badge>
                </button>

                {expanded && (
                  <div className="mt-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-[13px] leading-relaxed text-on-surface mb-3">{q.aiAnswer.text}</p>
                    <div className="border-t border-primary/10 pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                        Sources cited
                      </p>
                      {q.aiAnswer.basedOn.map((src) => (
                        <div key={src.id} className="flex items-center gap-2 mb-1.5 text-[12px]">
                          <span className="material-symbols-outlined text-[14px] text-primary">format_quote</span>
                          <span className="font-medium">{src.author}</span>
                          <span className="text-on-surface-variant">— {src.publishedAt}</span>
                          {src.sourceUrl && (
                            <a href={src.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline ml-auto">
                              source ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!hasAi && (
              <div className="mt-3 text-[12px] text-on-surface-variant italic">
                No AI answer yet — waiting for partner commentary to ground a response.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
