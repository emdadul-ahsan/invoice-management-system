import React from 'react'
import { StoreProvider, useStore, fmtMoney } from './store'
import { Icon, ClientCell, StatusPill, Sidebar, Topbar, Modal } from './ui'

// Lazy-loaded screens for code splitting
const DashboardScreen = React.lazy(() => import('./screens/dashboard'))
const InvoicesScreen = React.lazy(() => import('./screens/invoices'))
const InvoiceDetailScreen = React.lazy(() => import('./screens/invoice-detail'))
const InvoiceEditorScreen = React.lazy(() => import('./screens/invoice-editor'))
const ProjectsScreen = React.lazy(() => import('./screens/projects'))
const ProjectDetailScreen = React.lazy(() =>
  import('./screens/projects').then(m => ({ default: m.ProjectDetailScreen }))
)

/* ============================================
   Error Boundary
   ============================================ */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Something went wrong</h1>
            <p style={{ color: 'var(--fog-grey)', marginBottom: '20px' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              className="btn violet"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/dashboard';
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ============================================
   Loading Fallback
   ============================================ */
function LoadingFallback() {
  return (
    <div className="view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--deep-slate)',
          borderTop: '3px solid var(--aether-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: 'var(--fog-grey)' }}>Loading...</p>
      </div>
    </div>
  );
}

/* ============================================
   Route Config
   ============================================ */
const ROUTES = {
  dashboard: { name: 'dashboard', crumbs: [{ label: 'Dashboard' }], component: DashboardScreen },
  invoices: { name: 'invoices', crumbs: [{ label: 'Invoices' }], component: InvoicesScreen },
  editor: { name: 'editor', component: InvoiceEditorScreen },
  'invoice-detail': { name: 'invoice-detail', component: InvoiceDetailScreen },
  projects: { name: 'projects', crumbs: [{ label: 'Projects' }], component: ProjectsScreen },
  'project-detail': { name: 'project-detail', component: ProjectDetailScreen },
  clients: { name: 'clients', crumbs: [{ label: 'Clients' }], component: null },
  settings: { name: 'settings', crumbs: [{ label: 'Settings' }], component: null },
};

/* ============================================
   Route Renderer
   ============================================ */
function RouteRenderer({ routeName, routeParams, screenRoute, onNav, search }) {
  const store = useStore();

  // Dynamic route rendering
  const renderRoute = () => {
    switch(routeName) {
      case 'dashboard':
        return <DashboardScreen onNav={onNav} />;
      case 'invoices':
        return <InvoicesScreen onNav={onNav} search={search} />;
      case 'invoice-detail':
        return <InvoiceDetailScreen id={routeParams.id} onNav={onNav} />;
      case 'editor':
        return <InvoiceEditorScreen id={routeParams.id} onNav={onNav} />;
      case 'projects':
        return <ProjectsScreen onNav={onNav} />;
      case 'project-detail':
        return <ProjectDetailScreen id={routeParams.id} onNav={onNav} />;
      case 'clients':
        return <ClientsScreen onNav={onNav} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen onNav={onNav} />;
    }
  };

  return renderRoute();
}

/* ============================================
   APP — routing, shell, mount
   ============================================ */
function App(){
  const [route, setRoute] = React.useState({ name:'dashboard', params:{} });
  const [search, setSearch] = React.useState('');

  // simple hash routing
  React.useEffect(() => {
    const parse = () => {
      const h = window.location.hash.replace(/^#\/?/, '');
      if(!h){ setRoute({ name:'dashboard', params:{} }); return; }
      const [name, ...rest] = h.split('/');
      const params = {};
      if(rest.length){
        params.id = decodeURIComponent(rest[0]);
      }
      setRoute({ name: name || 'dashboard', params });
    };
    parse();
    window.addEventListener('hashchange', parse);
    return () => window.removeEventListener('hashchange', parse);
  }, []);

  const onNav = React.useCallback((name, params = {}) => {
    let hash = `#/${name}`;
    if(params.id) hash += `/${encodeURIComponent(params.id)}`;
    if(window.location.hash !== hash){
      window.location.hash = hash;
    }else{
      setRoute({ name, params }); // force re-render if same
    }
  }, []);

  return (
    <StoreProvider>
      <ErrorBoundary>
        <Shell route={route} onNav={onNav} search={search} setSearch={setSearch} />
      </ErrorBoundary>
    </StoreProvider>
  );
}

function Shell({ route, onNav, search, setSearch }){
  const store = useStore();
  const counts = {
    invoices: store.state.invoices.length,
    projects: store.state.projects.length,
    clients:  store.state.clients.length,
  };

  // map route → screen + crumbs
  const screenRoute = (() => {
    switch(route.name){
      case 'dashboard':       return { name:'dashboard', crumbs:[{label:'Dashboard'}] };
      case 'invoices':        return { name:'invoices',  crumbs:[{label:'Invoices'}] };
      case 'editor':          return { name:'editor',    crumbs:[
        {label:'Invoices', onClick:() => onNav('invoices')},
        route.params.id ? {label:`Edit ${store.state.invoices.find(i=>i.id===route.params.id)?.number || ''}`} : {label:'New invoice'}
      ]};
      case 'invoice-detail':  return { name:'invoice-detail', crumbs:[
        {label:'Invoices', onClick:() => onNav('invoices')},
        {label: store.state.invoices.find(i=>i.id===route.params.id)?.number || 'Invoice'}
      ]};
      case 'projects':        return { name:'projects', crumbs:[{label:'Projects'}] };
      case 'project-detail':  return { name:'project-detail', crumbs:[
        {label:'Projects', onClick:() => onNav('projects')},
        {label: store.state.projects.find(p=>p.id===route.params.id)?.name || 'Project'}
      ]};
      case 'clients':         return { name:'clients', crumbs:[{label:'Clients'}] };
      case 'settings':        return { name:'settings', crumbs:[{label:'Settings'}] };
      default:                return { name:'dashboard', crumbs:[{label:'Dashboard'}] };
    }
  })();

  // map navItem highlight (editor → invoices, invoice-detail → invoices, project-detail → projects)
  const sideRoute = {
    name:
      route.name === 'editor' || route.name === 'invoice-detail' ? 'invoices' :
      route.name === 'project-detail' ? 'projects' :
      route.name
  };

  return (
    <div className="app">
      <Sidebar route={sideRoute} onNav={onNav} counts={counts} />
      <div className="main">
        <Topbar crumbs={screenRoute.crumbs} search={search} onSearch={setSearch} />

        <React.Suspense fallback={<LoadingFallback />}>
          <ErrorBoundary>
            <RouteRenderer
              routeName={route.name}
              routeParams={route.params}
              screenRoute={screenRoute}
              onNav={onNav}
              search={search}
            />
          </ErrorBoundary>
        </React.Suspense>
      </div>
    </div>
  );
}

/* simple clients screen */
function ClientsScreen({ onNav }){
  const store = useStore();
  const { state, invoiceTotal, invoicesByClient } = store;
  const [editing, setEditing] = React.useState(null);     // null | {} (new) | client (edit)
  const [confirmDelete, setConfirmDelete] = React.useState(null); // client object

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1>Clients</h1>
          <div className="sub">{state.clients.length} active · sorted by lifetime value</div>
        </div>
        <div className="actions">
          <button className="btn violet" onClick={() => setEditing({ name:'', email:'', addr:'' })}>
            <Icon name="plus" size={14} /> Add client
          </button>
        </div>
      </div>

      <div className="grid grid-3">
        {state.clients
          .map(c => ({ c, total: invoicesByClient(c.id).reduce((s,i)=>s+invoiceTotal(i),0) }))
          .sort((a,b) => b.total - a.total)
          .map(({ c, total }) => {
            const invs = invoicesByClient(c.id);
            const outstanding = invs.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s,i)=>s+invoiceTotal(i),0);
            return (
              <div key={c.id} className="card" style={{cursor:'default'}}>
                <div className="row" style={{alignItems:'flex-start',marginBottom:14}}>
                  <div className="flex-1" style={{minWidth:0}}>
                    <h3 className="truncate" style={{margin:0,whiteSpace:'normal'}}>{c.name}</h3>
                    <div className="muted small truncate">{c.email || <span className="fade">no email on file</span>}</div>
                  </div>
                  <div className="row tight" style={{flexShrink:0}}>
                    <button className="icon-btn" title="Edit" onClick={() => setEditing(c)}><Icon name="edit" size={14} /></button>
                    <button className="icon-btn" title="Delete" onClick={() => setConfirmDelete(c)}><Icon name="trash" size={14} /></button>
                  </div>
                </div>
                {c.addr && <div className="muted small truncate" style={{marginBottom:12}}>{c.addr}</div>}
                <div className="row between"><span className="muted small">Lifetime</span><span className="mono semibold">{fmtMoney(total)}</span></div>
                <div className="row between"><span className="muted small">Outstanding</span><span className="mono" style={{color: outstanding > 0 ? 'var(--violet-700)' : 'var(--ink-3)'}}>{fmtMoney(outstanding)}</span></div>
                <div className="row between"><span className="muted small">Invoices</span><span className="semibold">{invs.length}</span></div>
                <div className="divider"></div>
                <button className="btn sm" style={{width:'100%'}} onClick={() => onNav('editor', { id: null })}>
                  <Icon name="plus" size={11} /> New invoice for {c.name.split(' ')[0]}
                </button>
              </div>
            );
        })}
      </div>

      {editing && (
        <ClientFormModal
          client={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            if(editing.id){ store.updateClient(editing.id, patch); }
            else { store.createClient(patch); }
            setEditing(null);
          }}
        />
      )}

      {confirmDelete && (() => {
        const invs = invoicesByClient(confirmDelete.id);
        return (
          <Modal
            title={`Delete ${confirmDelete.name}?`}
            desc={invs.length > 0
              ? `This client has ${invs.length} invoice${invs.length === 1 ? '' : 's'} attached. Their invoices will remain in your records but will no longer link to a client.`
              : `This client has no invoices. They'll be removed permanently.`}
            onClose={() => setConfirmDelete(null)}
            footer={<>
              <button className="btn ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn danger" onClick={() => { store.deleteClient(confirmDelete.id); setConfirmDelete(null); }}>
                <Icon name="trash" size={13} /> Delete client
              </button>
            </>} />
        );
      })()}
    </div>
  );
}

function ClientFormModal({ client, onClose, onSave }){
  const [name, setName]   = React.useState(client?.name || '');
  const [email, setEmail] = React.useState(client?.email || '');
  const [addr, setAddr]   = React.useState(client?.addr || '');
  const isEdit = !!client;
  const canSave = name.trim().length > 0;

  return (
    <Modal
      title={isEdit ? `Edit ${client.name}` : 'Add a new client'}
      desc={isEdit ? 'Update the client’s contact details.' : 'Just a name is required — you can fill in the rest later.'}
      onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn violet" disabled={!canSave} onClick={() => onSave({ name, email, addr })}>
          {isEdit ? 'Save changes' : 'Add client'}
        </button>
      </>}>
      <div className="field">
        <label>Company name *</label>
        <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Co." />
      </div>
      <div className="field">
        <label>Billing email</label>
        <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="billing@acme.io" />
      </div>
      <div className="field">
        <label>Address</label>
        <textarea className="input" rows="2" value={addr} onChange={e => setAddr(e.target.value)} placeholder="350 Mission St, San Francisco CA" />
      </div>
    </Modal>
  );
}

function SettingsScreen(){
  const store = useStore();
  const b = store.state.business;
  const [form, setForm] = React.useState({
    name:  b.name  || '',
    email: b.email || '',
    addr:  b.addr  || '',
    phone: b.phone || '',
    logo:  b.logo  || '',
  });
  const fileRef = React.useRef(null);

  React.useEffect(() => {
    setForm({ name:b.name||'', email:b.email||'', addr:b.addr||'', phone:b.phone||'', logo:b.logo||'' });
  }, [b.name, b.email, b.addr, b.phone, b.logo]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith('image/')){ store.toast('Please pick an image file', 'warn'); return; }
    if(file.size > 1.5 * 1024 * 1024){ store.toast('Image too large (max 1.5 MB)', 'warn'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { set('logo', ev.target.result); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1>Settings</h1>
          <div className="sub">Business details + demo data</div>
        </div>
      </div>
      <div className="grid" style={{gridTemplateColumns:'1.4fr 1fr'}}>
        <div className="card">
          <h3 style={{marginBottom:14}}>Business info</h3>

          <div className="field" style={{marginBottom:14}}>
            <label>Company logo</label>
            <div className="row" style={{gap:14,alignItems:'flex-start'}}>
              <div style={{
                width:88, height:88,
                border:'1px dashed var(--charcoal-grey)',
                background:'var(--pitch-black)',
                borderRadius:'var(--r-md)',
                display:'grid', placeItems:'center',
                overflow:'hidden', flexShrink:0,
              }}>
                {form.logo ? (
                  <img src={form.logo} alt="Logo preview" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} />
                ) : (
                  <span className="tiny muted" style={{textAlign:'center',padding:'0 6px'}}>No logo</span>
                )}
              </div>
              <div className="stack-sm flex-1" style={{minWidth:0}}>
                <div className="muted small">PNG, JPG or SVG · max 1.5 MB · transparent backgrounds look best.</div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={onPickFile} />
                <div className="row tight">
                  <button className="btn sm" onClick={() => fileRef.current?.click()}>
                    <Icon name="download" size={12} /> {form.logo ? 'Replace logo' : 'Upload logo'}
                  </button>
                  {form.logo && (
                    <button className="btn sm ghost" style={{color:'var(--warn)'}} onClick={() => set('logo','')}>
                      <Icon name="trash" size={12} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{gap:14}}>
            <div className="field"><label>Name</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="field"><label>Email</label>
              <input className="input" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}><label>Address</label>
              <input className="input" value={form.addr} onChange={e => set('addr', e.target.value)} />
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}><label>Phone</label>
              <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="row" style={{marginTop:14,justifyContent:'flex-end'}}>
            <button className="btn primary" onClick={() => store.updateBusiness(form)}>Save changes</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{marginBottom:10}}>Demo data</h3>
          <div className="muted small" style={{marginBottom:14}}>
            All your changes are saved to your browser's local storage. Reset to start fresh with the original sample data.
          </div>
          <button className="btn danger" onClick={() => store.resetData()}>
            <Icon name="trash" size={13} /> Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}

export { App, Shell };
