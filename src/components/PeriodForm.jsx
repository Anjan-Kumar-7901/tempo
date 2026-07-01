import { useState } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import DatePicker from './DatePicker'

const symptoms = ['Cramps', 'Headache', 'Bloating', 'Acne', 'Tiredness', 'Back pain', 'Nausea', 'Cravings']
const blank = { startDate: '', endDate: '', flow: '', painLevel: null, mood: '', symptoms: [], notes: '' }

export default function PeriodForm({ initial, onSubmit, overlapping }) {
  const [form, setForm] = useState({ ...blank, ...initial, symptoms: initial?.symptoms || [] })
  const [error, setError] = useState('')
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggle = (item) => set('symptoms', form.symptoms.includes(item) ? form.symptoms.filter((value) => value !== item) : [...form.symptoms, item])
  const submit = (e) => {
    e.preventDefault()
    const duration = form.startDate && form.endDate ? differenceInCalendarDays(parseISO(form.endDate), parseISO(form.startDate)) + 1 : 0
    if (!form.startDate || !form.endDate) return setError('Start and end dates are required.')
    if (duration < 1) return setError('End date cannot be before the start date.')
    if (duration > 14) return setError('Period duration must be between 1 and 14 days.')
    if (overlapping(form)) return setError('This period overlaps an existing log.')
    setError('')
    onSubmit(form)
  }
  return <form className="form-stack" onSubmit={submit}>
    <div className="field-grid"><label>Start date<DatePicker value={form.startDate} onChange={(value) => set('startDate', value)} placeholder="Choose start date"/></label><label>End date<DatePicker value={form.endDate} onChange={(value) => set('endDate', value)} placeholder="Choose end date"/></label></div>
    <fieldset><legend>Flow</legend><div className="segmented">{['Light', 'Medium', 'Heavy'].map((item) => <button type="button" className={form.flow === item ? 'selected' : ''} onClick={() => set('flow', item)} key={item}>{item}</button>)}</div></fieldset>
    <label>Pain level <span className="range-value">{form.painLevel ?? 'Not set'}</span><input type="range" min="0" max="10" value={form.painLevel ?? 0} onChange={(e) => set('painLevel', Number(e.target.value))}/></label>
    <label>Mood<input placeholder="How did you feel?" value={form.mood} onChange={(e) => set('mood', e.target.value)}/></label>
    <fieldset><legend>Symptoms</legend><div className="chip-list">{symptoms.map((item) => <button type="button" className={form.symptoms.includes(item) ? 'chip selected' : 'chip'} onClick={() => toggle(item)} key={item}>{item}</button>)}</div></fieldset>
    <label>Notes<textarea rows="3" placeholder="Anything else you want to remember" value={form.notes} onChange={(e) => set('notes', e.target.value)}/></label>
    {error && <p className="error">{error}</p>}
    <button className="button primary" type="submit">{initial?.id ? 'Save changes' : 'Save period'}</button>
  </form>
}
