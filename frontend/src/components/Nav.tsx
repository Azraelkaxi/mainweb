import type { ReactNode } from 'react'

type NavProps = {
  brand: ReactNode
  brandHref?: string
  children?: ReactNode
}

export function Nav({ brand, brandHref = '/', children }: NavProps) {
  return (
    <header className="nav">
      <a className="brand" href={brandHref}>
        {brand}
      </a>
      {children}
    </header>
  )
}

export function NavLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      className="nav-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
