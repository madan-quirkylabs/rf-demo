import { useState } from 'react';
import { circulars } from './data';
import { IndexPage } from './sections/IndexPage';
import type { CircularLens } from './sections/IndexPage';
import { CircularPage } from './sections/CircularPage';

interface OpenCircular {
  id: string;
  lens: CircularLens;
}

/**
 * App shell — two-level structure:
 *   Index (all circulars + the only search) → Circular page (two tabs:
 *   Circular & Checklist / Clarify). No search or digest chrome on the
 *   circular page itself; discovery happens on the index.
 */
export default function App() {
  const [open, setOpen] = useState<OpenCircular | null>(null);
  const c = open ? circulars.find((x) => x.id === open.id) : undefined;

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col">
      <header className="bg-surface border-b border-outline-variant/10 px-8 py-3 flex items-center justify-between gap-4 z-10 flex-wrap sticky top-0">
        <button
          onClick={() => setOpen(null)}
          className="flex items-center gap-3 min-w-0"
          title="Back to index"
        >
          <div className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">account_balance</span>
          </div>
          <div className="min-w-0 text-left">
            <h2 className="text-sm font-semibold truncate">RegulatoryFabric Live</h2>
            <p className="text-[11px] text-on-surface-variant truncate">
              circular in · checklist out
            </p>
          </div>
        </button>
      </header>

      {c && open ? (
        <CircularPage
          key={c.id}
          circular={c}
          onBack={() => setOpen(null)}
          initialLens={open.lens}
        />
      ) : (
        <IndexPage
          onOpen={(id, lens) => setOpen({ id, lens })}
        />
      )}
    </main>
  );
}
