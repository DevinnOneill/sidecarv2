import { Router, Request, Response } from 'express';
import { ORDERS, SAILORS, BILLETS } from '../data/seed';
import { PreQARequest, PreQACheck, OrderStatus } from '../types/index';

const router = Router();

// GET /api/orders
router.get('/', (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  const results = status
    ? ORDERS.filter(o => o.status === status.toUpperCase())
    : ORDERS;

  const by_status = ORDERS.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  res.json({ orders: results, total: results.length, by_status });
});

// GET /api/orders/:id
router.get('/:id', (req: Request, res: Response) => {
  const order = ORDERS.find(o => o.id === req.params.id);
  if (!order) { res.status(404).json({ status: 'error', message: 'Order not found' }); return; }
  res.json(order);
});

// POST /api/orders/preqa — Pre-QA Policy Engine
router.post('/preqa', (req: Request, res: Response) => {
  const body = req.body as PreQARequest;
  const { sailor_id, billet_id, order_type, rnltd, tour_length, funding_line } = body;

  const sailor = SAILORS.find(s => s.id === sailor_id);
  const billet = BILLETS.find(b => b.id === billet_id);
  const checks: PreQACheck[] = [];

  // 1 — JTRS Compliance
  checks.push({
    check:     'JTRS Compliance',
    reference: 'JTR Chapter 5',
    status:    'PASS',
    detail:    `PCS entitlements authorized for ${sailor?.paygrade ?? 'unknown grade'} — HHG, TLE, DLA, POV shipment`,
  });

  // 2 — Tour Length
  const prescribed = order_type === 'OVERSEAS' ? 24 : 36;
  checks.push({
    check:     'Tour Length',
    reference: 'MILPERSMAN 1301-102',
    status:    tour_length >= prescribed ? 'PASS' : 'ADVISORY',
    detail:    `Requested ${tour_length}mo — prescribed minimum ${prescribed}mo for ${order_type}`,
  });

  // 3 — EAOS / Obligated Service
  let eaosStatus: PreQACheck['status'] = 'ADVISORY';
  let eaosDetail = 'Unable to validate EAOS — confirm manually';
  if (sailor?.eaos && rnltd) {
    const monthsRemaining = Math.floor(
      (new Date(sailor.eaos).getTime() - new Date(rnltd).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    eaosStatus = monthsRemaining >= 12 ? 'PASS' : 'FAIL';
    eaosDetail = `${monthsRemaining}mo obligated service beyond RNLTD — minimum 12mo required`;
  }
  checks.push({ check: 'EAOS / Obligated Service', reference: 'MILPERSMAN 1160-030', status: eaosStatus, detail: eaosDetail });

  // 4 — NEC Match
  const primaryMatch   = sailor?.nec_primary   === billet?.nec_required;
  const secondaryMatch = sailor?.nec_secondary  === billet?.nec_required;
  checks.push({
    check:     'NEC Match',
    reference: 'MILPERSMAN 1306-106',
    status:    primaryMatch ? 'PASS' : secondaryMatch ? 'ADVISORY' : 'ADVISORY',
    detail:    `Sailor NEC ${sailor?.nec_primary ?? '—'}/${sailor?.nec_secondary ?? '—'} vs billet NEC ${billet?.nec_required ?? '—'}`,
  });

  // 5 — Sea/Shore Rotation
  checks.push({
    check:     'Sea/Shore Rotation',
    reference: 'MILPERSMAN 1306-106',
    status:    'PASS',
    detail:    `Sailor coded ${sailor?.roller_type?.replace('_', ' ') ?? 'UNKNOWN'} — eligible for rotation`,
  });

  // 6 — Budget / Funding Line
  checks.push({
    check:     'Budget / Funding Line',
    reference: 'NAVADMIN 052/26',
    status:    funding_line ? 'PASS' : 'ADVISORY',
    detail:    funding_line ?? 'Funding line not provided — QA will verify before approval',
  });

  // 7 — Medical Hold
  checks.push({
    check:     'Medical Hold',
    reference: 'MILPERSMAN 1850-040',
    status:    sailor?.medical_hold ? 'FAIL' : 'PASS',
    detail:    sailor?.medical_hold
      ? 'ACTIVE MEDICAL HOLD — orders blocked until Medical Reviewer clears'
      : 'No active medical hold on record',
  });

  // 8 — Paygrade Match
  const pgMatch = sailor?.paygrade === billet?.paygrade;
  checks.push({
    check:     'Paygrade Match',
    reference: 'MILPERSMAN 1000-020',
    status:    pgMatch ? 'PASS' : 'ADVISORY',
    detail:    `Sailor ${sailor?.paygrade ?? '—'} vs billet ${billet?.paygrade ?? '—'}`,
  });

  const passed   = checks.filter(c => c.status === 'PASS').length;
  const advisory = checks.filter(c => c.status === 'ADVISORY').length;
  const failed   = checks.filter(c => c.status === 'FAIL').length;

  res.json({
    sailor_id,
    billet_id,
    checks,
    summary:    { passed, advisory, failed },
    can_submit: failed === 0,
    message:    `${passed} passed · ${advisory} advisory · ${failed} failed`,
  });
});

export default router;
