import type { ReactNode } from 'react'

type HeroProps = {
  eyebrow?: ReactNode
  title: ReactNode
  tagline?: ReactNode
  children?: ReactNode
}

export function Hero({ eyebrow, title, tagline, children }: HeroProps) {
  return (
    <section className="hero">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {tagline ? <p className="tagline">{tagline}</p> : null}
      {children ? <p className="bio">{children}</p> : null}
    </section>
  )
}
