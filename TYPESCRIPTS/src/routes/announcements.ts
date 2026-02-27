import { Router, Request, Response } from 'express';
import { ANNOUNCEMENTS } from '../data/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { audience, category } = req.query as Record<string, string>;
  let results = [...ANNOUNCEMENTS];
  if (audience && audience !== 'ALL') {
    results = results.filter(a => a.audience === 'ALL' || a.audience === audience.toUpperCase());
  }
  if (category) results = results.filter(a => a.category === category.toUpperCase());
  results.sort((a, b) => {
    if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
    if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  res.json({ success: true, data: results, total: results.length });
});

router.get('/:id', (req: Request, res: Response) => {
  const ann = ANNOUNCEMENTS.find(a => a.id === req.params.id);
  if (!ann) { res.status(404).json({ success: false, message: 'Announcement not found' }); return; }
  res.json({ success: true, data: ann });
});

export default router;
