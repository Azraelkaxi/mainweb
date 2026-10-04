import { Link } from 'react-router-dom'
import { Field } from '../components/Field'
import { useCityClock, useStageCoord } from '../cityTime'
import { republic } from '../data/republic'

export function Home() {
  const clock = useCityClock()
  const { coord, onPointerMove, onPointerLeave } = useStageCoord()

  return (
    <section className="home" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
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
            <li key={item.path}>
              <Link className="district" to={item.path}>
                <span className="district-name">
                  {item.name}
                  <span className="district-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span className="district-state">{item.state}</span>
              </Link>
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
