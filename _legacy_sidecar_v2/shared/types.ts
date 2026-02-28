/**
 * SIDECAR — Shared TypeScript Types
 * Single source of truth for every data shape across front and back end.
 * Both the API and the UI consume from this file.
 */

// ── ENUMS ────────────────────────────────────────────────────────────────────

export type Role =
  | 'DETAILER'
  | 'QA_REVIEWER'
  | 'PLACEMENT_COORD'
  | 'PROGRAM_MANAGER'
  | 'LEADERSHIP'
  | 'MEDICAL_REVIEWER'
  | 'SAILOR';

export type RollerType   = 'SEA_ROLLER' | 'SHORE_ROLLER' | 'FLEXIBLE' | 'LOCKED';
export type RollerStatus = 'CRITICAL' | 'ACTIVE' | 'UPCOMING' | 'PENDING' | 'ORDERED';
export type OrderStatus  = 'DRAFT' | 'PRE_QA' | 'QA_REVIEW' | 'RETURNED' | 'APPROVED' | 'EXECUTED';
export type OrderType    = 'PCS' | 'PCA' | 'TAD' | 'TEMDU';
export type BilletStatus = 'FILLED' | 'VACANT' | 'PROJECTED' | 'FROZEN' | 'FLAGGED';
export type AvailType    = 'HUMANITARIAN' | 'MEDICAL' | 'HUMS' | 'EARLY_RETURN' | 'DISLOCATION';
export type AvailStatus  = 'SUBMITTED' | 'TRIAGED' | 'ROUTED' | 'IN_PROGRESS' | 'RESOLVED';
export type AvailPriority = 'URGENT' | 'HIGH' | 'ROUTINE';
export type PreQAResult  = 'PASS' | 'ADVISORY' | 'FAIL';
export type AOR          = 'LANT' | 'PACFLT' | 'WESTPAC' | 'NAVCENT' | 'NAVEUR' | 'SHORE' | 'CONUS';
export type AnnouncementCategory = 'POLICY_UPDATE' | 'CYCLE_GUIDANCE' | 'SYSTEM_NOTICE' | 'URGENT_ACTION';
export type AnnouncementAudience = 'ALL' | 'DETAILERS' | 'QA' | 'LEADERSHIP' | 'PLACEMENT' | string;

// ── USER / AUTH ───────────────────────────────────────────────────────────────

export interface User {
  id:             string;
  name:           string;
  role:           Role;
  rateCommunity:  string;
  email:          string;
  sailorId?:      string;  // only for SAILOR role
}

export interface LoginRequest  { userId: string; }
export interface LoginResponse { token: string; user: User; }

// ── SAILOR ────────────────────────────────────────────────────────────────────

export interface Sailor {
  id:                  string;
  edipi:               string;
  lastName:            string;
  firstName:           string;
  rate:                string;
  paygrade:            string;
  necPrimary:          string;
  necSecondary?:       string;
  clearance:           string;
  command:             string;
  uic:                 string;
  prd:                 string;   // ISO date string
  eaos:                string;   // ISO date string
  rollerType:          RollerType;
  rollerStatus:        RollerStatus;
  seaMonthsServed:     number;
  seaMonthsPrescribed: number;
  detailerId:          string;
  availsOpen:          number;
  applications12mo:    number;
  medicalHold?:        boolean;
}

export interface SailorApplication {
  billetId:  string;
  command:   string;
  date:      string;
  status:    'PENDING' | 'SUBMITTED' | 'NOT_SELECTED' | 'SELECTED' | 'WITHDRAWN';
  detailer:  string;
  notes:     string;
}

// ── BILLET ────────────────────────────────────────────────────────────────────

export interface Billet {
  id:            string;
  title:         string;
  command:       string;
  uic:           string;
  necRequired:   string;
  paygrade:      string;
  aor:           AOR;
  location:      string;
  status:        BilletStatus;
  daysVacant:    number;
  incumbentPrd?: string;
  matchScore?:   number;
}

// ── ORDER ─────────────────────────────────────────────────────────────────────

export interface Order {
  id:             string;
  sailorId:       string;
  sailorName:     string;
  gainingCommand: string;
  gainingUic:     string;
  billetId:       string;
  orderType:      OrderType;
  detachDate:     string;
  rnltd:          string;
  tourLength:     number;
  fundingLine?:   string;
  status:         OrderStatus;
  preqaPassed:    number;
  preqaAdvisory:  number;
  preqaFailed:    number;
  detailerId:     string;
  submittedDate:  string;
  returnReason?:  string;
}

export interface PreQACheck {
  check:     string;
  reference: string;
  status:    PreQAResult;
  detail:    string;
}

export interface PreQARequest {
  sailorId:     string;
  billetId:     string;
  orderType:    OrderType;
  rnltd:        string;
  tourLength:   number;
  fundingLine?: string;
}

export interface PreQAResponse {
  sailorId:  string;
  billetId:  string;
  checks:    PreQACheck[];
  summary:   { passed: number; advisory: number; failed: number };
  canSubmit: boolean;
  message:   string;
}

// ── AVAIL ─────────────────────────────────────────────────────────────────────

export interface Avail {
  id:          string;
  sailorId:    string;
  sailorName:  string;
  type:        AvailType;
  priority:    AvailPriority;
  status:      AvailStatus;
  routedTo?:   string;
  daysOpen:    number;
  description: string;
  medicalHold?: boolean;
}

// ── MESSAGING ─────────────────────────────────────────────────────────────────

export interface Channel {
  id:     string;
  name:   string;
  type:   'RATE' | 'BROADCAST' | 'DIRECT';
  unread: number;
}

export interface Message {
  id:   string;
  user: string;
  role: string;
  text: string;
  ts:   string;  // ISO datetime
}

// ── EMAIL ─────────────────────────────────────────────────────────────────────

export interface EmailThread {
  id:        string;
  sailorId:  string;
  from:      string;
  subject:   string;
  preview:   string;
  date:      string;
  tags:      string[];
  grade?:    string;
  category?: string;
  prdDays?:  number;
  archived?: boolean;
  teamHistory?: boolean;
  messages:  EmailMessage[];
}

export interface EmailMessage {
  from:    string;
  role:    string;
  body:    string;
  date:    string;
}

// ── ANNOUNCEMENT ─────────────────────────────────────────────────────────────

export interface Announcement {
  id:        string;
  title:     string;
  body:      string;
  category:  AnnouncementCategory;
  audience:  AnnouncementAudience;
  author:    string;
  date:      string;
  priority:  'HIGH' | 'NORMAL';
  readCount: number;
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────

export interface FleetReadiness {
  fleet:    string;
  fillRate: number;
  trend:    number;
  critical: boolean;
}

export interface DashboardStats {
  sailorsTotal:   number;
  criticalRollers: number;
  activeRollers:  number;
  ordersInQa:     number;
  vacantBillets:  number;
}

// ── AUDIT ─────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id:        string;
  ts:        string;
  userId:    string;
  userName:  string;
  userRole:  string;
  action:    string;
  entityType?: string;
  entityId?:   string;
}

// ── API RESPONSE WRAPPER ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data:    T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
}
