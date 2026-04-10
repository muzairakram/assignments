import { RAG_COLORS } from "@/lib/constants";

interface RAGBadgeProps {
  status: string;
  className?: string;
}

export function RAGBadge({ status, className = "" }: RAGBadgeProps) {
  const color = RAG_COLORS[status] || "#6B7B8D";

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="inline-block w-[9px] h-[9px]"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-[11px] font-bold uppercase tracking-[0.08em]"
        style={{ color }}
      >
        {status}
      </span>
    </span>
  );
}
