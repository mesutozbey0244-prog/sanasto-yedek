import { useLibrary } from '@/contexts/LibraryContext';
import Chip from '@/components/Chip';
import CategoryFilterField from '@/components/CategoryFilterField';
import LearningStatusField from '@/components/LearningStatusField';
import LevelSelector from '@/components/LevelSelector';
import SortSegmentedControl from '@/components/SortSegmentedControl';
import { selectListeningWords, type ListeningSource } from '@/lib/listening';
import { WORD_LIST_SORT_OPTIONS } from '@/lib/wordSort';

interface ListeningSourcePickerProps {
  source: ListeningSource;
  onChange: (source: ListeningSource) => void;
}

export default function ListeningSourcePicker({ source, onChange }: ListeningSourcePickerProps) {
  const { words, categories } = useLibrary();
  const update = (patch: Partial<ListeningSource>) => onChange({ ...source, ...patch });

  const selectedCount = selectListeningWords(words, source).length;

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">Hangi kelimeleri dinlemek istersiniz?</p>

      <CategoryFilterField
        label="Ana kategoriler"
        categories={categories}
        words={words}
        selected={source.categoryIds}
        onChange={(categoryIds) => update({ categoryIds })}
      />

      <LevelSelector value={source.levels} onChange={(levels) => update({ levels })} />

      <LearningStatusField
        statuses={source.learningStatuses}
        onChange={(learningStatuses) => update({ learningStatuses })}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime seçimi</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={source.favoritesOnly} onClick={() => update({ favoritesOnly: !source.favoritesOnly })}>
            Sadece favoriler
          </Chip>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime sıralaması</legend>
        <SortSegmentedControl
          label="Kelime sıralaması"
          options={WORD_LIST_SORT_OPTIONS}
          value={source.sort}
          onChange={(sort) => update({ sort })}
        />
      </fieldset>

      <p className="text-sm text-slate-600">
        {selectedCount > 0 ? `Bu seçimde ${selectedCount} kelime var.` : 'Bu seçimde dinlenecek kelime yok.'}
      </p>
    </section>
  );
}
