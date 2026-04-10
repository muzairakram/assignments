import { MicroLabel } from "./MicroLabel";

interface StatBoxProps {
  label: string;
  value: string | number;
  subText?: string;
  valueColor?: string;
  className?: string;
}

export function StatBox({ label, value, subText, valueColor, className = "" }: StatBoxProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <MicroLabel>{label}</MicroLabel>
      <div
        className="text-[28px] font-extrabold leading-tight tracking-tight"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
      {subText && (
        <span className="text-[12px] text-grey-text">{subText}</span>
      )}
    </div>
  );
}
