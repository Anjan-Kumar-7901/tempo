import { NavLink } from 'react-router-dom'
import { Icon } from './Icons'

const links = [['/home', 'home', 'Home'], ['/log', 'plus', 'Log'], ['/insights', 'chart', 'Insights'], ['/settings', 'settings', 'Settings']]

export default function BottomNav() {
  return <nav className="bottom-nav">{links.map(([to, icon, label]) =>
    <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><Icon name={icon}/><span>{label}</span></NavLink>
  )}</nav>
}
