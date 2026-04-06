const colors = {
  Red: 'bg-red-500/20 text-red-400 border-red-500/30',
  Amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function RAGBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || ''}`}>
      {status}
    </span>
  );
}
