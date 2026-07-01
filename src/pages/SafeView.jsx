import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { useAppStore } from '../store/useAppStore'
import { formatDate, getStats, periodDuration, sortOldest } from '../utils/cycleCalculations'

export default function SafeView() {
  const { logs, settings } = useAppStore()
  const stats = getStats(logs, settings)
  const history = sortOldest(logs).reverse()

  return <section className="page">
    <PageHeader title="Doctor view" subtitle="Read-only cycle summary without private notes" back/>
    <section className="safe-banner">
      <p className="eyebrow">Partner / clinician safe</p>
      <h2>Notes are hidden on this screen.</h2>
      <p>This view shows dates, cycle timing, flow, pain, and symptoms only. It cannot edit or delete your logs.</p>
    </section>
    <div className="stats-grid">
      <StatCard label="Average cycle" value={`${stats.averageCycleLength} days`}/>
      <StatCard label="Average period" value={`${stats.averagePeriodDuration} days`}/>
      <StatCard label="Regularity score" value={stats.regularityScore === null ? 'More data needed' : `${stats.regularityScore}/100`} detail={stats.regularity}/>
      <StatCard label="Last period" value={formatDate(stats.lastLog?.startDate, 'MMM d')} detail={stats.lastLog ? `to ${formatDate(stats.lastLog.endDate, 'MMM d')}` : ''}/>
    </div>
    <section className="card prose">
      <h3>Upcoming estimates</h3>
      <p><strong>Next period:</strong> {formatDate(stats.nextStart)} {stats.nextEnd ? `to ${formatDate(stats.nextEnd)}` : ''}</p>
      <p><strong>Predicted PMS days:</strong> {formatDate(stats.pmsStart)} {stats.pmsEnd ? `to ${formatDate(stats.pmsEnd)}` : ''}</p>
      <p><strong>Fertile window:</strong> {formatDate(stats.fertileStart)} {stats.fertileEnd ? `to ${formatDate(stats.fertileEnd)}` : ''} ({stats.fertileConfidence.label} confidence)</p>
    </section>
    <h2 className="section-title">Cycle history</h2>
    <div className="history-list safe-history">
      {history.length ? history.map((log) => <article className="card history-item" key={log.id}>
        <div>
          <p className="eyebrow">{periodDuration(log)} day period</p>
          <h3>{formatDate(log.startDate)} - {formatDate(log.endDate)}</h3>
          <p>{[log.flow && `${log.flow} flow`, log.painLevel !== null && `Pain ${log.painLevel}/10`, log.mood].filter(Boolean).join(' | ') || 'No clinical details added'}</p>
          {(log.symptoms || []).length > 0 && <div className="chip-list compact">{log.symptoms.map((item) => <span className="chip" key={item}>{item}</span>)}</div>}
        </div>
      </article>) : <div className="empty"><h2>No history yet</h2><p>Cycle history will appear after logging periods.</p></div>}
    </div>
    <p className="disclaimer">This summary is informational and is not a diagnosis, treatment plan, contraception method, or substitute for care from a qualified clinician.</p>
  </section>
}
