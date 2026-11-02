import type { LearningProgress } from '@/lib/learningProgress';

interface LearningBatteryProps {
  progress: LearningProgress;
}

export default function LearningBattery({ progress }: LearningBatteryProps) {
  if (progress.total === 0) {
    return <p className="text-xs font-semibold text-slate-400">Henüz kelime yok</p>;
  }

  const isFull = progress.percent === 100;
  const label = `${progress.learned}/${progress.total} (%${progress.percent})`;

  return (
    <div className="flex w-full items-center gap-3" role="img" aria-label={`Öğrenilme durumu: ${label}`}>
      <div className="relative h-5 min-w-0 flex-1 sm:h-6">
        <div className="h-full w-full rounded-md border-2 border-slate-400 bg-slate-100 p-0.5">
          <div
            className={`h-full rounded-sm transition-[width] duration-700 ease-out ${
              isFull ? 'bg-emerald-500' : progress.percent >= 30 ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span className="absolute top-1/2 -right-[7px] h-2.5 w-1.5 -translate-y-1/2 rounded-r-sm bg-slate-400" />
      </div>
      <p className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-slate-700">
        {progress.learned}/{progress.total}{' '}
        <span className="font-medium text-slate-500">(%{progress.percent})</span>
      </p>
    </div>
  );
}
