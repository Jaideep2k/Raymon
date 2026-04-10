import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STATS = [
  { id: 'lines', target: 847293, label: 'Lines of Code', fmt: v => Math.floor(v).toLocaleString() },
  { id: 'bugs',  target: 12847,  label: 'Bugs Squashed', fmt: v => Math.floor(v).toLocaleString() },
  { id: 'coffee',target: null,   label: 'Coffees Consumed', fmt: () => '☕ ∞' },
]

const QUOTE = '"The best code needs no comments to explain itself. That\'s the kind they write."'

function buildGhCells() {
  const cells = []
  for (let i = 0; i < 364; i++) {
    const intensity = Math.random()
    cells.push({ i, active: intensity > 0.35, dark: intensity > 0.6 })
  }
  return cells
}
const GH_CELLS = buildGhCells()

export default function Evidence() {
  const sectionRef = useRef(null)
  const statRefs   = useRef([])
  const numRefs    = useRef([])
  const ghRef      = useRef(null)
  const quoteRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stat cards
      statRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' } }
        )
      })

      // Count-up numbers
      STATS.filter(s => s.target).forEach((stat, i) => {
        const el = numRefs.current[i]
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: stat.target, duration: 2.2, ease: 'power2.out',
              onUpdate() { el.textContent = stat.fmt(this.targets()[0].val) },
              onComplete() { el.textContent = stat.fmt(stat.target) },
            })
          },
        })
      })

      // GH graph
      gsap.fromTo(ghRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: ghRef.current, start: 'top 82%', toggleActions: 'play none none none' } }
      )
      ScrollTrigger.create({
        trigger: ghRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('.gh-cell').forEach((cell, idx) => {
            setTimeout(() => {
              if (GH_CELLS[idx]?.active) cell.style.background = GH_CELLS[idx].dark ? '#00a85a' : '#00ff88'
            }, idx * 2.5)
          })
        },
      })

      // Quote
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="evidence"
      className="relative min-h-screen flex flex-col items-center justify-center gap-20 px-6 py-28"
      style={{ background: 'linear-gradient(180deg,#000 0%,#0a0a1a 100%)' }}
    >
      <p className="section-label">The Evidence</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            ref={el => statRefs.current[i] = el}
            className="text-center rounded-2xl px-6 py-10 opacity-0"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="text-5xl sm:text-6xl font-black leading-none"
              style={{
                background: 'linear-gradient(135deg,#00d4ff,#f5c842)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {stat.target
                ? <span ref={el => numRefs.current[i] = el}>0</span>
                : <span>☕ ∞</span>
              }
            </div>
            <p className="mt-3 text-[11px] tracking-[2px] uppercase text-white/35 font-light">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* GitHub graph */}
      <div ref={ghRef} className="max-w-2xl w-full opacity-0">
        <p className="text-[11px] tracking-[2px] uppercase text-white/30 mb-4 font-light">Contribution Activity</p>
        <div className="flex flex-wrap gap-[3px]">
          {GH_CELLS.map(cell => (
            <div
              key={cell.i}
              className="gh-cell rounded-[2px]"
              style={{ width: 11, height: 11, background: 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }}
            />
          ))}
        </div>
      </div>

      {/* Quote */}
      <div ref={quoteRef} className="max-w-xl text-center opacity-0">
        <blockquote className="text-xl sm:text-2xl font-light italic text-white/75 leading-relaxed">
          {QUOTE}
        </blockquote>
        <cite className="block mt-5 text-[11px] tracking-[2px] uppercase text-white/25 not-italic">
          — The Engineering Annals, Vol. 7
        </cite>
      </div>
    </section>
  )
}
