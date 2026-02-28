import { Router, Request, Response } from 'express';
import { AVAILS } from '../data/seed';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, priority } = req.query as Record<string, string>;
  let results = [...AVAILS];
  if (status)   results = results.filter(a => a.status   === status.toUpperCase());
  if (priority) results = results.filter(a => a.priority === priority.toUpperCase());
  res.json({
    avails:   results,
    total:    results.length,
    urgent:   AVAILS.filter(a => a.priority === 'URGENT').length,
    unrouted: AVAILS.filter(a => a.status   === 'SUBMITTED').length,
  });
});

export default router;
