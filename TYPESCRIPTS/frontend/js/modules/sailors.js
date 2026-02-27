const ROLLER_TAGS = {
  CRITICAL: 'roller-critical',
  ACTIVE: 'roller-active',
  UPCOMING: 'roller-upcoming',
  PENDING: 'roller-pending',
  ORDERED: 'roller-ordered',
};

async function loadSailors(filter = 'all') {
  wsLoading();
  renderFilters([
    { label: 'All', val: 'all' },
    { label: '🔴 Critical', val: 'CRITICAL' },
    { label: '🟡 Active', val: 'ACTIVE' },
    { label: '🔵 Upcoming', val: 'UPCOMING' },
  ]);
  window._filterCb = (val) => loadSailors(val);

  try {
    const params = filter !== 'all' ? { rollerStatus: filter } : {};
    const data = await API.getSailors(params);

    renderLPList(data.sailors.map(s => {
      const daysLeft = Math.round((new Date(s.prd) - new Date()) / 86400000);
      const rollerCls = ROLLER_TAGS[s.rollerStatus] || 'tag-ghost';
      return {
        avatar: s.lastName[0] + s.firstName[0],
        name: `${s.lastName}, ${s.firstName}`,
        sub: `${s.rate} · ${s.command.split('(')[0].trim()}`,
        tags: [
          { cls: `tag ${rollerCls}`, label: s.rollerStatus },
          ...(s.medicalHold ? [{ cls: 'tag tag-purple', label: 'MED HOLD' }] : []),
        ],
        ts: `${daysLeft}d PRD`,
        unread: s.rollerStatus === 'CRITICAL',
        onclick: `showSailor('${s.id}')`,
      };
    }));

    if (data.sailors.length) showSailor(data.sailors[0].id);
    else wsContent('<div class="empty-state"><div class="empty-state-icon">👤</div><div class="empty-state-sub">No sailors match filter</div></div>');
  } catch (e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Error loading sailors</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}

window.showSailor = async function (id) {
  document.querySelectorAll('.lp-item').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.lp-item').forEach(el => {
    if (el.getAttribute('onclick')?.includes(id)) el.classList.add('selected');
  });

  setTabs([
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'apps', label: 'Applications' },
    { id: 'email', label: 'Email History' },
  ], 'profile', (tab) => loadSailorTab(id, tab));

  loadSailorTab(id, 'profile');
};

async function loadSailorTab(id, tab) {
  try {
    const s = await API.getSailor(id);
    const daysLeft = Math.round((new Date(s.prd) - new Date()) / 86400000);

    if (tab === 'profile') {
      const billets = await API.getBillets({ nec: s.necPrimary, status: 'VACANT' });
      wsContent(`
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
          <div style="width:56px;height:56px;border-radius:50%;background:var(--bg3);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:20px;font-weight:800;color:var(--gold)">
            ${s.lastName[0]}${s.firstName[0]}
          </div>
          <div>
            <div style="font-family:var(--font-head);font-size:20px;font-weight:800">${s.lastName}, ${s.firstName}</div>
            <div style="font-size:12px;color:var(--text2);margin-top:3px">${s.rate} · ${s.paygrade} · NEC ${s.necPrimary}${s.necSecondary ? ' / ' + s.necSecondary : ''} · ${s.clearance}</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
            <span class="tag ${ROLLER_TAGS[s.rollerStatus] || 'tag-ghost'}" style="font-size:11px;padding:4px 10px">${s.rollerType.replace('_', ' ')} · ${s.rollerStatus}</span>
            ${s.medicalHold ? '<span class="tag tag-purple">MED HOLD</span>' : ''}
          </div>
        </div>

        <div class="g2">
          <div>
            <div class="card mb16">
              <div class="card-header">Assignment Details</div>
              <table style="width:100%;font-size:12px">
                <tr><td style="color:var(--text3);padding:4px 0;width:40%">Command</td><td>${s.command}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">UIC</td><td class="mono">${s.uic}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">PRD</td><td class="mono ${daysLeft <= 30 ? 'red' : daysLeft <= 90 ? 'amber' : ''}">${s.prd} <strong>(${daysLeft}d)</strong></td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">EAOS</td><td class="mono">${s.eaos}</td></tr>
                <tr><td style="color:var(--text3);padding:4px 0">Sea Served</td><td class="mono">${s.seaMonthsServed} / ${s.seaMonthsPrescribed} mo</td></tr>
              </table>
            </div>

            <div class="card">
              <div class="card-header">Sea/Shore Roller Status</div>
              <div class="progress mb8"><div class="progress-fill ${daysLeft <= 30 ? 'pf-red' : daysLeft <= 90 ? 'pf-amber' : 'pf-green'}" style="width:${Math.min(100, s.seaMonthsServed / Math.max(1, s.seaMonthsPrescribed) * 100)}%"></div></div>
              <div style="font-size:11px;color:var(--text2)">${s.seaMonthsServed}mo served of ${s.seaMonthsPrescribed}mo prescribed</div>
            </div>
          </div>

          <div>
            <div class="card mb16">
              <div class="card-header">AI Billet Matches — ${s.rate} Rate</div>
              ${billets.billets.slice(0, 4).map(b => `
                <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">
                  <div style="flex:1">
                    <div style="font-size:12px;font-weight:600">${b.command}</div>
                    <div style="font-size:10px;color:var(--text2)">${b.title} · ${b.location} · <span class="mono">NEC ${b.necRequired}</span></div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-family:var(--font-head);font-size:14px;font-weight:800;color:${b.matchScore >= 90 ? 'var(--green)' : b.matchScore >= 80 ? 'var(--gold)' : 'var(--text2)'}">${b.matchScore}%</div>
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
      const STATUS_COLORS = { PENDING: 'tag-amber', SUBMITTED: 'tag-blue', NOT_SELECTED: 'tag-ghost', WITHDRAWN: 'tag-red' };
      wsContent(`
        <div class="section-hdr">12-Month Application Tracker</div>
        <div class="card" style="padding:0">
          <table class="tbl">
            <thead><tr><th>Command</th><th>Date</th><th>Status</th><th>Detailer</th><th>Notes</th></tr></thead>
            <tbody>
              ${data.applications.map(a => `
                <tr>
                  <td style="font-size:12px;font-weight:600">${a.command}</td>
                  <td class="mono text-xs muted">${a.date}</td>
                  <td><span class="tag ${STATUS_COLORS[a.status] || 'tag-ghost'}">${a.status.replace('_', ' ')}</span></td>
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
      wsLoading();
      const threads = await API.getSailorEmails(id);
      wsContent(`
        <div class="section-hdr">Email Thread History — Permanent Record</div>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:680px">
          ${threads.threads.length ? threads.threads.map(t => `
            <div class="card" style="${t.teamHistory ? 'border-left:3px solid var(--purple)' : ''}">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span style="font-size:11px;font-weight:600">${t.from}</span>
                ${t.teamHistory ? '<span class="tag tag-purple">TEAM HISTORY</span>' : ''}
                <span class="mono text-xs muted" style="margin-left:auto">${t.date}</span>
              </div>
              <div style="font-size:11px;font-weight:700;margin-bottom:4px">${t.subject}</div>
              <div style="font-size:11px;color:var(--text2)">${t.preview}</div>
              <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.05)">
                ${t.messages.map(m => `
                  <div style="margin-bottom:8px">
                    <div style="font-size:10px;font-weight:600">${m.from} · <span class="muted">${m.role}</span></div>
                    <div style="font-size:11px;color:var(--text2)">${m.body}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('') : '<div class="empty-state">No email history found</div>'}
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;max-width:680px">
          <textarea class="input" rows="3" placeholder="Reply to ${s.lastName}…"></textarea>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn btn-primary btn-sm">Send · Log to Record</button>
          <button class="btn btn-ghost btn-sm">AI Draft</button>
        </div>
      `);
    }

  } catch (e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}
