import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Buildup() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const bgRef       = useRef(null)
  const textRef     = useRef(null)
  const doorRef     = useRef(null)
  const countRef    = useRef(null)
  const panelRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress

          // Background brightness
          const brightness = 0.3 + p * 2.4
          gsap.set(bgRef.current, { filter: `brightness(${brightness})` })

          // Phase: text
          if (p < 0.15) {
            gsap.set(textRef.current, { opacity: p / 0.15 })
            gsap.set(doorRef.current, { opacity: 0 })
            gsap.set(countRef.current, { opacity: 0 })
          } else if (p < 0.35) {
            gsap.set(textRef.current, { opacity: 1 })
            gsap.set(doorRef.current, { opacity: Math.min(1, (p - 0.15) / 0.2) })
            gsap.set(countRef.current, { opacity: 0 })
          } else if (p < 0.55) {
            countRef.current.textContent = '3'
            gsap.set(countRef.current, { opacity: 1 })
            gsap.set(doorRef.current, { opacity: 1 })
          } else if (p < 0.75) {
            countRef.current.textContent = '2'
            gsap.set(countRef.current, { opacity: 1 })
          } else {
            countRef.current.textContent = '1'
            gsap.set(countRef.current, { opacity: 1 })
            // Door swings open
            const doorProg = Math.min(1, (p - 0.75) / 0.25)
            gsap.set(panelRef.current, {
              rotationY: -doorProg * 80,
              transformOrigin: 'left center',
            })
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="buildup"
      style={{ minHeight: '400vh', background: 'linear-gradient(180deg, #0a0a1a 0%, #000 100%)' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245,200,66,0.07) 0%, transparent 70%)',
          }}
        />

        <p
          ref={textRef}
          className="relative z-10 text-xl sm:text-2xl font-light text-white/55 mb-8 tracking-wide"
          style={{ opacity: 0 }}
        >
          The secret is almost yours.
        </p>

        {/* Countdown */}
        <div
          ref={countRef}
          className="relative z-10 font-black text-white leading-none select-none"
          style={{
            fontSize: 'clamp(100px, 22vw, 220px)',
            letterSpacing: '-6px',
            opacity: 0,
            textShadow: '0 0 80px rgba(245,200,66,0.3)',
          }}
        >
          3
        </div>

        {/* Door SVG */}
        <div ref={doorRef} className="relative z-10 mt-8" style={{ opacity: 0 }}>
          <svg
            width="110" height="150"
            viewBox="0 0 110 150"
            overflow="visible"
            style={{ filter: 'drop-shadow(0 0 20px rgba(245,200,66,0.25))' }}
          >
            {/* Frame */}
            <rect x="5" y="5" width="100" height="140" rx="4"
              fill="rgba(245,200,66,0.07)" stroke="rgba(245,200,66,0.25)" strokeWidth="1.5"/>
            {/* Door panel */}
            <g ref={panelRef} style={{ transformOrigin: '5px 75px' }}>
              <rect x="5" y="5" width="100" height="140" rx="4"
                fill="rgba(245,200,66,0.14)" stroke="rgba(245,200,66,0.5)" strokeWidth="1.5"/>
              {/* Panels */}
              <rect x="18" y="22" width="34" height="46" rx="2"
                fill="none" stroke="rgba(245,200,66,0.25)" strokeWidth="1"/>
              <rect x="58" y="22" width="34" height="46" rx="2"
                fill="none" stroke="rgba(245,200,66,0.25)" strokeWidth="1"/>
              <rect x="18" y="82" width="74" height="46" rx="2"
                fill="none" stroke="rgba(245,200,66,0.25)" strokeWidth="1"/>
              {/* Knob */}
              <circle cx="94" cy="80" r="5" fill="rgba(245,200,66,0.65)"/>
            </g>
            <text x="55" y="168" textAnchor="middle" fontSize="10"
              fill="rgba(245,200,66,0.45)" fontFamily="Inter,sans-serif" letterSpacing="3">
              ENTER
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
