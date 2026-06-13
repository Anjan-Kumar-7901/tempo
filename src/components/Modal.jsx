export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><h2>{title}</h2>{children}</div></div>
}
