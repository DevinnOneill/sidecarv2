/**
 * SIDECAR — Typed Mock Data Store
 * All seed data typed against shared interfaces.
 * Replace with PostgreSQL + TypeORM in Phase 1.
 */

import type {
  Sailor, Billet, Order, Avail, User,
  Channel, Message, FleetReadiness, Announcement, AuditEntry, EmailThread, SailorApplication
} from '../types/index';

const today = new Date();
const daysOut = (n: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

// ── USERS ─────────────────────────────────────────────────────────────────────

export const USERS: Record<string, User> = {
  'D001': { id: 'D001', name: 'J. Davis', role: 'DETAILER', rateCommunity: 'IT', email: 'jessica.davis@navy.mil' },
  'Q001': { id: 'Q001', name: 'M. Torres', role: 'QA_REVIEWER', rateCommunity: 'ALL', email: 'm.torres@navy.mil' },
  'PM01': { id: 'PM01', name: 'C. Miller', role: 'PROGRAM_MANAGER', rateCommunity: 'IT', email: 'c.miller@navy.mil' },
  'S001U': { id: 'S001U', name: 'IT2 Martinez', role: 'SAILOR', rateCommunity: 'IT', email: 'r.martinez@navy.mil', sailorId: 'S001' },
};

// ── SAILORS ───────────────────────────────────────────────────────────────────

export const SAILORS: Sailor[] = [
  {
    id: 'S001', edipi: '1234567890', lastName: 'Martinez', firstName: 'Rafael',
    rate: 'IT2', paygrade: 'E-5', necPrimary: '2779', necSecondary: '2781', clearance: 'TS/SCI',
    command: 'USS Nimitz (CVN-68)', uic: '21289', prd: daysOut(22), eaos: daysOut(365),
    rollerType: 'SEA_ROLLER', rollerStatus: 'CRITICAL', seaMonthsServed: 47, seaMonthsPrescribed: 48,
    detailerId: 'D001', availsOpen: 1, applications12mo: 3,
  },
  {
    id: 'S002', edipi: '2345678901', lastName: 'Anderson', firstName: 'Brittany',
    rate: 'IT2', paygrade: 'E-5', necPrimary: '2779', clearance: 'SECRET',
    command: 'USS Gerald R. Ford (CVN-78)', uic: '21456', prd: daysOut(67), eaos: daysOut(540),
    rollerType: 'SEA_ROLLER', rollerStatus: 'ACTIVE', seaMonthsServed: 28, seaMonthsPrescribed: 48,
    detailerId: 'D001', availsOpen: 1, applications12mo: 1, medicalHold: true,
  },
  {
    id: 'S003', edipi: '3456789012', lastName: 'Thompson', firstName: 'James',
    rate: 'IT1', paygrade: 'E-6', necPrimary: '2779', necSecondary: '2735', clearance: 'TS/SCI',
    command: 'NISC Little Creek', uic: '63890', prd: daysOut(145), eaos: daysOut(720),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'UPCOMING', seaMonthsServed: 48, seaMonthsPrescribed: 48,
    detailerId: 'D001', availsOpen: 0, applications12mo: 0,
  },
  {
    id: 'S004', edipi: '4567890123', lastName: 'Williams', firstName: 'Denise',
    rate: 'IT3', paygrade: 'E-4', necPrimary: '2781', clearance: 'SECRET',
    command: 'NAS Jacksonville', uic: '44230', prd: daysOut(312), eaos: daysOut(900),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'PENDING', seaMonthsServed: 0, seaMonthsPrescribed: 0,
    detailerId: 'D002', availsOpen: 0, applications12mo: 0,
  },
  {
    id: 'S005', edipi: '5678901234', lastName: 'Nguyen', firstName: 'Kevin',
    rate: 'IT2', paygrade: 'E-5', necPrimary: '2781', clearance: 'TS/SCI',
    command: 'VFA-106', uic: '09476', prd: daysOut(12), eaos: daysOut(420),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'CRITICAL', seaMonthsServed: 36, seaMonthsPrescribed: 36,
    detailerId: 'D001', availsOpen: 0, applications12mo: 5,
  },
  {
    id: 'S006', edipi: '6789012345', lastName: 'Bakshi', firstName: 'Arjun',
    rate: 'LS1', paygrade: 'E-6', necPrimary: 'S05A', clearance: 'SECRET',
    command: 'USS Leyte Gulf (CG-55)', uic: '21235', prd: daysOut(45), eaos: daysOut(600),
    rollerType: 'SEA_ROLLER', rollerStatus: 'ACTIVE', seaMonthsServed: 32, seaMonthsPrescribed: 48,
    detailerId: 'D003', availsOpen: 0, applications12mo: 2,
  },
  {
    id: 'S007', edipi: '7890123456', lastName: 'Smith', firstName: 'Garrett',
    rate: 'LS2', paygrade: 'E-5', necPrimary: 'S05A', clearance: 'SECRET',
    command: 'NAVSUP FLC Norfolk', uic: '35421', prd: daysOut(180), eaos: daysOut(720),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'PENDING', seaMonthsServed: 48, seaMonthsPrescribed: 48,
    detailerId: 'D003', availsOpen: 0, applications12mo: 0,
  },
  {
    id: 'S008', edipi: '8901234567', lastName: 'O\'Malley', firstName: 'Erin',
    rate: 'ITS2', paygrade: 'E-5', necPrimary: '741A', clearance: 'TS/SCI',
    command: 'USS Michigan (SSGN-727)', uic: '23412', prd: daysOut(5), eaos: daysOut(300),
    rollerType: 'SEA_ROLLER', rollerStatus: 'CRITICAL', seaMonthsServed: 42, seaMonthsPrescribed: 42,
    detailerId: 'D001', availsOpen: 1, applications12mo: 4,
  },
  {
    id: 'S009', edipi: '9012345678', lastName: 'Gacia', firstName: 'Elena',
    rate: 'IT1', paygrade: 'E-6', necPrimary: '2779', clearance: 'TS/SCI',
    command: 'Cyber Strike Group 2', uic: '88214', prd: daysOut(240), eaos: daysOut(1095),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'PENDING', seaMonthsServed: 36, seaMonthsPrescribed: 36,
    detailerId: 'D002', availsOpen: 0, applications12mo: 0,
  },
  {
    id: 'S010', edipi: '0123456789', lastName: 'Peterson', firstName: 'Kyle',
    rate: 'ITCS', paygrade: 'E-8', necPrimary: '2779', clearance: 'TS/SCI',
    command: 'COMNAVPERSCOM', uic: '00022', prd: daysOut(300), eaos: daysOut(1460),
    rollerType: 'SHORE_ROLLER', rollerStatus: 'PENDING', seaMonthsServed: 180, seaMonthsPrescribed: 36,
    detailerId: 'D002', availsOpen: 0, applications12mo: 0,
  }
];

// ── BILLETS ───────────────────────────────────────────────────────────────────

export const BILLETS: Billet[] = [
  { id: 'B001', title: 'IT Systems Administrator', command: 'NISC Little Creek', uic: '63890', necRequired: '2779', paygrade: 'E-5', aor: 'LANT', location: 'Norfolk, VA', status: 'VACANT', daysVacant: 34, matchScore: 96 },
  { id: 'B002', title: 'IT Network Technician', command: 'NAS Jacksonville', uic: '44230', necRequired: '2779', paygrade: 'E-5', aor: 'LANT', location: 'Jacksonville, FL', status: 'VACANT', daysVacant: 18, matchScore: 94 },
  { id: 'B003', title: 'IT Instructor', command: 'NETC Pensacola', uic: '55120', necRequired: '2779', paygrade: 'E-5', aor: 'SHORE', location: 'Pensacola, FL', status: 'PROJECTED', daysVacant: 0, incumbentPrd: daysOut(45), matchScore: 81 },
  { id: 'B004', title: 'IT Systems Supervisor', command: 'USS John C. Stennis (CVN-74)', uic: '21544', necRequired: '2779', paygrade: 'E-6', aor: 'PACFLT', location: 'Bremerton, WA', status: 'VACANT', daysVacant: 52, matchScore: 71 },
  { id: 'B005', title: 'IT Network Operations', command: '7th Fleet Flagship', uic: '31200', necRequired: '2779', paygrade: 'E-5', aor: 'WESTPAC', location: 'Yokosuka, Japan', status: 'VACANT', daysVacant: 67, matchScore: 88 },
  { id: 'B006', title: 'Senior IT Lead', command: 'USAEUR Headquarters', uic: '44501', necRequired: '2779', paygrade: 'E-6', aor: 'NAVEUR', location: 'Stuttgart, GE', status: 'VACANT', daysVacant: 12, matchScore: 92 },
  { id: 'B007', title: 'Cyber Defense Op', command: 'NIOC Hawaii', uic: '66001', necRequired: '2781', paygrade: 'E-5', aor: 'PACFLT', location: 'Honolulu, HI', status: 'PROJECTED', daysVacant: 0, incumbentPrd: daysOut(90), matchScore: 85 },
  { id: 'B008', title: 'Supply Chain Manager', command: 'USS Constitution', uic: '21001', necRequired: 'S05A', paygrade: 'E-6', aor: 'LANT', location: 'Boston, MA', status: 'VACANT', daysVacant: 145, matchScore: 78 },
  { id: 'B009', title: 'Logistics Specialist', command: 'NAVSUP FLC San Diego', uic: '35422', necRequired: 'S05A', paygrade: 'E-5', aor: 'PACFLT', location: 'San Diego, CA', status: 'VACANT', daysVacant: 5, matchScore: 95 },
  { id: 'B010', title: 'Submarine IT Support', command: 'COMSUBPAC', uic: '44122', necRequired: '741A', paygrade: 'E-5', aor: 'PACFLT', location: 'Pearl Harbor, HI', status: 'VACANT', daysVacant: 82, matchScore: 89 },
];

// ── APPLICATIONS ─────────────────────────────────────────────────────────────

export const APPLICATIONS: Record<string, SailorApplication[]> = {
  'S001': [
    { billetId: 'B001', command: 'NISC Little Creek', date: '2026-02-10', status: 'PENDING', detailer: 'J. Davis', notes: 'Strong NEC match, preference aligned' },
    { billetId: 'B002', command: 'NAS Jacksonville', date: '2026-01-22', status: 'SUBMITTED', detailer: 'J. Davis', notes: 'East Coast preference met' },
    { billetId: 'B003', command: 'NETC Pensacola', date: '2025-12-05', status: 'NOT_SELECTED', detailer: 'S. Johnson', notes: 'Selected another candidate' },
  ],
  'S005': [
    { billetId: 'B007', command: 'NIOC Hawaii', date: '2026-02-15', status: 'SUBMITTED', detailer: 'J. Davis', notes: 'Cross-rate request pending nec verification' },
    { billetId: 'B002', command: 'NAS Jacksonville', date: '2026-02-05', status: 'PENDING', detailer: 'J. Davis', notes: 'Prefers stay in local area' },
  ]
};

// ── ORDERS ────────────────────────────────────────────────────────────────────

export const ORDERS: Order[] = [
  {
    id: 'ORD-2026-0847', sailorId: 'S001', sailorName: 'IT2 Martinez, R.',
    gainingCommand: 'NISC Little Creek', gainingUic: '63890', billetId: 'B001',
    orderType: 'PCS', detachDate: daysOut(20), rnltd: daysOut(35),
    tourLength: 36, fundingLine: 'N00014-26-PCS-IT',
    status: 'QA_REVIEW', preqaPassed: 7, preqaAdvisory: 1, preqaFailed: 0,
    detailerId: 'D001', submittedDate: daysOut(-1),
  },
  {
    id: 'ORD-2026-0793', sailorId: 'S003', sailorName: 'IT1 Thompson, J.',
    gainingCommand: 'USS John C. Stennis (CVN-74)', gainingUic: '21544', billetId: 'B004',
    orderType: 'PCS', detachDate: daysOut(90), rnltd: daysOut(110),
    tourLength: 48, fundingLine: 'N00014-26-PCS-IT',
    status: 'RETURNED', preqaPassed: 6, preqaAdvisory: 0, preqaFailed: 2,
    detailerId: 'D001', submittedDate: daysOut(-3),
    returnReason: 'Funding line not validated; NEC mismatch for E-6 billet',
  },
  {
    id: 'ORD-2026-1102', sailorId: 'S005', sailorName: 'IT2 Nguyen, K.',
    gainingCommand: 'NAS Jacksonville', gainingUic: '44230', billetId: 'B002',
    orderType: 'PCS', detachDate: daysOut(15), rnltd: daysOut(30),
    tourLength: 36, status: 'DRAFT', preqaPassed: 4, preqaAdvisory: 2, preqaFailed: 0,
    detailerId: 'D001', submittedDate: daysOut(-1),
  },
  {
    id: 'ORD-2026-0551', sailorId: 'S006', sailorName: 'LS1 Bakshi, A.',
    gainingCommand: 'USS Constitution', gainingUic: '21001', billetId: 'B008',
    orderType: 'PCS', detachDate: daysOut(45), rnltd: daysOut(60),
    tourLength: 36, fundingLine: 'N00014-26-PCS-LS',
    status: 'APPROVED', preqaPassed: 8, preqaAdvisory: 0, preqaFailed: 0,
    detailerId: 'D003', submittedDate: daysOut(-10),
  }
];

// ── AVAILS ────────────────────────────────────────────────────────────────────

export const AVAILS: Avail[] = [
  { id: 'AVAIL-2026-0284', sailorId: 'S001', sailorName: 'IT2 Martinez, R.', type: 'HUMANITARIAN', priority: 'URGENT', status: 'ROUTED', routedTo: 'D001', daysOpen: 5, description: 'Family hardship — spouse medical, East Coast only' },
  { id: 'AVAIL-2026-0271', sailorId: 'S002', sailorName: 'IT2 Anderson, B.', type: 'MEDICAL', priority: 'ROUTINE', status: 'IN_PROGRESS', routedTo: 'D001', daysOpen: 12, description: 'LIMDU — orders on hold pending medical clearance', medicalHold: true },
  { id: 'AVAIL-2026-0331', sailorId: 'S008', sailorName: 'ITS2 O\'Malley, E.', type: 'HUMS', priority: 'HIGH', status: 'SUBMITTED', daysOpen: 2, description: 'Humanitarian assignment requested due to parental care.' },
];

// ── CHANNELS & MESSAGES ───────────────────────────────────────────────────────

export const CHANNELS: Channel[] = [
  { id: 'CH001', name: 'IT Rate — General', type: 'RATE', unread: 3 },
  { id: 'CH002', name: 'IT Rate — Orders', type: 'RATE', unread: 1 },
  { id: 'CH003', name: 'IT Rate — QA', type: 'RATE', unread: 0 },
  { id: 'CH004', name: 'PERS-40 Broadcast', type: 'BROADCAST', unread: 1 },
];

export const MESSAGES: Record<string, Message[]> = {
  CH001: [
    { id: 'M001', user: 'K. Brooks', role: 'PLACEMENT_COORD', text: 'Spring 2026 cycle guidance is out — check PERS-40 broadcast before actioning any new orders this week.', ts: '2026-02-25T08:14:00' },
    { id: 'M002', user: 'J. Davis', role: 'DETAILER', text: 'Got it. Martinez orders going to QA today — 7/8 checks passed, funding advisory only.', ts: '2026-02-25T09:22:00' },
    { id: 'M003', user: 'S. Martinez', role: 'DETAILER', text: 'J. Davis — can you take Thompson? I have 3 criticals and she just flagged interest in Stennis.', ts: '2026-02-25T10:45:00' },
    { id: 'M004', user: 'M. Torres', role: 'QA_REVIEWER', text: 'ORD-2026-0793 returned — funding line not validated, NEC advisory on E-6 billet. Detailer action required.', ts: '2026-02-25T11:20:00' },
  ],
  CH004: [
    { id: 'M005', user: 'CAPT Rhodes', role: 'LEADERSHIP', text: 'Spring 2026 Cycle opens 01 MAR. All Detailers ensure Sailor preferences in MNA are current before actioning orders.', ts: '2026-02-24T14:00:00' },
  ],
};

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'ANN001', title: 'Spring 2026 Cycle Opens 01 MAR', body: 'Review all Sailor preferences in MNA before actioning new orders this cycle. Confirm billet match scores against updated NEC tables before submission.', category: 'CYCLE_GUIDANCE', audience: 'ALL', author: 'CAPT Rhodes', date: '2026-02-24', priority: 'HIGH', readCount: 47 },
  { id: 'ANN002', title: 'Updated MILPERSMAN 1306-106 Tables', body: 'NEC prescriptions for CTN, IT, and IS rates have been updated. Detailers must verify against new tables before writing orders for any E-5/E-6 assignment effective 01 MAR 2026.', category: 'POLICY_UPDATE', audience: 'DETAILERS', author: 'C. Miller', date: '2026-02-20', priority: 'NORMAL', readCount: 31 },
  { id: 'ANN003', title: 'New Navy-365 Integration Beta', body: 'Sidecar now supports direct Outlook calendar syncing for detailer interview scheduling. Please report any sync lag to the program manager.', category: 'SYSTEM_NOTICE', audience: 'ALL', author: 'K. Brooks', date: '2026-02-26', priority: 'NORMAL', readCount: 12 },
];

// ── FLEET READINESS ───────────────────────────────────────────────────────────

export const FLEET_READINESS: FleetReadiness[] = [
  { fleet: '3rd Fleet (PACFLT)', fillRate: 81, trend: -2, critical: false },
  { fleet: '5th Fleet (NAVCENT)', fillRate: 84, trend: 1, critical: false },
  { fleet: '7th Fleet (WESTPAC)', fillRate: 64, trend: -5, critical: true },
  { fleet: '2nd Fleet (LANT)', fillRate: 93, trend: 0.5, critical: false },
  { fleet: '6th Fleet (NAVEUR)', fillRate: 89, trend: 0, critical: false },
  { fleet: 'Shore / CONUS', fillRate: 96, trend: 1, critical: false },
];

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'A001', ts: '2026-02-27T06:10:00', userId: 'D003', userName: 'R. Chen', userRole: 'DETAILER', action: 'Drafted orders for LS1 Bakshi to USS Constitution', entityType: 'ORDER', entityId: 'ORD-2026-0551' },
  { id: 'A002', ts: '2026-02-26T14:22:00', userId: 'M001', userName: 'Dr. Simmons', userRole: 'MEDICAL_REVIEWER', action: 'Placed medical hold on IT2 Anderson (S002)', entityType: 'SAILOR', entityId: 'S002' },
  { id: 'A003', ts: '2026-02-25T11:34:00', userId: 'D001', userName: 'J. Davis', userRole: 'DETAILER', action: 'Submitted ORD-2026-0847 to QA — Pre-QA: 7/8 pass, 1 advisory', entityType: 'ORDER', entityId: 'ORD-2026-0847' },
  { id: 'A004', ts: '2026-02-25T10:52:00', userId: 'PM01', userName: 'C. Miller', userRole: 'PROGRAM_MANAGER', action: 'Routed AVAIL-2026-0284 to J. Davis (Humanitarian, Martinez R.)', entityType: 'AVAIL', entityId: 'AVAIL-2026-0284' },
  { id: 'A005', ts: '2026-02-25T09:14:00', userId: 'SYS', userName: 'SYSTEM', userRole: 'SYSTEM', action: 'Email intake: martinez.r@navy.mil — tagged E-5/IT2, Orders, PRD 22d', entityType: 'EMAIL' },
  { id: 'A006', ts: '2026-02-25T08:00:00', userId: 'SYS', userName: 'SYSTEM', userRole: 'SYSTEM', action: 'Roller status update Martinez: ACTIVE → CRITICAL (PRD ≤30d)', entityType: 'SAILOR', entityId: 'S001' },
  { id: 'A007', ts: '2026-02-24T16:22:00', userId: 'Q001', userName: 'M. Torres', userRole: 'QA_REVIEWER', action: 'Returned ORD-2026-0793 — Funding line not validated; NEC mismatch', entityType: 'ORDER', entityId: 'ORD-2026-0793' },
  { id: 'A008', ts: '2026-02-24T14:11:00', userId: 'L001', userName: 'CAPT Rhodes', userRole: 'LEADERSHIP', action: 'Broadcast: Spring 2026 Cycle Opens (892 recipients)', entityType: 'ANNOUNCEMENT', entityId: 'ANN001' },
];

// ── EMAIL THREADS ─────────────────────────────────────────────────────────────

export const EMAIL_THREADS: EmailThread[] = [
  {
    id: 'ET001', sailorId: 'S001', from: 'r.martinez@navy.mil', subject: 'Requesting Orders / Billet Options — IT2 Martinez',
    preview: 'Good morning, I am reaching out regarding my upcoming PRD...',
    date: '2026-02-25', tags: ['E-5', 'IT2', 'Orders/Billet', 'PRD 22d'], grade: 'E-5', category: 'ORDERS', prdDays: 22,
    messages: [
      { from: 'IT2 Martinez', role: 'SAILOR', body: 'Good morning, I am reaching out regarding my upcoming PRD of March 2026. I would like to discuss billet options, specifically East Coast billets with NEC 2779. My top preference is Norfolk area.', date: '2026-02-25T09:14:00' },
      { from: 'J. Davis', role: 'DETAILER', body: 'IT2 Martinez — I have identified a strong match at NISC Little Creek (NEC 2779, East Coast preference). Orders are being prepared. Stand by for further guidance.', date: '2026-02-25T11:40:00' },
    ]
  },
  {
    id: 'ET002', sailorId: 'S008', from: 'e.omalley@navy.mil', subject: 'HUMS Request for O\'Malley, Erin',
    preview: 'Resubmitting humanitarian assignment documentation per latest medical advice...',
    date: '2026-02-26', tags: ['E-5', 'ITS2', 'HUMS', 'PRD 5d'], grade: 'E-5', category: 'HUMS', prdDays: 5,
    messages: [
      { from: 'ITS2 O\'Malley', role: 'SAILOR', body: 'Detailer, following up on my previous HUMS request. I have uploaded the updated medical certification for my father. Please review as my PRD is in 5 days.', date: '2026-02-26T08:30:00' },
    ]
  },
  {
    id: 'ET003', sailorId: 'S006', from: 'a.bakshi@navy.mil', subject: 'LS1 Bakshi — USS Constitution preference',
    preview: 'Checking status of my application for the Boston billet...',
    date: '2026-02-27', tags: ['E-6', 'LS1', 'Boston'], grade: 'E-6', category: 'ORDERS', prdDays: 45,
    messages: [
      { from: 'LS1 Bakshi', role: 'SAILOR', body: 'Detailer, I saw the vacancy for USS Constitution. Since I am a local recruit from that area, I would very much like to be considered.', date: '2026-02-27T09:00:00' },
      { from: 'R. Chen', role: 'DETAILER', body: 'LS1 Bakshi, I have drafted your orders. We are pending final approval for the funding line.', date: '2026-02-27T10:15:00' }
    ]
  }
];
