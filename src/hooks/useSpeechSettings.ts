import { useCallback, useEffect, useState } from 'react';
import { getVoices, subscribeToVoiceChanges, type SpeechLanguage } from '@/lib/speech';

const STORAGE_KEY = 'sanasto.speechSettings';

export interface SpeechSettings {
  rate: number;
  fiVoiceURI: string | null;
  trVoiceURI: string | null;
}

export const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  rate: 0.9,
  fiVoiceURI: null,
  trVoiceURI: null,
};

function readSettings(): SpeechSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SPEECH_SETTINGS;
    return { ...DEFAULT_SPEECH_SETTINGS, ...(JSON.parse(raw) as Partial<SpeechSettings>) };
  } catch {
    return DEFAULT_SPEECH_SETTINGS;
  }
}

export function useSpeechSettings() {
  const [settings, setSettings] = useState<SpeechSettings>(readSettings);

  const updateSettings = useCallback((patch: Partial<SpeechSettings>) => {
    setSettings((previous) => {
      const next = { ...previous, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings };
}

export function useVoices(language: SpeechLanguage): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => getVoices(language));

  useEffect(() => {
    setVoices(getVoices(language));
    return subscribeToVoiceChanges(() => setVoices(getVoices(language)));
  }, [language]);

  return voices;
}
