/**
 * SIDECAR — UI Helpers
 */

// ── NOTIFICATIONS ─────────────────────────────────────────────────
function notif(icon, title, sub) {
  const stack = document.getElementById('notif-stack');
  const n = document.createElement('div');
  n.className = 'notif';
  n.innerHTML = `<div class="notif-icon">${icon}</div><div><div class="notif-title">${title}</div><div class="notif-sub">${sub}</div></div>`;
  stack.appendChild(n);
  setTimeout(() => n.remove(), 4200);
}

// ── TAG HELPERS ───────────────────────────────────────────────────
function rollerTag(type) {
  const map = {
    SHORE_ROLLER:  ['roller roller-shore', '● SHORE ROLLER'],
    SEA_ROLLER:    ['roller roller-sea',   '● SEA ROLLER'],
    CRITICAL:      ['roller roller-crit',  '● CRITICAL ROLLER'],
    LOCKED:        ['roller roller-locked','● LOCKED'],
    FLEXIBLE:      ['roller roller-ordered','● FLEXIBLE'],
  };
  const [cls, lbl] = map[type] || ['roller roller-locked', type];
  return `<span class="${cls}">${lbl}</span>`;
}

function prdTag(status, days) {
  const map = {
    CRITICAL: 't-r',
    ACTIVE:   't-a',
    UPCOMING: 't-g',
    PENDING:  't-d',
    ORDERED:  't-gold',
  };
  const cls = map[status] || 't-d';
  return `<span class="tag ${cls}">PRD ${days}d</span>`;
}

function statusTag(status) {
  const map = {
    VACANT:    ['t-r','VACANT'],
    PROJECTED: ['t-b','PROJECTED'],
    FILLED:    ['t-g','FILLED'],
    FROZEN:    ['t-d','FROZEN'],
    DRAFT:           ['t-d','DRAFT'],
    SUBMITTED:       ['t-b','SUBMITTED'],
    QA_REVIEW:       ['t-a','QA REVIEW'],
    QA_RETURNED:     ['t-r','RETURNED'],
    APPROVED:        ['t-g','APPROVED'],
    EXECUTED:        ['t-g','EXECUTED'],
    CRITICAL:        ['t-r','CRITICAL'],
    ACTIVE:          ['t-a','ACTIVE'],
    UPCOMING:        ['t-b','UPCOMING'],
    PENDING:         ['t-d','PENDING'],
    ORDERED:         ['t-gold','ORDERED'],
    ROUTED:          ['t-b','ROUTED'],
    IN_PROGRESS:     ['t-a','IN PROGRESS'],
    RESOLVED:        ['t-g','RESOLVED'],
    URGENT:          ['t-r','URGENT'],
    ROUTINE:         ['t-d','ROUTINE'],
    MEDICAL:         ['t-r','MEDICAL'],
    HUMANITARIAN:    ['t-a','HUMANITARIAN'],
    OPERATIONAL:     ['t-b','OPERATIONAL'],
  };
  const [cls, lbl] = map[status] || ['t-d', status];
  return `<span class="tag ${cls}">${lbl}</span>`;
}

function initials(name) {
  return name.split(',')[0].trim().substring(0,2).toUpperCase();
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
}

function fmtDateTime(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleDateString('en-US', { day:'2-digit', month:'short' }).toUpperCase() + ' ' +
    d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
}

function barColor(pct) {
  if (pct >= 90) return 'var(--green)';
  if (pct >= 75) return 'var(--amber)';
  return 'var(--red)';
}

// ── VIEW SWITCHER ─────────────────────────────────────────────────
function showView(id) {
  document.querySelectorAll('.view, .view-flex').forEach(v => {
    v.classList.remove('on');
  });
  const el = document.getElementById(id);
  if (el) el.classList.add('on');
}

function setTab(tabEl, viewId) {
  if (!tabEl) return;
  const bar = tabEl.closest('.topbar-tabs');
  if (bar) bar.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('on'));
  tabEl.classList.add('on');
  showView(viewId);
}

// ── LOADING HELPERS ───────────────────────────────────────────────
function loadingHTML() {
  return '<div class="loading">Loading</div>';
}

function errorHTML(msg) {
  return `<div class="error-state">⚠ ${msg}</div>`;
}

window.notif     = notif;
window.rollerTag = rollerTag;
window.prdTag    = prdTag;
window.statusTag = statusTag;
window.initials  = initials;
window.fmtDate   = fmtDate;
window.fmtDateTime = fmtDateTime;
window.barColor  = barColor;
window.showView  = showView;
window.setTab    = setTab;
window.loadingHTML = loadingHTML;
window.errorHTML = errorHTML;
