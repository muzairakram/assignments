const { Router } = require('express');
const db = require('../db/database');

const router = Router();

router.get('/', (req, res) => {
  const members = db.prepare('SELECT * FROM team_members ORDER BY name').all();
  res.json(members);
});

module.exports = router;
