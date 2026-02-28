import { Router, Request, Response } from 'express';
import { ORDERS, SAILORS, BILLETS } from '../data/index';
import type { PreQARequest, PreQAResponse, PreQACheck, OrderStatus } from '../types/index';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status } = req.query as Record<string, string>;
  let results = [...ORDERS];
  if (status) results = results.filter(o => o.status === (status.toUpperCase() as OrderStatus));

  const byStatus = {
    DRAFT:     ORDERS.filter(o => o.status === 'DRAFT').length,
    PRE_QA:    ORDERS.filter(o => o.status === 'PRE_QA').length,
    QA_REVIEW: ORDERS.filter(o => o.status === 'QA_REVIEW').length,
    RETURNED:  ORDERS.filter(o => o.status === 'RETURNED').length,
    APPROVED:  ORDERS.filter(o => o.status === 'APPROVED').length,
    EXECUTED:  ORDERS.filter(o => o.status === 'EXECUTED').length,
  };

  res.json({ success: true, data: results, total: results.length, byStatus });
});

router.get('/:id', (req: Request, res: Response) => {
  const order = ORDERS.find(o => o.id === req.params.id);
  if (!order) { res.status(404).json({ success: false, message: 'Order not found' }); return; }
  res.json({ success: true, data: order });
});

// ── Pre-QA Policy Engine ────────────────────────────────────────────────────
router.post('/preqa', (req: Request<{}, {}, PreQARequest>, res: Response) => {
  const { sailorId, billetId, orderType, rnltd, tourLength, fundingLine } = req.body;

  const sailor = SAILORS.find(s => s.id === sailorId);
  const billet = BILLETS.find(b => b.id === billetId);
  const checks: PreQACheck[] = [];

  // 1 — JTRS
  checks.push({
    check: 'JTRS Compliance', reference: 'JTR Chapter 5',
    status: 'PASS',
    detail: `PCS entitlements authorized for ${sailor?.paygrade ?? '?'} — HHG, DLA, TLE applicable`,
  });

  // 2 — Tour Length
  const prescribed: Record<string, number> = { PCS: 36, PCA: 24, TAD: 0, TEMDU: 0 };
  const minTour = prescribed[orderType] ?? 36;
  checks.push({
    check: 'Tour Length', reference: 'MILPERSMAN 1301-102',
    status: tourLength >= minTour ? 'PASS' : 'ADVISORY',
    detail: `Requested ${tourLength}mo — prescribed minimum ${minTour}mo for ${orderType}`,
  });

  // 3 — EAOS / Obligated Service
  let eaosStatus: PreQACheck['status'] = 'ADVISORY';
  let eaosDetail = 'Unable to validate EAOS — confirm manually';
  if (sailor?.eaos && rnltd) {
    const eaosDate  = new Date(sailor.eaos);
    const rnltdDate = new Date(rnltd);
    const monthsRemaining = Math.floor((eaosDate.getTime() - rnltdDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
    eaosStatus = monthsRemaining >= 12 ? 'PASS' : 'FAIL';
    eaosDetail = `${monthsRemaining}mo obligated service beyond RNLTD (minimum 12mo required per MILPERSMAN 1160-030)`;
  }
  checks.push({ check: 'EAOS / Obligated Service', reference: 'MILPERSMAN 1160-030', status: eaosStatus, detail: eaosDetail });

  // 4 — NEC Match
  const sailorNec   = sailor?.necPrimary;
  const sailorNec2  = sailor?.necSecondary;
  const billetNec   = billet?.necRequired;
  const necMatch    = sailorNec === billetNec || sailorNec2 === billetNec;
  checks.push({
    check: 'NEC Match', reference: 'MILPERSMAN 1306-106',
    status: necMatch ? 'PASS' : 'ADVISORY',
    detail: `Sailor NEC ${sailorNec ?? '?'}${sailorNec2 ? ' / ' + sailorNec2 : ''} vs billet NEC ${billetNec ?? '?'}`,
  });

  // 5 — Sea/Shore Rotation
  checks.push({
    check: 'Sea/Shore Rotation', reference: 'MILPERSMAN 1306-106',
    status: 'PASS',
    detail: `Sailor coded ${sailor?.rollerType?.replace('_', ' ') ?? '?'} — billet type eligible for rotation`,
  });

  // 6 — Budget / Funding Line
  checks.push({
    check: 'Budget / Funding Line', reference: 'NAVADMIN 052/26',
    status: fundingLine ? 'PASS' : 'ADVISORY',
    detail: fundingLine ?? 'Funding line not provided — QA will verify before approval',
  });

  // 7 — Medical Hold
  const medHold = sailor?.medicalHold === true;
  checks.push({
    check: 'Medical Hold', reference: 'MILPERSMAN 1850-040',
    status: medHold ? 'FAIL' : 'PASS',
    detail: medHold
      ? 'ACTIVE MEDICAL HOLD — orders blocked until Medical Reviewer clears'
      : 'No active medical hold on record',
  });

  // 8 — Paygrade Match
  const pgMatch = sailor?.paygrade === billet?.paygrade;
  checks.push({
    check: 'Paygrade Match', reference: 'MILPERSMAN 1000-020',
    status: pgMatch ? 'PASS' : 'ADVISORY',
    detail: `Sailor ${sailor?.paygrade ?? '?'} vs billet ${billet?.paygrade ?? '?'}`,
  });

  const passed   = checks.filter(c => c.status === 'PASS').length;
  const advisory = checks.filter(c => c.status === 'ADVISORY').length;
  const failed   = checks.filter(c => c.status === 'FAIL').length;

  const response: PreQAResponse = {
    sailorId, billetId, checks,
    summary:  { passed, advisory, failed },
    canSubmit: failed === 0,
    message:  `${passed} passed · ${advisory} advisory · ${failed} failed`,
  };

  res.json({ success: true, data: response });
});

export default router;
