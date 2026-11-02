import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FlashcardGame from '@/components/games/FlashcardGame';
import GameSession from '@/components/games/GameSession';
import GameSetup from '@/components/games/GameSetup';
import { useLibrary } from '@/contexts/LibraryContext';
import { useGameSettings } from '@/hooks/useGameSettings';
import {
  getCandidateWords,
  getSetupIssues,
  selectGameWords,
} from '@/lib/games/gameConfig';
import { GAME_DEFINITIONS, type GameDefinition } from '@/lib/games/gameDefinitions';
import type { GameId, QuizGameId } from '@/lib/games/types';
import type { Word } from '@/lib/vocabulary';

interface ActiveGame {
  gameId: GameId;
  words: Word[];
  attempt: number;
}

function isQuizGame(gameId: GameId): gameId is QuizGameId {
  return gameId !== 'flashcards';
}

function getNextGameDefinition(gameId: GameId): GameDefinition | undefined {
  const index = GAME_DEFINITIONS.findIndex((item) => item.id === gameId);
  return index === -1 ? undefined : GAME_DEFINITIONS[index + 1];
}

export default function GamesPage() {
  const { words, isLoading, loadError } = useLibrary();
  const { config, updateConfig, saveError } = useGameSettings();
  const [selectedId, setSelectedId] = useState<GameId | null>(null);
  const [active, setActive] = useState<ActiveGame | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800">
        Kelimeler yüklenemedi: {loadError}
      </p>
    );
  }

  const exitToList = () => {
    setActive(null);
    setSelectedId(null);
  };

  const retryWrong = (wordIds: string[]) => {
    setActive((previous) =>
      previous && isQuizGame(previous.gameId)
        ? {
            gameId: previous.gameId,
            words: words.filter((word) => wordIds.includes(word.id)),
            attempt: previous.attempt + 1,
          }
        : previous,
    );
  };

  const restart = () => {
    setActive((previous) => (previous ? { ...previous, attempt: previous.attempt + 1 } : previous));
  };

  const startNextGame = (currentId: GameId) => {
    const next = getNextGameDefinition(currentId);
    if (!next) return;
    const gameWords = selectGameWords(words, config, next.requiresImage);
    const pool = getCandidateWords(words, config, next.requiresImage);
    if (gameWords.length === 0 || getSetupIssues(next, pool, words, config).length > 0) {
      setActive(null);
      setSelectedId(next.id);
      return;
    }
    setActive({ gameId: next.id, words: gameWords, attempt: 0 });
  };

  if (active) {
    const title = GAME_DEFINITIONS.find((item) => item.id === active.gameId)?.title ?? '';
    const hasNextGame = getNextGameDefinition(active.gameId) !== undefined;
    const sessionKey = `${active.gameId}-${active.attempt}`;
    const onNext = hasNextGame ? () => startNextGame(active.gameId) : undefined;
    return (
      <div className="space-y-4">
        {isQuizGame(active.gameId) ? (
          <GameSession
            key={sessionKey}
            gameId={active.gameId}
            words={active.words}
            onExit={exitToList}
            onRetryWrong={retryWrong}
            onRestart={restart}
            onNext={onNext}
          />
        ) : (
          <FlashcardGame
            key={sessionKey}
            title={title}
            words={active.words}
            onExit={exitToList}
            onRestart={restart}
            onNext={onNext}
          />
        )}
      </div>
    );
  }

  if (selectedId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Oyunlar" description="Oyun için kelimeleri ve kelime sayısını seçin." />
        <GameSetup
          gameId={selectedId}
          config={config}
          onConfigChange={updateConfig}
          settingsError={saveError}
          onStart={(gameWords) => setActive({ gameId: selectedId, words: gameWords, attempt: 0 })}
          onBack={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Oyunlar" description="Kelimeleri oyunlarla pekiştirin. Filtreleri seçip bir oyun başlatın." />

      {words.length === 0 && (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          Henüz kelimeniz yok. Oyunları oynamak için önce Kelimeler bölümünden kelime ekleyin.
        </p>
      )}

      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {GAME_DEFINITIONS.map((game, index) => {
          const Icon = game.icon;
          return (
            <li key={game.id}>
              <button
                type="button"
                onClick={() => setSelectedId(game.id)}
                className="group flex h-full w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:flex-col sm:items-stretch sm:gap-4 sm:rounded-3xl sm:p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white sm:h-12 sm:w-12 sm:justify-between sm:rounded-2xl">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 space-y-0.5 sm:space-y-1.5">
                  <span className="hidden text-sm font-semibold text-slate-400 sm:block">{index + 1}. oyun</span>
                  <span className="block text-base font-bold text-slate-900 sm:text-lg">{game.title}</span>
                  <span className="line-clamp-1 block text-sm leading-snug text-slate-600 sm:line-clamp-none sm:leading-relaxed">
                    {game.description}
                  </span>
                </span>
                <span className="hidden text-sm font-semibold text-blue-700 sm:mt-auto sm:inline-flex sm:items-center sm:gap-1">
                  Oyunu hazırla
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
