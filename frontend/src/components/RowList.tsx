export type RowItem = {
  name: string
  description: string
  href: string
  external?: boolean
}

export function RowList({ items }: { items: RowItem[] }) {
  return (
    <ul className="row-list">
      {items.map((item) => (
        <li key={item.name}>
          <a
            className="row"
            href={item.href}
            {...(item.external !== false
              ? { target: '_blank', rel: 'noreferrer' }
              : {})}
          >
            <span className="row-name">{item.name}</span>
            <p className="row-desc">{item.description}</p>
            <span className="row-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
