import { Router, Request, Response } from 'express';
import { SAILORS } from '../data/seed';
import { RollerStatus } from '../types/index';

const router = Router();

const ROLLER_ORDER: Record<RollerStatus, number> = {
  CRITICAL: 0, ACTIVE: 1, UPCOMING: 2, PENDING: 3, ORDERED: 4,
};

// GET /api/sailors
router.get('/', (req: Request, res: Response) => {
  const { roller_status, rate, detailer_id } = req.query as Record<string, string>;

  let results = [...SAILORS];
  if (roller_status) results = results.filter(s => s.roller_status === roller_status.toUpperCase());
  if (rate)          results = results.filter(s => s.rate.includes(rate.toUpperCase()));
  if (detailer_id)   results = results.filter(s => s.detailer_id === detailer_id);

  results.sort((a, b) =>
    (ROLLER_ORDER[a.roller_status] ?? 9) - (ROLLER_ORDER[b.roller_status] ?? 9)
  );

  res.json({ sailors: results, total: results.length });
});

// GET /api/sailors/:id
router.get('/:id', (req: Request, res: Response) => {
  const sailor = SAILORS.find(s => s.id === req.params.id);
  if (!sailor) { res.status(404).json({ status: 'error', message: 'Sailor not found' }); return; }
  res.json(sailor);
});

// GET /api/sailors/:id/applications
router.get('/:id/applications', (req: Request, res: Response) => {
  res.json({
    sailor_id: req.params.id,
    applications: [
      { billet_id:'B001', command:'NISC Little Creek',  date:'2026-02-10', status:'PENDING',      detailer:'J. Davis',   notes:'Strong NEC match, East Coast preference aligned' },
      { billet_id:'B002', command:'NAS Jacksonville',   date:'2026-01-22', status:'SUBMITTED',    detailer:'J. Davis',   notes:'East Coast preference met, family considerations' },
      { billet_id:'B003', command:'NETC Pensacola',     date:'2025-12-05', status:'NOT_SELECTED', detailer:'S. Johnson', notes:'Selected another candidate — cycle Dec 2025' },
    ],
  });
});

export default router;
