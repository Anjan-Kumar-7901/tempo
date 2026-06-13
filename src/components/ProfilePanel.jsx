import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import PinInput from './PinInput'
import { Icon } from './Icons'
import { useAppStore } from '../store/useAppStore'

export default function ProfilePanel({ onClose }) {
  const { settings, changePin, resetAll, lock } = useAppStore()
  const navigate = useNavigate()
  const [pinOpen, setPinOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const [resetText, setResetText] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  const savePin = async () => {
    if (pin.length !== 4 || pin !== confirmPin) return setMessage('PINs must match and contain four digits.')
    await changePin(pin)
    setPinOpen(false)
    setPin('')
    setConfirmPin('')
    setMessage('PIN updated.')
  }

  return <div className="profile-backdrop" onMouseDown={onClose}>
    <aside className="profile-panel" onMouseDown={(event) => event.stopPropagation()}>
      <header className="profile-head"><div className="profile-avatar"><Icon name="profile" size={25}/></div><div><p className="eyebrow">TEMPO profile</p><h2>{settings?.name || 'Profile'}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close profile"><Icon name="close"/></button></header>
      {(settings?.age || settings?.heightCm || settings?.weightKg) && <div className="profile-metrics"><span><small>Age</small><strong>{settings.age || '—'}</strong></span><span><small>Height</small><strong>{settings.heightCm} cm</strong></span><span><small>Weight</small><strong>{settings.weightKg} kg</strong></span></div>}
      {message && <p className="notice">{message}</p>}
      <section className="card settings-list"><button onClick={() => { setMessage(''); setPinOpen(true) }}><span><strong>Change PIN</strong><small>Update your local privacy lock</small></span><b>›</b></button><button onClick={() => { lock(); navigate('/unlock') }}><span><strong>Lock now</strong><small>TEMPO also locks after 5 minutes inactive</small></span><b>›</b></button><button className="danger-text" onClick={() => setResetOpen(true)}><span><strong>Reset all data</strong><small>Permanently erase this device’s TEMPO data</small></span><b>›</b></button></section>
      <Modal open={pinOpen} title="Change PIN" onClose={() => setPinOpen(false)}><label>New PIN<PinInput value={pin} onChange={setPin} autoFocus={false}/></label><label>Confirm new PIN<PinInput value={confirmPin} onChange={setConfirmPin} autoFocus={false}/></label>{message && <p className="error">{message}</p>}<div className="modal-actions"><button className="button secondary" onClick={() => setPinOpen(false)}>Cancel</button><button className="button primary" onClick={savePin}>Save PIN</button></div></Modal>
      <Modal open={resetOpen} title="Reset TEMPO?" onClose={() => setResetOpen(false)}><p>All saved data till now will be lost. This cannot be undone.</p><label>Type RESET to continue<input value={resetText} onChange={(e) => setResetText(e.target.value)}/></label><div className="modal-actions"><button className="button secondary" onClick={() => setResetOpen(false)}>Cancel</button><button className="button danger" disabled={resetText !== 'RESET'} onClick={async () => { await resetAll(); navigate('/') }}>Reset all data</button></div></Modal>
    </aside>
  </div>
}
