export type ChangeType = 'new' | 'amended' | 'withdrawn' | 'unchanged';

/** A clause/paragraph from the source instrument, as published. */
export interface SourceClause {
  id: string;
  /** Published reference, e.g. "Para 74" */
  ref: string;
  /** Section heading, e.g. "Use of Technology for Monitoring" */
  section?: string;
  /** The clause text as published (quoted; keep verbatim where possible). */
  text: string;
  /** How this clause moved relative to the prior instrument. */
  changeType: ChangeType;
  /** Obligations in this Circular that trace to this clause. */
  obligationIds: string[];
}

export interface RegulationRef {
  /** e.g. "SEBI Master Circular for Mutual Funds, dated 27 Jun 2024" */
  source: string;
  /** e.g. "Para 10.1" */
  clause: string;
  url?: string;
}

export interface CurrentPosition {
  summary: string;
  effectiveFrom: string;
  interpretationBasis: RegulationRef[];
}

export interface EvolutionNode {
  date: string;
  title: string;
  description: string;
  /** marks the current/active node */
  current?: boolean;
}

export interface ChangeDiff {
  /** what the prior instrument required */
  previous: string[];
  /** what the current instrument now requires */
  current: string[];
}

export interface Obligation {
  id: string;
  label: string;
  clause: string;
  source: string;
}

/** Expert analysis attributable to a named partner/firm. */
export interface Commentary {
  id: string;
  /** Partner or firm name, e.g. "Khaitan & Co" */
  author: string;
  /** When it was published */
  publishedAt: string;
  /** Link to the official publication, if available */
  sourceUrl?: string;
  /** Which clause this commentary addresses */
  clauseRef: string;
  /** The commentary text */
  text: string;
  /** true = officially published by the partner; false = community-contributed */
  official: boolean;
}

/** A reader's question about a clause, with optional AI answer grounded in partner sources. */
export interface Clarification {
  id: string;
  /** Which clause the question addresses */
  clauseRef: string;
  /** Who asked */
  askedBy: string;
  /** The question text */
  text: string;
  /** Number of upvotes from other readers */
  upvotes: number;
  /** AI-generated answer, only shown if grounded in partner sources */
  aiAnswer?: {
    text: string;
    /** Which partner commentaries this answer draws on */
    basedOn: Commentary[];
  };
}

/**
 * Checklist categories — the practitioner taxonomy (6-header model) a
 * compliance officer uses to triage a circular into their working world.
 */
export type ChecklistCategory =
  | 'reporting'
  | 'event'
  | 'actionable'
  | 'policy'
  | 'appointments'
  | 'info';

/** When the item comes due. `none` = ongoing obligation with no fixed date. */
export type ChecklistDeadline =
  | { kind: 'periodic'; frequency: string }
  | { kind: 'event'; trigger: string; leadTime?: string }
  | { kind: 'fixed'; date: string }
  | { kind: 'none'; note: string };

/**
 * One row of the auto-derived compliance checklist for a circular.
 * Deliberately general — "what this instrument requires of regulated entities",
 * never any specific company's tracking state.
 */
export interface ChecklistItem {
  id: string;
  /** Published reference, e.g. "Para 74(5)" */
  ref: string;
  /** Parent section heading — context Devesh requires on every clause view */
  section?: string;
  /** Action-oriented restatement of what the clause requires */
  action: string;
  /** Which regulated-entity categories from the instrument's applicability this lands on */
  appliesTo: string[];
  category: ChecklistCategory;
  deadline: ChecklistDeadline;
  /** The generic proof a regulator / auditor expects against this item (not company state) */
  evidenceExpected: string;
}

/** Anonymous reader profile from the no-signup applicability questionnaire. */
export interface ReaderProfile {
  regulated: 'yes' | 'no' | null;
  licenses: string[];
  worksWithRegulatedEntities: boolean | null;
}

export interface Circular {
  id: string;
  /** Title as published */
  title: string;
  /** Dated / circular number */
  refNo: string;
  dated: string;
  regulator: string;
  instrumentType: 'Circular' | 'Master Circular' | 'Notification';
  status: 'Effective' | 'Superseded' | 'Draft';
  /** Regulated entity categories this instrument applies to (applicability). */
  appliesTo: string[];
  summary: string;
  current: CurrentPosition;
  evolution: EvolutionNode[];
  changeDiff: ChangeDiff;
  obligations: Obligation[];
  /** Clause-level source text for the Circular Reader tab. */
  clauses: SourceClause[];
  /** Expert analysis attributable to named partners */
  commentary: Commentary[];
  /** Community clarification questions with optional AI answers */
  clarifications: Clarification[];
  /** Clause-by-clause compliance checklist auto-derived from the instrument */
  checklist: ChecklistItem[];
  /** The clause-level change this demo proves is traceable (the "diff, not a summary"). */
  keyChange: {
    headline: string;
    detail: string;
  };
}
