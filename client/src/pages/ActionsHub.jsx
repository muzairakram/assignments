import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchActions, fetchUrgentActions, fetchActionsByOwner, updateActionStatus } from '../api/client';
import { useApp } from '../context/AppContext';
import Avatar from '../components/shared/Avatar';
import StatusBadge from '../components/shared/StatusBadge';
import DeadlineDisplay, { getDaysFromNow } from '../components/shared/DeadlineDisplay';

const TABS = [
  { key: 'open', label: 'All Open' },
  { key: 'mine', label: 'My Actions' },
  { key: 'urgent', label: 'Urgent' },
];

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Done', 'Blocked'];

function DeadlinePill({ deadline }) {
  const days = getDaysFromNow(deadline);
  let bgClass;
  if (days < 0) bgClass = 'bg-red-500/20 text-red-400 border-red-500/30';
  else if (days <= 3) bgClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  else bgClass = 'bg-navy-lighter text-gray-300 border-navy-light';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bgClass}`}>
      <span>{deadline}</span>
      <span className="opacity-70"><DeadlineDisplay deadline={deadline} /></span>
    </span>
  );
}

export default function ActionsHub() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('open');
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, [activeTab]);

  async function loadActions() {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'open') {
        data = (await fetchActions()).filter((a) => a.status !== 'Done');
      } else if (activeTab === 'mine') {
        data = await fetchActionsByOwner(currentUser);
      } else {
        data = await fetchUrgentActions();
      }
      setActions(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleStatusChange(actionId, status) {
    await updateActionStatus(actionId, status);
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status } : a))
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-navy-light rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-gold text-navy'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : actions.length === 0 ? (
        <div className="bg-navy-light rounded-xl p-8 text-center border border-navy-lighter">
          <p className="text-gray-400">No actions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="bg-navy-light rounded-xl p-5 border border-navy-lighter hover:border-navy-lighter/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100">{action.task}</p>
                  <Link
                    to={`/clients/${action.client_id}`}
                    className="text-xs text-gold hover:text-gold-light mt-1 inline-block"
                  >
                    {action.client_name} &rarr;
                  </Link>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Avatar name={action.owner} size="sm" />
                    <span className="text-xs text-gray-400 hidden sm:inline">{action.owner}</span>
                  </div>
                  <DeadlinePill deadline={action.deadline} />
                  <select
                    value={action.status}
                    onChange={(e) => handleStatusChange(action.id, e.target.value)}
                    className="bg-navy border border-navy-lighter rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-gold/50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
