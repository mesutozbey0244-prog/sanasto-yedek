import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import WordFilterBar from '@/components/WordFilterBar';
import WordFormModal from '@/components/WordFormModal';
import WordList from '@/components/WordList';
import { useLibrary } from '@/contexts/LibraryContext';
import { useStoredState } from '@/hooks/useStoredState';
import { EMPTY_WORD_FILTERS, filterWords, type WordFilters } from '@/lib/wordFilters';
import { sortWordsAlphabetically } from '@/lib/wordSort';

type WordListSort = 'added' | 'finnish' | 'turkish';

const WORD_SORT_KEY = 'sanasto.wordListSort';

const SORT_OPTIONS: { value: WordListSort; label: string }[] = [
  { value: 'added', label: 'Eklenme sırası' },
  { value: 'finnish', label: 'Fince A-Z' },
  { value: 'turkish', label: 'Türkçe A-Z' },
];

export default function WordsPage() {
  const { words } = useLibrary();
  const [filters, setFilters] = useState<WordFilters>(EMPTY_WORD_FILTERS);
  const [isCreating, setIsCreating] = useState(false);
  const [sortSettings, setSortSettings] = useStoredState<{ mode: WordListSort }>(WORD_SORT_KEY, { mode: 'added' });
  const sortMode = sortSettings.mode;

  const visibleWords = useMemo(() => {
    const filtered = filterWords(words, filters);
    if (sortMode === 'added') return filtered;
    return sortWordsAlphabetically(filtered, sortMode === 'finnish' ? 'finnish' : 'turkish');
  }, [words, filters, sortMode]);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_WORD_FILTERS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelimelerim"
        description={`${words.length} kelime kayıtlı.`}
        action={
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
          >
            <Plus className="h-5 w-5" /> Yeni kelime
          </button>
        }
      />

      <WordFilterBar filters={filters} onChange={setFilters} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-slate-600">
        <span>Toplam {words.length} kelime</span>
        <span>Seçili filtrelerde {visibleWords.length} kelime</span>
      </div>
        <div role="group" aria-label="Kelime sıralaması" className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={sortMode === option.value}
              onClick={() => setSortSettings({ mode: option.value })}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                sortMode === option.value ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <WordList
        words={visibleWords}
        emptyTitle={hasFilters ? 'Bu filtrelere uyan kelime yok' : 'Henüz kelime eklemediniz'}
        emptyText={
          hasFilters
            ? 'Filtreleri temizleyerek bütün kelimelerinizi tekrar görebilirsiniz.'
            : 'Sağ üstteki "Yeni kelime" butonuyla ilk kelimenizi ekleyerek başlayın.'
        }
      />

      {isCreating && <WordFormModal word={null} onClose={() => setIsCreating(false)} />}
    </div>
  );
}
