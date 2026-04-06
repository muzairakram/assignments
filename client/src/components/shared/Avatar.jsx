import { getInitials } from '../../context/AppContext';

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

export default function Avatar({ name, size = 'md' }) {
  return (
    <div
      className={`${sizes[size]} rounded-full bg-navy-lighter border border-gold/30 flex items-center justify-center text-gold font-semibold shrink-0`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
