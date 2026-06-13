import React from 'react'
import { useStore, fmtMoney, fmtDate, fmtDateShort, daysAgo, daysBetween } from '../store'
import { Icon } from '../ui'

/* ============================================
   DASHBOARD
   ============================================ */
function DashboardScreen({ onNav }){
  const store = useStore();
  const { state, getClient, invoiceTotal } = store;

  const today = new Date().toISOString().slice(0,10);
  const totals = React.useMemo(() => {
    const pending  = state.invoices.filter(i => i.status === 'pending').reduce((s,i) => s + invoiceTotal(i), 0);
    const overdue  = state.invoices.filter(i => i.status === 'overdue').reduce((s,i) => s + invoiceTotal(i), 0);
    const paidMo   = state.invoices.filter(i => i.status === 'paid' && i.paidOn && i.paidOn >= daysAgo(30)).reduce((s,i) => s + invoiceTotal(i), 0);
    const earned   = state.invoices.filter(i => i.status === 'paid').reduce((s,i) => s + invoiceTotal(i), 0);
    return { pending, overdue, paidMo, earned };
  }, [state.invoices]);

  const upcoming = React.useMemo(() =>
    [...state.invoices]
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .sort((a,b) => a.due.localeCompare(b.due))
      .slice(0,4)
  , [state.invoices]);

  const recent = React.useMemo(() => {
    return [...state.invoices]
      .flatMap(i => (i.activity || []).slice(-1).map(a => ({ ...a, invoice: i })))
      .sort((a,b) => b.when.localeCompare(a.when))
      .slice(0, 5);
  }, [state.invoices]);

  // 6-month mini chart
  const chart = React.useMemo(() => {
    const months = [];
    for(let m=5; m>=0; m--){
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - m);
      const key = d.toISOString().slice(0,7);
      const label = d.toLocaleDateString('en-US',{month:'short'});
      months.push({ key, label, total: 0 });
    }
    state.invoices.forEach(i => {
      if(i.status === 'paid' && i.paidOn){
        const k = i.paidOn.slice(0,7);
        const slot = months.find(m => m.key === k);
        if(slot) slot.total += invoiceTotal(i);
      }
    });
    const max = Math.max(1, ...months.map(m => m.total));
    return { months, max };
  }, [state.invoices]);

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1>Good morning, Jane</h1>
          <div className="sub">Here's where your money is today · {fmtDate(today)}</div>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => onNav('invoices')}>View all invoices</button>
          <button className="btn violet" onClick={() => onNav('editor', { id:null })}>
            <Icon name="plus" size={14} /> New invoice
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{marginBottom:18}}>
        <div className="kpi">
          <div className="label">Total earned</div>
          <div className="value">{fmtMoney(totals.earned)}</div>
          <div className="trend"><span className="up">↑ 12.4%</span> vs last quarter</div>
        </div>
        <div className="kpi">
          <div className="label">Awaiting payment</div>
          <div className="value">{fmtMoney(totals.pending)}</div>
          <div className="trend">{(() => { const n = state.invoices.filter(i => i.status==='pending').length; return `${n} invoice${n === 1 ? '' : 's'} in-flight`; })()}</div>
        </div>
        <div className="kpi">
          <div className="label">Paid this month</div>
          <div className="value">{fmtMoney(totals.paidMo)}</div>
          <div className="trend">{(() => { const n = state.invoices.filter(i => i.status==='paid' && i.paidOn && i.paidOn>=daysAgo(30)).length; return `${n} payment${n === 1 ? '' : 's'} cleared`; })()}</div>
        </div>
        <div className="kpi">
          <div className="label">Overdue</div>
          <div className="value" style={{color: totals.overdue > 0 ? 'var(--warn)' : 'inherit'}}>{fmtMoney(totals.overdue)}</div>
          <div className="trend">{(() => { const n = state.invoices.filter(i => i.status==='overdue').length; return n === 0 ? 'all clear' : `${n} need${n === 1 ? 's' : ''} a nudge`; })()}</div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1.4fr 1fr', marginBottom:18}}>
        <div className="card flush">
          <div className="card-head">
            <div>
              <h3>Cashflow · last 6 months</h3>
              <div className="card-sub">Payments received, in USD</div>
            </div>
            <div className="row tight">
              <span className="pill paid no-dot" style={{background:'transparent',color:'var(--ink-3)'}}>
                <span style={{display:'inline-block',width:8,height:8,background:'var(--violet-600)',borderRadius:2,marginRight:4}}></span>
                Paid
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="bars">
              {chart.months.map((m,i) => {
                const isNow = i === chart.months.length - 1;
                const h = (m.total / chart.max) * 100;
                return (
                  <i key={m.key} className={isNow ? 'now' : ''} style={{height: `${Math.max(6, h)}%`}} title={`${m.label} · ${fmtMoney(m.total)}`}>
                    {m.total > 0 && <b>{fmtMoney(m.total).replace('.00','')}</b>}
                  </i>
                );
              })}
            </div>
            <div className="row" style={{marginTop:8,justifyContent:'space-between'}}>
              {chart.months.map(m => <span key={m.key} className="tiny muted" style={{flex:1,textAlign:'center'}}>{m.label}</span>)}
            </div>
          </div>
        </div>

        <div className="card flush">
          <div className="card-head">
            <h3>Upcoming payments</h3>
            <button className="btn ghost sm" onClick={() => onNav('invoices')}>View all</button>
          </div>
          <div className="card-body" style={{paddingTop:6}}>
            {upcoming.length === 0 ? (
              <div className="empty" style={{padding:24}}>
                <div className="ico">✓</div>
                <h4>All clear</h4>
                <div className="muted small">No payments expected this period.</div>
              </div>
            ) : (
              <div className="stack-md">
                {upcoming.map(inv => {
                  const c = getClient(inv.clientId);
                  const overdueDays = inv.status === 'overdue' ? Math.abs(daysBetween(today, inv.due)) : null;
                  return (
                    <div key={inv.id} className="row" style={{padding:'10px 0',borderBottom:'1px solid var(--line-2)',cursor:'pointer'}}
                         onClick={() => onNav('invoice-detail', { id: inv.id })}>
                      <div className="flex-1">
                        <div className="semibold">{c?.name}</div>
                        <div className="muted small truncate">{inv.number} · {inv.project}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="mono semibold">{fmtMoney(invoiceTotal(inv))}</div>
                        <div className="tiny" style={{color: inv.status==='overdue' ? 'var(--warn)' : 'var(--ink-3)'}}>
                          {inv.status === 'overdue' ? `${overdueDays}d overdue` : `due ${fmtDateShort(inv.due)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr'}}>
        <div className="card flush">
          <div className="card-head">
            <h3>Recent activity</h3>
            <button className="btn ghost sm">All activity</button>
          </div>
          <div className="card-body">
            <div className="timeline">
              {recent.map((a) => (
                <div key={a.id + a.invoice.id} className="tl-item">
                  <span className={`tl-dot ${a.type === 'paid' ? 'paid' : a.type === 'sent' ? 'sent' : a.type === 'reminder' ? 'violet' : 'created'}`}></span>
                  <div className="tl-body flex-1">
                    <div className="what">
                      {a.note} ·{' '}
                      <button className="btn ghost sm" style={{padding:'0 4px',color:'var(--violet-700)'}}
                              onClick={() => onNav('invoice-detail', { id: a.invoice.id })}>
                        {a.invoice.number}
                      </button>
                    </div>
                    <div className="when">{fmtDate(a.when)} · {getClient(a.invoice.clientId)?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
