import React from 'react'

/* ============================================
   UI primitives — icons, sidebar, topbar, modal, shared bits
   ============================================ */

/* ---- inline SVG icons ---- */
const Icon = ({ name, size=18, stroke=1.6 }) => {
  const s = { width:size, height:size, fill:'none', stroke:'currentColor', strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round' };
  const paths = {
    dashboard:    <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    invoice:      <><path d="M6 3h9l3 3v15a0 0 0 0 1 0 0H6z"/><path d="M9 9h6M9 13h6M9 17h4"/></>,
    project:      <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 4v5"/></>,
    client:       <><circle cx="12" cy="8" r="3.5"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></>,
    settings:     <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4.7a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.3a7 7 0 0 0-2 1.2l-2.4-.7-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.7a7 7 0 0 0 2 1.2L10 21h4l.5-2.3a7 7 0 0 0 2-1.2l2.4.7 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/></>,
    plus:         <><path d="M12 5v14M5 12h14"/></>,
    search:       <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
    arrow:        <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    chevron:      <><path d="M9 6l6 6-6 6"/></>,
    chevronDown:  <><path d="M6 9l6 6 6-6"/></>,
    back:         <><path d="M19 12H5M11 19l-7-7 7-7"/></>,
    check:        <><path d="M5 12l5 5L20 7"/></>,
    download:     <><path d="M12 4v12M7 11l5 5 5-5M5 20h14"/></>,
    send:         <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></>,
    bell:         <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>,
    trash:        <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></>,
    dollar:       <><path d="M12 3v18M17 7c0-2-2.5-3-5-3s-5 1-5 3.5S9.5 11 12 11.5s5 1.5 5 4-2.5 3.5-5 3.5-5-1-5-3"/></>,
    dot:          <circle cx="12" cy="12" r="3.5"/>,
    sparkle:      <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></>,
    calendar:     <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    filter:       <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    more:         <><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></>,
    close:        <><path d="M6 6l12 12M18 6L6 18"/></>,
    eye:          <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    clock:        <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    edit:         <><path d="M4 20h4l10-10-4-4L4 16zM14 6l4 4"/></>,
    receipt:      <><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" style={s}>{paths[name] || paths.dot}</svg>
  );
};

/* ---- Avatar / client chip ---- */
function ClientAvatar({ client, size=28 }){
  // company name only — no synthetic logos
  return null;
}

function ClientCell({ client, sub }){
  return (
    <div className="client-cell">
      <div style={{minWidth:0}}>
        <div className="semibold truncate">{client?.name || '—'}</div>
        {sub && <div className="muted small truncate">{sub}</div>}
      </div>
    </div>
  );
}

/* ---- Status pill ---- */
function StatusPill({ status }){
  const labels = { paid:'Paid', pending:'Pending', overdue:'Overdue', draft:'Draft', partial:'Partial', sent:'Sent' };
  return <span className={`pill ${status}`}>{labels[status] || status}</span>;
}

/* ---- Sidebar ---- */
function Sidebar({ route, onNav, counts }){
  const items = [
    { id:'dashboard', label:'Dashboard', icon:'dashboard' },
    { id:'invoices',  label:'Invoices',  icon:'invoice', count: counts.invoices },
    { id:'projects',  label:'Projects',  icon:'project', count: counts.projects },
    { id:'clients',   label:'Clients',   icon:'client',  count: counts.clients },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div>
          <div className="brand-name">{/* user's company name */}Jane Doe Studio</div>
          <div className="brand-sub">Invoicing</div>
        </div>
      </div>

      <button className="btn violet" onClick={() => onNav('editor', { id:null })}>
        <Icon name="plus" size={15} /> New invoice
      </button>

      <nav className="nav" aria-label="Primary">
        <div className="nav-section">Workspace</div>
        {items.map(it => (
          <button key={it.id}
            className={`nav-item ${route.name === it.id ? 'active' : ''}`}
            onClick={() => onNav(it.id)}>
            <span className="nav-ico"><Icon name={it.icon} size={17} /></span>
            <span>{it.label}</span>
            {it.count != null && <span className="nav-count">{it.count}</span>}
          </button>
        ))}
        <div className="nav-section">Account</div>
        <button className="nav-item" onClick={() => onNav('settings')}>
          <span className="nav-ico"><Icon name="settings" size={17} /></span>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-foot">
        <div className="user-card">
          <div style={{minWidth:0}}>
            <div className="name">Jane Doe</div>
            <div className="email truncate">hello@janedoe.co</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---- Topbar with breadcrumbs + search ---- */
function Topbar({ crumbs, onSearch, search }){
  return (
    <header className="topbar">
      <div className="crumb">
        {crumbs.map((c,i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {c.onClick ? (
              <button className="btn ghost sm" onClick={c.onClick}>{c.label}</button>
            ) : (
              <span className={i === crumbs.length - 1 ? 'here' : ''}>{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-spacer"></div>
      <div className="search">
        <Icon name="search" size={15} />
        <input
          placeholder="Search invoices, clients, projects…"
          value={search}
          onChange={(e) => onSearch(e.target.value)} />
        <span className="kbd">⌘K</span>
      </div>
      <button className="icon-btn" title="Notifications"><Icon name="bell" size={16} /></button>
    </header>
  );
}

/* ---- Confirm modal ---- */
function Modal({ title, desc, children, onClose, footer }){
  React.useEffect(() => {
    const handler = (e) => { if(e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div className="scrim" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        {(title || desc) && (
          <div className="modal-head">
            {title && <h2>{title}</h2>}
            {desc && <p>{desc}</p>}
          </div>
        )}
        {children && <div className="modal-body">{children}</div>}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ---- Invoice download (print-to-PDF) ---- */
function downloadInvoice(inv, client, business, invoiceTotalFn) {
  const total = invoiceTotalFn(inv);
  const fmt$ = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n || 0);
  const fmtD = (iso) => {
    if (!iso) return '—';
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const logoHtml = business.logo
    ? `<img src="${business.logo}" alt="" style="max-height:56px;max-width:180px;object-fit:contain;display:block;margin-bottom:10px;margin-left:auto;">`
    : '';

  const itemRows = (inv.items || []).map(l => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #ebebeb;font-size:14px;color:#111;">${l.desc || ''}</td>
      <td style="padding:11px 0;border-bottom:1px solid #ebebeb;text-align:right;font-size:14px;color:#555;">${l.qty || 0}</td>
      <td style="padding:11px 0;border-bottom:1px solid #ebebeb;text-align:right;font-size:14px;color:#555;">${fmt$(l.rate)}</td>
      <td style="padding:11px 0;border-bottom:1px solid #ebebeb;text-align:right;font-size:14px;font-weight:600;color:#111;">${fmt$((Number(l.qty) || 0) * (Number(l.rate) || 0))}</td>
    </tr>`).join('');

  const paidBadge = inv.status === 'paid'
    ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-18deg);
        font-size:82px;font-weight:900;letter-spacing:10px;color:rgba(34,160,66,0.13);
        border:8px solid rgba(34,160,66,0.13);border-radius:10px;padding:4px 20px;
        white-space:nowrap;pointer-events:none;">PAID</div>`
    : inv.status === 'overdue'
    ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-18deg);
        font-size:72px;font-weight:900;letter-spacing:8px;color:rgba(220,60,60,0.1);
        border:8px solid rgba(220,60,60,0.1);border-radius:10px;padding:4px 20px;
        white-space:nowrap;pointer-events:none;">OVERDUE</div>`
    : '';

  const paidRow = inv.status === 'paid'
    ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#22a042;font-weight:600;">
        <span>Paid ${fmtD(inv.paidOn)}</span><span>−${fmt$(total)}</span>
       </div>
       <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px solid #e8e8e8;margin-top:4px;font-size:14px;font-weight:700;color:#111;">
        <span>Balance</span><span>${fmt$(0)}</span>
       </div>`
    : '';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Invoice ${inv.number || ''}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:#f2f3f5;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @media print{
    body{background:#fff}
    .toolbar{display:none!important}
    .paper{box-shadow:none!important;border-radius:0!important;padding:48px 56px!important}
  }
  .toolbar{display:flex;align-items:center;gap:10px;padding:16px 40px;background:#fff;border-bottom:1px solid #e4e4e7;position:sticky;top:0;z-index:10}
  .toolbar-num{font-size:14px;font-weight:600;color:#111;letter-spacing:.3px}
  .toolbar-status{display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
  .s-paid{background:#d1fae5;color:#065f46}
  .s-pending{background:#fef3c7;color:#92400e}
  .s-overdue{background:#fee2e2;color:#991b1b}
  .s-draft{background:#f1f5f9;color:#475569}
  .spacer{flex:1}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:7px;border:1px solid #e2e2e5;background:#fff;font-size:13px;font-weight:500;cursor:pointer;color:#111;text-decoration:none}
  .btn-primary{background:#111;color:#fff;border-color:#111}
  .btn-primary:hover{background:#333}
  .page{max-width:860px;margin:36px auto;padding:0 24px 80px}
  .paper{position:relative;background:#fff;border-radius:14px;box-shadow:0 4px 32px rgba(0,0,0,.09),0 1px 4px rgba(0,0,0,.06);padding:64px 72px;overflow:hidden}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:44px}
  .inv-label{font-size:38px;font-weight:200;letter-spacing:-1px;color:#bbb}
  .inv-num{font-size:13px;font-weight:700;color:#111;margin-top:6px;letter-spacing:.8px;text-transform:uppercase}
  .from-block{text-align:right;font-size:13px;line-height:1.75;color:#666}
  .from-block .biz{font-size:16px;font-weight:700;color:#111;margin-bottom:2px}
  .rule{height:1px;background:#e8e8e8;margin:36px 0}
  .meta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;margin-bottom:44px}
  .mlabel{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;margin-bottom:5px}
  .mval{font-size:14px;color:#111;line-height:1.6}
  .mval.lg{font-size:24px;font-weight:700;letter-spacing:-.5px}
  .mval small{display:block;font-size:12px;color:#888;margin-top:1px}
  table{width:100%;border-collapse:collapse;margin-bottom:28px}
  thead th{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#aaa;padding:0 0 10px;border-bottom:2px solid #e8e8e8;text-align:left}
  thead th:not(:first-child){text-align:right}
  .totals-wrap{display:flex;justify-content:flex-end}
  .totals-box{width:300px}
  .trow{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#777}
  .trow.grand{border-top:2px solid #111;margin-top:6px;padding-top:10px;font-size:15px;font-weight:700;color:#111}
  .notes{margin-top:44px;padding-top:28px;border-top:1px solid #e8e8e8}
  .nlabel{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#aaa;margin-bottom:8px}
  .nbody{font-size:13px;color:#555;line-height:1.7}
</style>
</head>
<body>
<div class="toolbar">
  <span class="toolbar-num">${inv.number || 'Invoice'}</span>
  <span class="toolbar-status s-${inv.status || 'draft'}">${inv.status || 'draft'}</span>
  <span class="spacer"></span>
  <button class="btn" onclick="window.close()">✕ Close</button>
  <button class="btn btn-primary" onclick="window.print()">⬇ Save as PDF</button>
</div>
<div class="page">
  <div class="paper">
    ${paidBadge}
    <div class="inv-header">
      <div>
        <div class="inv-label">Invoice</div>
        <div class="inv-num">${inv.number || ''}</div>
      </div>
      <div class="from-block">
        ${logoHtml}
        <div class="biz">${business.name || ''}</div>
        ${business.email ? `<div>${business.email}</div>` : ''}
        ${business.addr  ? `<div>${business.addr}</div>`  : ''}
        ${business.phone ? `<div>${business.phone}</div>` : ''}
      </div>
    </div>
    <div class="rule"></div>
    <div class="meta">
      <div>
        <div class="mlabel">Bill to</div>
        <div class="mval">
          <strong style="font-size:15px;font-weight:700;">${client?.name || '—'}</strong>
          ${client?.email ? `<small>${client.email}</small>` : ''}
          ${client?.addr  ? `<small>${client.addr}</small>`  : ''}
        </div>
      </div>
      <div>
        <div class="mlabel">Issued</div>
        <div class="mval">${fmtD(inv.issued)}</div>
        <div class="mlabel" style="margin-top:18px;">Due</div>
        <div class="mval">${fmtD(inv.due)}</div>
      </div>
      <div>
        <div class="mlabel">Total due</div>
        <div class="mval lg">${fmt$(total)}</div>
        ${inv.status === 'paid' ? `<div class="mlabel" style="margin-top:18px;color:#22a042;">Paid</div><div class="mval" style="color:#22a042;">${fmtD(inv.paidOn)}</div>` : ''}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="width:80px;text-align:right;">Qty</th>
          <th style="width:120px;text-align:right;">Rate</th>
          <th style="width:140px;text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="totals-wrap">
      <div class="totals-box">
        <div class="trow"><span>Subtotal</span><span>${fmt$(total)}</span></div>
        <div class="trow"><span>Tax (0%)</span><span>${fmt$(0)}</span></div>
        <div class="trow grand"><span>Total</span><span>${fmt$(total)}</span></div>
        ${paidRow}
      </div>
    </div>
    ${inv.notes ? `<div class="notes"><div class="nlabel">Notes</div><div class="nbody">${inv.notes}</div></div>` : ''}
  </div>
</div>
<script>window.onload = () => { setTimeout(() => window.print(), 350); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=780');
  if (win) { win.document.write(html); win.document.close(); }
}

export { Icon, ClientAvatar, ClientCell, StatusPill, Sidebar, Topbar, Modal, downloadInvoice };
