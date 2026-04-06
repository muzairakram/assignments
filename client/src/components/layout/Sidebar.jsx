import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/actions', label: 'Actions Hub', icon: ActionsIcon },
];

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ActionsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-navy-dark min-h-screen flex flex-col border-r border-navy-light">
      <div className="p-6 border-b border-navy-light">
        <h1 className="text-gold font-bold text-lg tracking-wide">DA Outcomes</h1>
        <p className="text-gold-light text-xs tracking-widest uppercase mt-1">CRM</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-navy-light'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-navy-light">
        <p className="text-xs text-gray-500 text-center">Delivery Associates</p>
      </div>
    </aside>
  );
}
