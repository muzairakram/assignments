export default function PhaseBadge({ phase }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-lighter text-gray-300 border border-navy-light">
      {phase}
    </span>
  );
}
