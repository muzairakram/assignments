const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const clientsRouter = require('./routes/clients');
const milestonesRouter = require('./routes/milestones');
const actionsRouter = require('./routes/actions');
const dashboardRouter = require('./routes/dashboard');
const teamRouter = require('./routes/team');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/clients', clientsRouter);
app.use('/api/milestones', milestonesRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/team', teamRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`DA Outcomes CRM server running on port ${PORT}`);
});
