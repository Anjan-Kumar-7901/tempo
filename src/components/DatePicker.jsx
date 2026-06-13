import { useEffect, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { Icon } from './Icons'

export default function DatePicker({ value, onChange, placeholder = 'Choose a date' }) {
  const selected = value ? parseISO(value) : null
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(selected || new Date())
  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) })

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  const select = (day) => {
    onChange(format(day, 'yyyy-MM-dd'))
    setOpen(false)
  }

  return <>
    <button type="button" className={value ? 'date-trigger has-value' : 'date-trigger'} onClick={() => { setMonth(selected || new Date()); setOpen(true) }}><span>{selected ? format(selected, 'EEEE, MMMM d, yyyy') : placeholder}</span><Icon name="calendar" size={18}/></button>
    {open && <div className="date-picker-backdrop" onMouseDown={() => setOpen(false)}><section className="date-picker" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Choose date">
      <header><div><p className="eyebrow">Choose a date</p><h2>{selected ? format(selected, 'MMMM d, yyyy') : format(month, 'MMMM yyyy')}</h2></div><button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close"><Icon name="close"/></button></header>
      <div className="date-picker-month"><button type="button" onClick={() => setMonth(subMonths(month, 1))}>&lsaquo;</button><strong>{format(month, 'MMMM yyyy')}</strong><button type="button" onClick={() => setMonth(addMonths(month, 1))}>&rsaquo;</button></div>
      <div className="date-picker-grid weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}${index}`}>{day}</span>)}</div>
      <div className="date-picker-grid">{days.map((day) => <button type="button" key={day.toISOString()} className={[!isSameMonth(day, month) ? 'muted' : '', selected && isSameDay(day, selected) ? 'selected' : '', isSameDay(day, new Date()) ? 'today' : ''].join(' ')} onClick={() => select(day)}>{format(day, 'd')}</button>)}</div>
      <footer><button type="button" className="text-button" onClick={() => { onChange(''); setOpen(false) }}>Clear</button><button type="button" className="button secondary" onClick={() => select(new Date())}>Today</button></footer>
    </section></div>}
  </>
}
