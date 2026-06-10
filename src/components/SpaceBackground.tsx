'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  layer: number
  phase: number
  speed: number
  color: string
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

const STAR_COLORS = ['255,255,255', '255,255,255', '190,225,255', '0,212,255']

/**
 * Fundo espacial global: 3 camadas de estrelas em parallax com twinkle,
 * nebulosas derivando lentamente e meteoros ocasionais.
 * Renderizado em canvas fixo atrás de todo o conteúdo.
 */
export default function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let nextMeteor = 2500

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(260, Math.floor((w * h) / 9000))
      stars = Array.from({ length: count }, () => {
        const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.75 ? 1 : 2
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + layer * 0.5 + Math.random() * 0.6,
          layer,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 1.2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        }
      })
    }
    resize()
    window.addEventListener('resize', resize)

    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      const t = now / 1000
      ctx.clearRect(0, 0, w, h)

      // Nebulosas derivando lentamente
      const big = Math.max(w, h)
      const nebulas = [
        { x: w * 0.18 + Math.sin(t * 0.05) * 40, y: h * 0.25 + Math.cos(t * 0.04) * 30, r: big * 0.32, c: '0,85,204', a: 0.1 },
        { x: w * 0.85 + Math.cos(t * 0.03) * 50, y: h * 0.65 + Math.sin(t * 0.05) * 40, r: big * 0.28, c: '0,212,255', a: 0.055 },
        { x: w * 0.55 + Math.sin(t * 0.025) * 60, y: h * 0.05, r: big * 0.22, c: '110,90,255', a: 0.05 },
      ]
      for (const n of nebulas) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        g.addColorStop(0, `rgba(${n.c},${n.a})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2)
      }

      // Estrelas — parallax por camada + twinkle senoidal
      for (const s of stars) {
        s.x -= (0.002 + s.layer * 0.006) * dt
        if (s.x < -2) {
          s.x = w + 2
          s.y = Math.random() * h
        }
        const tw = 0.55 + 0.45 * Math.sin(s.phase + t * s.speed)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.color},${(0.25 + 0.75 * tw) * (s.layer === 2 ? 1 : 0.7)})`
        ctx.fill()
        // Brilho em cruz nas estrelas mais próximas no pico do twinkle
        if (s.layer === 2 && tw > 0.92) {
          ctx.strokeStyle = `rgba(${s.color},0.35)`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(s.x - s.r * 3, s.y)
          ctx.lineTo(s.x + s.r * 3, s.y)
          ctx.moveTo(s.x, s.y - s.r * 3)
          ctx.lineTo(s.x, s.y + s.r * 3)
          ctx.stroke()
        }
      }

      // Meteoros ocasionais
      nextMeteor -= dt
      if (nextMeteor <= 0) {
        nextMeteor = 4000 + Math.random() * 7000
        meteors.push({
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() < 0.7 ? -10 : Math.random() * h * 0.3,
          vx: -(0.25 + Math.random() * 0.3),
          vy: 0.18 + Math.random() * 0.22,
          life: 0,
          maxLife: 900 + Math.random() * 500,
        })
      }
      meteors = meteors.filter((m) => m.life < m.maxLife)
      for (const m of meteors) {
        m.life += dt
        m.x += m.vx * dt
        m.y += m.vy * dt
        const k = 1 - m.life / m.maxLife
        const tail = 120 * k + 30
        const g = ctx.createLinearGradient(m.x, m.y, m.x + tail * 0.8, m.y - tail * 0.55)
        g.addColorStop(0, `rgba(210,240,255,${0.85 * k})`)
        g.addColorStop(1, 'rgba(210,240,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x + tail * 0.8, m.y - tail * 0.55)
        ctx.stroke()
        ctx.fillStyle = `rgba(255,255,255,${0.9 * k})`
        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    if (reduced) {
      // Um único frame estático
      draw(performance.now())
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="space-bg-canvas" aria-hidden="true" />
}
