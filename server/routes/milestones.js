const { Router } = require('express');
const db = require('../db/database');

const router = Router();

// Get milestones for a client
router.get('/client/:clientId', (req, res) => {
  const milestones = db.prepare(
    'SELECT * FROM milestones WHERE client_id = ? ORDER BY sort_order'
  ).all(req.params.clientId);
  res.json(milestones);
});

// Create milestone
router.post('/', (req, res) => {
  const { client_id, name, sort_order } = req.body;
  const result = db.prepare(
    'INSERT INTO milestones (client_id, name, sort_order) VALUES (?, ?, ?)'
  ).run(client_id, name, sort_order || 0);
  const milestone = db.prepare('SELECT * FROM milestones WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(milestone);
});

// Toggle completed / update milestone
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM milestones WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Milestone not found' });

  if (req.body.completed !== undefined) {
    db.prepare('UPDATE milestones SET completed = ? WHERE id = ?').run(req.body.completed ? 1 : 0, req.params.id);
  }
  if (req.body.name !== undefined) {
    db.prepare('UPDATE milestones SET name = ? WHERE id = ?').run(req.body.name, req.params.id);
  }
  if (req.body.sort_order !== undefined) {
    db.prepare('UPDATE milestones SET sort_order = ? WHERE id = ?').run(req.body.sort_order, req.params.id);
  }

  // Update parent client's updated_at
  db.prepare("UPDATE clients SET updated_at = datetime('now') WHERE id = ?").run(existing.client_id);

  const milestone = db.prepare('SELECT * FROM milestones WHERE id = ?').get(req.params.id);
  res.json(milestone);
});

// Delete milestone
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM milestones WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
