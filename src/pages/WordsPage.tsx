import { useMemo, useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import CategoryManager from '@/components/CategoryManager';
import Modal from '@/components/Modal';
import PageHeader from '@/components/PageHeader';
import WordFilterBar from '@/components/WordFilterBar';
import WordFormModal from '@/components/WordFormModal';
import WordList from '@/components/WordList';
import { useLibrary } from '@/contexts/LibraryContext';
import SortDropdown from '@/components/SortDropdown';
import { useStoredState } from '@/hooks/useStoredState';
import { EMPTY_WORD_FILTERS, filterWords, type WordFilters } from '@/lib/wordFilters';
import { sortWordsByListMode, WORD_LIST_SORT_OPTIONS, type WordListSort } from '@/lib/wordSort';

const WORD_SORT_KEY = 'sanasto.wordListSort';

export default function WordsPage() {
  const { words } = useLibrary();
  const [filters, setFilters] = useState<WordFilters>(EMPTY_WORD_FILTERS);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [sortSettings, setSortSettings] = useStoredState<{ mode: WordListSort }>(WORD_SORT_KEY, { mode: 'added' });
  const sortMode = sortSettings.mode;

  const visibleWords = useMemo(() => {
    return sortWordsByListMode(filterWords(words, filters), sortMode);
  }, [words, filters, sortMode]);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_WORD_FILTERS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelimelerim"
        description={`${words.length} kelime kayıtlı.`}
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsManagingCategories(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Tags className="h-5 w-5" /> Kategorileri yönet
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-800"
            >
              <Plus className="h-5 w-5" /> Yeni kelime
            </button>
          </div>
        }
      />

      <WordFilterBar filters={filters} onChange={setFilters} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-slate-600">
        <span>Toplam {words.length} kelime</span>
        <span>Seçili filtrelerde {visibleWords.length} kelime</span>
      </div>
        <div className="w-full sm:w-64">
          <SortDropdown
            label="Kelime sıralaması"
            options={WORD_LIST_SORT_OPTIONS}
            value={sortMode}
            onChange={(mode) => setSortSettings({ mode })}
          />
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
      {isManagingCategories && (
        <Modal title="Kategorileri yönet" onClose={() => setIsManagingCategories(false)} maxWidthClass="max-w-3xl">
          <CategoryManager />
        </Modal>
      )}
    </div>
  );
}
