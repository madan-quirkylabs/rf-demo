import type { Circular } from './types';
import { sebiSIDCircular } from './circular';
import { rbiComplianceDirections } from './rbiCircular';

/**
 * All demo circulars. Adding a new regulator = add one dataset file that
 * satisfies the `Circular` type; nothing else needs to change.
 */
export const circulars: Circular[] = [sebiSIDCircular, rbiComplianceDirections];

export type { Circular, Commentary, Clarification } from './types';
export { sebiSIDCircular } from './circular';
export { rbiComplianceDirections } from './rbiCircular';