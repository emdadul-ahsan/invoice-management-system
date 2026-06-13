import React from 'react'
import { useStore, fmtMoney, fmtDate } from '../store'
import { Icon, Modal } from '../ui'

/* ============================================
   PROJECTS — list + milestone detail
   ============================================ */
function ProjectsScreen({ onNav }){
  const store = useStore();
  const { state, getClient, projectProgress, projectAmounts } = store;

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <h1>Projects</h1>
          <div className="sub">Milestone-based engagements · invoice when each chunk is complete</div>
        </div>
        <div className="actions">
          <button className="btn violet"><Icon name="plus" size={14} /> New project</button>
        </div>
      </div>

      <div className="grid grid-3">
        {state.projects.map(p => {
          const c = getClient(p.clientId);
          const prog = projectProgress(p);
          const amt = projectAmounts(p);
          return (
            <div key={p.id} className="card" style={{cursor:'pointer'}} onClick={() => onNav('project-detail', { id: p.id })}>
              <div className="row" style={{marginBottom:14}}>
                <ClientAvatar client={c} size={36} />
                <div className="flex-1" style={{minWidth:0}}>
                  <h3 className="truncate" style={{margin:0}}>{p.name}</h3>
                  <div className="muted small truncate">{c?.name}</div>
                </div>
              </div>
              <div className="row between" style={{marginBottom:6}}>
                <span className="muted small">Progress</span>
                <span className="semibold small">{prog.done}/{prog.total} milestones</span>
              </div>
              <div className="progress" style={{marginBottom:14}}><div className="bar" style={{width: `${prog.pct}%`}}></div></div>
              <div className="row between">
                <div>
                  <div className="muted tiny">Paid</div>
                  <div className="mono semibold" style={{color:'var(--ok)'}}>{fmtMoney(amt.paid)}</div>
                </div>
                <div>
                  <div className="muted tiny">Remaining</div>
                  <div className="mono semibold" style={{color:'var(--violet-700)'}}>{fmtMoney(amt.remaining)}</div>
                </div>
                <div>
                  <div className="muted tiny">Total</div>
                  <div className="mono semibold">{fmtMoney(amt.total)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetailScreen({ id, onNav }){
  const store = useStore();
  const { state, getClient, projectProgress, projectAmounts } = store;
  const project = state.projects.find(p => p.id === id);

  if(!project) return (
    <div className="view"><div className="empty"><h4>Project not found</h4><button className="btn" onClick={() => onNav('projects')}>← Back</button></div></div>
  );

  const client = getClient(project.clientId);
  const prog = projectProgress(project);
  const amt = projectAmounts(project);

  return (
    <div className="view">
      <div className="view-head">
        <div>
          <button className="btn ghost sm" onClick={() => onNav('projects')} style={{marginBottom:6}}>
            <Icon name="back" size={13} /> Projects
          </button>
          <h1 style={{display:'flex',alignItems:'center',gap:12}}>{project.name}</h1>
          <div className="sub row" style={{gap:8}}>
            <ClientAvatar client={client} size={20} />
            <span>{client?.name}</span>
            <span className="fade">·</span>
            <span>{prog.done}/{prog.total} milestones</span>
            <span className="fade">·</span>
            <span>{fmtMoney(amt.total)} total</span>
          </div>
        </div>
        <div className="actions">
          <button className="btn ghost">Message client</button>
          <button className="btn"><Icon name="edit" size={13} /> Edit project</button>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1.6fr 1fr',alignItems:'flex-start'}}>
        <div className="stack-md">
          {/* progress card */}
          <div className="card">
            <div className="row between" style={{marginBottom:10}}>
              <div>
                <div className="muted small">Project progress</div>
                <div className="h-display" style={{fontSize:28}}>{prog.pct}% complete</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="muted small">Earned so far</div>
                <div className="h-display" style={{fontSize:24,color:'var(--ok)'}}>{fmtMoney(amt.paid)}</div>
              </div>
            </div>
            <div className="progress ok" style={{height:10}}><div className="bar" style={{width: `${prog.pct}%`}}></div></div>
            <div className="row between" style={{marginTop:6}}>
              <span className="tiny muted">{fmtMoney(amt.paid)} earned</span>
              <span className="tiny muted">{fmtMoney(amt.remaining)} to go</span>
            </div>
          </div>

          {/* milestones */}
          <div className="card flush">
            <div className="card-head">
              <h3>Milestones</h3>
              <button className="btn ghost sm"><Icon name="plus" size={12} /> Add milestone</button>
            </div>
            <div className="card-body stack-sm">
              {project.milestones.map((m, idx) => (
                <MilestoneRow key={m.id} project={project} milestone={m} idx={idx} onNav={onNav} />
              ))}
            </div>
          </div>
        </div>

        <div className="stack-md">
          <div className="card">
            <h3 style={{marginBottom:14}}>Summary</h3>
            <div className="row between"><span className="muted small">Total contract</span><span className="mono semibold">{fmtMoney(amt.total)}</span></div>
            <div className="row between"><span className="muted small">Paid</span><span className="mono" style={{color:'var(--ok)'}}>{fmtMoney(amt.paid)}</span></div>
            <div className="row between"><span className="muted small">Remaining</span><span className="mono" style={{color:'var(--violet-700)'}}>{fmtMoney(amt.remaining)}</span></div>
            <div className="divider"></div>
            <div className="row between"><span className="muted small">Client</span><span className="semibold">{client?.name}</span></div>
            <div className="row between"><span className="muted small">Milestones</span><span className="semibold">{prog.done} of {prog.total}</span></div>
          </div>

          <div className="card flush">
            <div className="card-head"><h3>Linked invoices</h3></div>
            <div className="card-body stack-sm">
              {project.milestones.filter(m => m.invoiceId).length === 0 && (
                <div className="muted small">No invoices generated yet.<br/>Click "Send invoice" on a completed milestone.</div>
              )}
              {project.milestones.filter(m => m.invoiceId).map(m => {
                const inv = state.invoices.find(i => i.id === m.invoiceId);
                if(!inv) return null;
                return (
                  <div key={m.id} className="row" style={{cursor:'pointer'}} onClick={() => onNav('invoice-detail', { id: inv.id })}>
                    <Icon name="invoice" size={15} />
                    <div className="flex-1">
                      <div className="semibold small">{inv.number}</div>
                      <div className="tiny muted">{m.title}</div>
                    </div>
                    <StatusPill status={inv.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneRow({ project, milestone, idx, onNav }){
  const store = useStore();
  const m = milestone;
  const linked = m.invoiceId ? store.state.invoices.find(i => i.id === m.invoiceId) : null;
  const isDone = m.status === 'done';

  return (
    <div className={`milestone ${isDone ? 'done' : ''}`}>
      <button className="check" aria-label="Toggle complete" onClick={() => store.toggleMilestone(project.id, m.id)}>
        {isDone && <Icon name="check" size={14} />}
      </button>
      <div className="flex-1" style={{minWidth:0}}>
        <div className="ms-title">M{idx + 1} · {m.title}</div>
        <div className="ms-sub">
          {isDone ? `Completed · due ${fmtDateShort(m.due)}` : `Due ${fmtDateShort(m.due)}`}
          {linked && <> · <button className="btn ghost sm" style={{padding:'0 4px',color:'var(--violet-700)'}} onClick={() => onNav('invoice-detail', { id: linked.id })}>{linked.number}</button></>}
        </div>
      </div>
      <span className="ms-amt">{fmtMoney(m.amount)}</span>
      {!linked && isDone && (
        <button className="btn sm violet" onClick={() => store.invoiceMilestone(project.id, m.id)}>
          <Icon name="send" size={11} /> Send invoice
        </button>
      )}
      {linked && <StatusPill status={linked.status} />}
      {!isDone && !linked && (
        <button className="btn sm ghost" onClick={() => store.toggleMilestone(project.id, m.id)}>Mark done</button>
      )}
    </div>
  );
}

export { ProjectsScreen, ProjectDetailScreen };
export default ProjectsScreen;
