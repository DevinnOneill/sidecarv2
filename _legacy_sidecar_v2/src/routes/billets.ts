import { Router, Request, Response } from 'express';
import { BILLETS } from '../data/index';
import type { BilletStatus, AOR } from '../types/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, aor, nec, paygrade } = req.query as Record<string, string>;
  let results = [...BILLETS];
  if (status) results = results.filter(b => b.status === (status.toUpperCase() as BilletStatus));
  if (aor) results = results.filter(b => b.aor === (aor.toUpperCase() as AOR));
  if (nec) results = results.filter(b => b.necRequired === nec);
  if (paygrade) results = results.filter(b => b.paygrade === paygrade);
  res.json({
    success: true, data: { billets: results }, total: results.length,
    vacant: results.filter(b => b.status === 'VACANT').length,
    projected: results.filter(b => b.status === 'PROJECTED').length,
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const billet = BILLETS.find(b => b.id === req.params.id);
  if (!billet) { res.status(404).json({ success: false, message: 'Billet not found' }); return; }
  res.json({ success: true, data: billet });
});

export default router;
