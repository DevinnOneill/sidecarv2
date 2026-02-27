import { Router, Request, Response } from 'express';
import { AVAILS } from '../data/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, priority } = req.query as Record<string, string>;
  let results = [...AVAILS];
  if (status)   results = results.filter(a => a.status   === status.toUpperCase());
  if (priority) results = results.filter(a => a.priority === priority.toUpperCase());
  res.json({
    success: true, data: results, total: results.length,
    urgent:   results.filter(a => a.priority === 'URGENT').length,
    unrouted: results.filter(a => a.status   === 'SUBMITTED').length,
  });
});

export default router;
