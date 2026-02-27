import express from 'express';
import cors    from 'cors';
import morgan  from 'morgan';
import path    from 'path';

import authRouter          from './routers/auth';
import sailorsRouter       from './routers/sailors';
import billetsRouter       from './routers/billets';
import ordersRouter        from './routers/orders';
import availsRouter        from './routers/avails';
import messagesRouter      from './routers/messages';
import analyticsRouter     from './routers/analytics';
import announcementsRouter from './routers/announcements';

const app  = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',          authRouter);
app.use('/api/sailors',       sailorsRouter);
app.use('/api/billets',       billetsRouter);
app.use('/api/orders',        ordersRouter);
app.use('/api/avails',        availsRouter);
app.use('/api/messages',      messagesRouter);
app.use('/api/analytics',     analyticsRouter);
app.use('/api/announcements', announcementsRouter);

// ── Health ────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:         'operational',
    system:         'SIDECAR',
    version:        '0.1.0',
    language:       'TypeScript + Node.js + Express',
    classification: 'UNCLASSIFIED // FOUO',
    timestamp:      new Date().toISOString(),
  });
});

// ── Serve Frontend ─────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', '..', '..', 'frontend');
app.use('/static', express.static(frontendPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/app', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'pages', 'app.html'));
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ⚓  SIDECAR is running');
  console.log('  ──────────────────────────────────────');
  console.log(`  App:      http://localhost:${PORT}`);
  console.log(`  API:      http://localhost:${PORT}/api/health`);
  console.log('  ──────────────────────────────────────');
  console.log('  UNCLASSIFIED // FOR OFFICIAL USE ONLY');
  console.log('');
});

export default app;
