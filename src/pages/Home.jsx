import { useState } from 'react'
import { Link } from 'react-router-dom'
import CalendarView from '../components/CalendarView'
import ExpandedCalendar from '../components/ExpandedCalendar'
import ProfilePanel from '../components/ProfilePanel'
import StatCard from '../components/StatCard'
import { Icon } from '../components/Icons'
import { useAppStore } from '../store/useAppStore'
import { formatDate, getStats } from '../utils/cycleCalculations'

export default function Home() {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date())
  const [profileOpen, setProfileOpen] = useState(false)
  const { logs, settings } = useAppStore()
  const stats = getStats(logs, settings)
  const dayText = stats.daysUntil === null
    ? 'Log a period to start estimates'
    : stats.daysUntil === 0
    ? 'Expected today'
    : stats.daysUntil > 0
      ? `${stats.daysUntil} days to go`
      : `${Math.abs(stats.daysUntil)} days later than estimated`

  return <section className="page">
    <header className="home-head">
      <div><p className="eyebrow">TEMPO</p><h1>Hello{settings?.name ? `, ${settings.name}` : ', today'}</h1></div>
      <button className="profile-button" onClick={() => setProfileOpen(true)} aria-label="Open profile"><Icon name="profile"/></button>
    </header>
    <section className="card calendar-card home-calendar" role="button" tabIndex="0" aria-label="Open expanded calendar" onClick={() => { setSelectedCalendarDate(new Date()); setCalendarOpen(true) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { setSelectedCalendarDate(new Date()); setCalendarOpen(true) } }}>
      <CalendarView logs={logs} settings={settings} onSelectDate={(date) => { setSelectedCalendarDate(date); setCalendarOpen(true) }}/>
      <p className="calendar-hint">Tap calendar to expand</p>
    </section>
    <div className="legend home-legend"><span><i className="logged"/>Period</span><span><i className="fertile"/>Fertile window</span><span><i className="ovulation"/>Ovulation</span><span><i className="today"/>Today</span></div>
    <article className="hero-card">
      <p>Next period estimate</p>
      <h2>{formatDate(stats.nextStart, 'EEEE, MMM d')}</h2>
      <span>{dayText}</span>
      <div className="progress-track"><i style={{ width: `${Math.min(100, ((stats.currentCycleDay || 1) / stats.averageCycleLength) * 100)}%` }}/></div>
      <small>Cycle day {stats.currentCycleDay} of about {stats.averageCycleLength}</small>
    </article>
    <div className="quick-actions home-actions v2-actions">
      <Link className="quick primary-quick" to="/log"><Icon name="plus"/><span>Log period</span></Link>
      <Link className="quick" to="/insights"><Icon name="chart"/><span>Insights</span></Link>
      <Link className="quick" to="/history"><Icon name="history"/><span>History</span></Link>
      <Link className="quick" to="/safe-view"><Icon name="doctor"/><span>Doctor view</span></Link>
      <Link className="quick" to="/library"><Icon name="book"/><span>Library</span></Link>
    </div>
    <h2 className="section-title">Your Tempo</h2>
    <div className="stats-grid">
      <StatCard label="Average cycle" value={`${stats.averageCycleLength} days`}/>
      <StatCard label="Average period" value={`${stats.averagePeriodDuration} days`}/>
      <StatCard label="Last period" value={formatDate(stats.lastLog?.startDate, 'MMM d')} detail={stats.lastLog ? `to ${formatDate(stats.lastLog.endDate, 'MMM d')}` : ''}/>
      <StatCard label="Regularity score" value={stats.regularityScore === null ? 'More data needed' : `${stats.regularityScore}/100`} detail={stats.regularity}/>
      <StatCard label="Fertile confidence" value={stats.fertileConfidence.label} detail={stats.fertileConfidence.detail}/>
      <StatCard label="PMS estimate" value={formatDate(stats.pmsStart, 'MMM d')} detail={stats.pmsEnd ? `to ${formatDate(stats.pmsEnd, 'MMM d')}` : ''}/>
    </div>
    <p className="disclaimer">Predictions are estimates based on your history, not medical advice or contraception guidance.</p>
    <footer className="home-signature"><span>♡</span> Made for her. Shared with everyone. <span>♡</span></footer>
    {calendarOpen && <ExpandedCalendar logs={logs} settings={settings} initialDate={selectedCalendarDate} onClose={() => setCalendarOpen(false)}/>}
    {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)}/>}
  </section>
}
