import { useState } from 'react'
import { Hero, Page } from '../components'
import { deal, LAMP_N, lit, toggle } from '../games/lamps'

export function Lamps() {
  const [grid, setGrid] = useState(deal)
  const [steps, setSteps] = useState(0)
  const done = !lit(grid)

  function press(x: number, y: number) {
    if (done) return
    setGrid((current) => toggle(current, x, y))
    setSteps((count) => count + 1)
  }

  function reset() {
    setGrid(deal())
    setSteps(0)
  }

  return (
    <Page>
      <Hero eyebrow="熄灯" title="翻灯" tagline="点一盏，它和上下左右一起翻。全部熄掉。" />
      <div className="play">
        <p className="play-status" aria-live="polite">
          {done ? `灭了 · ${steps} 步` : `${steps} 步`}
        </p>
        <div className="lamp-grid" style={{ gridTemplateColumns: `repeat(${LAMP_N}, minmax(0, 1fr))` }}>
          {grid.map((row, y) =>
            row.map((on, x) => (
              <button
                key={`${x}-${y}`}
                type="button"
                className={on ? 'lamp is-on' : 'lamp'}
                aria-pressed={on}
                aria-label={on ? `${y + 1} 行 ${x + 1} 列，亮` : `${y + 1} 行 ${x + 1} 列，灭`}
                onClick={() => press(x, y)}
              />
            )),
          )}
        </div>
        <button className="quiet" type="button" onClick={reset}>
          重来
        </button>
      </div>
    </Page>
  )
}
