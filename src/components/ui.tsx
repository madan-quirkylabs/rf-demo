import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  icon,
  title,
  right,
  accent,
}: {
  icon?: string;
  title: string;
  right?: ReactNode;
  accent?: string;
}) {
  return (
    <div
      className={`px-5 py-3.5 border-b border-outline-variant/20 flex items-center justify-between ${
        accent ?? ''
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {right}
    </div>
  );
}

type BadgeTone = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' | 'green';

const TONES: Record<BadgeTone, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary-container text-on-secondary-container border-outline-variant/30',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  error: 'bg-error-container text-on-error-container border-error/20',
  neutral: 'bg-surface-container-highest text-on-surface border-outline-variant/30',
  green: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/30',
};

export function Badge({ tone = 'primary', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  accent = 'text-primary',
}: {
  icon: string;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-surface-container shadow-sm border border-outline-variant/20">
      <div className="flex items-center gap-2 text-on-surface-variant mb-1.5">
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-2xl font-semibold ${accent}`}>{value}</span>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="px-2.5 py-1 bg-surface-container-high rounded-full text-[11px] font-mono text-on-surface border border-outline-variant/30 inline-flex items-center gap-1.5">
      {children}
    </span>
  );
}
