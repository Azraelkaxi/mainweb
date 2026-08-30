import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  hx: number
  hy: number
  vx: number
  vy: number
  charge: number
}

const COUNT = 78
const BASE_LINK = 108
const EXTRA_LINK = 34
const MOUSE_R = 220
const SEPARATE = 32
const REPEL = 0.018
const MOUSE_PULL = 0.0055
const DAMPING = 0.992
const MAX_V = 1.15
const CHARGE_UP = 2.4
const CHARGE_DOWN = 0.85
const HOME = 0.09
const SCATTER = 150
const SCATTER_F = 0.01

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
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const node of nodes) {
        node.hx = Math.min(w, Math.max(0, node.hx))
        node.hy = Math.min(h, Math.max(0, node.hy))
      }
    }

    const seed = () => {
      nodes.length = 0
      for (let i = 0; i < COUNT; i += 1) {
        const x = Math.random() * w
        const y = Math.random() * h
        nodes.push({
          x,
          y,
          hx: x,
          hy: y,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          charge: 0,
        })
      }
    }

    const step = (dt: number) => {
      if (reduced) return

      for (const node of nodes) {
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const dist = Math.hypot(dx, dy)
        const near = mouse.ok && dist < MOUSE_R && dist > 0.001
        if (near) {
          const falloff = 1 - dist / MOUSE_R
          node.charge = Math.min(1, node.charge + CHARGE_UP * falloff * dt)
          if (dist > 28) {
            node.vx += (dx / dist) * MOUSE_PULL * falloff
            node.vy += (dy / dist) * MOUSE_PULL * falloff
          }
        } else {
          node.charge = Math.max(0, node.charge - CHARGE_DOWN * dt)
        }
        const settle = mouse.ok ? 0.12 : 1
        node.vx += (node.hx - node.x) * HOME * settle * dt
        node.vy += (node.hy - node.y) * HOME * settle * dt
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist === 0) continue
          const nx = dx / dist
          const ny = dy / dist
          if (dist < SEPARATE) {
            const overlap = (SEPARATE - dist) / SEPARATE
            const force = overlap * overlap * REPEL
            a.vx += nx * force
            a.vy += ny * force
            b.vx -= nx * force
            b.vy -= ny * force
          } else if (dist < SCATTER) {
            const force = (1 - dist / SCATTER) * SCATTER_F * dt
            a.vx += nx * force
            a.vy += ny * force
            b.vx -= nx * force
            b.vy -= ny * force
          }
        }
      }

      for (const node of nodes) {
        const speed = Math.hypot(node.vx, node.vy)
        if (speed > MAX_V) {
          node.vx = (node.vx / speed) * MAX_V
          node.vy = (node.vy / speed) * MAX_V
        }
        node.vx *= DAMPING
        node.vy *= DAMPING
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -0.86
        if (node.y < 0 || node.y > h) node.vy *= -0.86
        node.x = Math.min(w, Math.max(0, node.x))
        node.y = Math.min(h, Math.max(0, node.y))
      }
    }

    const draw = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      step(dt)

      for (const node of nodes) {
        const r = 1.05 + node.charge * 0.45
        ctx.beginPath()
        ctx.fillStyle = `rgba(212, 160, 86, ${0.55 + node.charge * 0.28})`
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          const warmth = (a.charge + b.charge) / 2
          const reach = BASE_LINK + warmth * EXTRA_LINK
          if (dist > reach) continue
          const fade = 1 - dist / reach
          const alpha = fade * (0.16 + warmth * 0.1)
          if (alpha < 0.02) continue
          ctx.strokeStyle = `rgba(212, 160, 86, ${alpha})`
          ctx.lineWidth = 0.65
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      if (mouse.ok) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140)
        glow.addColorStop(0, 'rgba(212, 160, 86, 0.07)')
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
    last = performance.now()
    if (reduced) {
      draw(last)
    } else {
      raf = requestAnimationFrame(draw)
    }
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
