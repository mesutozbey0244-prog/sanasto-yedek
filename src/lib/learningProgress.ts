import type { Word } from '@/lib/vocabulary';

export interface LearningProgress {
  learned: number;
  total: number;
  percent: number;
}

export function getLearningProgress(words: Word[]): LearningProgress {
  const total = words.length;
  const learned = words.filter((word) => word.learning_status === 'learned').length;
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
  return { learned, total, percent };
}
