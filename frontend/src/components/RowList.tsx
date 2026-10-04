import { Link } from 'react-router-dom'

export type RowItem = {
  name: string
  description: string
  href: string
  external?: boolean
}

export function RowList({ items }: { items: RowItem[] }) {
  return (
    <ul className="row-list">
      {items.map((item) => {
        const body = (
          <>
            <span className="row-name">{item.name}</span>
            <p className="row-desc">{item.description}</p>
            <span className="row-arrow" aria-hidden="true">
              ↗
            </span>
          </>
        )
        const outbound = item.external !== false

        return (
          <li key={item.name}>
            {outbound ? (
              <a className="row" href={item.href} target="_blank" rel="noreferrer">
                {body}
              </a>
            ) : (
              <Link className="row" to={item.href}>
                {body}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
