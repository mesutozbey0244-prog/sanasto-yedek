import Chip from '@/components/Chip';
import LearningStatusField from '@/components/LearningStatusField';
import LevelSelector from '@/components/LevelSelector';
import MultiSelectField from '@/components/MultiSelectField';
import { type GameSetupConfig, type WordCount } from '@/lib/games/gameConfig';
import type { Category } from '@/lib/vocabulary';

interface GameFilterFieldsProps {
  config: GameSetupConfig;
  onChange: (config: GameSetupConfig) => void;
  categories: Category[];
}

export default function GameFilterFields({ config, onChange, categories }: GameFilterFieldsProps) {
  const update = (patch: Partial<GameSetupConfig>) => onChange({ ...config, ...patch });

  return (
    <div className="space-y-6">
      <MultiSelectField
        label="Ana kategoriler"
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
        selected={config.categoryIds}
        allLabel="Tüm kategoriler"
        onChange={(categoryIds) => update({ categoryIds })}
      />

      <LevelSelector value={config.levels} onChange={(levels) => update({ levels })} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime seçimi</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={config.favoritesOnly} onClick={() => update({ favoritesOnly: !config.favoritesOnly })}>
            Sadece favoriler
          </Chip>
          <Chip active={config.wrongOnly} onClick={() => update({ wrongOnly: !config.wrongOnly })}>
            Daha önce yanlışlar
          </Chip>
        </div>
      </fieldset>

      <LearningStatusField
        statuses={config.learningStatuses}
        onChange={(learningStatuses) => update({ learningStatuses })}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime sırası</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={config.order === 'added'} onClick={() => update({ order: 'added' })}>
            Eklenme sırası
          </Chip>
          <Chip active={config.order === 'alphabetical'} onClick={() => update({ order: 'alphabetical' })}>
            Alfabetik
          </Chip>
          <Chip active={config.order === 'random'} onClick={() => update({ order: 'random' })}>
            Karışık
          </Chip>
        </div>
        {config.order === 'alphabetical' && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Chip active={config.alphabetLanguage === 'finnish'} onClick={() => update({ alphabetLanguage: 'finnish' })}>
              Fince kelimeye göre
            </Chip>
            <Chip active={config.alphabetLanguage === 'turkish'} onClick={() => update({ alphabetLanguage: 'turkish' })}>
              Türkçe anlama göre
            </Chip>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-700">Kelime sayısı</legend>
        <div className="flex items-center justify-between gap-3">
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={config.count}
            onChange={(event) => update({ count: Number(event.target.value) as WordCount })}
            aria-label="Kelime sayısı"
            className="h-2 w-full cursor-pointer accent-blue-700"
          />
          <span className="w-12 shrink-0 text-right text-lg font-bold tabular-nums text-blue-700">{config.count}</span>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>10</span>
          <span>100</span>
        </div>
      </fieldset>
    </div>
  );
}
