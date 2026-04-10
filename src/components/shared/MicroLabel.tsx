interface MicroLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function MicroLabel({ children, className = "" }: MicroLabelProps) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text ${className}`}
    >
      {children}
    </span>
  );
}
