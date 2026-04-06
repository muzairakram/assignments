const colors = {
  'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Blocked': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || ''}`}>
      {status}
    </span>
  );
}
