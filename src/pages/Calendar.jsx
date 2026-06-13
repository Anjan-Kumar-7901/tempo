import CalendarView from '../components/CalendarView'
import PageHeader from '../components/PageHeader'
import { useAppStore } from '../store/useAppStore'
export default function Calendar() {
  const { logs, settings } = useAppStore()
  return <section className="page"><PageHeader title="Calendar" subtitle="Your logged days and upcoming estimates"/><section className="card calendar-card"><CalendarView logs={logs} settings={settings}/></section><div className="legend"><span><i className="logged"/>Logged period</span><span><i className="predicted"/>Predicted period</span><span><i className="today"/>Today</span><span><i className="ovulation"/>Estimated ovulation</span></div><p className="disclaimer">Ovulation and fertile window dates are estimates only and should not be used for contraception guidance.</p></section>
}
