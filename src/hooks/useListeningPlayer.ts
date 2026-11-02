import { useCallback, useEffect, useState } from 'react';
import { buildSpeechSteps, type ListeningSettings } from '@/lib/listening';
import { speak, stopSpeech } from '@/lib/speech';
import type { Word } from '@/lib/vocabulary';
import { useSpeechSettings } from '@/hooks/useSpeechSettings';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useListeningPlayer(queue: Word[], settings: ListeningSettings) {
  const { settings: speech } = useSpeechSettings();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastIndex = queue.length - 1;

  useEffect(() => {
    const word = queue[index];
    if (!isPlaying || !word) return;

    let cancelled = false;

    const run = async () => {
      for (const step of buildSpeechSteps(word, settings)) {
        if (cancelled) return;
        if (step.kind === 'wait') {
          await wait(step.seconds * 1000);
        } else {
          await speak(step.text, {
            language: step.language,
            rate: speech.rate,
            voiceURI: step.language === 'fi' ? speech.fiVoiceURI : speech.trVoiceURI,
          });
        }
      }
      if (cancelled) return;
      await wait(settings.pauseSeconds * 1000);
      if (cancelled) return;
      if (settings.autoplay && index < lastIndex) {
        setIndex(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      stopSpeech();
    };
  }, [isPlaying, index, queue, lastIndex, settings, speech]);

  const goTo = useCallback(
    (target: number) => setIndex(Math.min(Math.max(target, 0), lastIndex)),
    [lastIndex],
  );

  const togglePlaying = useCallback(() => setIsPlaying((playing) => !playing), []);

  return { index, isPlaying, togglePlaying, goTo, lastIndex };
}
