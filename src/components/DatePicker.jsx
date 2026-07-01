import { useEffect, useState } from 'react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { Icon } from './Icons'

export default function DatePicker({ value, onChange, placeholder = 'Choose a date' }) {
  const selected = value ? parseISO(value) : null
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(selected || new Date())
  const [pending, setPending] = useState(selected)
  const activeDate = pending || selected
  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) })

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  const select = (day) => {
    setPending(day)
  }
  const add = (event) => {
    event?.preventDefault()
    event?.stopPropagation()
    if (!pending) return
    setOpen(false)
    onChange(format(pending, 'yyyy-MM-dd'))
  }
  const close = (event) => {
    event?.preventDefault()
    event?.stopPropagation()
    setOpen(false)
  }

  return <>
    <button type="button" className={value ? 'date-trigger has-value' : 'date-trigger'} onClick={() => { setMonth(selected || new Date()); setPending(selected); setOpen(true) }}><span>{selected ? format(selected, 'EEEE, MMMM d, yyyy') : placeholder}</span><Icon name="calendar" size={18}/></button>
    {open && <div className="date-picker-backdrop" onPointerDown={close}><section className="date-picker" onPointerDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Choose date">
      <header><div><p className="eyebrow">Choose a date</p><h2>{activeDate ? format(activeDate, 'MMMM d, yyyy') : format(month, 'MMMM yyyy')}</h2></div></header>
      <div className="date-picker-month"><button type="button" onClick={() => setMonth(subMonths(month, 1))}>&lsaquo;</button><strong>{format(month, 'MMMM yyyy')}</strong><button type="button" onClick={() => setMonth(addMonths(month, 1))}>&rsaquo;</button></div>
      <div className="date-picker-grid weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}${index}`}>{day}</span>)}</div>
      <div className="date-picker-grid">{days.map((day) => <button type="button" key={day.toISOString()} className={[!isSameMonth(day, month) ? 'muted' : '', activeDate && isSameDay(day, activeDate) ? 'selected' : '', isSameDay(day, new Date()) ? 'today' : ''].join(' ')} onClick={() => select(day)}>{format(day, 'd')}</button>)}</div>
      <footer><button type="button" className="button secondary" onPointerDown={close} onClick={close}>Close</button><button type="button" className="button primary" disabled={!pending} onPointerDown={add} onClick={(event) => { if (event.detail === 0) add(event) }}>Log</button></footer>
    </section></div>}
  </>
}
