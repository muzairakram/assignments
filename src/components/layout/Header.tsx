import { MicroLabel } from "@/components/shared/MicroLabel";

interface HeaderProps {
  microLabel: string;
  title: string;
  children?: React.ReactNode;
}

export function Header({ microLabel, title, children }: HeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <MicroLabel>{microLabel}</MicroLabel>
        <h1 className="text-[26px] font-extrabold text-navy tracking-[-0.01em] mt-1">
          {title}
        </h1>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
