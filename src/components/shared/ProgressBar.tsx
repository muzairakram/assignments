interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = "" }: ProgressBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={`w-full bg-grey-border h-[5px] ${className}`}>
      <div
        className="h-full bg-gold transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
