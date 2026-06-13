import { useNavigate } from 'react-router-dom'
export default function Welcome() {
  const navigate = useNavigate()
  return <section className="welcome"><div className="brand-orbit"><img src="/icons/tempo.svg" className="welcome-logo" alt="TEMPO"/></div><p className="eyebrow">Private cycle tracking</p><h1 className="display">TEMPO</h1><p className="tagline">In sync with your body</p><p className="welcome-copy">A calm, private space to understand your cycle. Your data stays on this device.</p><button className="button primary wide" onClick={() => navigate('/onboarding')}>Get started</button><small>No account. No cloud.</small></section>
}
