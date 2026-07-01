import { useEffect, useState } from 'react'
import {
  addDays, differenceInCalendarDays, eachDayOfInterval, endOfWeek, format,
  isSameDay, startOfWeek,
} from 'date-fns'
import { getStats, isWithin } from '../utils/cycleCalculations'
import { Icon } from './Icons'

function getDayStatus(selected, logs, stats) {
  const actualLog = logs.find((log) => isWithin(selected, new Date(`${log.startDate}T00:00:00`), new Date(`${log.endDate}T00:00:00`)))
  if (actualLog) {
    return {
      tone: 'period',
      eyebrow: 'Logged period',
      title: `Day ${differenceInCalendarDays(selected, new Date(`${actualLog.startDate}T00:00:00`)) + 1}`,
      detail: `${differenceInCalendarDays(new Date(`${actualLog.endDate}T00:00:00`), new Date(`${actualLog.startDate}T00:00:00`)) + 1} day period`,
    }
  }
  if (isWithin(selected, stats.nextStart, stats.nextEnd)) {
    return {
      tone: 'period',
      eyebrow: 'Predicted period',
      title: `Day ${differenceInCalendarDays(selected, stats.nextStart) + 1}`,
      detail: 'Estimated from your cycle history',
    }
  }
  if (stats.ovulation && isSameDay(selected, stats.ovulation)) {
    return { tone: 'ovulation', eyebrow: 'Prediction', title: 'Estimated ovulation', detail: 'This date is an estimate, not a medical fact' }
  }
  if (stats.ovulation) {
    const ovulationOffset = differenceInCalendarDays(selected, stats.ovulation)
    if (ovulationOffset >= -2 && ovulationOffset <= 2) {
      const label = ovulationOffset < 0
        ? `${Math.abs(ovulationOffset)} ${Math.abs(ovulationOffset) === 1 ? 'day' : 'days'} before ovulation`
        : `${ovulationOffset} ${ovulationOffset === 1 ? 'day' : 'days'} after ovulation`
      return { tone: 'ovulation', eyebrow: 'Ovulation estimate window', title: label, detail: `Estimated ovulation is ${format(stats.ovulation, 'MMMM d')}` }
    }
  }
  if (isWithin(selected, stats.fertileStart, stats.ovulation)) {
    return { tone: 'fertile', eyebrow: 'Prediction', title: 'Estimated fertile window', detail: 'Do not use this estimate for contraception guidance' }
  }
  const days = stats.nextStart ? differenceInCalendarDays(stats.nextStart, selected) : null
  if (days === 0) return { tone: 'period', eyebrow: 'Predicted period', title: 'Expected today', detail: 'Estimated from your cycle history' }
  if (days > 0) return { tone: 'calm', eyebrow: 'Next period estimate', title: `${days} ${days === 1 ? 'day' : 'days'}`, detail: `Expected around ${format(stats.nextStart, 'MMMM d')}` }
  return { tone: 'calm', eyebrow: 'Cycle date', title: format(selected, 'MMMM d'), detail: 'Select another date to explore your cycle' }
}

function getExpectedPatterns(selected, logs, stats) {
  const actualLog = logs.find((log) => isWithin(selected, new Date(`${log.startDate}T00:00:00`), new Date(`${log.endDate}T00:00:00`)))
  const isPeriodPhase = Boolean(actualLog) || isWithin(selected, stats.nextStart, stats.nextEnd)
  const isOvulationPhase = stats.ovulation && Math.abs(differenceInCalendarDays(selected, stats.ovulation)) <= 2
  const periodDay = actualLog
    ? differenceInCalendarDays(selected, new Date(`${actualLog.startDate}T00:00:00`)) + 1
    : isWithin(selected, stats.nextStart, stats.nextEnd)
      ? differenceInCalendarDays(selected, stats.nextStart) + 1
      : null
  const relevantLogs = logs.filter((log) => {
    if (actualLog) return log.id === actualLog.id
    if (isPeriodPhase) return differenceInCalendarDays(new Date(`${log.endDate}T00:00:00`), new Date(`${log.startDate}T00:00:00`)) + 1 >= periodDay
    return isOvulationPhase ? (log.symptoms || []).length > 0 || log.mood : false
  })
  const symptomCounts = {}
  relevantLogs.flatMap((log) => log.symptoms || []).forEach((symptom) => { symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1 })
  const symptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name)
  const flows = {}
  relevantLogs.forEach((log) => { if (log.flow) flows[log.flow] = (flows[log.flow] || 0) + 1 })
  const commonFlow = Object.entries(flows).sort((a, b) => b[1] - a[1])[0]?.[0]
  const pains = relevantLogs.filter((log) => log.painLevel !== null).map((log) => log.painLevel)
  const moods = {}
  relevantLogs.forEach((log) => { if (log.mood) moods[log.mood] = (moods[log.mood] || 0) + 1 })
  const mood = Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0]
  return {
    phase: isPeriodPhase ? `period day ${periodDay}` : isOvulationPhase ? 'your ovulation estimate window' : 'this point in your cycle',
    periodDay,
    isActual: Boolean(actualLog),
    symptoms,
    commonFlow: isPeriodPhase ? commonFlow : null,
    pain: pains.length ? Math.round(pains.reduce((sum, value) => sum + value, 0) / pains.length) : null,
    mood,
    hasData: Boolean(symptoms.length || commonFlow || pains.length || mood),
  }
}

export default function ExpandedCalendar({ logs, settings, onClose, initialDate = new Date() }) {
  const [selected, setSelected] = useState(initialDate)
  const stats = getStats(logs, settings)
  const week = eachDayOfInterval({ start: startOfWeek(selected, { weekStartsOn: 0 }), end: endOfWeek(selected, { weekStartsOn: 0 }) })
  const status = getDayStatus(selected, logs, stats)
  const patterns = getExpectedPatterns(selected, logs, stats)
  const actual = (day) => logs.some((log) => isWithin(day, new Date(`${log.startDate}T00:00:00`), new Date(`${log.endDate}T00:00:00`)))

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  return <div className={`expanded-calendar ${status.tone}`} role="dialog" aria-modal="true" aria-label="Expanded cycle calendar">
    <div className="expanded-shape shape-one"/><div className="expanded-shape shape-two"/>
    <header className="expanded-head">
      <div className="brand-mark">T</div>
      <strong>{format(selected, 'd MMMM')}</strong>
      <button className="icon-btn" onClick={onClose} aria-label="Close expanded calendar"><Icon name="close"/></button>
    </header>
    <div className="week-nav">
      <button onClick={() => setSelected(addDays(selected, -7))} aria-label="Previous week">‹</button>
      <div className="expanded-week">{week.map((day) => {
        const ovulationOffset = stats.ovulation ? differenceInCalendarDays(day, stats.ovulation) : null
        const nearOvulation = ovulationOffset !== null && ovulationOffset >= -2 && ovulationOffset <= 2
        const classes = ['week-day', isSameDay(day, selected) ? 'selected' : '', isSameDay(day, new Date()) ? 'is-today' : '', actual(day) ? 'is-logged' : '', isWithin(day, stats.nextStart, stats.nextEnd) ? 'is-predicted' : '', nearOvulation ? 'is-ovulation-window' : ''].join(' ')
        const marker = ovulationOffset === 0 ? 'O' : ovulationOffset < 0 ? `${Math.abs(ovulationOffset)} before` : `${ovulationOffset} after`
        return <button className={classes} key={day.toISOString()} onClick={() => setSelected(day)}><span>{isSameDay(day, new Date()) ? 'Today' : format(day, 'EEEEE')}</span><strong>{format(day, 'd')}</strong>{nearOvulation && <small>{marker}</small>}</button>
      })}</div>
      <button onClick={() => setSelected(addDays(selected, 7))} aria-label="Next week">›</button>
    </div>
    <main className="expanded-status">
      <p>{status.eyebrow}</p>
      <h2>{status.title}</h2>
      <span>{status.detail}</span>
      <section className="expected-panel">
        <div className="expected-heading"><span>{patterns.isActual ? 'Logged for this period' : 'Based on your history'}</span><strong>{patterns.periodDay ? `${patterns.isActual ? 'Your pattern' : 'What you may notice'} on period day ${patterns.periodDay}` : 'What you may notice'}</strong></div>
        {patterns.hasData ? <div className="expected-grid">
          {patterns.symptoms.length > 0 && <article><small>Recurring symptoms</small><b>{patterns.symptoms.join(', ')}</b></article>}
          {patterns.commonFlow && <article><small>Typical flow</small><b>{patterns.commonFlow}</b></article>}
          {patterns.pain !== null && <article><small>Average pain</small><b>{patterns.pain}/10</b></article>}
          {patterns.mood && <article><small>Common mood</small><b>{patterns.mood}</b></article>}
        </div> : <div className="expected-empty"><strong>Patterns will appear here</strong><span>Keep logging symptoms, mood, flow, and pain to reveal trends for {patterns.phase}.</span></div>}
        <small className="expected-note">{patterns.isActual ? 'Details reflect what was saved for this period.' : 'History-based pattern only, not a medical prediction.'}</small>
      </section>
    </main>
    <footer className="expanded-footer"><span><i className="logged"/>Logged</span><span><i className="predicted"/>Predicted</span><span><i className="ovulation"/>2 days before · Ovulation · 2 days after</span></footer>
  </div>
}
