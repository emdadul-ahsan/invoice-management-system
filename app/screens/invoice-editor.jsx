import React from 'react'
import { useStore, fmtMoney, fmtDate, daysFromNow } from '../store'
import { Icon, ClientCell, StatusPill, Modal } from '../ui'

/* ============================================
   INVOICE EDITOR — form + live preview
   ============================================ */
function InvoiceEditorScreen({ id, onNav }){
  const store = useStore();
  const { state, getClient, invoiceTotal } = store;
  const existing = id ? state.invoices.find(i => i.id === id) : null;

  const [draft, setDraft] = React.useState(() => existing ? { ...existing, items: existing.items.map(l => ({...l})) } : {
    clientId: state.clients[0]?.id,
    project: '',
    issued: new Date().toISOString().slice(0,10),
    due: daysFromNow(14),
    items: [{ id:'l1', desc:'', qty:1, rate:0 }],
    notes: 'Thank you! Net 14 · pay via Stripe link below.',
    status: 'draft',
  });

  const client = getClient(draft.clientId);
  const total = invoiceTotal(draft);
  const isNew = !existing;
  const previewNumber = existing ? existing.number : `INV-${String(state.nextInvoiceNum).padStart(4,'0')}`;

  const setField = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const updateLine = (lid, patch) => setDraft(d => ({ ...d, items: d.items.map(l => l.id === lid ? { ...l, ...patch } : l) }));
  const addLine = () => setDraft(d => ({ ...d, items: [...d.items, { id:'l-'+Date.now(), desc:'', qty:1, rate:0 }] }));
  const removeLine = (lid) => setDraft(d => ({ ...d, items: d.items.length > 1 ? d.items.filter(l => l.id !== lid) : d.items }));

  const save = (sendAfter=false) => {
    if(isNew){
      const inv = store.createInvoice(draft);
      if(sendAfter){ store.sendInvoice(inv.id); }
      else { store.toast('Draft saved', 'info'); }
      onNav('invoice-detail', { id: inv.id });
    }else{
      store.updateInvoice(existing.id, draft);
      if(sendAfter && existing.status === 'draft'){ store.sendInvoice(existing.id); }
      else { store.toast('Saved', 'info'); }
      onNav('invoice-detail', { id: existing.id });
    }
  };

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <button className="btn ghost sm" onClick={() => onNav(existing ? 'invoice-detail' : 'invoices', { id: existing?.id })} style={{marginBottom:6}}>
            <Icon name="back" size={13} /> {existing ? 'Back' : 'Invoices'}
          </button>
          <h1>{isNew ? 'New invoice' : `Edit ${existing.number}`}</h1>
          <div className="sub">Fill out the form on the left — preview updates as you type.</div>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => onNav('invoices')}>Cancel</button>
          <button className="btn" onClick={() => save(false)}>Save draft</button>
          <button className="btn violet" onClick={() => save(true)}>
            <Icon name="send" size={13} /> Save & send
          </button>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 1.2fr',alignItems:'flex-start'}}>
        {/* FORM */}
        <div className="stack-md">
          <div className="card">
            <h3 style={{marginBottom:14}}>Parties & dates</h3>
            <div className="grid grid-2" style={{gap:14}}>
              <div className="field">
                <label>Bill to</label>
                <select className="input" value={draft.clientId} onChange={e => setField('clientId', e.target.value)}>
                  {state.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Project</label>
                <input type="text" className="input" placeholder="e.g. Website redesign" value={draft.project} onChange={e => setField('project', e.target.value)} />
              </div>
              <div className="field">
                <label>Issued</label>
                <input type="date" className="input" value={draft.issued} onChange={e => setField('issued', e.target.value)} />
              </div>
              <div className="field">
                <label>Due</label>
                <input type="date" className="input" value={draft.due} onChange={e => setField('due', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="row between" style={{marginBottom:10}}>
              <h3 style={{margin:0}}>Line items</h3>
              <span className="muted small">{draft.items.length} item{draft.items.length === 1 ? '' : 's'}</span>
            </div>
            <div className="stack-sm">
              <div className="row" style={{gap:8,padding:'0 0 4px',marginBottom:2}}>
                <label className="flex-1" style={{minWidth:0}}>Description</label>
                <label style={{width:78,textAlign:'right'}}>Qty</label>
                <label style={{width:112,textAlign:'right'}}>Rate</label>
                <label style={{width:112,textAlign:'right'}}>Amount</label>
                <span style={{width:30}}></span>
              </div>
              {draft.items.map((l) => (
                <div key={l.id} className="row" style={{gap:8}}>
                  <input type="text" className="input flex-1" style={{minWidth:0}} placeholder="What did you do?"
                    value={l.desc} onChange={e => updateLine(l.id, { desc: e.target.value })} />
                  <input type="number" min="0" step="1" className="input mono" style={{width:78,textAlign:'right'}} value={l.qty} onChange={e => updateLine(l.id, { qty: e.target.value === '' ? 0 : Number(e.target.value) })} />
                  <input type="number" min="0" step="0.01" className="input mono" style={{width:112,textAlign:'right'}} value={l.rate} onChange={e => updateLine(l.id, { rate: e.target.value === '' ? 0 : Number(e.target.value) })} />
                  <div className="input mono" style={{width:112,background:'var(--paper-2)',textAlign:'right'}}>
                    {fmtMoney((l.qty||0) * (l.rate||0))}
                  </div>
                  <button className="icon-btn" style={{color:'var(--warn)',flexShrink:0}}
                          title="Remove line"
                          onClick={() => removeLine(l.id)}
                          disabled={draft.items.length === 1}>
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button className="btn ghost sm" style={{marginTop:10}} onClick={addLine}>
              <Icon name="plus" size={12} /> Add line item
            </button>

            <div className="divider"></div>
            <div className="row between">
              <div className="muted small">Subtotal</div>
              <div className="mono semibold">{fmtMoney(total)}</div>
            </div>
            <div className="row between">
              <div className="muted small">Tax (0%)</div>
              <div className="mono">{fmtMoney(0)}</div>
            </div>
            <div className="row between" style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--line)'}}>
              <div className="bold">Total</div>
              <div className="h-display" style={{fontSize:22}}>{fmtMoney(total)}</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{marginBottom:10}}>Notes & terms</h3>
            <textarea className="input" rows="3" value={draft.notes} onChange={e => setField('notes', e.target.value)} placeholder="Anything to communicate to the client (payment terms, thank you, etc.)" />
          </div>
        </div>

        {/* PREVIEW */}
        <div style={{position:'sticky',top:78}}>
          <div className="row" style={{marginBottom:8,flexWrap:'nowrap'}}>
            <span className="pill no-dot" style={{background:'var(--violet-50)',color:'var(--violet-700)',whiteSpace:'nowrap'}}>
              <Icon name="eye" size={11} /> Live preview
            </span>
            <span className="muted small mono" style={{whiteSpace:'nowrap'}}>{previewNumber}</span>
          </div>
          <div className="inv-paper" style={{padding:'32px 36px'}}>
            <div className="inv-h">
              <div>
                <div className="inv-title">Invoice</div>
                <div className="inv-num">{previewNumber}</div>
              </div>
              <div className="inv-from">
                {state.business.logo && (
                  <img src={state.business.logo} alt="" style={{maxHeight:48,maxWidth:160,objectFit:'contain',marginBottom:8,marginLeft:'auto',display:'block'}} />
                )}
                <div className="biz">{state.business.name}</div>
                <div className="ln">{state.business.email}</div>
                <div className="ln">{state.business.addr}</div>
              </div>
            </div>
            <div className="inv-rule"></div>
            <div className="inv-meta">
              <div>
                <div className="meta-lbl">Bill to</div>
                <div className="meta-val">{client?.name}<small>{client?.email}</small><small>{client?.addr}</small></div>
              </div>
              <div>
                <div className="meta-lbl">Issued</div>
                <div className="meta-val">{fmtDate(draft.issued)}</div>
              </div>
              <div>
                <div className="meta-lbl">Due</div>
                <div className="meta-val">{fmtDate(draft.due)}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Description</th><th style={{width:'60px',textAlign:'right'}}>Qty</th><th style={{width:'100px',textAlign:'right'}}>Rate</th><th style={{width:'110px',textAlign:'right'}}>Amount</th></tr>
              </thead>
              <tbody>
                {draft.items.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.desc || <span className="fade">—</span>}</strong></td>
                    <td className="num">{l.qty}</td>
                    <td className="num">{fmtMoney(l.rate)}</td>
                    <td className="num"><strong>{fmtMoney((l.qty||0) * (l.rate||0))}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="totals">
              <div className="totals-box">
                <div className="totals-row"><span className="muted">Subtotal</span><span className="num">{fmtMoney(total)}</span></div>
                <div className="totals-row total"><span>Total</span><span className="num">{fmtMoney(total)}</span></div>
              </div>
            </div>
            {draft.notes && <div className="footer-note"><strong>Notes</strong><br />{draft.notes}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceEditorScreen;
