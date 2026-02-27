// ── BILLETS MODULE ────────────────────────────────────────────────────────────
async function loadBillets(filter='all') {
  wsLoading();
  renderFilters([
    {label:'All', val:'all'},
    {label:'🔴 Vacant', val:'VACANT'},
    {label:'🟡 Projected', val:'PROJECTED'},
    {label:'🌊 LANT', val:'LANT'},
    {label:'⛵ PACFLT', val:'PACFLT'},
  ]);
  window._filterCb = (val) => {
    if(['LANT','PACFLT','WESTPAC','SHORE'].includes(val)) loadBillets(val, 'aor');
    else loadBillets(val, 'status');
  };

  try {
    const params = filter === 'all' ? {} : {status: filter.toUpperCase()};
    const data = await API.getBillets(params);

    renderLPList(data.billets.map(b => ({
      avatar: b.aor[0],
      name: b.command.split('(')[0].trim(),
      sub: `${b.title} · ${b.paygrade}`,
      tags: [
        {cls: b.status==='VACANT'?'tag tag-red':b.status==='PROJECTED'?'tag tag-amber':'tag tag-green', label: b.status},
        {cls:'tag tag-ghost', label: b.aor},
      ],
      ts: b.status==='VACANT'?`${b.days_vacant}d`:'',
    })));

    wsContent(`
      <div class="stat-grid stat-grid-4 mb16">
        <div class="stat-block"><div class="stat-n">${data.total}</div><div class="stat-l">Total Billets</div></div>
        <div class="stat-block"><div class="stat-n red">${data.vacant}</div><div class="stat-l">Vacant</div></div>
        <div class="stat-block"><div class="stat-n amber">${data.projected}</div><div class="stat-l">Projected</div></div>
        <div class="stat-block"><div class="stat-n green">${data.total-data.vacant-data.projected}</div><div class="stat-l">Filled</div></div>
      </div>

      <div class="section-hdr">Billet Inventory</div>
      <div class="card" style="padding:0">
        <table class="tbl">
          <thead><tr><th>Command</th><th>Title</th><th>NEC</th><th>Grade</th><th>AOR</th><th>Status</th><th>Days Vacant</th><th></th></tr></thead>
          <tbody>
            ${data.billets.map(b=>`
              <tr>
                <td style="font-size:11px;font-weight:600">${b.command.split('(')[0].trim()}</td>
                <td style="font-size:11px;color:var(--text2)">${b.title}</td>
                <td class="mono text-xs">${b.nec_required}</td>
                <td class="mono text-xs">${b.paygrade}</td>
                <td><span class="tag tag-ghost">${b.aor}</span></td>
                <td><span class="tag ${b.status==='VACANT'?'tag-red':b.status==='PROJECTED'?'tag-amber':'tag-green'}">${b.status}</span></td>
                <td class="mono text-xs ${b.days_vacant>30?'red':b.days_vacant>0?'amber':''}">${b.days_vacant>0?b.days_vacant+'d':'—'}</td>
                <td><button class="btn btn-primary btn-xs" onclick="setMod('orders')">Match</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `);
  } catch(e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}

// ── ORDERS MODULE ─────────────────────────────────────────────────────────────
async function loadOrders() {
  wsLoading();
  renderLPList([]);

  try {
    const data = await API.getOrders();
    const bs = data.by_status;

    wsContent(`
      <div class="pipeline">
        <div class="pipeline-stage"><div class="ps-count muted">${bs.DRAFT||0}</div><div class="ps-label">Draft</div></div>
        <div class="pipeline-stage active"><div class="ps-count gold">${bs.QA_REVIEW||0}</div><div class="ps-label">QA Review</div></div>
        <div class="pipeline-stage"><div class="ps-count amber">${bs.RETURNED||0}</div><div class="ps-label">Returned</div></div>
        <div class="pipeline-stage"><div class="ps-count green">${bs.APPROVED||0}</div><div class="ps-label">Approved</div></div>
        <div class="pipeline-stage"><div class="ps-count muted">${bs.EXECUTED||0}</div><div class="ps-label">Executed</div></div>
      </div>

      <div class="g2">
        <div>
          <div class="section-hdr">Recent Orders</div>
          <div class="card" style="padding:0">
            <table class="tbl">
              <thead><tr><th>Order #</th><th>Sailor</th><th>Gaining Command</th><th>Status</th><th>Pre-QA</th></tr></thead>
              <tbody>
                ${data.orders.map(o=>`
                  <tr>
                    <td class="mono text-xs">${o.id}</td>
                    <td style="font-size:11px;font-weight:600">${o.sailor_name}</td>
                    <td style="font-size:11px;color:var(--text2)">${o.gaining_command.split('(')[0].trim()}</td>
                    <td><span class="tag ${o.status==='QA_REVIEW'?'tag-amber':o.status==='RETURNED'?'tag-red':o.status==='APPROVED'?'tag-green':'tag-ghost'}">${o.status.replace('_',' ')}</span></td>
                    <td style="font-size:11px">${o.preqa_passed}✅ ${o.preqa_advisory}⚠️ ${o.preqa_failed}❌</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${data.orders.find(o=>o.status==='RETURNED') ? `
            <div class="card mt16" style="border-left:3px solid var(--red)">
              <div style="font-size:10px;font-weight:700;color:var(--red);letter-spacing:1px;margin-bottom:4px">ORDER RETURNED</div>
              <div style="font-size:12px;font-weight:600">ORD-2026-0793</div>
              <div style="font-size:11px;color:var(--text2);margin-top:4px">${data.orders.find(o=>o.id==='ORD-2026-0793')?.return_reason||'See QA findings'}</div>
            </div>
          ` : ''}
        </div>

        <div>
          <div class="section-hdr">Write New Orders</div>
          <div class="card">
            <div class="g2 mb8">
              <div><label class="form-label">Order Type</label><select class="input"><option>PCS</option><option>PCA</option><option>TAD</option></select></div>
              <div><label class="form-label">Sailor</label><select class="input"><option>IT2 Martinez, R.</option><option>IT2 Anderson, B.</option><option>IT1 Thompson, J.</option></select></div>
            </div>
            <div class="g2 mb8">
              <div><label class="form-label">Gaining Command</label><input class="input" placeholder="NISC Little Creek"></div>
              <div><label class="form-label">Billet ID</label><input class="input" placeholder="B001"></div>
            </div>
            <div class="g2 mb8">
              <div><label class="form-label">Detach Date</label><input class="input" type="date"></div>
              <div><label class="form-label">RNLTD</label><input class="input" type="date"></div>
            </div>
            <div class="g2 mb8">
              <div><label class="form-label">Tour Length (months)</label><input class="input" placeholder="36" value="36"></div>
              <div><label class="form-label">Funding Line</label><input class="input" placeholder="N00014-26-PCS-IT"></div>
            </div>
            <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="runPreQADemo()">⚡ Run Pre-QA Policy Check</button>
          </div>

          <div id="preqaResults" style="margin-top:12px"></div>
        </div>
      </div>
    `);
  } catch(e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}

window.runPreQADemo = async function() {
  const container = document.getElementById('preqaResults');
  container.innerHTML = '<div class="loading"><div class="spinner"></div> Running policy checks…</div>';
  try {
    const data = await API.runPreQA({
      sailor_id: 'S001', billet_id: 'B001',
      order_type: 'PCS', rnltd: '2026-04-01',
      tour_length: 36, funding_line: 'N00014-26-PCS-IT'
    });
    const icons = {PASS:'✅', ADVISORY:'⚠️', FAIL:'❌'};
    container.innerHTML = `
      <div class="section-hdr">Pre-QA Results — ${data.message}</div>
      ${data.checks.map((c,i) => `
        <div class="preqa-check" style="animation:fadeUp .2s ease ${i*0.08}s both">
          <div class="preqa-icon">${icons[c.status]}</div>
          <div class="preqa-body">
            <div class="preqa-name">${c.check}</div>
            <div class="preqa-detail">${c.detail}</div>
            <div class="preqa-ref">${c.reference}</div>
          </div>
        </div>
      `).join('')}
      <button class="btn btn-primary" style="width:100%;margin-top:12px" ${!data.can_submit?'disabled':''}>
        ${data.can_submit ? '📤 Submit to QA Queue' : '⛔ Fix Failures Before Submitting'}
      </button>
    `;
  } catch(e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-sub">Pre-QA error: ${e.message}</div></div>`;
  }
};

// ── ANALYTICS MODULE ─────────────────────────────────────────────────────────
async function loadAnalytics() {
  wsLoading();
  renderLPList([]);
  try {
    const [dash, fleet] = await Promise.all([API.getDashboard(), API.getFleetData()]);
    wsContent(`
      <div class="stat-grid stat-grid-4 mb16">
        <div class="stat-block"><div class="stat-n">328,441</div><div class="stat-l">Total Navy Billets</div></div>
        <div class="stat-block"><div class="stat-n green">87.3%</div><div class="stat-l">Overall Fill Rate</div></div>
        <div class="stat-block"><div class="stat-n red">4,218</div><div class="stat-l">Critical Vacancies</div></div>
        <div class="stat-block"><div class="stat-n gold">12,847</div><div class="stat-l">Orders This Cycle</div></div>
      </div>

      <div class="g2">
        <div>
          <div class="section-hdr">Fleet Readiness — Fill Rate by AOR</div>
          <div class="card">
            <div class="bar-chart">
              ${fleet.fleets.map(f=>`
                <div class="bar-item">
                  <div class="bar-label" title="${f.fleet}">${f.fleet.split('(')[0].trim()}</div>
                  <div class="bar-track"><div class="bar-fill ${f.fill_rate<70?'pf-red':f.fill_rate<85?'pf-amber':'pf-green'}" style="width:${f.fill_rate}%"></div></div>
                  <div class="bar-pct">${f.fill_rate}%</div>
                  <span class="mono text-xs ${f.trend<0?'red':'green'}" style="width:36px;text-align:right">${f.trend>0?'+':''}${f.trend}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div>
          <div class="section-hdr">Community Health — IT Rate</div>
          <div class="card">
            <div class="bar-chart">
              ${[
                {label:'IT E-7/E-8/E-9', rate:68, critical:true},
                {label:'IT E-6',         rate:79, critical:false},
                {label:'IT E-5',         rate:83, critical:false},
                {label:'IT E-4',         rate:94, critical:false},
              ].map(c=>`
                <div class="bar-item">
                  <div class="bar-label">${c.label}</div>
                  <div class="bar-track"><div class="bar-fill ${c.rate<70?'pf-red':c.rate<85?'pf-amber':'pf-green'}" style="width:${c.rate}%"></div></div>
                  <div class="bar-pct ${c.critical?'red':''}">${c.rate}%${c.critical?' ⚠':''}  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section-hdr mt16">Your Portfolio Stats</div>
          <div class="stat-grid stat-grid-2">
            <div class="stat-block"><div class="stat-n red">${dash.critical_rollers}</div><div class="stat-l">Critical Rollers</div></div>
            <div class="stat-block"><div class="stat-n amber">${dash.active_rollers}</div><div class="stat-l">Active Rollers</div></div>
          </div>
        </div>
      </div>
    `);
  } catch(e) {
    wsContent(`<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-sub">${e.message}</div></div>`);
  }
}
