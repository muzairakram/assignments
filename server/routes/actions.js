const { Router } = require('express');
const db = require('../db/database');

const router = Router();

// All actions (with client name)
router.get('/', (req, res) => {
  const actions = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    ORDER BY a.deadline
  `).all();
  res.json(actions);
});

// Urgent actions (deadline within 3 days, not done)
router.get('/urgent', (req, res) => {
  const actions = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.status != 'Done'
      AND a.deadline <= date('now', '+3 days')
    ORDER BY a.deadline
  `).all();
  res.json(actions);
});

// Actions by owner
router.get('/by-owner/:name', (req, res) => {
  const actions = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.owner = ?
    ORDER BY a.deadline
  `).all(req.params.name);
  res.json(actions);
});

// Update action status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE actions SET status = ? WHERE id = ?').run(status, req.params.id);
  const action = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.id = ?
  `).get(req.params.id);
  res.json(action);
});

// Create action
router.post('/', (req, res) => {
  const { client_id, task, owner, deadline, status } = req.body;
  const result = db.prepare(
    'INSERT INTO actions (client_id, task, owner, deadline, status) VALUES (?, ?, ?, ?, ?)'
  ).run(client_id, task, owner, deadline, status || 'Not Started');
  db.prepare("UPDATE clients SET updated_at = datetime('now') WHERE id = ?").run(client_id);
  const action = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(action);
});

// Update action
router.put('/:id', (req, res) => {
  const { task, owner, deadline, status } = req.body;
  db.prepare(
    'UPDATE actions SET task=?, owner=?, deadline=?, status=? WHERE id=?'
  ).run(task, owner, deadline, status, req.params.id);
  const action = db.prepare(`
    SELECT a.*, c.name AS client_name
    FROM actions a
    JOIN clients c ON c.id = a.client_id
    WHERE a.id = ?
  `).get(req.params.id);
  res.json(action);
});

// Delete action
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM actions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
