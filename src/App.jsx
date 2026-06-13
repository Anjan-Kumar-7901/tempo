import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'
import Welcome from './pages/Welcome'
import CreatePin from './pages/CreatePin'
import Unlock from './pages/Unlock'
import Setup from './pages/Setup'
import Home from './pages/Home'
import LogPeriod from './pages/LogPeriod'
import Insights from './pages/Insights'
import History from './pages/History'
import Onboarding from './pages/Onboarding'

const LOCK_AFTER_MS = 5 * 60 * 1000

function App() {
  const { boot, ready, settings, unlocked, lock } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()
  const lastActivity = useRef(null)

  useEffect(() => { boot() }, [boot])

  useEffect(() => {
    if (!unlocked) return
    lastActivity.current = Date.now()
    const markActive = () => { lastActivity.current = Date.now() }
    const check = () => {
      if (Date.now() - lastActivity.current >= LOCK_AFTER_MS) {
        lock()
        navigate('/unlock')
      }
    }
    const events = ['pointerdown', 'keydown', 'touchstart']
    events.forEach((event) => window.addEventListener(event, markActive))
    const timer = window.setInterval(check, 15000)
    return () => {
      events.forEach((event) => window.removeEventListener(event, markActive))
      window.clearInterval(timer)
    }
  }, [unlocked, lock, navigate])

  if (!ready) return <div className="splash-loader"><div className="brand-mark">T</div><p>TEMPO</p></div>

  const hasPin = Boolean(settings?.pinHash)
  const onboardingComplete = Boolean(settings?.isOnboardingComplete)
  const setupComplete = Boolean(settings?.isSetupComplete)
  let redirect = null
  const prePinRoutes = ['/', '/onboarding', '/create-pin']
  if (!hasPin && !prePinRoutes.includes(location.pathname)) redirect = '/'
  if (!hasPin && location.pathname === '/create-pin' && !onboardingComplete) redirect = '/onboarding'
  if (!hasPin && onboardingComplete && location.pathname === '/') redirect = '/create-pin'
  if (hasPin && !unlocked && location.pathname !== '/unlock') redirect = '/unlock'
  if (hasPin && unlocked && !setupComplete && location.pathname !== '/setup') redirect = '/setup'
  if (hasPin && unlocked && setupComplete && ['/', '/onboarding', '/create-pin', '/unlock', '/setup'].includes(location.pathname)) redirect = '/home'

  return (
    <div className="app-shell">
      {redirect && <Navigate to={redirect} replace />}
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/unlock" element={<Unlock />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/log" element={<LogPeriod />} />
          <Route path="/log/:id" element={<LogPeriod />} />
          <Route path="/calendar" element={<Navigate to="/home" replace />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
