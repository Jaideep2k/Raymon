import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

export default function Hero() {
  const headlineRef = useRef(null)
  const subRef      = useRef(null)
  const hintRef     = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 })

    tl.to(headlineRef.current, {
      duration: 2.4,
      text: { value: 'Someone wants you to know something.', delimiter: '' },
      ease: 'none',
    })
    .to(subRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .to(hintRef.current, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '+=0.6')
  }, [])

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center flex-col text-center overflow-hidden"
    >
      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,16,0.85) 100%)' }}
      />

      <div className="relative z-[2] max-w-2xl px-6">
        {/* Eyebrow */}
        <p className="section-label mb-6 opacity-0 animate-[fadeUp_0.6s_2s_ease_forwards]">
          A message. Just for you.
        </p>

        {/* Headline — GSAP types into this */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white min-h-[80px]"
        />

        {/* Sub */}
        <p
          ref={subRef}
          className="mt-6 text-lg sm:text-xl font-light text-white/50 tracking-wide"
          style={{ opacity: 0, transform: 'translateY(16px)' }}
        >
          But first&hellip; you'll have to earn it.
        </p>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="mt-16 flex flex-col items-center gap-2 text-white/25 text-[11px] tracking-[3px] uppercase"
          style={{ opacity: 0 }}
        >
          <div
            className="w-5 h-5 border-r-2 border-b-2 border-white/25 rotate-45"
            style={{ animation: 'bounceY 1.8s ease-in-out infinite' }}
          />
          <span>Scroll</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </section>
  )
}
