import Chip from '@/components/Chip';
import CategoryFilterField from '@/components/CategoryFilterField';
import LearningStatusField from '@/components/LearningStatusField';
import LevelSelector from '@/components/LevelSelector';
import SortSegmentedControl from '@/components/SortSegmentedControl';
import { type GameSetupConfig, type WordCount } from '@/lib/games/gameConfig';
import type { Category, Word } from '@/lib/vocabulary';
import type { WordListSort } from '@/lib/wordSort';

type GameSort = WordListSort | 'random';

const GAME_SORT_OPTIONS: { value: GameSort; label: string }[] = [
  { value: 'added', label: 'Eklenme sırası' },
  { value: 'finnish', label: 'Fince A-Z' },
  { value: 'turkish', label: 'Türkçe A-Z' },
  { value: 'random', label: 'Karışık' },
];

interface GameFilterFieldsProps {
  config: GameSetupConfig;
  onChange: (config: GameSetupConfig) => void;
  categories: Category[];
  words: Word[];
}

export default function GameFilterFields({ config, onChange, categories, words }: GameFilterFieldsProps) {
  const update = (patch: Partial<GameSetupConfig>) => onChange({ ...config, ...patch });

  const sortValue: GameSort = config.order === 'alphabetical' ? config.alphabetLanguage : config.order;
  const applySort = (value: GameSort) => {
    if (value === 'finnish' || value === 'turkish') {
      update({ order: 'alphabetical', alphabetLanguage: value });
      return;
    }
    update({ order: value });
  };

  return (
    <div className="space-y-6">
      <CategoryFilterField
        label="Ana kategoriler"
        categories={categories}
        words={words}
        selected={config.categoryIds}
        onChange={(categoryIds) => update({ categoryIds })}
      />

      <LevelSelector value={config.levels} onChange={(levels) => update({ levels })} />

      <LearningStatusField
        statuses={config.learningStatuses}
        onChange={(learningStatuses) => update({ learningStatuses })}
      />

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

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime sıralaması</legend>
        <SortSegmentedControl label="Kelime sıralaması" options={GAME_SORT_OPTIONS} value={sortValue} onChange={applySort} />
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
