import { Router, Request, Response } from 'express';
import { AUDIT_LOG } from '../data/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { entityType, userId } = req.query as Record<string, string>;
  let results = [...AUDIT_LOG];
  if (entityType) results = results.filter(a => a.entityType === entityType.toUpperCase());
  if (userId) results = results.filter(a => a.userId === userId);
  results.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  res.json({ success: true, data: { entries: results }, total: results.length });
});

export default router;
