import { useLocation } from 'react-router-dom';
import { useApp, getInitials } from '../../context/AppContext';

const titles = {
  '/': 'Dashboard',
  '/actions': 'Actions Hub',
};

export default function TopBar() {
  const { currentUser } = useApp();
  const location = useLocation();

  const title = location.pathname.startsWith('/clients/')
    ? 'Client Detail'
    : titles[location.pathname] || 'DA Outcomes CRM';

  return (
    <header className="h-16 bg-navy-light border-b border-navy-lighter flex items-center justify-between px-8">
      <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">{currentUser}</span>
        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy text-sm font-bold">
          {getInitials(currentUser)}
        </div>
      </div>
    </header>
  );
}
