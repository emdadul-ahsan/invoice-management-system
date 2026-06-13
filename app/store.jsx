import React from 'react'

/* ============================================
   STORE — localStorage-backed app state
   ============================================ */
const STORAGE_KEY = 'mydesk_invoicing_v1';

const seedClients = [
  { id:'c1', name:'Acme Co.',       email:'billing@acme.io',   addr:'350 Mission St, San Francisco CA', color:'#7b68ee' },
  { id:'c2', name:'Beta Studio',    email:'ap@betastudio.com', addr:'14 Hoxton Sq, London',             color:'#ef8354' },
  { id:'c3', name:'Gamma Inc.',     email:'hello@gamma.co',    addr:'221 Park Ave, NYC',                color:'#1f8a5b' },
  { id:'c4', name:'Delta & Co',     email:'finance@delta.co',  addr:'2 Rue de Rivoli, Paris',           color:'#2c70d4' },
  { id:'c5', name:'Epsilon Labs',   email:'pay@epsilon.dev',   addr:'9 Smith St, Brooklyn',             color:'#b27200' },
];

function daysFromNow(d){ return new Date(Date.now() + d*86400000).toISOString().slice(0,10); }
function daysAgo(d){ return new Date(Date.now() - d*86400000).toISOString().slice(0,10); }

const seedInvoices = [
  { id:'inv-0142', number:'INV-0142', clientId:'c1', project:'Website redesign · phase 1',
    issued: daysAgo(42), due: daysAgo(28), status:'paid', paidOn: daysAgo(26),
    method:'Stripe · •• 4242', ref:'ch_3PqRf2hzL',
    items:[
      {id:'l1', desc:'Discovery sprint', qty:1, rate:600},
      {id:'l2', desc:'UI design · 3 screens', qty:3, rate:200},
    ],
    notes:'Thank you! Net 14 terms · pay via Stripe link below.',
    activity:[
      { id:'a1', type:'created', when: daysAgo(45), note:'Draft created' },
      { id:'a2', type:'sent',    when: daysAgo(42), note:'Sent to billing@acme.io' },
      { id:'a3', type:'opened',  when: daysAgo(41), note:'Opened by client' },
      { id:'a4', type:'paid',    when: daysAgo(26), note:'$1,200 received via Stripe' },
    ]},
  { id:'inv-0143', number:'INV-0143', clientId:'c2', project:'UI Audit',
    issued: daysAgo(10), due: daysFromNow(4), status:'pending',
    items:[ {id:'l1', desc:'UI audit · 6h block', qty:6, rate:140} ],
    notes:'Pay via wire or Stripe.',
    activity:[
      { id:'a1', type:'created', when: daysAgo(11), note:'Draft created' },
      { id:'a2', type:'sent',    when: daysAgo(10), note:'Sent to ap@betastudio.com' },
      { id:'a3', type:'opened',  when: daysAgo(9),  note:'Opened by client' },
    ]},
  { id:'inv-0119', number:'INV-0119', clientId:'c3', project:'Brand sprint',
    issued: daysAgo(20), due: daysAgo(6), status:'overdue',
    items:[ {id:'l1', desc:'Brand sprint · 5 days', qty:5, rate:250} ],
    notes:'Net 14. Late fee 2% after 14 days.',
    activity:[
      { id:'a1', type:'created', when: daysAgo(22), note:'Draft created' },
      { id:'a2', type:'sent',    when: daysAgo(20), note:'Sent to hello@gamma.co' },
      { id:'a3', type:'opened',  when: daysAgo(18), note:'Opened by client' },
      { id:'a4', type:'reminder',when: daysAgo(3),  note:'Reminder sent' },
    ]},
  { id:'inv-0144', number:'INV-0144', clientId:'c4', project:'Retainer · May',
    issued: daysFromNow(0), due: daysFromNow(14), status:'draft',
    items:[ {id:'l1', desc:'Retainer · May 2026', qty:1, rate:2400} ],
    notes:'',
    activity:[ { id:'a1', type:'created', when: daysAgo(0), note:'Draft created' } ]},
  { id:'inv-0140', number:'INV-0140', clientId:'c5', project:'Logo + guidelines',
    issued: daysAgo(4), due: daysFromNow(10), status:'pending',
    items:[
      {id:'l1', desc:'Logo concepts · 3 directions', qty:1, rate:1800},
      {id:'l2', desc:'Brand guidelines doc', qty:1, rate:1600},
    ],
    notes:'',
    activity:[
      { id:'a1', type:'created', when: daysAgo(5), note:'Draft created' },
      { id:'a2', type:'sent',    when: daysAgo(4), note:'Sent to pay@epsilon.dev' },
    ]},
  { id:'inv-0137', number:'INV-0137', clientId:'c1', project:'Onboarding flow',
    issued: daysAgo(38), due: daysAgo(24), status:'paid', paidOn: daysAgo(22),
    method:'Stripe · •• 4242', ref:'ch_3PqQwYn',
    items:[ {id:'l1', desc:'Onboarding · design + prototype', qty:1, rate:1800} ],
    activity:[
      { id:'a1', type:'sent', when: daysAgo(38), note:'Sent' },
      { id:'a2', type:'paid', when: daysAgo(22), note:'$1,800 received' },
    ]},
];

const seedProjects = [
  { id:'p1', name:'Website Redesign', clientId:'c1', total:1200, currency:'USD',
    milestones:[
      { id:'m1', title:'Wireframes',     amount:200, status:'done',    invoiceId:null, due: daysAgo(40) },
      { id:'m2', title:'UI Design',      amount:400, status:'done',    invoiceId:null, due: daysAgo(28) },
      { id:'m3', title:'Final Delivery', amount:600, status:'pending', invoiceId:null, due: daysFromNow(7) },
    ]},
  { id:'p2', name:'Brand Sprint', clientId:'c3', total:1250, currency:'USD',
    milestones:[
      { id:'m1', title:'Discovery & moodboards', amount:300, status:'done', invoiceId:null, due: daysAgo(15) },
      { id:'m2', title:'Brand system',          amount:600, status:'in_progress', invoiceId:null, due: daysFromNow(3) },
      { id:'m3', title:'Brand guidelines',      amount:350, status:'todo', invoiceId:null, due: daysFromNow(14) },
    ]},
  { id:'p3', name:'Retainer · Beta Studio', clientId:'c2', total:5100, currency:'USD',
    milestones:[
      { id:'m1', title:'February retainer', amount:1700, status:'done', invoiceId:null, due: daysAgo(80) },
      { id:'m2', title:'March retainer',    amount:1700, status:'done', invoiceId:null, due: daysAgo(50) },
      { id:'m3', title:'April retainer',    amount:1700, status:'in_progress', invoiceId:null, due: daysAgo(10) },
    ]},
];

const defaultState = {
  business: { name:'Jane Doe Studio', email:'hello@janedoe.co', addr:'221B Baker St, London', phone:'+1 555 0117' },
  clients: seedClients,
  invoices: seedInvoices,
  projects: seedProjects,
  nextInvoiceNum: 147,
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState;
    const parsed = JSON.parse(raw);
    // shallow merge to be safe with new fields
    return { ...defaultState, ...parsed };
  }catch(e){
    return defaultState;
  }
}
function saveState(s){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }catch(e){}
}
function resetState(){
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
}

/* recompute "overdue" status on each load so passage of time is reflected */
function refreshOverdue(state){
  const today = new Date().toISOString().slice(0,10);
  state.invoices = state.invoices.map(inv => {
    if(inv.status === 'pending' && inv.due < today){
      return { ...inv, status:'overdue' };
    }
    return inv;
  });
  return state;
}

const StoreCtx = React.createContext(null);

function StoreProvider({ children }){
  const [state, setState] = React.useState(() => refreshOverdue(loadState()));
  const [toasts, setToasts] = React.useState([]);
  const toastId = React.useRef(1);

  React.useEffect(() => { saveState(state); }, [state]);

  const toast = React.useCallback((msg, variant='ok') => {
    const id = toastId.current++;
    setToasts(t => [...t, { id, msg, variant }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  /* ---- selectors ---- */
  const helpers = React.useMemo(() => ({
    getClient: (id) => state.clients.find(c => c.id === id),
    getInvoice: (id) => state.invoices.find(i => i.id === id),
    getProject: (id) => state.projects.find(p => p.id === id),
    invoiceTotal: (inv) => (inv?.items || []).reduce((s,l) => s + (Number(l.qty)||0)*(Number(l.rate)||0), 0),
    invoicesByClient: (clientId) => state.invoices.filter(i => i.clientId === clientId),
    projectsByClient: (clientId) => state.projects.filter(p => p.clientId === clientId),
    projectProgress: (project) => {
      const total = project.milestones.length || 1;
      const done = project.milestones.filter(m => m.status === 'done').length;
      return { done, total, pct: Math.round((done/total)*100) };
    },
    projectAmounts: (project) => {
      const paid = project.milestones.filter(m => m.status === 'done').reduce((s,m) => s + m.amount, 0);
      const remaining = project.milestones.filter(m => m.status !== 'done').reduce((s,m) => s + m.amount, 0);
      return { paid, remaining, total: paid + remaining };
    },
  }), [state]);

  /* ---- mutations ---- */
  const actions = React.useMemo(() => ({
    createInvoice(draft){
      const num = state.nextInvoiceNum;
      const id = `inv-${String(num).padStart(4,'0')}`;
      const number = `INV-${String(num).padStart(4,'0')}`;
      const inv = {
        id, number,
        clientId: draft.clientId,
        project: draft.project || '',
        issued: draft.issued || new Date().toISOString().slice(0,10),
        due: draft.due || daysFromNow(14),
        status: draft.status || 'draft',
        items: (draft.items && draft.items.length) ? draft.items : [{id:'l1', desc:'New line item', qty:1, rate:0}],
        notes: draft.notes || '',
        activity:[{ id:'a1', type:'created', when:new Date().toISOString().slice(0,10), note:'Draft created' }],
      };
      setState(s => ({ ...s, invoices:[inv, ...s.invoices], nextInvoiceNum: s.nextInvoiceNum + 1 }));
      return inv;
    },
    updateInvoice(id, patch){
      setState(s => ({ ...s, invoices: s.invoices.map(i => i.id === id ? { ...i, ...patch } : i) }));
    },
    deleteInvoice(id){
      setState(s => ({ ...s, invoices: s.invoices.filter(i => i.id !== id) }));
    },
    sendInvoice(id){
      const today = new Date().toISOString().slice(0,10);
      setState(s => ({ ...s, invoices: s.invoices.map(i => i.id === id ? {
        ...i, status:'pending',
        activity:[ ...(i.activity||[]), { id:'a-'+Date.now(), type:'sent', when: today, note:'Sent to client' } ]
      } : i)}));
      toast('Invoice sent to client', 'info');
    },
    markPaid(id, { method='Stripe', ref } = {}){
      const today = new Date().toISOString().slice(0,10);
      setState(s => ({ ...s, invoices: s.invoices.map(i => i.id === id ? {
        ...i, status:'paid', paidOn: today, method, ref: ref || ('ch_'+Math.random().toString(36).slice(2,10)),
        activity:[ ...(i.activity||[]), { id:'a-'+Date.now(), type:'paid', when: today, note:'Payment received' } ]
      } : i)}));
      toast('Marked as paid 🎉', 'ok');
    },
    sendReminder(id){
      const today = new Date().toISOString().slice(0,10);
      setState(s => ({ ...s, invoices: s.invoices.map(i => i.id === id ? {
        ...i,
        activity:[ ...(i.activity||[]), { id:'a-'+Date.now(), type:'reminder', when: today, note:'Reminder email sent' } ]
      } : i)}));
      toast('Reminder sent', 'info');
    },
    duplicateInvoice(id){
      const orig = state.invoices.find(i => i.id === id);
      if(!orig) return;
      return actions.createInvoice({
        clientId: orig.clientId,
        project: orig.project,
        items: orig.items.map(l => ({ ...l })),
        notes: orig.notes,
      });
    },
    updateProject(id, patch){
      setState(s => ({ ...s, projects: s.projects.map(p => p.id === id ? { ...p, ...patch } : p) }));
    },
    toggleMilestone(projectId, milestoneId){
      setState(s => ({ ...s, projects: s.projects.map(p => p.id !== projectId ? p : {
        ...p, milestones: p.milestones.map(m => m.id !== milestoneId ? m : {
          ...m, status: m.status === 'done' ? 'in_progress' : 'done'
        })
      })}));
    },
    invoiceMilestone(projectId, milestoneId){
      const proj = state.projects.find(p => p.id === projectId);
      const ms = proj?.milestones.find(m => m.id === milestoneId);
      if(!proj || !ms) return;
      const inv = actions.createInvoice({
        clientId: proj.clientId,
        project: `${proj.name} · ${ms.title}`,
        items:[{ id:'l1', desc: `${proj.name} — ${ms.title}`, qty:1, rate: ms.amount }],
        status:'pending',
      });
      setState(s => ({
        ...s,
        projects: s.projects.map(p => p.id !== projectId ? p : {
          ...p, milestones: p.milestones.map(m => m.id !== milestoneId ? m : { ...m, invoiceId: inv.id })
        }),
        invoices: s.invoices.map(i => i.id === inv.id ? { ...i,
          activity:[ ...(i.activity||[]), { id:'a-'+Date.now()+1, type:'sent', when: new Date().toISOString().slice(0,10), note:'Generated from milestone' } ]
        } : i)
      }));
      toast(`Invoice ${inv.number} created from milestone`, 'info');
      return inv;
    },
    resetData(){
      resetState();
      setState(refreshOverdue(loadState()));
      toast('Demo data reset', 'info');
    },
    createClient(draft){
      const id = 'c-' + Date.now();
      const client = {
        id,
        name: (draft.name || '').trim() || 'Untitled client',
        email: (draft.email || '').trim(),
        addr: (draft.addr || '').trim(),
        color: '#7b68ee',
      };
      setState(s => ({ ...s, clients: [...s.clients, client] }));
      toast(`${client.name} added`, 'info');
      return client;
    },
    updateClient(id, patch){
      setState(s => ({ ...s, clients: s.clients.map(c => c.id === id ? { ...c, ...patch } : c) }));
      toast('Client updated', 'info');
    },
    deleteClient(id){
      const c = state.clients.find(x => x.id === id);
      setState(s => ({ ...s, clients: s.clients.filter(x => x.id !== id) }));
      toast(`${c?.name || 'Client'} removed`, 'warn');
    },
    updateBusiness(patch){
      setState(s => ({ ...s, business: { ...s.business, ...patch } }));
      toast('Business details saved', 'info');
    },
  }), [state, toast]);

  const value = { state, ...helpers, ...actions, toast };

  return (
    <StoreCtx.Provider value={value}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.variant}`}><span className="dot"></span>{t.msg}</div>
        ))}
      </div>
    </StoreCtx.Provider>
  );
}

const useStore = () => React.useContext(StoreCtx);

/* ---- format helpers ---- */
const fmtMoney = (n, currency='USD') => new Intl.NumberFormat('en-US',{ style:'currency', currency, maximumFractionDigits: 2 }).format(n||0);
const fmtDate = (iso) => {
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
};
const fmtDateShort = (iso) => {
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
};
const daysBetween = (a, b) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86400000);
};

export { StoreProvider, useStore, fmtMoney, fmtDate, fmtDateShort, daysBetween, daysFromNow, daysAgo };
