import { ArrowLeft, AlertTriangle, Info, Play } from 'lucide-react';
import GameFilterFields from '@/components/games/GameFilterFields';
import { useLibrary } from '@/contexts/LibraryContext';
import { getCategoryOptions } from '@/lib/learningProgress';
import {
  countWordsWithoutImage,
  getCandidateWords,
  getSetupIssues,
  selectGameWords,
  type GameSetupConfig,
} from '@/lib/games/gameConfig';
import { getGameDefinition } from '@/lib/games/gameDefinitions';
import type { GameId } from '@/lib/games/types';
import type { Word } from '@/lib/vocabulary';

interface GameSetupProps {
  gameId: GameId;
  config: GameSetupConfig;
  onConfigChange: (config: GameSetupConfig) => void;
  settingsError: string | null;
  onStart: (words: Word[]) => void;
  onBack: () => void;
}

export default function GameSetup({ gameId, config, onConfigChange, settingsError, onStart, onBack }: GameSetupProps) {
  const { words, categories } = useLibrary();
  const definition = getGameDefinition(gameId);

  const pool = getCandidateWords(words, config, definition.requiresImage);
  const questionTotal = Math.min(config.count, pool.length);
  const withoutImage = definition.requiresImage ? countWordsWithoutImage(words, config) : 0;
  const issues = getSetupIssues(definition, pool, words, config);
  const Icon = definition.icon;

  const handleStart = () => {
    onStart(selectGameWords(words, config, definition.requiresImage));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Oyun listesine dön
      </button>

      <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">{definition.title}</h2>
          <p className="text-sm text-slate-600">{definition.description}</p>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <GameFilterFields config={config} onChange={onConfigChange} categoryOptions={getCategoryOptions(categories, words)} />

        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Bu ayarlara uyan <strong>{pool.length}</strong> kelime var.
          </p>
          {withoutImage > 0 && (
            <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Görseli olmayan {withoutImage} kelime bu oyuna alınmadı.
            </p>
          )}
          {pool.length > 0 && pool.length < config.count && (
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Yeterli kelime yok. Oyun {questionTotal} kelimeyle başlayacak.
            </p>
          )}
          {issues.map((issue) => (
            <p key={issue} className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {issue}
            </p>
          ))}
        </div>

        {settingsError && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
            Ayarlarınız kaydedilemedi: {settingsError}
          </p>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={issues.length > 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          Oyunu başlat ({questionTotal} kelime)
        </button>
      </div>
    </div>
  );
}
