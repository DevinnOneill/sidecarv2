/**
 * SIDECAR — Login Page JS
 */

const ROLE_CONFIG = {
  DETAILER: { icon: '👤', title: 'Detailer', sub: 'Sailor queue · Orders · Email' },
  QA_REVIEWER: { icon: '✅', title: 'QA Reviewer', sub: 'Orders pipeline · Approve / Return' },
  PLACEMENT_COORD: { icon: '🗂', title: 'Placement Coord.', sub: 'Billet inventory · Fill analytics' },
  PROGRAM_MANAGER: { icon: '👔', title: 'Program Manager', sub: 'Avails triage · HUMS · Routing' },
  LEADERSHIP: { icon: '⭐', title: 'PERS-40 Leadership', sub: 'Fleet readiness · Announcements' },
  SAILOR: { icon: '🪖', title: 'Sailor Portal', sub: 'My record · Billets · Contact' },
};

let selectedUserId = null;

async function initLogin() {
  try {
    const data = await API.getUsers();
    renderRoleCards(data.users || data);
  } catch (e) {
    renderFallback();
  }
}

function renderRoleCards(users) {
  const grid = document.getElementById('roleGrid');
  grid.innerHTML = '';
  users.forEach(user => {
    const cfg = ROLE_CONFIG[user.role] || { icon: '👤', title: user.role, sub: user.email };
    const card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML = `
      <div class="rc-icon">${cfg.icon}</div>
      <div class="rc-title">${cfg.title}</div>
      <div class="rc-sub">${user.name}<br>${user.rateCommunity ? user.rateCommunity + ' Rate' : ''}</div>
      <div class="rc-id">${user.id}</div>
    `;
    card.onclick = () => selectRole(card, user.id);
    grid.appendChild(card);
  });
  // Add Enter button
  const btn = document.createElement('button');
  btn.id = 'enterBtn';
  btn.className = 'enter-btn';
  btn.textContent = 'Access SIDECAR →';
  btn.onclick = doLogin;
  grid.insertAdjacentElement('afterend', btn);
}

function renderFallback() {
  const grid = document.getElementById('roleGrid');
  const users = [
    { id: 'D001', role: 'DETAILER', name: 'J. Davis', rateCommunity: 'IT' },
    { id: 'Q001', role: 'QA_REVIEWER', name: 'M. Torres', rateCommunity: 'ALL' },
    { id: 'PM01', role: 'PROGRAM_MANAGER', name: 'C. Miller', rateCommunity: 'IT' },
    { id: 'S001U', role: 'SAILOR', name: 'IT2 Martinez', rateCommunity: 'IT' },
  ];
  renderRoleCards(users);
}

function selectRole(card, userId) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedUserId = userId;
  const btn = document.getElementById('enterBtn');
  if (btn) btn.classList.add('visible');
}

async function doLogin() {
  if (!selectedUserId) return;
  try {
    const data = await API.login(selectedUserId);
    sessionStorage.setItem('sidecar_token', data.token);
    sessionStorage.setItem('sidecar_user', JSON.stringify(data.user));
    window.location.href = '/app';
  } catch (e) {
    // Demo fallback — store mock session
    const mockUsers = {
      'D001': { id: 'D001', name: 'J. Davis', role: 'DETAILER', rateCommunity: 'IT' },
      'Q001': { id: 'Q001', name: 'M. Torres', role: 'QA_REVIEWER', rateCommunity: 'ALL' },
      'PM01': { id: 'PM01', name: 'C. Miller', role: 'PROGRAM_MANAGER', rateCommunity: 'IT' },
      'S001U': { id: 'S001U', name: 'IT2 Martinez', role: 'SAILOR', rateCommunity: 'IT' },
    };
    sessionStorage.setItem('sidecar_token', `demo-${selectedUserId}`);
    sessionStorage.setItem('sidecar_user', JSON.stringify(mockUsers[selectedUserId]));
    window.location.href = '/app';
  }
}

initLogin();
