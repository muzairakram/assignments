import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchClients } from '../api/client';
import RAGBadge from '../components/shared/RAGBadge';
import PhaseBadge from '../components/shared/PhaseBadge';
import Avatar from '../components/shared/Avatar';
import DeadlineDisplay from '../components/shared/DeadlineDisplay';

function StatCard({ label, value, accent }) {
  const accents = {
    gold: 'border-gold/40',
    red: 'border-red-500/40',
    amber: 'border-amber-500/40',
    green: 'border-emerald-500/40',
    blue: 'border-blue-500/40',
  };
  return (
    <div className={`bg-navy-light rounded-xl p-5 border-l-4 ${accents[accent] || accents.gold}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-100 mt-1">{value}</p>
    </div>
  );
}

function MilestoneProgressBar({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Milestones</span>
        <span>{completed}/{total}</span>
      </div>
      <div className="h-2 bg-navy rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [ragFilter, setRagFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(console.error);
    fetchClients().then(setClients).catch(console.error);
  }, []);

  const filteredClients = clients.filter((c) => {
    if (ragFilter && c.rag_status !== ragFilter) return false;
    if (phaseFilter && c.phase !== phaseFilter) return false;
    return true;
  });

  if (!stats) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Engagements" value={stats.totalClients} accent="gold" />
        <StatCard label="Green" value={stats.ragBreakdown.Green || 0} accent="green" />
        <StatCard label="Amber" value={stats.ragBreakdown.Amber || 0} accent="amber" />
        <StatCard label="Red" value={stats.ragBreakdown.Red || 0} accent="red" />
        <StatCard label="Open Actions" value={stats.openActions} accent="blue" />
      </div>

      {/* Overdue Banner */}
      {stats.overdueActions > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-semibold">{stats.overdueActions} overdue action{stats.overdueActions > 1 ? 's' : ''}</p>
              <p className="text-red-400/70 text-sm">Require immediate attention</p>
            </div>
          </div>
          <Link to="/actions" className="text-sm text-red-400 hover:text-red-300 font-medium">
            View Actions &rarr;
          </Link>
        </div>
      )}

      {/* Approaching Deadlines Banner */}
      {stats.upcomingDeadlines.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-400 font-semibold">Approaching Deadlines</p>
          </div>
          <div className="space-y-2">
            {stats.upcomingDeadlines.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{a.task}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">{a.client_name}</span>
                  <DeadlineDisplay deadline={a.deadline} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-100">Client Engagements</h3>
        <div className="flex gap-2 ml-auto">
          <select
            value={ragFilter}
            onChange={(e) => setRagFilter(e.target.value)}
            className="bg-navy-light border border-navy-lighter rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gold/50"
          >
            <option value="">All RAG</option>
            <option value="Red">Red</option>
            <option value="Amber">Amber</option>
            <option value="Green">Green</option>
          </select>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="bg-navy-light border border-navy-lighter rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gold/50"
          >
            <option value="">All Phases</option>
            <option value="Discovery">Discovery</option>
            <option value="Design">Design</option>
            <option value="Delivery">Delivery</option>
            <option value="Sustain">Sustain</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            to={`/clients/${client.id}`}
            className="bg-navy-light rounded-xl p-5 border border-navy-lighter hover:border-gold/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-100 group-hover:text-gold transition-colors truncate">
                  {client.name}
                </h4>
                <p className="text-sm text-gray-400 mt-0.5">{client.engagement_type}</p>
              </div>
              <RAGBadge status={client.rag_status} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <PhaseBadge phase={client.phase} />
              <span className="text-xs text-gray-500">Started {client.start_date}</span>
            </div>
            <MilestoneProgressBar
              completed={client.completed_milestones || 0}
              total={client.total_milestones || 0}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
