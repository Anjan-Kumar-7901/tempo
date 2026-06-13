import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PeriodForm from '../components/PeriodForm'
import { useAppStore } from '../store/useAppStore'
import { overlapsLog } from '../utils/cycleCalculations'
export default function LogPeriod() {
  const { id } = useParams(), navigate = useNavigate(), { logs, upsertLog } = useAppStore(), existing = logs.find((log) => log.id === id)
  return <section className="page"><PageHeader title={existing ? 'Edit period' : 'Log period'} subtitle="Add what feels useful. Only dates are required." back/><section className="card"><PeriodForm initial={existing} overlapping={(form) => overlapsLog(form, logs, id)} onSubmit={async (form) => { await upsertLog({ ...form, id }); navigate('/home') }}/></section></section>
}
