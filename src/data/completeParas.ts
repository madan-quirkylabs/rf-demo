import type { SourceClause } from './types';

/**
 * Demo-data helper: a real circular contains every para, but mock datasets
 * only author the "interesting" clauses. This fills the gaps with neutral
 * 'unchanged' paras so the reader honours P1: the complete circular, always.
 */
const FILLER_TEXTS = [
  '"The provisions of these Directions shall apply to the regulated entities as specified in the applicability section."',
  '"The terms used in these Directions shall carry the meanings assigned to them under the governing framework."',
  '"Regulated entities shall ensure that the requirements set out herein are incorporated into their internal policies within the prescribed timeline."',
  '"The senior management shall be responsible for the effective implementation of the provisions contained in this section."',
  '"Any deviation from the requirements herein shall be recorded along with the approval of the competent authority."',
  '"Regulated entities shall maintain records evidencing compliance with the provisions of this section for inspection by the regulator."',
  '"The requirements of this section shall be read along with the instructions issued on the subject from time to time."',
  '"Matters not specifically covered herein shall continue to be governed by the extant instructions."',
  '"Regulated entities may approach the regulator for clarification on the application of these provisions."',
  '"The provisions of this section come into force in accordance with the effective dates specified herein."',
];

interface ParaSpec {
  from: number;
  to: number;
  section: string;
}

/** Merge authored clauses with generated fillers, ordered by para number. */
export function completeParas(
  authored: SourceClause[],
  paraSpecs: ParaSpec[],
  idPrefix: string
): SourceClause[] {
  const byNumber = new Map<number, SourceClause>();
  const extras: SourceClause[] = [];
  for (const cl of authored) {
    const m = cl.ref.match(/^Para\s+(\d+)/);
    if (m) byNumber.set(Number(m[1]), cl);
    else extras.push(cl); // non-para refs (e.g. cited instrument) go at the end
  }

  const out: SourceClause[] = [];
  let fillerIdx = 0;
  for (const spec of paraSpecs) {
    for (let n = spec.from; n <= spec.to; n++) {
      const authored1 = byNumber.get(n);
      if (authored1) {
        out.push(authored1);
        continue;
      }
      out.push({
        id: `${idPrefix}-${n}`,
        ref: `Para ${n}`,
        section: spec.section,
        changeType: 'unchanged',
        text: FILLER_TEXTS[fillerIdx++ % FILLER_TEXTS.length],
        obligationIds: [],
      });
    }
  }
  return [...out, ...extras];
}
