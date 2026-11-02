import type { ReactNode } from 'react';

export default function Chip({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
          : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}
