import { useEffect, useState, type PointerEvent } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function cityStamp(date = new Date()) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function useCityClock() {
  const [clock, setClock] = useState(cityStamp)

  useEffect(() => {
    const id = window.setInterval(() => setClock(cityStamp()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return clock
}

export function useStageCoord() {
  const [coord, setCoord] = useState('— · —')

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setCoord(`${x.toFixed(1)} · ${y.toFixed(1)}`)
  }

  const onPointerLeave = () => setCoord('— · —')

  return { coord, onPointerMove, onPointerLeave }
}
