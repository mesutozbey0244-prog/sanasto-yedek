import { useMemo, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import WordFilterBar from '@/components/WordFilterBar';
import WordList from '@/components/WordList';
import { useLibrary } from '@/contexts/LibraryContext';
import { EMPTY_WORD_FILTERS, filterWords, type WordFilters } from '@/lib/wordFilters';

export default function FavoritesPage() {
  const { words } = useLibrary();
  const [filters, setFilters] = useState<WordFilters>(EMPTY_WORD_FILTERS);

  const favoriteWords = useMemo(
    () => filterWords(words, { ...filters, favoritesOnly: true }),
    [words, filters],
  );
  const favoriteCount = useMemo(() => words.filter((word) => word.is_favorite).length, [words]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Favoriler"
        description={`${favoriteCount} favori kelimeniz var. Favorileri Dinleme bölümünde "Favoriler" seçeneğiyle dinleyebilirsiniz.`}
      />

      <WordFilterBar filters={filters} onChange={setFilters} showFavoritesToggle={false} />

      <p className="text-sm font-semibold text-slate-600">{favoriteWords.length} favori kelime gösteriliyor</p>

      <WordList
        words={favoriteWords}
        emptyTitle={favoriteCount === 0 ? 'Henüz favori kelimeniz yok' : 'Bu filtrelere uyan favori yok'}
        emptyText={
          favoriteCount === 0
            ? 'Kelime kartlarındaki kalp simgesine dokunarak en sevdiğiniz kelimeleri buraya ekleyebilirsiniz.'
            : 'Filtreleri temizleyerek tüm favorilerinizi tekrar görebilirsiniz.'
        }
      />
    </div>
  );
}
