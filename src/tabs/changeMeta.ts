import type { ChangeType } from '../data/types';

export const CHANGE_META: Record<ChangeType, { label: string; chip: string }> = {
  new: { label: 'New', chip: 'bg-primary/10 text-primary border-primary/20' },
  amended: { label: 'Amended', chip: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  withdrawn: { label: 'Withdrawn', chip: 'bg-error-container text-on-error-container border-error/20' },
  unchanged: { label: 'Unchanged', chip: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/30' },
};
