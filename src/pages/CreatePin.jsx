import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PinInput from '../components/PinInput'
import { useAppStore } from '../store/useAppStore'
export default function CreatePin() {
  const [pin, setPin] = useState(''), [confirm, setConfirm] = useState(''), [step, setStep] = useState(1), [error, setError] = useState('')
  const createPin = useAppStore((s) => s.createPin), navigate = useNavigate()
  const next = async () => {
    if (pin.length !== 4) return setError('Enter all four digits.')
    if (step === 1) { setStep(2); setError(''); return }
    if (confirm !== pin) return setError('PINs do not match. Try again.')
    await createPin(pin); navigate('/setup')
  }
  return <section className="center-page"><div className="brand-mark">T</div><p className="eyebrow">Local privacy lock</p><h1>{step === 1 ? 'Create your PIN' : 'Confirm your PIN'}</h1><p className="muted">This PIN protects TEMPO on this device. It is not full account authentication.</p><PinInput value={step === 1 ? pin : confirm} onChange={step === 1 ? setPin : setConfirm}/>{error && <p className="error">{error}</p>}<button className="button primary wide" onClick={next}>{step === 1 ? 'Continue' : 'Create PIN'}</button></section>
}
