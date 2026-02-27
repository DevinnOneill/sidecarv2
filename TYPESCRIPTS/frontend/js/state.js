/**
 * SIDECAR — App State
 */

const ROLES = {
  detailer:    { av: 'JD', badge: 'DET',  name: 'J. Davis',    label: 'IT Detailer',      crumb: 'IT Rate',       defaultMod: 'sailors',  defaultView: 'view-sailor' },
  qa:          { av: 'MT', badge: 'QA',   name: 'M. Torres',   label: 'QA Reviewer',      crumb: 'QA',            defaultMod: 'orders',   defaultView: 'view-qa' },
  placement:   { av: 'KB', badge: 'PLAC', name: 'K. Brooks',   label: 'Placement Coord',  crumb: 'Placement',     defaultMod: 'billets',  defaultView: 'view-billets' },
  frontoffice: { av: 'CM', badge: 'PM',   name: 'C. Miller',   label: 'Program Manager',  crumb: 'Program Office',defaultMod: 'avails',   defaultView: 'view-avails' },
  medical:     { av: 'RK', badge: 'MED',  name: 'Dr. R. Kim',  label: 'Medical Reviewer', crumb: 'Medical',       defaultMod: 'avails',   defaultView: 'view-medical' },
  leadership:  { av: 'P4', badge: 'PERS', name: 'PERS-40',     label: 'PERS-40',          crumb: 'PERS-40',       defaultMod: 'analytics',defaultView: 'view-leadership' },
  sailor:      { av: 'MR', badge: 'SLOR', name: 'IT2 Martinez',label: 'Sailor Portal',    crumb: 'My Portal',     defaultMod: 'home',     defaultView: 'view-sailor-portal' },
};

const STATE = {
  role: 'detailer',
  mod:  'sailors',
  selectedSailor: null,
  selectedOrder:  null,
  data: {
    sailors: null,
    billets: null,
    orders:  null,
    avails:  null,
    stats:   null,
    audit:   null,
    announcements: null,
  }
};

window.ROLES = ROLES;
window.STATE = STATE;
