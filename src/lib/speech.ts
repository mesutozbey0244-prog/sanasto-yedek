export type SpeechLanguage = 'fi' | 'tr';

const LANGUAGE_TAGS: Record<SpeechLanguage, string> = {
  fi: 'fi-FI',
  tr: 'tr-TR',
};

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoices(language: SpeechLanguage): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith(language));
}

export function subscribeToVoiceChanges(callback: () => void): () => void {
  if (!isSpeechSupported()) return () => {};
  const synth = window.speechSynthesis;
  synth.addEventListener('voiceschanged', callback);
  return () => synth.removeEventListener('voiceschanged', callback);
}

interface SpeakOptions {
  language: SpeechLanguage;
  rate: number;
  voiceURI: string | null;
}

export function speak(text: string, { language, rate, voiceURI }: SpeakOptions): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_TAGS[language];
    utterance.rate = rate;
    const voice = voiceURI ? getVoices(language).find((item) => item.voiceURI === voiceURI) : undefined;
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeech(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
