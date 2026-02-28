import { Router, Request, Response } from 'express';
import { CHANNELS, MESSAGES } from '../data/seed';

const router = Router();

router.get('/channels', (_req: Request, res: Response) => {
  res.json({ channels: CHANNELS });
});

router.get('/channels/:id', (req: Request, res: Response) => {
  const messages = MESSAGES[req.params.id] ?? [];
  res.json({ channel_id: req.params.id, messages });
});

export default router;
