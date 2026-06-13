import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PinInput from '../components/PinInput'
import Modal from '../components/Modal'
import { useAppStore } from '../store/useAppStore'
export default function Unlock() {
  const [pin, setPin] = useState(''), [error, setError] = useState(''), [resetOpen, setResetOpen] = useState(false), [confirm, setConfirm] = useState('')
  const { unlock, resetAll } = useAppStore(), navigate = useNavigate()
  const submit = async () => { if (pin.length < 4) return; if (await unlock(pin)) navigate('/home'); else { setError('Incorrect PIN. Please try again.'); setPin('') } }
  const reset = async () => { if (confirm !== 'RESET') return; await resetAll(); navigate('/') }
  return <section className="center-page"><div className="brand-mark"><span>◆</span></div><p className="eyebrow">Welcome back</p><h1>Unlock TEMPO</h1><p className="muted">Enter your 4-digit PIN</p><PinInput value={pin} onChange={(value) => { setPin(value); setError('') }}/>{error && <p className="error">{error}</p>}<button className="button primary wide" onClick={submit}>Unlock</button><button className="text-button" onClick={() => setResetOpen(true)}>Forgot PIN?</button><Modal open={resetOpen} title="Reset TEMPO?" onClose={() => setResetOpen(false)}><p>All saved data till now will be lost. This cannot be undone.</p><label>Type RESET to continue<input value={confirm} onChange={(e) => setConfirm(e.target.value)}/></label><div className="modal-actions"><button className="button secondary" onClick={() => setResetOpen(false)}>Cancel</button><button className="button danger" disabled={confirm !== 'RESET'} onClick={reset}>Reset all data</button></div></Modal></section>
}
