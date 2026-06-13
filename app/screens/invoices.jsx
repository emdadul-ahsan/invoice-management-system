import React from 'react'
import { useStore, fmtMoney, fmtDate, fmtDateShort, daysBetween } from '../store'
import { Icon, StatusPill, Modal } from '../ui'

/* ============================================
   INVOICES LIST
   ============================================ */
function InvoicesScreen({ onNav, search }){
  const store = useStore();
  const { state, getClient, invoiceTotal } = store;
  const [filter, setFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('date');
  const [menuFor, setMenuFor] = React.useState(null);          // invoice id whose menu is open
  const [confirmDelete, setConfirmDelete] = React.useState(null); // invoice obj

  // close any open row-menu on outside click / escape
  React.useEffect(() => {
    if(!menuFor) return;
    const onDoc = (e) => {
      if(!e.target.closest('[data-row-menu]')) setMenuFor(null);
    };
    const onKey = (e) => { if(e.key === 'Escape') setMenuFor(null); };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuFor]);

  const filtered = React.useMemo(() => {
    let list = state.invoices.slice();
    if(filter !== 'all') list = list.filter(i => i.status === filter);
    if(search){
      const q = search.toLowerCase();
      list = list.filter(i => {
        const c = getClient(i.clientId);
        return i.number.toLowerCase().includes(q) ||
               (c?.name || '').toLowerCase().includes(q) ||
               (i.project || '').toLowerCase().includes(q);
      });
    }
    list.sort((a,b) => {
      if(sortBy === 'amount') return invoiceTotal(b) - invoiceTotal(a);
      if(sortBy === 'due')    return a.due.localeCompare(b.due);
      return b.issued.localeCompare(a.issued); // default: newest
    });
    return list;
  }, [state.invoices, filter, search, sortBy]);

  const counts = React.useMemo(() => {
    const c = { all: state.invoices.length, draft:0, pending:0, paid:0, overdue:0 };
    state.invoices.forEach(i => { c[i.status] = (c[i.status]||0) + 1; });
    return c;
  }, [state.invoices]);

  const tabs = [
    { id:'all',     label:'All' },
    { id:'draft',   label:'Drafts' },
    { id:'pending', label:'Pending' },
    { id:'overdue', label:'Overdue' },
    { id:'paid',    label:'Paid' },
  ];

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1>Invoices</h1>
          <div className="sub">{counts.all} total · {fmtMoney(state.invoices.filter(i=>i.status==='pending'||i.status==='overdue').reduce((s,i)=>s+invoiceTotal(i),0))} outstanding</div>
        </div>
        <div className="actions">
          <button className="btn violet" onClick={() => onNav('editor', { id:null })}>
            <Icon name="plus" size={14} /> New invoice
          </button>
        </div>
      </div>

      <div className="row" style={{marginBottom:14,gap:6,flexWrap:'wrap'}}>
        {tabs.map(t => (
          <button key={t.id}
            className={`chip ${filter === t.id ? 'active' : ''}`}
            onClick={() => setFilter(t.id)}>
            {t.label}
            <span className={`tiny ${filter === t.id ? '' : 'muted'}`} style={{
              padding:'1px 6px',borderRadius:54,
              background: filter === t.id ? 'rgba(255,255,255,.18)' : 'var(--paper-3)',
            }}>{counts[t.id] || 0}</span>
          </button>
        ))}
        <div style={{flex:1}}></div>
        <select className="input" style={{width:'auto',padding:'5px 10px',fontSize:12}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Newest</option>
          <option value="due">Sort: Due date</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      <div className="card flush">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="ico">📭</div>
            <h4>No invoices match</h4>
            <div className="muted small">Try a different filter or clear the search.</div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{width:'9%'}}>#</th>
                <th>Client / Project</th>
                <th style={{width:'14%'}}>Issued</th>
                <th style={{width:'14%'}}>Due</th>
                <th style={{width:'14%',textAlign:'right'}}>Amount</th>
                <th style={{width:'12%'}}>Status</th>
                <th style={{width:'52px'}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const c = getClient(inv.clientId);
                const today = new Date().toISOString().slice(0,10);
                const overdueDays = inv.status === 'overdue' ? Math.abs(daysBetween(today, inv.due)) : null;
                return (
                  <tr key={inv.id} onClick={() => onNav('invoice-detail', { id: inv.id })}>
                    <td><span className="mono small muted">{inv.number}</span></td>
                    <td><ClientCell client={c} sub={inv.project} /></td>
                    <td className="muted small">{fmtDateShort(inv.issued)}</td>
                    <td className="small" style={{color: inv.status === 'overdue' ? 'var(--warn)' : 'var(--ink-3)'}}>
                      {fmtDateShort(inv.due)}{overdueDays != null && <div className="tiny">{overdueDays}d ago</div>}
                    </td>
                    <td className="num"><strong>{fmtMoney(invoiceTotal(inv))}</strong></td>
                    <td><StatusPill status={inv.status} /></td>
                    <td onClick={e => e.stopPropagation()} style={{position:'relative'}}>
                      <button className="icon-btn"
                              data-row-menu
                              onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === inv.id ? null : inv.id); }}
                              title="Actions">
                        <Icon name="more" size={15} />
                      </button>
                      {menuFor === inv.id && (
                        <div data-row-menu className="row-menu">
                          <button className="row-menu-item" onClick={() => { setMenuFor(null); onNav('invoice-detail', { id: inv.id }); }}>
                            <Icon name="eye" size={14} /> View
                          </button>
                          <button className="row-menu-item" onClick={() => { setMenuFor(null); onNav('editor', { id: inv.id }); }}>
                            <Icon name="edit" size={14} /> Edit
                          </button>
                          <button className="row-menu-item" onClick={() => { setMenuFor(null); downloadInvoice(inv, getClient(inv.clientId), state.business, invoiceTotal); }}>
                            <Icon name="download" size={14} /> Download PDF
                          </button>
                          <div className="row-menu-sep"></div>
                          <button className="row-menu-item danger" onClick={() => { setMenuFor(null); setConfirmDelete(inv); }}>
                            <Icon name="trash" size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {confirmDelete && (
        <Modal
          title={`Delete ${confirmDelete.number}?`}
          desc={`This can't be undone. Drafts can be safely deleted; for sent invoices consider archiving.`}
          onClose={() => setConfirmDelete(null)}
          footer={<>
            <button className="btn ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn danger" onClick={() => { store.deleteInvoice(confirmDelete.id); setConfirmDelete(null); }}>
              <Icon name="trash" size={13} /> Delete invoice
            </button>
          </>} />
      )}
    </div>
  );
}

export default InvoicesScreen;
