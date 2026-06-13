import { useRef } from 'react'

export default function PinInput({ value, onChange, autoFocus = true }) {
  const ref = useRef()
  return <div className="pin-wrap" onClick={() => ref.current?.focus()}>
    <input ref={ref} autoFocus={autoFocus} className="pin-hidden" type="password" inputMode="numeric" maxLength="4"
      value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))} aria-label="4 digit PIN" />
    {[0, 1, 2, 3].map((i) => <span key={i} className={value.length > i ? 'pin-dot filled' : 'pin-dot'} />)}
  </div>
}
