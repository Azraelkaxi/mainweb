import type { ReactNode } from 'react'

export function Footer({
  left,
  right,
}: {
  left: ReactNode
  right?: ReactNode
}) {
  return (
    <footer className="footer">
      <span>{left}</span>
      {right}
    </footer>
  )
}
