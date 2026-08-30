import { useEffect, useState } from 'react'
import { Field } from '../components/Field'
import { republic } from '../data/republic'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function nowStamp() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function Home() {
  const [clock, setClock] = useState(nowStamp)
  const [coord, setCoord] = useState('— · —')

  useEffect(() => {
    const id = window.setInterval(() => setClock(nowStamp()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      className="home"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100
        setCoord(`${x.toFixed(1)} · ${y.toFixed(1)}`)
      }}
      onPointerLeave={() => setCoord('— · —')}
    >
      <Field />
      <div className="home-copy">
        <p className="eyebrow">{republic.eyebrow}</p>
        <h1 className="home-title">{republic.title}</h1>
        <p className="tagline">{republic.tagline}</p>
        <p className="bio">{republic.manifesto}</p>
      </div>
      <div className="home-meta">
        <ul className="districts">
          {republic.districts.map((item) => (
            <li key={item.name}>
              <span className="district-name">{item.name}</span>
              <span className="district-state">{item.state}</span>
            </li>
          ))}
        </ul>
        <p className="home-readout">
          <span>{clock} · 理想国时间</span>
          <span>坐标 {coord}</span>
        </p>
      </div>
    </section>
  )
}
