import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    gsap.set(el, { opacity: 1 })
    const tl = gsap.timeline({ delay: 1.6 })
    tl.to(el, { opacity: 0, duration: 0.8, ease: 'power2.out',
                onComplete: () => { el.style.display = 'none' } })
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-7"
      style={{ background: '#000' }}
    >
      {/* Pulsing orb */}
      <div
        className="w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #6c63ff, #050510)',
          boxShadow: '0 0 40px rgba(108,99,255,0.8), 0 0 80px rgba(108,99,255,0.4)',
          animation: 'pulseOrb 1.4s ease-in-out infinite',
        }}
      />
      <p className="text-[13px] tracking-[4px] uppercase text-white/40 font-light">
        Loading something important&hellip;
      </p>
      <style>{`
        @keyframes pulseOrb {
          0%,100% { transform:scale(1); box-shadow:0 0 40px rgba(108,99,255,.8),0 0 80px rgba(108,99,255,.4); }
          50%      { transform:scale(1.12); box-shadow:0 0 60px rgba(108,99,255,1),0 0 120px rgba(108,99,255,.6); }
        }
      `}</style>
    </div>
  )
}
