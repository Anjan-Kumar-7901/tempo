import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import DatePicker from '../components/DatePicker'
import { useAppStore } from '../store/useAppStore'

export default function Setup() {
  const [form, setForm] = useState({ startDate: '', endDate: '', averageCycleLength: 28, averagePeriodDuration: 5 })
  const [error, setError] = useState('')
  const { upsertLog, updateSettings } = useAppStore()
  const navigate = useNavigate()
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    if (!form.startDate || !form.endDate || form.endDate < form.startDate) return setError('Enter a valid last period date range.')
    const duration = differenceInCalendarDays(parseISO(form.endDate), parseISO(form.startDate)) + 1
    if (duration > 14) return setError('Period duration must be between 1 and 14 days.')
    await upsertLog({ startDate: form.startDate, endDate: form.endDate, flow: '', painLevel: null, mood: '', symptoms: [], notes: '' })
    await updateSettings({ averageCycleLength: Number(form.averageCycleLength), averagePeriodDuration: Number(form.averagePeriodDuration), isSetupComplete: true })
    navigate('/home')
  }
  return <section className="page"><p className="eyebrow">One quick setup</p><h1>Let’s find your rhythm</h1><p className="muted">These details create your first estimate. You can adjust them later.</p><form className="card form-stack setup-card" onSubmit={submit}><div className="field-grid"><label>Last period start<DatePicker value={form.startDate} onChange={(value) => set('startDate', value)} placeholder="Choose start date"/></label><label>Last period end<DatePicker value={form.endDate} onChange={(value) => set('endDate', value)} placeholder="Choose end date"/></label></div><div className="field-grid"><label>Usual cycle length<input type="number" min="15" max="60" value={form.averageCycleLength} onChange={(event) => set('averageCycleLength', event.target.value)}/><small>Days between period starts</small></label><label>Usual period duration<input type="number" min="1" max="14" value={form.averagePeriodDuration} onChange={(event) => set('averagePeriodDuration', event.target.value)}/><small>Days of bleeding</small></label></div>{error && <p className="error">{error}</p>}<button className="button primary">Finish setup</button></form></section>
}
