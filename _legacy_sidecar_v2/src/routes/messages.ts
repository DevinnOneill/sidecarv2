import { Router, Request, Response } from 'express';
import { CHANNELS, MESSAGES } from '../data/index';

const router = Router();

router.get('/channels', (_req: Request, res: Response) => {
  res.json({ success: true, data: CHANNELS });
});

router.get('/channels/:id', (req: Request, res: Response) => {
  const msgs = MESSAGES[req.params.id] ?? [];
  res.json({ success: true, data: msgs, channelId: req.params.id });
});

export default router;
