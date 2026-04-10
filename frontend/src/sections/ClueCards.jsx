import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CLUES = [
  { num: '// clue_001', text: 'They debugged a production outage at 2am — and still committed clean, readable code before sunrise.' },
  { num: '// clue_002', text: 'Their pull requests are reviewed within hours. Merged without drama. Every. Single. Time.' },
  { num: '// clue_003', text: 'They don\'t just fix bugs. They find the root cause and eliminate the entire class of bug. Permanently.' },
  { num: '// clue_004', text: 'They have never once said "it works on my machine." Because it works everywhere. Always.' },
]

export default function ClueCards() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const cardRefs    = useRef([])

  useEffect(() => {
    const isMobile = window.innerWidth <= 768

    if (isMobile) {
      // Mobile: simple scroll fade-in
      cardRefs.current.forEach(card => {
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' } }
        )
      })
      return
    }

    // Desktop: horizontal scroll
    const numPanels = CLUES.length
    const vw = window.innerWidth
    const scrollDist = vw * (numPanels - 1)
    sectionRef.current.style.height = `${100 + numPanels * 100}vh`
    gsap.set(trackRef.current, { width: vw * numPanels })

    const tween = gsap.to(trackRef.current, {
      x: () => -scrollDist,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollDist}`,
        pin: '.clues-sticky',
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate(self) {
          cardRefs.current.forEach((card, i) => {
            if (!card) return
            const panelProgress = self.progress * (numPanels - 1) - i
            if (Math.abs(panelProgress) < 0.7) {
              gsap.to(card, { opacity: 1, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            }
          })
        },
      },
    })

    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [])

  return (
    <section ref={sectionRef} id="clues" className="relative" style={{ background: '#000' }}>
      <div className="clues-sticky sticky top-0 h-screen flex items-center overflow-hidden">
        <div ref={trackRef} className="flex">
          {CLUES.map((clue, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-screen h-screen flex items-center justify-center px-12 md:px-20"
            >
              <div
                ref={el => cardRefs.current[i] = el}
                className="max-w-xl rounded-2xl p-10 md:p-12"
                style={{
                  opacity: 0,
                  transform: 'rotateY(30deg) scale(0.9)',
                  background: 'rgba(0,255,136,0.03)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  boxShadow: '0 0 60px rgba(0,255,136,0.05)',
                }}
              >
                <div className="font-mono text-[11px] tracking-[3px] uppercase text-neon-green/50 mb-5">
                  {clue.num}
                </div>
                <p className="font-mono text-lg md:text-xl text-neon-green/85 leading-relaxed">
                  <span className="opacity-40">&gt; </span>{clue.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
