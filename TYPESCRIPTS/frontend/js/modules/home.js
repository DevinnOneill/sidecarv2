async function loadHome() {
  wsLoading();
  renderLPList([]);
  try {
    const dash = await API.getDashboard();
    wsContent(`
      <div class="stat-grid stat-grid-4 mb16">
        <div class="stat-block">
          <div class="stat-n">${dash.sailors_total}</div>
          <div class="stat-l">Sailors in Portfolio</div>
        </div>
        <div class="stat-block">
          <div class="stat-n red">${dash.critical_rollers}</div>
          <div class="stat-l">Critical Rollers</div>
          <div class="stat-sub">PRD ≤ 30 days</div>
        </div>
        <div class="stat-block">
          <div class="stat-n amber">${dash.active_rollers}</div>
          <div class="stat-l">Active Rollers</div>
          <div class="stat-sub">PRD 31–90 days</div>
        </div>
        <div class="stat-block">
          <div class="stat-n gold">${dash.orders_in_qa}</div>
          <div class="stat-l">Orders in QA</div>
        </div>
      </div>

      <div class="g2">
        <div>
          <div class="section-hdr">Critical Rollers — Immediate Action Required</div>
          <div class="card" style="padding:0">
            <table class="tbl">
              <thead><tr><th>Sailor</th><th>Rate</th><th>PRD</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr onclick="setMod('sailors')" style="cursor:pointer">
                  <td style="font-size:12px;font-weight:600">Martinez, R.</td>
                  <td class="mono text-xs">IT2 / E-5</td>
                  <td class="mono text-xs red">22d</td>
                  <td><span class="tag roller-critical">CRITICAL</span></td>
                  <td><button class="btn btn-primary btn-xs" onclick="event.stopPropagation();setMod('sailors')">View</button></td>
                </tr>
                <tr>
                  <td style="font-size:12px;font-weight:600">Anderson, B.</td>
                  <td class="mono text-xs">IT2 / E-5</td>
                  <td class="mono text-xs amber">67d</td>
                  <td><span class="tag roller-active">ACTIVE</span> <span class="tag tag-purple">MED HOLD</span></td>
                  <td><button class="btn btn-ghost btn-xs">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-hdr">Orders Pipeline</div>
          <div class="pipeline">
            <div class="pipeline-stage" onclick="setMod('orders')">
              <div class="ps-count muted">89</div>
              <div class="ps-label">Draft</div>
            </div>
            <div class="pipeline-stage active" onclick="setMod('orders')">
              <div class="ps-count gold">${dash.orders_in_qa}</div>
              <div class="ps-label">QA Review</div>
            </div>
            <div class="pipeline-stage" onclick="setMod('orders')">
              <div class="ps-count amber">6</div>
              <div class="ps-label">Returned</div>
            </div>
            <div class="pipeline-stage" onclick="setMod('orders')">
              <div class="ps-count green">127</div>
              <div class="ps-label">Approved</div>
            </div>
            <div class="pipeline-stage" onclick="setMod('orders')">
              <div class="ps-count muted">44</div>
              <div class="ps-label">Executed</div>
            </div>
          </div>
        </div>

        <div>
          <div class="section-hdr">PERS-40 Announcement</div>
          <div class="card" style="border-left:3px solid var(--gold);margin-bottom:12px">
            <div style="font-size:10px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-bottom:6px">POLICY UPDATE · 24 FEB 2026</div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px">Spring 2026 Cycle Opens 01 MAR</div>
            <div style="font-size:11px;color:var(--text2);line-height:1.5">Review all sailor preferences in MNA before actioning new orders this cycle. Confirm billet match scores against updated NEC tables before submission.</div>
          </div>

          <div class="section-hdr">Vacant Billets — IT Rate</div>
          <div class="card" style="padding:0">
            <table class="tbl">
              <thead><tr><th>Command</th><th>NEC</th><th>AOR</th><th>Days Vacant</th></tr></thead>
              <tbody>
                <tr onclick="setMod('billets')"><td style="font-size:11px;font-weight:600">NISC Little Creek</td><td class="mono text-xs">2779</td><td><span class="tag tag-blue">LANT</span></td><td class="mono text-xs amber">34d</td></tr>
                <tr onclick="setMod('billets')"><td style="font-size:11px;font-weight:600">7th Fleet Flagship</td><td class="mono text-xs">2779</td><td><span class="tag tag-amber">WESTPAC</span></td><td class="mono text-xs red">67d ⚠</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `);
  } catch(e) {
    wsContent('<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Could not load dashboard</div><div class="empty-state-sub">Check that the backend is running: uvicorn app.main:app</div></div>');
  }
}
