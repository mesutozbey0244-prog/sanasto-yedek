import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { describeError } from '@/lib/errors';
import { parseGameSettings, type GameSetupConfig } from '@/lib/games/gameConfig';
import { supabase } from '@/lib/supabase';

const GAME_SETTINGS_METADATA_KEY = 'game_settings';

export function useGameSettings(): {
  config: GameSetupConfig;
  updateConfig: (next: GameSetupConfig) => void;
  saveError: string | null;
} {
  const { user } = useAuth();
  const [config, setConfig] = useState<GameSetupConfig>(() =>
    parseGameSettings(user?.user_metadata?.[GAME_SETTINGS_METADATA_KEY]),
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateConfig = useCallback((next: GameSetupConfig) => {
    setConfig(next);
    setSaveError(null);
    void supabase.auth
      .updateUser({ data: { [GAME_SETTINGS_METADATA_KEY]: next } })
      .then(({ error }) => {
        if (error) setSaveError(describeError(error));
      });
  }, []);

  return { config, updateConfig, saveError };
}
