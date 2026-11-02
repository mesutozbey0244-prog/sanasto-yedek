import type { ReactNode } from 'react';
import { LEVEL_OPTIONS } from '@/lib/vocabulary';
import { toggleLevelSelection, type LevelSelection } from '@/lib/wordFilters';

interface LevelSelectorProps {
  value: LevelSelection;
  onChange: (value: LevelSelection) => void;
}

export default function LevelSelector({ value, onChange }: LevelSelectorProps) {
  const isAll = value === 'all';

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1.5 text-sm font-semibold text-slate-700">Seviye</legend>
      <div className="flex flex-wrap gap-2">
        <LevelChip active={isAll} onClick={() => onChange('all')}>
          Tümü
        </LevelChip>
        {LEVEL_OPTIONS.map((level) => (
          <LevelChip
            key={level}
            active={!isAll && value.includes(level)}
            onClick={() => onChange(toggleLevelSelection(value, level))}
          >
            {level}
          </LevelChip>
        ))}
      </div>
      {!isAll && value.length === 0 && (
        <p className="text-sm text-amber-700">En az bir seviye seçin. Seviye seçilmezse kelime gösterilmez.</p>
      )}
    </fieldset>
  );
}

function LevelChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
          : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700'
      }`}
    >
      {children}
    </button>
  );
}
