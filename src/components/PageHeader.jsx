import { useNavigate } from 'react-router-dom'
import { Icon } from './Icons'
export default function PageHeader({ title, subtitle, back = false, action }) {
  const navigate = useNavigate()
  return <header className="page-header">{back && <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back"><Icon name="back"/></button>}<div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
}
