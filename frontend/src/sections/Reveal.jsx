import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGame } from '../context/GameContext'

export default function Reveal() {
  const { playFanfare } = useGame()
  const sectionRef  = useRef(null)
  const canvasRef   = useRef(null)
  const labelRef    = useRef(null)
  const nameRef     = useRef(null)
  const subRef      = useRef(null)
  const avatarRef   = useRef(null)
  const actionsRef  = useRef(null)
  const triggered   = useRef(false)
  const [copied, setCopied]   = useState(false)

  // Confetti
  function launchConfetti() {
    const canvas = canvasRef.current
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const colors = ['#f5c842','#ffe97a','#6c63ff','#00ff88','#ff3366','#00d4ff','#fff']
    const particles = Array.from({ length: 450 }, () => ({
      x: Math.random() * canvas.width,
      y: -30 - Math.random() * 220,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      w: Math.random() * 11 + 5,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 9,
      alpha: 1,
    }))

    let frame = 0
    ;(function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      let alive = false
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.09
        if (frame > 160) p.alpha -= 0.007
        if (p.alpha <= 0 || p.y > canvas.height + 40) return
        alive = true
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot * Math.PI / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive) requestAnimationFrame(loop)
    })()
  }

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        launchConfetti()
        playFanfare()

        const tl = gsap.timeline()
        tl.to(labelRef.current,  { opacity: 1, duration: 0.5, ease: 'power2.out' })
          .to(nameRef.current,   { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)' }, '+=0.15')
          .to(subRef.current,    { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2')
          .to(avatarRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, '+=0.2')
          .to(actionsRef.current,{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      },
    })
  }, [playFanfare])

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2800)
  }

  return (
    <section
      ref={sectionRef}
      id="reveal"
      className="relative min-h-screen flex items-center justify-center flex-col text-center px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0a0020 0%,#000814 50%,#0a1500 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Star burst decoration */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] flex items-center justify-center opacity-60"
        style={{ animation: 'spin 60s linear infinite' }}
      >
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none">
          {[0,45,90,135,22,67,112,157].map((deg, i) => (
            <line key={i}
              x1="300" y1="300"
              x2={300 + Math.cos(deg * Math.PI/180) * 300}
              y2={300 + Math.sin(deg * Math.PI/180) * 300}
              stroke={`rgba(245,200,66,${i < 4 ? 0.12 : 0.06})`} strokeWidth="1"
            />
          ))}
          <circle cx="300" cy="300" r="200" stroke="rgba(245,200,66,0.07)" strokeWidth="1" fill="none"/>
          <circle cx="300" cy="300" r="120" stroke="rgba(245,200,66,0.1)" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-[10] flex flex-col items-center">
        <p
          ref={labelRef}
          className="text-[11px] tracking-[5px] uppercase mb-4 font-light"
          style={{ color: 'var(--gold)', opacity: 0 }}
        >
          The Secret Has Been Unlocked
        </p>

        <h1
          ref={nameRef}
          className="font-black leading-none tracking-tight shimmer-gold select-none"
          style={{
            fontSize: 'clamp(44px,10vw,120px)',
            letterSpacing: '-2px',
            opacity: 0,
            transform: 'translateY(60px) scale(0.8)',
          }}
        >
          RAYMON CHAWLA
        </h1>

        <p
          ref={subRef}
          className="mt-6 text-lg sm:text-2xl font-light text-white/75 max-w-xl leading-relaxed"
          style={{ opacity: 0 }}
        >
          is a certified genius &amp; an exceptional software engineer
        </p>

        {/* Avatar */}
        <div
          ref={avatarRef}
          className="mt-12 flex flex-col items-center gap-3"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(245,200,66,0.3), rgba(245,200,66,0.1))',
                border: '2px solid rgba(245,200,66,0.45)',
                boxShadow: '0 0 40px rgba(245,200,66,0.2)',
              }}
            />
            <div
              className="w-32 -mt-2 rounded-[55px_55px_20px_20px]"
              style={{
                height: 120,
                background: 'linear-gradient(135deg,rgba(245,200,66,0.18),rgba(245,200,66,0.05))',
                border: '2px solid rgba(245,200,66,0.3)',
              }}
            />
          </div>
          <div
            className="text-[11px] tracking-[2px] uppercase font-bold px-5 py-1.5 rounded-full"
            style={{
              color: 'var(--gold)',
              background: 'rgba(245,200,66,0.1)',
              border: '1px solid rgba(245,200,66,0.25)',
            }}
          >
            ⭐ Certified Genius
          </div>
        </div>

        {/* Actions */}
        <div
          ref={actionsRef}
          className="mt-12 flex flex-wrap gap-4 justify-center"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <button className="btn-gold" onClick={copyLink}>
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
          <button
            className="btn-outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑ Start Over
          </button>
        </div>

        {/* Tooltip */}
        {copied && (
          <div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 text-sm px-5 py-2.5 rounded-xl z-[9999]"
            style={{
              background: 'rgba(0,255,136,0.12)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00ff88',
              backdropFilter: 'blur(10px)',
            }}
          >
            Link copied! Share the secret 🎉
          </div>
        )}
      </div>
    </section>
  )
}
