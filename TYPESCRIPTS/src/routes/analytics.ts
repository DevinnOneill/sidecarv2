import { Router, Request, Response } from 'express';
import { SAILORS, BILLETS, ORDERS, FLEET_READINESS } from '../data/index';
import type { DashboardStats } from '../types/index';

const router = Router();

router.get('/dashboard', (_req: Request, res: Response) => {
  const stats: DashboardStats = {
    sailorsTotal:    SAILORS.length,
    criticalRollers: SAILORS.filter(s => s.rollerStatus === 'CRITICAL').length,
    activeRollers:   SAILORS.filter(s => s.rollerStatus === 'ACTIVE').length,
    ordersInQa:      ORDERS.filter(o => o.status === 'QA_REVIEW').length,
    vacantBillets:   BILLETS.filter(b => b.status === 'VACANT').length,
  };
  res.json({ success: true, data: stats });
});

router.get('/fleet-readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: FLEET_READINESS });
});

router.get('/fill-rates', (_req: Request, res: Response) => {
  const total    = BILLETS.length;
  const filled   = BILLETS.filter(b => b.status === 'FILLED').length;
  const vacant   = BILLETS.filter(b => b.status === 'VACANT').length;
  const projected= BILLETS.filter(b => b.status === 'PROJECTED').length;
  res.json({ success: true, data: { total, filled, vacant, projected, fillRate: total ? Math.round(filled/total*100*10)/10 : 0 }});
});

export default router;
