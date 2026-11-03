import { useLibrary } from '@/contexts/LibraryContext';
import Chip from '@/components/Chip';
import LearningStatusField from '@/components/LearningStatusField';
import LevelSelector from '@/components/LevelSelector';
import MultiSelectField from '@/components/MultiSelectField';
import { selectListeningWords, type ListeningSource } from '@/lib/listening';
import { getCategoryOptions } from '@/lib/learningProgress';

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

      <MultiSelectField
        label="Ana kategoriler"
        options={getCategoryOptions(categories, words)}
        selected={source.categoryIds}
        allLabel="Tüm kategoriler"
        onChange={(categoryIds) => update({ categoryIds })}
      />

      <LevelSelector value={source.levels} onChange={(levels) => update({ levels })} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">Kelime seçimi</legend>
        <div className="flex flex-wrap gap-2">
          <Chip active={source.favoritesOnly} onClick={() => update({ favoritesOnly: !source.favoritesOnly })}>
            Sadece favoriler
          </Chip>
        </div>
      </fieldset>

      <LearningStatusField
        statuses={source.learningStatuses}
        onChange={(learningStatuses) => update({ learningStatuses })}
      />

      <p className="text-sm text-slate-600">
        {selectedCount > 0 ? `Bu seçimde ${selectedCount} kelime var.` : 'Bu seçimde dinlenecek kelime yok.'}
      </p>
    </section>
  );
}
