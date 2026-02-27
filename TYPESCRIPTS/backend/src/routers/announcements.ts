import { Router, Request, Response } from 'express';
import { ANNOUNCEMENTS } from '../data/seed';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { audience } = req.query as { audience?: string };
  const results = audience && audience !== 'ALL'
    ? ANNOUNCEMENTS.filter(a => a.audience === 'ALL' || a.audience === audience.toUpperCase())
    : ANNOUNCEMENTS;
  res.json({ announcements: results, total: results.length });
});

router.get('/:id', (req: Request, res: Response) => {
  const ann = ANNOUNCEMENTS.find(a => a.id === req.params.id);
  if (!ann) { res.status(404).json({ status: 'error', message: 'Announcement not found' }); return; }
  res.json(ann);
});

export default router;
