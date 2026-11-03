interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortSegmentedControlProps<T extends string> {
  label: string;
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function SortSegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SortSegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            value === option.value ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
