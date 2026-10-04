import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { profile } from '../data/profile'
import { republic } from '../data/republic'

const links = [
  { to: '/', label: '理想国', end: true },
  { to: '/workshop', label: '工坊', end: false },
  { to: '/archive', label: '档案', end: false },
  { to: '/night', label: '夜航', end: false },
  { to: '/about', label: '站长', end: false },
] as const

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <aside className="rail">
        <Link className="rail-brand" to="/">
          <span className="rail-mark">{republic.name}</span>
          <span className="rail-owner">{profile.name}</span>
        </Link>

        <nav className="rail-nav" aria-label="理想国导航">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'rail-link is-active' : 'rail-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <p className="rail-status">创作进行中</p>
      </aside>
      <main className="stage">{children}</main>
    </div>
  )
}
