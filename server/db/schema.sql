CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  engagement_type TEXT NOT NULL CHECK(engagement_type IN ('Technical Assistance', 'Strategy Advisory', 'Capacity Building', 'Implementation Support', 'Assessment')),
  phase TEXT NOT NULL CHECK(phase IN ('Discovery', 'Design', 'Delivery', 'Sustain', 'Closed')),
  rag_status TEXT NOT NULL CHECK(rag_status IN ('Red', 'Amber', 'Green')),
  start_date TEXT NOT NULL,
  target_outcome TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  task TEXT NOT NULL,
  owner TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK(status IN ('Not Started', 'In Progress', 'Done', 'Blocked')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
