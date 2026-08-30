import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
}

const COUNT = 86
const LINK = 128
const MOUSE_R = 180

export function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: -9999, y: -9999, ok: false }
    const nodes: Node[] = []
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      nodes.length = 0
      for (let i = 0; i < COUNT; i += 1) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const node of nodes) {
        if (!reduced) {
          if (mouse.ok) {
            const dx = mouse.x - node.x
            const dy = mouse.y - node.y
            const d2 = dx * dx + dy * dy
            if (d2 < MOUSE_R * MOUSE_R && d2 > 16) {
              const d = Math.sqrt(d2)
              node.vx += (dx / d) * 0.018
              node.vy += (dy / d) * 0.018
            }
          }
          node.vx *= 0.99
          node.vy *= 0.99
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > w) node.vx *= -1
          if (node.y < 0 || node.y > h) node.vy *= -1
          node.x = Math.min(w, Math.max(0, node.x))
          node.y = Math.min(h, Math.max(0, node.y))
        }

        ctx.beginPath()
        ctx.fillStyle = 'rgba(212, 160, 86, 0.72)'
        ctx.arc(node.x, node.y, 1.15, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > LINK) continue
          const alpha = (1 - dist / LINK) * 0.22
          ctx.strokeStyle = `rgba(212, 160, 86, ${alpha})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      if (mouse.ok) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160)
        glow.addColorStop(0, 'rgba(212, 160, 86, 0.1)')
        glow.addColorStop(1, 'rgba(212, 160, 86, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(0, 0, w, h)
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
      mouse.ok = true
    }

    const onLeave = () => {
      mouse.ok = false
    }

    resize()
    seed()
    draw()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas className="field" ref={canvasRef} aria-hidden="true" />
}
