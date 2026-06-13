import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subDays, subMonths } from 'date-fns'
import { useState } from 'react'
import { getStats, isWithin } from '../utils/cycleCalculations'

export default function CalendarView({ logs, settings, onSelectDate }) {
  const [month, setMonth] = useState(new Date())
  const stats = getStats(logs, settings)
  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) })
  const logged = (day) => logs.some((log) => isWithin(day, new Date(`${log.startDate}T00:00:00`), new Date(`${log.endDate}T00:00:00`)))
  const changeMonth = (event, nextMonth) => {
    event.stopPropagation()
    setMonth(nextMonth)
  }

  return <div>
    <div className="calendar-head"><button onClick={(event) => changeMonth(event, subMonths(month, 1))}>&lsaquo;</button><strong>{format(month, 'MMMM yyyy')}</strong><button onClick={(event) => changeMonth(event, addMonths(month, 1))}>&rsaquo;</button></div>
    <div className="calendar-grid week">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}${index}`}>{day}</span>)}</div>
    <div className="calendar-grid">{days.map((day) => {
      const ovulationWindow = stats.ovulation && isWithin(day, subDays(stats.ovulation, 2), addDays(stats.ovulation, 2))
      const classes = ['day', !isSameMonth(day, month) ? 'muted' : '', logged(day) ? 'logged' : '', isWithin(day, stats.nextStart, stats.nextEnd) ? 'predicted' : '', ovulationWindow ? 'ovulation-window' : '', isSameDay(day, new Date()) ? 'today' : '', stats.ovulation && isSameDay(day, stats.ovulation) ? 'ovulation' : ''].join(' ')
      return <button type="button" className={classes} key={day.toISOString()} onClick={(event) => { if (!onSelectDate) return; event.stopPropagation(); onSelectDate(day) }}>{format(day, 'd')}</button>
    })}</div>
  </div>
}
