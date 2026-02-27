import { Router, Request, Response } from 'express';
import { SAILORS, BILLETS, ORDERS, FLEET_READINESS } from '../data/seed';

const router = Router();

router.get('/dashboard', (_req: Request, res: Response) => {
  res.json({
    sailors_total:    SAILORS.length,
    critical_rollers: SAILORS.filter(s => s.roller_status === 'CRITICAL').length,
    active_rollers:   SAILORS.filter(s => s.roller_status === 'ACTIVE').length,
    orders_in_qa:     ORDERS.filter(o => o.status === 'QA_REVIEW').length,
    vacant_billets:   BILLETS.filter(b => b.status === 'VACANT').length,
  });
});

router.get('/fleet-readiness', (_req: Request, res: Response) => {
  res.json({ fleets: FLEET_READINESS });
});

router.get('/fill-rates', (_req: Request, res: Response) => {
  const total     = BILLETS.length;
  const vacant    = BILLETS.filter(b => b.status === 'VACANT').length;
  const projected = BILLETS.filter(b => b.status === 'PROJECTED').length;
  const filled    = total - vacant - projected;
  res.json({ total, filled, vacant, projected, fill_rate: Math.round(filled / total * 100 * 10) / 10 });
});

export default router;
