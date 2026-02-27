import {
  Sailor, Billet, Order, Avail, User, Channel, Message,
  Announcement, FleetReadiness
} from '../types/index';

// ── Helper ────────────────────────────────────────────────────────
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── SAILORS ───────────────────────────────────────────────────────
export const SAILORS: Sailor[] = [
  {
    id: 'S001', edipi: '1234567890',
    last_name: 'Martinez', first_name: 'Rafael',
    rate: 'IT2', paygrade: 'E-5',
    nec_primary: '2779', nec_secondary: '2781',
    clearance: 'TS/SCI',
    command: 'USS Nimitz (CVN-68)', uic: '21289',
    prd: daysFromNow(22), eaos: daysFromNow(365),
    roller_type: 'SEA_ROLLER', roller_status: 'CRITICAL',
    sea_months_served: 47, sea_months_prescribed: 48,
    detailer_id: 'D001', avails_open: 1, applications_12mo: 3,
  },
  {
    id: 'S002', edipi: '2345678901',
    last_name: 'Anderson', first_name: 'Brittany',
    rate: 'IT2', paygrade: 'E-5',
    nec_primary: '2779',
    clearance: 'SECRET',
    command: 'USS Gerald R. Ford (CVN-78)', uic: '21456',
    prd: daysFromNow(67), eaos: daysFromNow(540),
    roller_type: 'SEA_ROLLER', roller_status: 'ACTIVE',
    sea_months_served: 28, sea_months_prescribed: 48,
    detailer_id: 'D001', avails_open: 1, applications_12mo: 1,
    medical_hold: true,
  },
  {
    id: 'S003', edipi: '3456789012',
    last_name: 'Thompson', first_name: 'James',
    rate: 'IT1', paygrade: 'E-6',
    nec_primary: '2779', nec_secondary: '2735',
    clearance: 'TS/SCI',
    command: 'NISC Little Creek', uic: '63890',
    prd: daysFromNow(145), eaos: daysFromNow(720),
    roller_type: 'SHORE_ROLLER', roller_status: 'UPCOMING',
    sea_months_served: 48, sea_months_prescribed: 48,
    detailer_id: 'D001', avails_open: 0, applications_12mo: 0,
  },
  {
    id: 'S004', edipi: '4567890123',
    last_name: 'Williams', first_name: 'Denise',
    rate: 'IT3', paygrade: 'E-4',
    nec_primary: '2781',
    clearance: 'SECRET',
    command: 'NAS Jacksonville', uic: '44230',
    prd: daysFromNow(312), eaos: daysFromNow(900),
    roller_type: 'SHORE_ROLLER', roller_status: 'PENDING',
    sea_months_served: 0, sea_months_prescribed: 0,
    detailer_id: 'D002', avails_open: 0, applications_12mo: 0,
  },
];

// ── BILLETS ───────────────────────────────────────────────────────
export const BILLETS: Billet[] = [
  {
    id: 'B001', title: 'IT Systems Administrator',
    command: 'NISC Little Creek', uic: '63890',
    nec_required: '2779', paygrade: 'E-5',
    aor: 'LANT', location: 'Norfolk, VA',
    status: 'VACANT', days_vacant: 34, match_score: 96,
  },
  {
    id: 'B002', title: 'IT Network Technician',
    command: 'NAS Jacksonville', uic: '44230',
    nec_required: '2779', paygrade: 'E-5',
    aor: 'LANT', location: 'Jacksonville, FL',
    status: 'VACANT', days_vacant: 18, match_score: 94,
  },
  {
    id: 'B003', title: 'IT Instructor',
    command: 'NETC Pensacola', uic: '55120',
    nec_required: '2779', paygrade: 'E-5',
    aor: 'SHORE', location: 'Pensacola, FL',
    status: 'PROJECTED', days_vacant: 0,
    incumbent_prd: daysFromNow(45), match_score: 81,
  },
  {
    id: 'B004', title: 'IT Systems Supervisor',
    command: 'USS John C. Stennis (CVN-74)', uic: '21544',
    nec_required: '2779', paygrade: 'E-6',
    aor: 'PACFLT', location: 'Bremerton, WA',
    status: 'VACANT', days_vacant: 52, match_score: 71,
  },
  {
    id: 'B005', title: 'IT Network Operations',
    command: '7th Fleet Flagship', uic: '31200',
    nec_required: '2779', paygrade: 'E-5',
    aor: 'WESTPAC', location: 'Yokosuka, Japan',
    status: 'VACANT', days_vacant: 67, match_score: 88,
  },
];

// ── ORDERS ────────────────────────────────────────────────────────
export const ORDERS: Order[] = [
  {
    id: 'ORD-2026-0847',
    sailor_id: 'S001', sailor_name: 'IT2 Martinez, R.',
    gaining_command: 'NISC Little Creek', gaining_uic: '63890',
    billet_id: 'B001', order_type: 'PCS',
    detach_date: daysFromNow(20), rnltd: daysFromNow(35),
    tour_length: 36, funding_line: 'N00014-26-PCS-IT',
    status: 'QA_REVIEW',
    preqa_passed: 7, preqa_advisory: 1, preqa_failed: 0,
    detailer_id: 'D001', submitted_date: daysFromNow(-1),
  },
  {
    id: 'ORD-2026-0793',
    sailor_id: 'S003', sailor_name: 'IT1 Thompson, J.',
    gaining_command: 'USS John C. Stennis (CVN-74)', gaining_uic: '21544',
    billet_id: 'B004', order_type: 'PCS',
    detach_date: daysFromNow(90), rnltd: daysFromNow(110),
    tour_length: 48, funding_line: 'N00014-26-PCS-IT',
    status: 'RETURNED',
    preqa_passed: 6, preqa_advisory: 0, preqa_failed: 2,
    detailer_id: 'D001', submitted_date: daysFromNow(-3),
    return_reason: 'Funding line not validated; NEC mismatch for E-6 billet',
  },
];

// ── AVAILS ────────────────────────────────────────────────────────
export const AVAILS: Avail[] = [
  {
    id: 'AVAIL-2026-0284',
    sailor_id: 'S001', sailor_name: 'IT2 Martinez, R.',
    type: 'HUMANITARIAN', priority: 'URGENT',
    status: 'ROUTED', routed_to: 'D001',
    days_open: 5,
    description: 'Family hardship — spouse medical, East Coast only',
  },
  {
    id: 'AVAIL-2026-0271',
    sailor_id: 'S002', sailor_name: 'IT2 Anderson, B.',
    type: 'MEDICAL', priority: 'ROUTINE',
    status: 'IN_PROGRESS', routed_to: 'D001',
    days_open: 12,
    description: 'LIMDU — orders on hold pending medical clearance',
    medical_hold: true,
  },
];

// ── USERS ─────────────────────────────────────────────────────────
export const USERS: Record<string, User> = {
  D001:  { id:'D001',  name:'J. Davis',     role:'DETAILER',        rate_community:'IT',  email:'jessica.davis@navy.mil'  },
  D002:  { id:'D002',  name:'S. Martinez',  role:'DETAILER',        rate_community:'IT',  email:'s.martinez@navy.mil'     },
  Q001:  { id:'Q001',  name:'M. Torres',    role:'QA_REVIEWER',     rate_community:'ALL', email:'m.torres@navy.mil'       },
  P001:  { id:'P001',  name:'K. Brooks',    role:'PLACEMENT_COORD', rate_community:'IT',  email:'k.brooks@navy.mil'       },
  PM01:  { id:'PM01',  name:'C. Miller',    role:'PROGRAM_MANAGER', rate_community:'IT',  email:'c.miller@navy.mil'       },
  MED01: { id:'MED01', name:'Dr. Reyes',    role:'MEDICAL_REVIEWER',rate_community:'ALL', email:'reyes.med@navy.mil'      },
  L001:  { id:'L001',  name:'CAPT Rhodes',  role:'LEADERSHIP',      rate_community:'ALL', email:'j.rhodes@navy.mil'       },
  S001U: { id:'S001U', name:'IT2 Martinez', role:'SAILOR',          rate_community:'IT',  email:'r.martinez@navy.mil', sailor_id:'S001' },
};

// ── CHANNELS ─────────────────────────────────────────────────────
export const CHANNELS: Channel[] = [
  { id:'CH001', name:'IT Rate — General',   type:'RATE',      unread:3 },
  { id:'CH002', name:'IT Rate — Orders',    type:'RATE',      unread:1 },
  { id:'CH003', name:'IT Rate — QA',        type:'RATE',      unread:0 },
  { id:'CH004', name:'PERS-40 Broadcast',   type:'BROADCAST', unread:1 },
];

export const MESSAGES: Record<string, Message[]> = {
  CH001: [
    { id:'M001', user:'K. Brooks',  role:'PLACEMENT_COORD', text:'Spring 2026 cycle guidance is out — confirm all billet preferences before actioning new orders this week.', ts:'2026-02-25T08:14:00' },
    { id:'M002', user:'J. Davis',   role:'DETAILER',        text:'Martinez orders going to QA today — 7/8 checks passed, funding advisory only.', ts:'2026-02-25T09:22:00' },
    { id:'M003', user:'S. Martinez',role:'DETAILER',        text:'J. Davis — can you take Thompson? I have 3 criticals in queue and she just flagged Stennis.', ts:'2026-02-25T10:45:00' },
    { id:'M004', user:'M. Torres',  role:'QA_REVIEWER',     text:'ORD-2026-0793 returned — funding line not validated, NEC advisory for E-6 billet. Detailer action required.', ts:'2026-02-25T11:20:00' },
  ],
  CH002: [
    { id:'M005', user:'J. Davis',   role:'DETAILER',        text:'Thompson orders drafted — running Pre-QA now before submitting.', ts:'2026-02-25T13:10:00' },
  ],
};

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id:'ANN001', title:'Spring 2026 Cycle Opens 01 MAR',
    body:'Review all Sailor preferences in MNA before actioning new orders this cycle. Confirm billet match scores against updated NEC tables.',
    category:'CYCLE', audience:'ALL', author:'CAPT Rhodes',
    date:'2026-02-24', read:847, total:892,
  },
  {
    id:'ANN002', title:'IT Rate — NEC 2779 Critical Vacancy Alert',
    body:'7th Fleet fill rate has dropped to 64%. IT rate Detailers — prioritize WESTPAC billets in current matching cycle.',
    category:'URGENT', audience:'IT', author:'CAPT Rhodes',
    date:'2026-02-23', read:12, total:14,
  },
];

// ── FLEET READINESS ───────────────────────────────────────────────
export const FLEET_READINESS: FleetReadiness[] = [
  { fleet:'3rd Fleet (PACFLT)',  fill_rate:81, trend:-2,   critical:false },
  { fleet:'5th Fleet (NAVCENT)', fill_rate:84, trend:1,    critical:false },
  { fleet:'7th Fleet (WESTPAC)', fill_rate:64, trend:-5,   critical:true  },
  { fleet:'2nd Fleet (LANT)',    fill_rate:93, trend:0.5,  critical:false },
  { fleet:'6th Fleet (NAVEUR)',  fill_rate:89, trend:0,    critical:false },
  { fleet:'Shore / CONUS',       fill_rate:96, trend:1,    critical:false },
];
