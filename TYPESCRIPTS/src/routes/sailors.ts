import { Router, Request, Response } from 'express';
import { APPLICATIONS, SAILORS, EMAIL_THREADS } from '../data/index';
import type { RollerStatus } from '../types/index';

const router = Router();

const ROLLER_ORDER: Record<RollerStatus, number> = {
  CRITICAL: 0, ACTIVE: 1, UPCOMING: 2, PENDING: 3, ORDERED: 4,
};

router.get('/', (req: Request, res: Response) => {
  const { rollerStatus, rate, detailerId } = req.query as Record<string, string>;
  let results = [...SAILORS];
  if (rollerStatus) results = results.filter(s => s.rollerStatus === rollerStatus.toUpperCase());
  if (rate) results = results.filter(s => s.rate.includes(rate.toUpperCase()));
  if (detailerId) results = results.filter(s => s.detailerId === detailerId);
  results.sort((a, b) => (ROLLER_ORDER[a.rollerStatus] ?? 9) - (ROLLER_ORDER[b.rollerStatus] ?? 9));
  res.json({ success: true, data: { sailors: results }, total: results.length });
});

router.get('/:id', (req: Request, res: Response) => {
  const sailor = SAILORS.find(s => s.id === req.params.id);
  if (!sailor) { res.status(404).json({ success: false, message: 'Sailor not found' }); return; }
  res.json({ success: true, data: sailor });
});

router.get('/:id/applications', (req: Request, res: Response) => {
  const apps = APPLICATIONS[req.params.id] || [];
  res.json({ success: true, data: { applications: apps }, sailorId: req.params.id });
});

router.get('/:id/emails', (req: Request, res: Response) => {
  const threads = EMAIL_THREADS.filter(e => e.sailorId === req.params.id);
  res.json({ success: true, data: { threads }, total: threads.length });
});

export default router;
