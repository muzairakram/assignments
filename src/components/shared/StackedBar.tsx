interface Segment {
  value: number;
  color: string;
  label?: string;
}

interface StackedBarProps {
  segments: Segment[];
  height?: number;
  className?: string;
}

export function StackedBar({ segments, height = 8, className = "" }: StackedBarProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div
      className={`w-full bg-grey-border overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className="flex h-full">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="h-full transition-[width] duration-300"
            style={{
              width: `${(seg.value / total) * 100}%`,
              backgroundColor: seg.color,
            }}
            title={seg.label ? `${seg.label}: ${seg.value}%` : `${seg.value}%`}
          />
        ))}
      </div>
    </div>
  );
}
