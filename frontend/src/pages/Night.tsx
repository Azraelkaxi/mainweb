import { useRef, useState } from 'react'
import { Hero, Page } from '../components'
import { extendSequence, STAR_FIELD } from '../games/stars'

type Phase = 'ready' | 'show' | 'play' | 'miss'

const BEST_KEY = 'republic-stars'

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY) || 0) || 0
  } catch {
    return 0
  }
}

function writeBest(value: number) {
  try {
    localStorage.setItem(BEST_KEY, String(value))
  } catch {
    /* 这一局记在内存里就够了 */
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function Night() {
  const [phase, setPhase] = useState<Phase>('ready')
  const [sequence, setSequence] = useState<number[]>([])
  const [cursor, setCursor] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [best, setBest] = useState(readBest)
  const run = useRef(0)
  const phaseRef = useRef<Phase>('ready')

  function movePhase(next: Phase) {
    phaseRef.current = next
    setPhase(next)
  }

  async function show(next: number[]) {
    const id = ++run.current
    movePhase('show')
    setSequence(next)
    setLit(null)
    for (const star of next) {
      if (run.current !== id) return
      setLit(star)
      await wait(460)
      if (run.current !== id) return
      setLit(null)
      await wait(240)
    }
    if (run.current !== id) return
    setCursor(0)
    movePhase('play')
  }

  function remember(reached: number) {
    setBest((current) => {
      const next = Math.max(current, reached)
      writeBest(next)
      return next
    })
  }

  async function choose(index: number) {
    if (phaseRef.current !== 'play') return
    if (index !== sequence[cursor]) {
      setLit(index)
      movePhase('miss')
      remember(sequence.length - 1)
      return
    }

    const step = cursor + 1
    setLit(index)
    if (step < sequence.length) {
      setCursor(step)
      window.setTimeout(() => {
        setLit((current) => (current === index ? null : current))
      }, 160)
      return
    }

    remember(sequence.length)
    movePhase('show')
    const id = run.current
    await wait(420)
    if (run.current !== id) return
    void show(extendSequence(sequence))
  }

  const status =
    phase === 'ready'
      ? best
        ? `最远 ${best} 颗`
        : '还没启锚'
      : phase === 'show'
        ? '看'
        : phase === 'play'
          ? `第 ${sequence.length} 颗`
        : phase === 'miss'
          ? best > 0
            ? `偏了 · 最远 ${best} 颗`
            : '偏了'
          : '偏了'

  return (
    <Page>
      <Hero eyebrow="未眠" title="夜航" tagline="灯按顺序亮起。再按同样的顺序点回去。" />
      <div className="play">
        <p className="play-status" aria-live="polite">
          {status}
        </p>
        <svg className="constellation" viewBox="0 0 100 100" role="group" aria-label="星序">
          {STAR_FIELD.map((star, index) => (
            <g key={`${star.x}-${star.y}`}>
              <circle
                className={lit === index ? 'star is-lit' : 'star'}
                cx={star.x}
                cy={star.y}
                r="2.4"
              />
              <circle
                className="star-hit"
                cx={star.x}
                cy={star.y}
                r="8"
                role="button"
                tabIndex={0}
                aria-label={`第 ${index + 1} 颗星`}
                onClick={() => void choose(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    void choose(index)
                  }
                }}
              />
            </g>
          ))}
        </svg>
        {phase === 'ready' ? (
          <button className="quiet" type="button" onClick={() => void show(extendSequence([]))}>
            启锚
          </button>
        ) : null}
        {phase === 'miss' ? (
          <button className="quiet" type="button" onClick={() => void show(extendSequence([]))}>
            再走
          </button>
        ) : null}
      </div>
    </Page>
  )
}
