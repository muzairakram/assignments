const { Router } = require('express');
const db = require('../db/database');

const router = Router();

// List clients with optional filters and milestone progress
router.get('/', (req, res) => {
  const { rag, phase, engagement_type } = req.query;
  let where = [];
  let params = {};

  if (rag) { where.push('c.rag_status = @rag'); params.rag = rag; }
  if (phase) { where.push('c.phase = @phase'); params.phase = phase; }
  if (engagement_type) { where.push('c.engagement_type = @engagement_type'); params.engagement_type = engagement_type; }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const clients = db.prepare(`
    SELECT c.*,
      COUNT(m.id) AS total_milestones,
      SUM(CASE WHEN m.completed = 1 THEN 1 ELSE 0 END) AS completed_milestones
    FROM clients c
    LEFT JOIN milestones m ON m.client_id = c.id
    ${whereClause}
    GROUP BY c.id
    ORDER BY c.updated_at DESC
  `).all(params);

  res.json(clients);
});

// Get single client with milestones and actions
router.get('/:id', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.milestones = db.prepare(
    'SELECT * FROM milestones WHERE client_id = ? ORDER BY sort_order'
  ).all(req.params.id);

  client.actions = db.prepare(
    'SELECT * FROM actions WHERE client_id = ? ORDER BY deadline'
  ).all(req.params.id);

  res.json(client);
});

// Create client
router.post('/', (req, res) => {
  const { name, engagement_type, phase, rag_status, start_date, target_outcome, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO clients (name, engagement_type, phase, rag_status, start_date, target_outcome, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, engagement_type, phase, rag_status, start_date, target_outcome, notes);
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(client);
});

// Update client
router.put('/:id', (req, res) => {
  const { name, engagement_type, phase, rag_status, start_date, target_outcome, notes } = req.body;
  db.prepare(`
    UPDATE clients SET name=?, engagement_type=?, phase=?, rag_status=?, start_date=?, target_outcome=?, notes=?, updated_at=datetime('now')
    WHERE id=?
  `).run(name, engagement_type, phase, rag_status, start_date, target_outcome, notes, req.params.id);
  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  res.json(client);
});

// Delete client
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
