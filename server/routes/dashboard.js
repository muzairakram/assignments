const { Router } = require('express');
const db = require('../db/database');

const router = Router();

router.get('/stats', (req, res) => {
  const totalClients = db.prepare('SELECT COUNT(*) AS count FROM clients').get().count;

  const ragBreakdown = db.prepare(`
    SELECT rag_status, COUNT(*) AS count FROM clients GROUP BY rag_status
  `).all();

  const phaseBreakdown = db.prepare(`
    SELECT phase, COUNT(*) AS count FROM clients GROUP BY phase
  `).all();

  const openActions = db.prepare(
    "SELECT COUNT(*) AS count FROM actions WHERE status != 'Done'"
  ).get().count;

  const overdueActions = db.prepare(
    "SELECT COUNT(*) AS count FROM actions WHERE status != 'Done' AND deadline < date('now')"
  ).get().count;

  const upcomingDeadlines = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.status != 'Done'
      AND a.deadline >= date('now')
      AND a.deadline <= date('now', '+7 days')
    ORDER BY a.deadline
  `).all();

  res.json({
    totalClients,
    ragBreakdown: Object.fromEntries(ragBreakdown.map(r => [r.rag_status, r.count])),
    phaseBreakdown: Object.fromEntries(phaseBreakdown.map(r => [r.phase, r.count])),
    openActions,
    overdueActions,
    upcomingDeadlines,
  });
});

module.exports = router;
