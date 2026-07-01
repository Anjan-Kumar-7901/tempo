import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { Icon } from '../components/Icons'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatDate, periodDuration } from '../utils/cycleCalculations'
export default function History() {
  const { logs, deleteLog } = useAppStore(), [target, setTarget] = useState(null)
  return <section className="page"><PageHeader title="History" subtitle={`${logs.length} logged ${logs.length === 1 ? 'period' : 'periods'}`} back/><div className="history-list">{logs.length ? logs.map((log) => <article className="card history-item" key={log.id}><div><p className="eyebrow">{periodDuration(log)} day period</p><h3>{formatDate(log.startDate)} — {formatDate(log.endDate)}</h3><p>{[log.flow && `${log.flow} flow`, log.painLevel !== null && `Pain ${log.painLevel}/10`, log.mood].filter(Boolean).join(' · ') || 'No details added'}</p>{(log.symptoms || []).length > 0 && <div className="chip-list compact">{log.symptoms.map((item) => <span className="chip" key={item}>{item}</span>)}</div>}{log.notes && <blockquote>{log.notes}</blockquote>}</div><div className="item-actions"><Link className="icon-btn" to={`/log/${log.id}`} aria-label="Edit"><Icon name="edit"/></Link><button className="icon-btn danger-text" onClick={() => setTarget(log)} aria-label="Delete"><Icon name="trash"/></button></div></article>) : <div className="empty"><h2>No history yet</h2><p>Your period logs will appear here.</p><Link className="button primary" to="/log">Log a period</Link></div>}</div><Modal open={Boolean(target)} title="Delete this period?" onClose={() => setTarget(null)}><p>This log will be permanently removed.</p><div className="modal-actions"><button className="button secondary" onClick={() => setTarget(null)}>Cancel</button><button className="button danger" onClick={async () => { await deleteLog(target.id); setTarget(null) }}>Delete</button></div></Modal></section>
}
