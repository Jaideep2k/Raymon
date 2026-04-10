import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const WORDS = [
  { text: 'There is',              side: 'left'  },
  { text: 'a person',             side: 'right', accent: true },
  { text: 'who writes code',      side: 'left'  },
  { text: 'like poetry.',         side: 'right', accent: true },
  { text: 'Who solves problems',  side: 'left'  },
  { text: 'like a grandmaster.',  side: 'right', accent: true },
  { text: 'Who ships things',     side: 'left'  },
  { text: 'that actually work.',  side: 'right', accent: true },
]

export default function Mystery() {
  const sectionRef   = useRef(null)
  const silhouetteRef = useRef(null)
  const wordRefs     = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word reveals — staggered per scroll position
      wordRefs.current.forEach((el, i) => {
        if (!el) return
        const fromX = WORDS[i].side === 'left' ? -70 : 70
        gsap.fromTo(el,
          { opacity: 0, x: fromX },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${8 + i * 10}% center`,
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Silhouette un-blur on scroll
      gsap.to(silhouetteRef.current, {
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '30% top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh]"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #0d0020 100%)' }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center flex-col gap-10 px-6 overflow-hidden">
        {/* Words */}
        <div className="max-w-3xl text-center space-y-2">
          {WORDS.map((w, i) => (
            <span
              key={i}
              ref={el => wordRefs.current[i] = el}
              className={`inline-block mx-2 text-3xl sm:text-4xl lg:text-5xl font-black leading-snug
                          ${w.accent ? 'text-[#00d4ff]' : 'text-white'}`}
              style={{ opacity: 0 }}
            >
              {w.text}
            </span>
          ))}
        </div>

        {/* Silhouette */}
        <div
          ref={silhouetteRef}
          className="flex flex-col items-center"
          style={{ filter: 'blur(20px)' }}
        >
          <div className="w-16 h-16 rounded-full" style={{ background: 'rgba(150,130,255,0.25)' }} />
          <div
            className="w-28 rounded-[55px_55px_20px_20px] -mt-2"
            style={{ height: 120, background: 'rgba(150,130,255,0.18)' }}
          />
        </div>
      </div>
    </section>
  )
}
