/**
 * SIDECAR — Express + TypeScript Server
 * Serves the API and the frontend static files from a single process.
 */

import express from 'express';
import cors    from 'cors';
import morgan  from 'morgan';
import path    from 'path';

import authRouter       from './routes/auth';
import sailorsRouter    from './routes/sailors';
import billetsRouter    from './routes/billets';
import ordersRouter     from './routes/orders';
import availsRouter     from './routes/avails';
import messagesRouter   from './routes/messages';
import analyticsRouter  from './routes/analytics';
import announcementsRouter from './routes/announcements';
import auditRouter      from './routes/audit';

const app  = express();
const PORT = process.env.PORT ?? 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRouter);
app.use('/api/sailors',       sailorsRouter);
app.use('/api/billets',       billetsRouter);
app.use('/api/orders',        ordersRouter);
app.use('/api/avails',        availsRouter);
app.use('/api/messages',      messagesRouter);
app.use('/api/analytics',     analyticsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/audit',         auditRouter);

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:         'operational',
    system:         'SIDECAR',
    version:        '0.1.0',
    runtime:        'Node.js + TypeScript',
    classification: 'UNCLASSIFIED // FOUO',
    timestamp:      new Date().toISOString(),
  });
});

// ── Serve Frontend ─────────────────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use('/static', express.static(frontendPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/app', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'pages', 'app.html'));
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ⚓  SIDECAR is running');
  console.log('  ────────────────────────────────────');
  console.log(`  App:      http://localhost:${PORT}`);
  console.log(`  API:      http://localhost:${PORT}/api/health`);
  console.log('  ────────────────────────────────────');
  console.log('');
});

export default app;
