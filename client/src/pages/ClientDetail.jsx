import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchClient, updateMilestone, createAction, updateActionStatus } from '../api/client';
import { useApp } from '../context/AppContext';
import RAGBadge from '../components/shared/RAGBadge';
import PhaseBadge from '../components/shared/PhaseBadge';
import Avatar from '../components/shared/Avatar';
import StatusBadge from '../components/shared/StatusBadge';
import DeadlineDisplay from '../components/shared/DeadlineDisplay';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Done', 'Blocked'];

export default function ClientDetail() {
  const { id } = useParams();
  const { teamMembers } = useApp();
  const [client, setClient] = useState(null);
  const [newAction, setNewAction] = useState({ task: '', owner: '', deadline: '', status: 'Not Started' });

  useEffect(() => {
    loadClient();
  }, [id]);

  function loadClient() {
    fetchClient(id).then(setClient).catch(console.error);
  }

  async function handleToggleMilestone(milestone) {
    await updateMilestone(milestone.id, { completed: !milestone.completed });
    setClient((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestone.id ? { ...m, completed: m.completed ? 0 : 1 } : m
      ),
    }));
  }

  async function handleStatusChange(actionId, status) {
    await updateActionStatus(actionId, status);
    setClient((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === actionId ? { ...a, status } : a)),
    }));
  }

  async function handleAddAction(e) {
    e.preventDefault();
    if (!newAction.task || !newAction.owner || !newAction.deadline) return;
    await createAction({ client_id: Number(id), ...newAction });
    setNewAction({ task: '', owner: '', deadline: '', status: 'Not Started' });
    loadClient();
  }

  if (!client) return <div className="text-gray-400">Loading...</div>;

  const completedCount = client.milestones.filter((m) => m.completed).length;
  const totalCount = client.milestones.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link to="/" className="text-sm text-gold hover:text-gold-light">&larr; Back to Dashboard</Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{client.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <PhaseBadge phase={client.phase} />
            <RAGBadge status={client.rag_status} />
            <span className="text-sm text-gray-400">{client.engagement_type}</span>
          </div>
        </div>
      </div>

      {/* Target Outcome Card */}
      <div className="bg-navy-light rounded-xl p-6 border-l-4 border-gold">
        <h3 className="text-xs text-gold uppercase tracking-wide font-semibold mb-2">Target Outcome</h3>
        <p className="text-gray-200 leading-relaxed">{client.target_outcome}</p>
        {client.notes && (
          <p className="text-gray-400 text-sm mt-3 italic">{client.notes}</p>
        )}
        <p className="text-xs text-gray-500 mt-3">Started: {client.start_date}</p>
      </div>

      {/* Milestones */}
      <div className="bg-navy-light rounded-xl p-6 border border-navy-lighter">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-100">Milestones</h3>
          <span className="text-sm text-gray-400">{completedCount}/{totalCount} complete ({progressPct}%)</span>
        </div>
        <div className="h-2 bg-navy rounded-full overflow-hidden mb-5">
          <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="space-y-2">
          {client.milestones.map((m) => (
            <label
              key={m.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-lighter cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={!!m.completed}
                onChange={() => handleToggleMilestone(m)}
                className="w-5 h-5 rounded border-navy-lighter text-gold focus:ring-gold bg-navy"
              />
              <span className={`text-sm ${m.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                {m.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-navy-light rounded-xl border border-navy-lighter overflow-hidden">
        <div className="p-5 border-b border-navy-lighter">
          <h3 className="font-semibold text-gray-100">Follow-up Actions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-navy-lighter">
                <th className="text-left p-4">Task</th>
                <th className="text-left p-4">Owner</th>
                <th className="text-left p-4">Deadline</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {client.actions.map((a) => (
                <tr key={a.id} className="border-b border-navy-lighter/50 hover:bg-navy-lighter/30">
                  <td className="p-4 text-sm text-gray-200">{a.task}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={a.owner} size="sm" />
                      <span className="text-sm text-gray-300">{a.owner}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">{a.deadline}</span>
                      <DeadlineDisplay deadline={a.deadline} />
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className="bg-navy border border-navy-lighter rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-gold/50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {/* Add New Action Row */}
              <tr className="bg-navy-lighter/20">
                <td className="p-4">
                  <input
                    type="text"
                    placeholder="New action..."
                    value={newAction.task}
                    onChange={(e) => setNewAction((p) => ({ ...p, task: e.target.value }))}
                    className="bg-navy border border-navy-lighter rounded-lg px-3 py-2 text-sm text-gray-200 w-full focus:outline-none focus:border-gold/50"
                  />
                </td>
                <td className="p-4">
                  <select
                    value={newAction.owner}
                    onChange={(e) => setNewAction((p) => ({ ...p, owner: e.target.value }))}
                    className="bg-navy border border-navy-lighter rounded-lg px-2 py-2 text-sm text-gray-300 w-full focus:outline-none focus:border-gold/50"
                  >
                    <option value="">Select owner</option>
                    {teamMembers.map((tm) => (
                      <option key={tm.id} value={tm.name}>{tm.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <input
                    type="date"
                    value={newAction.deadline}
                    onChange={(e) => setNewAction((p) => ({ ...p, deadline: e.target.value }))}
                    className="bg-navy border border-navy-lighter rounded-lg px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-gold/50"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={handleAddAction}
                    className="bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
