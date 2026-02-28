import { Router, Request, Response } from 'express';
import { BILLETS } from '../data/seed';

const router = Router();

// GET /api/billets
router.get('/', (req: Request, res: Response) => {
  const { status, aor, nec, paygrade } = req.query as Record<string, string>;

  let results = [...BILLETS];
  if (status)   results = results.filter(b => b.status   === status.toUpperCase());
  if (aor)      results = results.filter(b => b.aor      === aor.toUpperCase());
  if (nec)      results = results.filter(b => b.nec_required === nec);
  if (paygrade) results = results.filter(b => b.paygrade === paygrade);

  res.json({
    billets:   results,
    total:     results.length,
    vacant:    results.filter(b => b.status === 'VACANT').length,
    projected: results.filter(b => b.status === 'PROJECTED').length,
  });
});

// GET /api/billets/:id
router.get('/:id', (req: Request, res: Response) => {
  const billet = BILLETS.find(b => b.id === req.params.id);
  if (!billet) { res.status(404).json({ status: 'error', message: 'Billet not found' }); return; }
  res.json(billet);
});

export default router;
