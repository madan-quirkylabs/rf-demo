import type { Circular } from './types';
import { kmtCirculars } from './generated/kmt';

/**
 * The comprehension-test build: real circulars only, generated from the KMT
 * corpus by scripts/ingest_kmt.py (last 30 days of available data). No
 * hand-authored datasets — commentary/checklists are empty rather than fake.
 */
export const circulars: Circular[] = kmtCirculars;

export type { Circular, Commentary, Clarification } from './types';