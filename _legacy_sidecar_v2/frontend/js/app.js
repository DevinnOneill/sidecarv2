let currentUser=null,currentMod='home';
(function init(){
  const raw=sessionStorage.getItem('sidecar_user');
  if(!raw){window.location.href='/';return;}
  currentUser=JSON.parse(raw);
  const LABELS={DETAILER:'DET',QA_REVIEWER:'QA',PLACEMENT_COORD:'PLAC',PROGRAM_MANAGER:'PM',LEADERSHIP:'PERS-40',SAILOR:'SAILOR'};
  document.getElementById('wsUserName').textContent=currentUser.name;
  document.getElementById('wsUserRole').textContent=LABELS[currentUser.role]||currentUser.role;
  document.getElementById('railAvatar').textContent=currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2);
  document.querySelectorAll('.rail-btn[data-mod]').forEach(btn=>{btn.addEventListener('click',()=>setMod(btn.dataset.mod));});
  setMod('home');
  loadBadges();
  setTimeout(()=>toast('✉️','New Email in Queue','IT2 Martinez · PRD 22d · Orders/Billet'),1500);
  setTimeout(()=>toast('📄','Order Ready for Review','ORD-2026-0847 → QA Queue'),4200);
})();

function setMod(mod){
  currentMod=mod;
  document.querySelectorAll('.rail-btn').forEach(b=>b.classList.remove('active'));
  const ab=document.querySelector(`.rail-btn[data-mod="${mod}"]`);
  if(ab)ab.classList.add('active');
  const labels={home:'Home',sailors:'Sailors',billets:'Billets',orders:'Orders',avails:'Avails',email:'Email',messages:'Messaging',analytics:'Analytics',audit:'Audit Log'};
  document.getElementById('wsBreadcrumb').textContent=`SIDECAR · ${labels[mod]||mod}`;
  document.getElementById('lpTitle').textContent=labels[mod]||mod;
  document.getElementById('wsTabs').style.display='none';
  document.getElementById('lpFilters').innerHTML='';
  switch(mod){
    case 'home':      loadHome();      break;
    case 'sailors':   loadSailors();   break;
    case 'billets':   loadBillets();   break;
    case 'orders':    loadOrders();    break;
    case 'analytics': loadAnalytics(); break;
    case 'messages':  loadMessages();  break;
    case 'audit':     loadAudit();     break;
    default: wsContent(`<div class="empty-state"><div class="empty-state-icon">🚧</div><div class="empty-state-title">${labels[mod]||mod} Module</div><div class="empty-state-sub">Coming in Phase 1 development</div></div>`);
      renderLPList([]);
  }
}

function wsContent(html){document.getElementById('wsContent').innerHTML=html;}
function wsLoading(){wsContent('<div class="loading"><div class="spinner"></div> Loading…</div>');}

function renderLPList(items){
  const list=document.getElementById('lpList');
  if(!items.length){list.innerHTML='<div class="empty-state" style="padding:30px 16px"><div class="empty-state-icon">📭</div><div class="empty-state-sub">No items</div></div>';return;}
  list.innerHTML=items.map(item=>`
    <div class="lp-item${item.selected?' selected':''}" onclick="${item.onclick||''}">
      <div class="lp-item-avatar">${item.avatar||'?'}</div>
      <div class="lp-item-body">
        <div class="lp-item-name">${item.name}</div>
        <div class="lp-item-sub">${item.sub||''}</div>
        <div class="lp-item-tags">${(item.tags||[]).map(t=>`<span class="tag ${t.cls}">${t.label}</span>`).join('')}</div>
      </div>
      <div class="lp-item-right"><span class="lp-item-ts">${item.ts||''}</span>${item.unread?'<span class="lp-unread"></span>':''}</div>
    </div>`).join('');
}

function renderFilters(chips){
  const el=document.getElementById('lpFilters');
  el.innerHTML=chips.map((c,i)=>`<button class="filter-chip${i===0?' on':''}" onclick="filterChip(this,'${c.val}')">${c.label}</button>`).join('');
}
window.filterChip=function(btn,val){document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('on'));btn.classList.add('on');if(window._filterCb)window._filterCb(val);};

function setTabs(tabs,active,cb){
  const wt=document.getElementById('wsTabs'),inner=document.getElementById('wsTabsInner');
  wt.style.display='block';
  inner.innerHTML=tabs.map(t=>`<div class="ws-tab${t.id===active?' active':''}" onclick="selectTab(this,'${t.id}')">${t.label}</div>`).join('');
  window._tabCb=cb;
}
window.selectTab=function(el,id){document.querySelectorAll('.ws-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');if(window._tabCb)window._tabCb(id);};

function toast(icon,title,sub){
  const c=document.getElementById('toastContainer');
  const t=document.createElement('div');t.className='toast';
  t.innerHTML=`<span class="toast-icon">${icon}</span><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-sub">${sub}</div></div><span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(120%)';t.style.transition='all .3s';setTimeout(()=>t.remove(),300);},4200);
}

async function loadBadges(){
  try{const d=await API.getOrders();const n=d.by_status?.QA_REVIEW||0;const b=document.getElementById('badge-orders');if(n&&b)b.textContent=n;}catch(e){}
  try{const d=await API.getAvails();const n=d.urgent||0;const b=document.getElementById('badge-avails');if(n&&b)b.textContent=n;}catch(e){}
}

async function loadMessages(){
  wsContent('<div class="loading"><div class="spinner"></div></div>');
  try{
    const data=await API.getChannels();
    renderLPList(data.channels.map(ch=>({avatar:ch.type==='BROADCAST'?'📢':'#',name:ch.name,sub:ch.type,tags:ch.unread?[{cls:'tag-gold',label:`${ch.unread} new`}]:[],unread:ch.unread>0,onclick:`loadChannel('${ch.id}')`})));
    loadChannel(data.channels[0]?.id);
  }catch(e){wsContent(`<div class="empty-state"><div class="empty-state-icon">💬</div><div class="empty-state-title">Messaging</div><div class="empty-state-sub">Team channels — Phase 1</div></div>`);}
}
window.loadChannel=async function(id){
  if(!id)return;
  try{
    const data=await API.getMessages(id);
    wsContent(`<div class="section-hdr">Channel Messages</div><div style="display:flex;flex-direction:column;gap:12px;max-width:680px">
      ${data.messages.map(m=>`<div style="display:flex;gap:10px"><div class="lp-item-avatar" style="width:32px;height:32px;font-size:10px;flex-shrink:0">${m.user.split(' ').pop()[0]}</div><div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:12px;font-weight:600">${m.user}</span><span class="tag tag-ghost">${m.role}</span><span class="mono text-xs muted">${m.ts.split('T')[1].slice(0,5)}</span></div><div style="font-size:12px;color:var(--text2);margin-top:4px;line-height:1.5">${m.text}</div></div></div>`).join('')}
    </div><div style="margin-top:24px;display:flex;gap:8px;max-width:680px"><input class="input" placeholder="Message channel…"><button class="btn btn-primary btn-sm">Send</button></div>`);
  }catch(e){}
};

function loadAudit(){
  renderLPList([]);
  const entries=[
    {ts:'25 FEB 11:34',user:'J. Davis',role:'DET',action:'Submitted ORD-2026-0847 to QA — Pre-QA: 7/8 pass, 1 advisory'},
    {ts:'25 FEB 10:52',user:'C. Miller',role:'PM',action:'Routed AVAIL-2026-0284 to J. Davis (Humanitarian, Martinez R.)'},
    {ts:'25 FEB 09:14',user:'SYSTEM',role:'SYS',action:'Email intake: martinez.r@navy.mil — auto-tagged E-5/IT2, Orders, PRD 22d'},
    {ts:'25 FEB 08:00',user:'SYSTEM',role:'SYS',action:'Roller status update Martinez: ACTIVE → CRITICAL (PRD ≤30d)'},
    {ts:'24 FEB 16:22',user:'M. Torres',role:'QA',action:'Returned ORD-2026-0793 — Funding line not validated; NEC mismatch'},
    {ts:'24 FEB 14:11',user:'K. Brooks',role:'PERS-40',action:'Broadcast: Spring 2026 Cycle Opens (892 recipients)'},
    {ts:'24 FEB 09:00',user:'SYSTEM',role:'SYS',action:'NSIPS ETL sync complete — 2,847 billets updated, 12 vacancies flagged'},
  ];
  wsContent(`<div class="section-hdr">Audit Log — Immutable Event Trail</div><div class="card"><table class="tbl"><thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th></tr></thead><tbody>${entries.map(e=>`<tr><td class="mono text-xs muted">${e.ts}</td><td style="font-size:11px;font-weight:600">${e.user}</td><td><span class="tag tag-ghost">${e.role}</span></td><td style="font-size:11px;color:var(--text2)">${e.action}</td></tr>`).join('')}</tbody></table></div>`);
}

const AGENT_KB={roller:'Roller codes: CRITICAL ≤30d (red pulse) · ACTIVE 31-90d · UPCOMING 91-180d · PENDING >180d · ORDERED (under orders)','sea shore':'Sea/Shore (MILPERSMAN 1306-106): IT2 E-5 prescribed sea tour 48mo. Shore follows at 36mo.',eaos:'EAOS (MILPERSMAN 1160-030): Sailor must have 12mo service beyond RNLTD. Extension or waiver if short.',humanitarian:'Humanitarian (MILPERSMAN 1306-1104): Documented hardship, suitable billet, no negative operational impact.',jtrs:'JTR Chapter 5: PCS E-5 dependents — 8,000 lbs HHG, TLE 10 days, DLA authorized, POV shipment.',nec:'NEC match: Primary NEC required. Secondary NEC may satisfy with QA advisory. CM can waive.'};
function runAgent(){
  const q=document.getElementById('agentInput').value.toLowerCase().trim();
  if(!q)return;
  let ans=null;
  for(const[k,v]of Object.entries(AGENT_KB)){if(q.includes(k.split(' ')[0])){ans=v;break;}}
  if(!ans)ans=`No specific policy for "${q}". Check mynavyhr.navy.mil or the policy library.`;
  toast('⚡','SIDECAR AI',ans.slice(0,90)+'…');
  document.getElementById('agentInput').value='';
}
function logout(){sessionStorage.clear();window.location.href='/';}
