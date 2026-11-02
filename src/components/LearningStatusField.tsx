import Chip from '@/components/Chip';
import { LEARNING_STATUS_OPTIONS, type LearningStatus } from '@/lib/vocabulary';

interface LearningStatusFieldProps {
  statuses: LearningStatus[];
  onChange: (statuses: LearningStatus[]) => void;
}

export default function LearningStatusField({ statuses, onChange }: LearningStatusFieldProps) {
  const toggle = (status: LearningStatus) => {
    onChange(statuses.includes(status) ? statuses.filter((item) => item !== status) : [...statuses, status]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-700">Öğrenme durumu</legend>
      <div className="flex flex-wrap gap-2">
        {LEARNING_STATUS_OPTIONS.map((option) => (
          <Chip key={option.value} active={statuses.includes(option.value)} onClick={() => toggle(option.value)}>
            {option.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}
