/**
 * SIDECAR — Login Page JS
 */

const ROLE_CONFIG = {
  DETAILER:         { icon:'👤', title:'Detailer',           sub:'Sailor queue · Orders · Email' },
  QA_REVIEWER:      { icon:'✅', title:'QA Reviewer',        sub:'Orders pipeline · Approve / Return' },
  PLACEMENT_COORD:  { icon:'🗂', title:'Placement Coord.',   sub:'Billet inventory · Fill analytics' },
  PROGRAM_MANAGER:  { icon:'👔', title:'Program Manager',    sub:'Avails triage · HUMS · Routing' },
  LEADERSHIP:       { icon:'⭐', title:'PERS-40 Leadership',  sub:'Fleet readiness · Announcements' },
  SAILOR:           { icon:'🪖', title:'Sailor Portal',       sub:'My record · Billets · Contact' },
};

let selectedUserId = null;

async function initLogin() {
  try {
    const data = await API.getUsers();
    renderRoleCards(data);
  } catch(e) {
    // fallback demo cards if API not ready
    renderFallback();
  }
}

function renderRoleCards(users) {
  const grid = document.getElementById('roleGrid');
  grid.innerHTML = '';
  users.forEach(user => {
    const cfg = ROLE_CONFIG[user.role] || { icon:'👤', title: user.role, sub: user.email };
    const card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML = `
      <div class="rc-icon">${cfg.icon}</div>
      <div class="rc-title">${cfg.title}</div>
      <div class="rc-sub">${user.name}<br>${user.rate_community ? user.rate_community + ' Rate' : ''}</div>
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
    {id:'D001', role:'DETAILER',        name:'J. Davis',    rate_community:'IT'},
    {id:'Q001', role:'QA_REVIEWER',     name:'M. Torres',   rate_community:'ALL'},
    {id:'P001', role:'PLACEMENT_COORD', name:'K. Brooks',   rate_community:'IT'},
    {id:'PM01', role:'PROGRAM_MANAGER', name:'C. Miller',   rate_community:'IT'},
    {id:'L001', role:'LEADERSHIP',      name:'CAPT Rhodes', rate_community:'ALL'},
    {id:'S001U',role:'SAILOR',          name:'IT2 Martinez',rate_community:'IT'},
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
  } catch(e) {
    // Demo fallback — store mock session
    const mockUsers = {
      'D001':  {id:'D001', name:'J. Davis',     role:'DETAILER',        rate_community:'IT'},
      'Q001':  {id:'Q001', name:'M. Torres',    role:'QA_REVIEWER',     rate_community:'ALL'},
      'P001':  {id:'P001', name:'K. Brooks',    role:'PLACEMENT_COORD', rate_community:'IT'},
      'PM01':  {id:'PM01', name:'C. Miller',    role:'PROGRAM_MANAGER', rate_community:'IT'},
      'L001':  {id:'L001', name:'CAPT Rhodes',  role:'LEADERSHIP',      rate_community:'ALL'},
      'S001U': {id:'S001U',name:'IT2 Martinez', role:'SAILOR',          rate_community:'IT'},
    };
    sessionStorage.setItem('sidecar_token', `demo-${selectedUserId}`);
    sessionStorage.setItem('sidecar_user', JSON.stringify(mockUsers[selectedUserId]));
    window.location.href = '/app';
  }
}

initLogin();
