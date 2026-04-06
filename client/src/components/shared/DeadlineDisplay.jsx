export function getDaysFromNow(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DeadlineDisplay({ deadline }) {
  const days = getDaysFromNow(deadline);
  let colorClass, label;

  if (days < 0) {
    colorClass = 'text-red-400';
    label = `${Math.abs(days)}d overdue`;
  } else if (days === 0) {
    colorClass = 'text-amber-400';
    label = 'Due today';
  } else if (days <= 3) {
    colorClass = 'text-amber-400';
    label = `${days}d left`;
  } else {
    colorClass = 'text-blue-400';
    label = `${days}d left`;
  }

  return <span className={`text-xs font-medium ${colorClass}`}>{label}</span>;
}
