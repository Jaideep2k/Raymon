import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Full-page fixed canvas particle field.
 * Phases (driven by global scroll progress 0→1):
 *   0.00–0.20  Scattered deep-space stars (navy/purple)
 *   0.20–0.45  Particles converge toward center, form nebula
 *   0.45–0.70  Burst outward — colorful chaos
 *   0.70–0.90  Re-form into a tight sphere
 *   0.90–1.00  Explode gold
 */

const COUNT = 1800

function lerp(a, b, t) { return a + (b - a) * t }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }
function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId
    let scrollProgress = 0

    // --- Particle data ---
    const px = new Float32Array(COUNT)
    const py = new Float32Array(COUNT)
    const vx = new Float32Array(COUNT)
    const vy = new Float32Array(COUNT)
    const baseX = new Float32Array(COUNT)
    const baseY = new Float32Array(COUNT)
    const hue   = new Float32Array(COUNT)
    const size   = new Float32Array(COUNT)

    function initParticles() {
      for (let i = 0; i < COUNT; i++) {
        px[i] = Math.random() * W
        py[i] = Math.random() * H
        vx[i] = (Math.random() - 0.5) * 0.5
        vy[i] = (Math.random() - 0.5) * 0.5
        baseX[i] = W / 2 + (Math.random() - 0.5) * W * 0.9
        baseY[i] = H / 2 + (Math.random() - 0.5) * H * 0.9
        hue[i]   = 220 + Math.random() * 120  // purple → blue range
        size[i]  = 0.8 + Math.random() * 1.6
      }
    }

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      initParticles()
    }

    window.addEventListener('resize', resize)
    resize()

    // Track scroll progress via ScrollTrigger
    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { scrollProgress = self.progress },
    })

    function draw() {
      animId = requestAnimationFrame(draw)
      const p = scrollProgress
      ctx.clearRect(0, 0, W, H)

      // Phase-based opacity of canvas (fade in after preloader)
      ctx.globalAlpha = 1

      for (let i = 0; i < COUNT; i++) {
        // Phase blend: how much to pull toward sphere center
        let targetX, targetY, alpha, radius, particleHue

        if (p < 0.20) {
          // Pure scatter — slow drift
          const phase = p / 0.20
          px[i] += vx[i] * 0.4
          py[i] += vy[i] * 0.4
          if (px[i] < 0) px[i] = W; if (px[i] > W) px[i] = 0
          if (py[i] < 0) py[i] = H; if (py[i] > H) py[i] = 0
          alpha = 0.35 + Math.sin(i * 3.7 + Date.now() * 0.0008) * 0.2
          radius = size[i]
          particleHue = hue[i]

        } else if (p < 0.45) {
          // Converge toward center nebula
          const phase = easeInOut(clamp((p - 0.20) / 0.25, 0, 1))
          const angle = (i / COUNT) * Math.PI * 2 * 12
          const dist  = 60 + (1 - phase) * Math.min(W, H) * 0.45
          targetX = W / 2 + Math.cos(angle) * dist * (0.5 + (i % 7) / 7)
          targetY = H / 2 + Math.sin(angle) * dist * (0.5 + (i % 5) / 5)
          px[i] = lerp(px[i], targetX, 0.03 + phase * 0.04)
          py[i] = lerp(py[i], targetY, 0.03 + phase * 0.04)
          alpha = 0.5 + phase * 0.4
          radius = size[i] * (1 + phase * 0.8)
          particleHue = lerp(hue[i], 280, phase)

        } else if (p < 0.70) {
          // Burst — scatter outward with color
          const phase = easeInOut(clamp((p - 0.45) / 0.25, 0, 1))
          const angle = (i / COUNT) * Math.PI * 2 * 7 + phase * Math.PI
          const dist  = phase * Math.max(W, H) * 0.6
          targetX = W / 2 + Math.cos(angle) * dist
          targetY = H / 2 + Math.sin(angle) * dist
          px[i] = lerp(px[i], targetX, 0.05)
          py[i] = lerp(py[i], targetY, 0.05)
          alpha = 0.7 * (1 - phase * 0.4)
          radius = size[i] * (1 + phase * 1.5)
          particleHue = (hue[i] + phase * 180) % 360

        } else if (p < 0.90) {
          // Sphere re-form
          const phase = easeInOut(clamp((p - 0.70) / 0.20, 0, 1))
          const angle = (i / COUNT) * Math.PI * 2
          const r     = Math.min(W, H) * 0.25
          targetX = W / 2 + Math.cos(angle) * r * (0.3 + (i % 3) * 0.35)
          targetY = H / 2 + Math.sin(angle) * r * (0.3 + (i % 3) * 0.35)
          px[i] = lerp(px[i], targetX, 0.06)
          py[i] = lerp(py[i], targetY, 0.06)
          alpha = 0.6 + phase * 0.3
          radius = size[i] * (0.8 + phase * 0.4)
          particleHue = lerp((hue[i] + 180) % 360, 45, phase) // toward gold

        } else {
          // Gold explosion
          const phase = easeInOut(clamp((p - 0.90) / 0.10, 0, 1))
          const angle = (i / COUNT) * Math.PI * 2 * 5
          const dist  = phase * Math.max(W, H) * 0.7
          targetX = W / 2 + Math.cos(angle) * dist
          targetY = H / 2 + Math.sin(angle) * dist
          px[i] = lerp(px[i], targetX, 0.08)
          py[i] = lerp(py[i], targetY, 0.08)
          alpha = 0.9 * (1 - phase * 0.5)
          radius = size[i] * (2 + phase * 3)
          particleHue = 40 + Math.sin(i) * 20  // gold range
        }

        ctx.beginPath()
        ctx.arc(px[i], py[i], Math.max(0.3, radius), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particleHue},85%,65%,${alpha})`
        ctx.fill()
      }

      // Connection lines (only in scatter phase, for neural-net look)
      if (p < 0.20) {
        const limit = 120
        for (let i = 0; i < COUNT; i += 3) {
          for (let j = i + 3; j < COUNT; j += 3) {
            const dx = px[i] - px[j], dy = py[i] - py[j]
            const d  = Math.sqrt(dx*dx + dy*dy)
            if (d < limit) {
              ctx.beginPath()
              ctx.moveTo(px[i], py[i])
              ctx.lineTo(px[j], py[j])
              ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - d / limit)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  )
}
