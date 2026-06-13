import React from 'react'
import { useStore, fmtMoney, fmtDate, daysBetween } from '../store'
import { Icon, StatusPill, Modal, downloadInvoice } from '../ui'

/* ============================================
   INVOICE DETAIL — view, mark paid, PAID stamp
   ============================================ */
function InvoiceDetailScreen({ id, onNav }){
  const store = useStore();
  const { state, getClient, invoiceTotal } = store;
  const inv = state.invoices.find(i => i.id === id);
  const [confirmPaid, setConfirmPaid] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if(!inv){
    return (
      <div className="view">
        <div className="empty">
          <h4>Invoice not found</h4>
          <button className="btn" onClick={() => onNav('invoices')}>← Back to invoices</button>
        </div>
      </div>
    );
  }

  const client = getClient(inv.clientId);
  const total  = invoiceTotal(inv);
  const business = state.business;
  const today = new Date().toISOString().slice(0,10);
  const overdueDays = inv.status === 'overdue' ? Math.abs(daysBetween(today, inv.due)) : null;

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <button className="btn ghost sm" onClick={() => onNav('invoices')} style={{marginBottom:6}}>
            <Icon name="back" size={13} /> Invoices
          </button>
          <h1 style={{display:'flex',alignItems:'center',gap:12}}>
            {inv.number}
            <StatusPill status={inv.status} />
          </h1>
          <div className="sub">{client?.name} · {inv.project}</div>
        </div>
        <div className="actions">
          <button className="btn ghost sm" onClick={() => downloadInvoice(inv, client, business, invoiceTotal)}>
            <Icon name="download" size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* status banner */}
      {inv.status === 'paid' && (
        <div className="banner ok">
          <div className="ico">✓</div>
          <div>
            <div className="title">Paid in full</div>
            <div className="body">{fmtMoney(total)} received on {fmtDate(inv.paidOn)} · {inv.method || 'manual'}{inv.ref ? ` · ref ${inv.ref}` : ''}</div>
          </div>
        </div>
      )}
      {inv.status === 'overdue' && (
        <div className="banner warn">
          <div className="ico">!</div>
          <div>
            <div className="title">Overdue by {overdueDays} days</div>
            <div className="body">Was due {fmtDate(inv.due)} · client opened on {fmtDate(inv.activity?.find(a => a.type === 'opened')?.when)}</div>
          </div>
        </div>
      )}

      <div className="grid" style={{gridTemplateColumns:'1.7fr 1fr'}}>
        {/* invoice paper */}
        <div>
          <div className="inv-paper">
            {inv.status === 'paid' && (
              <div className="paid-stamp" key={inv.paidOn}>
                PAID
                <small>{fmtDate(inv.paidOn).toUpperCase()}</small>
              </div>
            )}
            {inv.status === 'overdue' && (
              <div className="overdue-stamp">OVERDUE</div>
            )}

            <div className="inv-h">
              <div>
                <div className="inv-title">Invoice</div>
                <div className="inv-num">{inv.number}</div>
              </div>
              <div className="inv-from">
                {business.logo && (
                  <img src={business.logo} alt="" style={{maxHeight:56,maxWidth:180,objectFit:'contain',marginBottom:10,marginLeft:'auto',display:'block'}} />
                )}
                <div className="biz">{business.name}</div>
                <div className="ln">{business.email}</div>
                <div className="ln">{business.addr}</div>
                <div className="ln">{business.phone}</div>
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
                <div className="meta-val">{fmtDate(inv.issued)}</div>
                <div className="meta-lbl" style={{marginTop:12}}>Due</div>
                <div className="meta-val">{fmtDate(inv.due)}</div>
              </div>
              <div>
                <div className="meta-lbl">Total due</div>
                <div className="meta-val h-display" style={{fontSize:22}}>{fmtMoney(total)}</div>
                {inv.status === 'paid' && (
                  <>
                    <div className="meta-lbl" style={{marginTop:12,color:'var(--ok)'}}>Paid</div>
                    <div className="meta-val" style={{color:'var(--ok)'}}>{fmtDate(inv.paidOn)}</div>
                  </>
                )}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{width:'70px',textAlign:'right'}}>Qty</th>
                  <th style={{width:'110px',textAlign:'right'}}>Rate</th>
                  <th style={{width:'130px',textAlign:'right'}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.desc}</strong></td>
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
                <div className="totals-row"><span className="muted">Tax (0%)</span><span className="num">{fmtMoney(0)}</span></div>
                <div className="totals-row total"><span>Total</span><span className="num">{fmtMoney(total)}</span></div>
                {inv.status === 'paid' && (
                  <>
                    <div className="totals-row paid"><span className="semibold">Paid</span><span className="num">−{fmtMoney(total)}</span></div>
                    <div className="totals-row" style={{borderTop:'1px solid var(--line)',paddingTop:8,marginTop:4}}>
                      <strong>Balance</strong><span className="num">{fmtMoney(0)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {inv.notes && (
              <div className="footer-note">
                <strong>Notes</strong><br />
                {inv.notes}
              </div>
            )}
          </div>
        </div>

        {/* sidebar: activity, attached info */}
        <div className="stack-md">
          <div className="card flush">
            <div className="card-head">
              <h3>Timeline</h3>
              <span className="muted small">{inv.activity?.length || 0} events</span>
            </div>
            <div className="card-body">
              <div className="timeline">
                {[...(inv.activity || [])].reverse().map(a => (
                  <div key={a.id} className="tl-item">
                    <span className={`tl-dot ${a.type === 'paid' ? 'paid' : a.type === 'sent' ? 'sent' : a.type === 'reminder' ? 'violet' : a.type === 'opened' ? 'sent' : 'created'}`}></span>
                    <div className="tl-body">
                      <div className="what">{a.note}</div>
                      <div className="when">{fmtDate(a.when)} · <span style={{textTransform:'capitalize'}}>{a.type}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card flush">
            <div className="card-head"><h3>Client</h3></div>
            <div className="card-body">
              <div>
                <div className="semibold">{client?.name}</div>
                <div className="muted small">{client?.email}</div>
              </div>
              <div className="divider"></div>
              <div className="muted small">Lifetime billed</div>
              <div className="h-display" style={{fontSize:20}}>{fmtMoney(store.invoicesByClient(client?.id).reduce((s,i) => s + invoiceTotal(i), 0))}</div>
              <div className="muted small">{store.invoicesByClient(client?.id).length} invoices</div>
            </div>
          </div>
        </div>
      </div>

      {confirmPaid && (
        <Modal
          title="Mark this invoice as paid?"
          desc={`This will record ${fmtMoney(total)} as received and notify the client.`}
          onClose={() => setConfirmPaid(false)}
          footer={<>
            <button className="btn ghost" onClick={() => setConfirmPaid(false)}>Cancel</button>
            <button className="btn ok" onClick={() => { store.markPaid(inv.id); setConfirmPaid(false); }}>
              <Icon name="check" size={13} /> Mark paid
            </button>
          </>}>
          <div className="field">
            <label>Method</label>
            <select className="input" defaultValue="Stripe">
              <option>Stripe</option>
              <option>Wire transfer</option>
              <option>Cash</option>
              <option>Check</option>
              <option>Other</option>
            </select>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          title="Delete this invoice?"
          desc="This can't be undone. Drafts can be safely deleted, but for sent invoices consider archiving instead."
          onClose={() => setConfirmDelete(false)}
          footer={<>
            <button className="btn ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button className="btn danger" onClick={() => { store.deleteInvoice(inv.id); setConfirmDelete(false); onNav('invoices'); }}>
              <Icon name="trash" size={13} /> Delete
            </button>
          </>} />
      )}
    </div>
  );
}

export default InvoiceDetailScreen;
