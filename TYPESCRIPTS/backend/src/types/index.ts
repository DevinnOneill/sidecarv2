// ─────────────────────────────────────────────────────────────────
// SIDECAR — Shared Types
// Single source of truth. Backend and frontend both use these.
// ─────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────

export type RollerType   = 'SEA_ROLLER' | 'SHORE_ROLLER' | 'FLEXIBLE' | 'LOCKED';
export type RollerStatus = 'CRITICAL' | 'ACTIVE' | 'UPCOMING' | 'PENDING' | 'ORDERED';
export type OrderStatus  = 'DRAFT' | 'PRE_QA_CHECKED' | 'QA_REVIEW' | 'RETURNED' | 'APPROVED' | 'EXECUTED' | 'CANCELLED';
export type AvailType    = 'HUMANITARIAN' | 'MEDICAL' | 'OPERATIONAL' | 'HUMS' | 'LIMDU';
export type AvailStatus  = 'SUBMITTED' | 'TRIAGED' | 'ROUTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
export type AvailPriority = 'URGENT' | 'ROUTINE';
export type BilletStatus = 'VACANT' | 'FILLED' | 'PROJECTED' | 'FROZEN' | 'FLAGGED';
export type PreQAResult  = 'PASS' | 'ADVISORY' | 'FAIL';
export type ChannelType  = 'RATE' | 'BROADCAST' | 'DIRECT';

export type UserRole =
  | 'DETAILER'
  | 'QA_REVIEWER'
  | 'PLACEMENT_COORD'
  | 'PROGRAM_MANAGER'
  | 'MEDICAL_REVIEWER'
  | 'LEADERSHIP'
  | 'SAILOR';

// ── Core Entities ─────────────────────────────────────────────────

export interface Sailor {
  id:                  string;
  edipi:               string;
  last_name:           string;
  first_name:          string;
  rate:                string;
  paygrade:            string;
  nec_primary:         string;
  nec_secondary?:      string;
  clearance:           string;
  command:             string;
  uic:                 string;
  prd:                 string;         // ISO date string
  eaos:                string;         // ISO date string
  roller_type:         RollerType;
  roller_status:       RollerStatus;
  sea_months_served:   number;
  sea_months_prescribed: number;
  detailer_id?:        string;
  avails_open:         number;
  applications_12mo:   number;
  medical_hold?:       boolean;
}

export interface Billet {
  id:             string;
  title:          string;
  command:        string;
  uic:            string;
  nec_required:   string;
  paygrade:       string;
  aor:            string;
  location:       string;
  status:         BilletStatus;
  days_vacant:    number;
  incumbent_prd?: string;
  match_score?:   number;
}

export interface Order {
  id:              string;
  sailor_id:       string;
  sailor_name:     string;
  gaining_command: string;
  gaining_uic:     string;
  billet_id:       string;
  order_type:      string;
  detach_date:     string;
  rnltd:           string;
  tour_length:     number;
  funding_line?:   string;
  status:          OrderStatus;
  preqa_passed:    number;
  preqa_advisory:  number;
  preqa_failed:    number;
  detailer_id:     string;
  submitted_date:  string;
  return_reason?:  string;
}

export interface Avail {
  id:           string;
  sailor_id:    string;
  sailor_name:  string;
  type:         AvailType;
  priority:     AvailPriority;
  status:       AvailStatus;
  routed_to?:   string;
  days_open:    number;
  description:  string;
  medical_hold?: boolean;
}

export interface User {
  id:              string;
  name:            string;
  role:            UserRole;
  rate_community:  string;
  email:           string;
  sailor_id?:      string;  // only for SAILOR role
}

export interface Application {
  billet_id: string;
  command:   string;
  date:      string;
  status:    'PENDING' | 'SUBMITTED' | 'NOT_SELECTED' | 'WITHDRAWN';
  detailer:  string;
  notes:     string;
}

export interface Channel {
  id:     string;
  name:   string;
  type:   ChannelType;
  unread: number;
}

export interface Message {
  id:   string;
  user: string;
  role: string;
  text: string;
  ts:   string;
}

export interface Announcement {
  id:        string;
  title:     string;
  body:      string;
  category:  'POLICY' | 'CYCLE' | 'SYSTEM' | 'URGENT';
  audience:  string;
  author:    string;
  date:      string;
  read?:     number;
  total?:    number;
}

// ── Pre-QA ────────────────────────────────────────────────────────

export interface PreQACheck {
  check:     string;
  reference: string;
  status:    PreQAResult;
  detail:    string;
}

export interface PreQARequest {
  sailor_id:    string;
  billet_id:    string;
  order_type:   string;
  rnltd:        string;
  tour_length:  number;
  funding_line?: string;
}

export interface PreQAResponse {
  sailor_id:  string;
  billet_id:  string;
  checks:     PreQACheck[];
  summary:    { passed: number; advisory: number; failed: number };
  can_submit: boolean;
  message:    string;
}

// ── API Response wrappers ─────────────────────────────────────────

export interface ApiResponse<T> {
  data:    T;
  status:  'ok' | 'error';
  message?: string;
}

export interface SailorsResponse {
  sailors: Sailor[];
  total:   number;
}

export interface BilletsResponse {
  billets:   Billet[];
  total:     number;
  vacant:    number;
  projected: number;
}

export interface OrdersResponse {
  orders:    Order[];
  total:     number;
  by_status: Record<OrderStatus, number>;
}

export interface DashboardStats {
  sailors_total:   number;
  critical_rollers: number;
  active_rollers:  number;
  orders_in_qa:    number;
  vacant_billets:  number;
}

export interface FleetReadiness {
  fleet:    string;
  fill_rate: number;
  trend:    number;
  critical: boolean;
}
