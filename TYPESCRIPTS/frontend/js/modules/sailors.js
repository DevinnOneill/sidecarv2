const ROLLER_TAGS = {
  CRITICAL: 'roller-critical',
  ACTIVE:   'roller-active',
  UPCOMING: 'roller-upcoming',
  PENDING:  'roller-pending',
  ORDERED:  'roller-ordered',
};

async function loadSailors(filter = 'all') {
  wsLoading();
  renderFilters([
    {label:'All', val:'all'},
    {label:'🔴 Critical', val:'CRITICAL'},
    {label:'🟡 Active', val:'ACTIVE'},
    {label:'🔵 Upcoming', val:'UPCOMING'},
  ]);
  window._filterCb = (val) => loadSailors(val);

  try {
    const params = filter !== 'all' ? {roller_status: filter} : {};
    const data = await API.getSailors(params);

    renderLPList(data.sailors.map(s => {
      const daysLeft = Math.round((new Date(s.prd) - new Date()) / 86400000);
      const rollerCls = ROLLER_TAGS[s.roller_status] || 'tag-ghost';
      return {
        avatar: s.last_name[0] + s.first_name[0],
        name: `${s.last_name}, ${s.first_name}`,
        sub: `${s.rate} · ${s.command.split('(')[0].trim()}`,
        tags: [
          {cls: `tag ${rollerCls}`, label: s.roller_status},
          ...(s.medical_hold ? [{cls:'tag tag-purple', label:'MED HOLD'}] : []),
        ],
        ts: `${daysLeft}d PRD`,
        unread: s.roller_status === 'CRITICAL',
        onclick: `showSailor('${s.id}')`,
      };
    }));

    // Auto-load first sailor
    if (data.sailors.length) showSailor(data.sailors[0].id);
    else wsContent('<div class="empty-state"><div class="empty-state-icon">👤</div><div class="empty-state-sub">No sailors match filter</div></div>');
  } catch(e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Error loading sailors</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}

window.showSailor = async function(id) {
  // Highlight in list
  document.querySelectorAll('.lp-item').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.lp-item').forEach(el => {
    if (el.getAttribute('onclick')?.includes(id)) el.classList.add('selected');
  });

  setTabs([
    {id:'profile', label:'Profile'},
    {id:'orders',  label:'Orders'},
    {id:'apps',    label:'Applications'},
    {id:'email',   label:'Email History'},
  ], 'profile', (tab) => loadSailorTab(id, tab));

  loadSailorTab(id, 'profile');
};

async function loadSailorTab(id, tab) {
  try {
    const s = await API.getSailor(id);
    const daysLeft = Math.round((new Date(s.prd) - new Date()) / 86400000);
    const rollerCls = ROLLER_TAGS[s.roller_status] || 'tag-ghost';

    if (tab === 'profile') {
      const billets = await API.getBillets({nec: s.nec_primary, status: 'VACANT'});
      wsContent(`
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
          <div style="width:56px;height:56px;border-radius:50%;background:var(--bg3);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:20px;font-weight:800;color:var(--gold)">
            ${s.last_name[0]}${s.first_name[0]}
          </div>
          <div>
            <div style="font-family:var(--font-head);font-size:20px;font-weight:800">${s.last_name}, ${s.first_name}</div>
            <div style="font-size:12px;color:var(--text2);margin-top:3px">${s.rate} · ${s.paygrade} · NEC ${s.nec_primary}${s.nec_secondary ? ' / ' + s.nec_secondary : ''} · ${s.clearance}</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
            <span class="tag ${rollerCls}" style="font-size:11px;padding:4px 10px">${s.roller_type.replace('_',' ')} · ${s.roller_status}</span>
            ${s.medical_hold ? '<span class="tag tag-purple">MED HOLD</span>' : ''}
          </div>
        </div>

        <div class="g2">
          <div>
            <div class="card mb16">
              <div class="card-header">Assignment Details</div>
              <table style="width:100%;font-size:12px">
                <tr><td style="color:var(--text3);padding:4px 0;width:40%">Command</td><td>${s.command}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">UIC</td><td class="mono">${s.uic}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">PRD</td><td class="mono ${daysLeft<=30?'red':daysLeft<=90?'amber':''}">${s.prd} <strong>(${daysLeft}d)</strong></td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">EAOS</td><td class="mono">${s.eaos}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">Sea Served</td><td class="mono">${s.sea_months_served} / ${s.sea_months_prescribed} mo</td></tr>
              </table>
            </div>

            <div class="card">
              <div class="card-header">Sea/Shore Roller Status</div>
              <div class="progress mb8"><div class="progress-fill ${daysLeft<=30?'pf-red':daysLeft<=90?'pf-amber':'pf-green'}" style="width:${Math.min(100, s.sea_months_served/Math.max(1,s.sea_months_prescribed)*100)}%"></div></div>
              <div style="font-size:11px;color:var(--text2)">${s.sea_months_served}mo served of ${s.sea_months_prescribed}mo prescribed</div>
            </div>
          </div>

          <div>
            <div class="card mb16">
              <div class="card-header">AI Billet Matches — ${s.rate} Rate</div>
              ${billets.billets.slice(0,4).map(b=>`
                <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
                  <div style="flex:1">
                    <div style="font-size:12px;font-weight:600">${b.command}</div>
                    <div style="font-size:10px;color:var(--text2)">${b.title} · ${b.location} · <span class="mono">NEC ${b.nec_required}</span></div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-family:var(--font-head);font-size:14px;font-weight:800;color:${b.match_score>=90?'var(--green)':b.match_score>=80?'var(--gold)':'var(--text2)'}">${b.match_score}%</div>
                    <div style="font-size:9px;color:var(--text3)">MATCH</div>
                  </div>
                  <button class="btn btn-primary btn-xs" onclick="setMod('orders')">Write Orders</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `);
    }

    if (tab === 'apps') {
      const data = await API.getSailorApps(id);
      const STATUS_COLORS = {PENDING:'tag-amber',SUBMITTED:'tag-blue',NOT_SELECTED:'tag-ghost',WITHDRAWN:'tag-red'};
      wsContent(`
        <div class="section-hdr">12-Month Application Tracker</div>
        <div class="card" style="padding:0">
          <table class="tbl">
            <thead><tr><th>Command</th><th>Date</th><th>Status</th><th>Detailer</th><th>Notes</th></tr></thead>
            <tbody>
              ${data.applications.map(a=>`
                <tr>
                  <td style="font-size:12px;font-weight:600">${a.command}</td>
                  <td class="mono text-xs muted">${a.date}</td>
                  <td><span class="tag ${STATUS_COLORS[a.status]||'tag-ghost'}">${a.status.replace('_',' ')}</span></td>
                  <td style="font-size:11px;color:var(--text2)">${a.detailer}</td>
                  <td style="font-size:11px;color:var(--text3)">${a.notes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `);
    }

    if (tab === 'orders') {
      wsContent(`
        <div class="section-hdr">Orders History</div>
        <div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-sub">Write new orders in the Orders module</div></div>
        <div style="margin-top:16px"><button class="btn btn-primary" onclick="setMod('orders')">Go to Orders →</button></div>
      `);
    }

    if (tab === 'email') {
      wsContent(`
        <div class="section-hdr">Email Thread History — Permanent Record</div>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:680px">
          <div class="card" style="border-left:3px solid var(--purple)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:11px;font-weight:600">S. Johnson → IT2 Martinez</span>
              <span class="tag tag-purple">TEAM HISTORY</span>
              <span class="mono text-xs muted" style="margin-left:auto">Dec 2024</span>
            </div>
            <div style="font-size:11px;color:var(--text2)">IT2 Martinez — your PRD is approaching. Begin reviewing billet options in MNA and contact me with your top 3 choices by end of month.</div>
          </div>
          <div class="card">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:11px;font-weight:600">J. Davis → IT2 Martinez</span>
              <span class="mono text-xs muted" style="margin-left:auto">Feb 10 2026</span>
            </div>
            <div style="font-size:11px;color:var(--text2)">IT2 Martinez — I have identified a strong match at NISC Little Creek (NEC 2779, East Coast preference). Orders are being prepared. Stand by for further guidance.</div>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;max-width:680px">
          <textarea class="input" rows="3" placeholder="Reply to IT2 Martinez…"></textarea>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn btn-primary btn-sm">Send · Log to Record</button>
          <button class="btn btn-ghost btn-sm">AI Draft</button>
        </div>
      `);
    }

  } catch(e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}
