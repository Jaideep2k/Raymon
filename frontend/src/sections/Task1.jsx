import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGame } from '../context/GameContext'

const EMOJIS = ['🐍', '⚛️', '🦀', '🐳', '☁️', '🔧', '💡', '🚀']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Task1() {
  const { markComplete, playTone, playWin } = useGame()
  const [showModal, setShowModal] = useState(false)
  const [started, setStarted]     = useState(false)
  const [cards, setCards]         = useState([])
  const [flipped, setFlipped]     = useState([])
  const [matched, setMatched]     = useState(new Set())
  const [moves, setMoves]         = useState(0)
  const [locked, setLocked]       = useState(false)
  const sectionRef = useRef(null)
  const observedRef = useRef(false)

  // Trigger modal when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observedRef.current) {
          observedRef.current = true
          window.__lenis?.stop()
          setShowModal(true)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function startGame() {
    const pairs = shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({ id: i, emoji, flipped: false }))
    setCards(pairs)
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setShowModal(false)
    window.__lenis?.start()
  }

  function handleFlip(card) {
    if (locked || matched.has(card.id) || flipped.find(c => c.id === card.id)) return
    playTone(440, 0.12)
    const newFlipped = [...flipped, card]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newFlipped
      if (a.emoji === b.emoji) {
        playTone(660, 0.2)
        const newMatched = new Set(matched)
        newMatched.add(a.id)
        newMatched.add(b.id)
        setMatched(newMatched)
        setFlipped([])
        setLocked(false)
        if (newMatched.size === cards.length) {
          setTimeout(() => {
            playWin()
            setTimeout(() => {
              markComplete(1)
            }, 700)
          }, 300)
        }
      } else {
        playTone(220, 0.25)
        setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
      }
    }
  }

  const totalPairs = cards.length / 2
  const matchedPairs = matched.size / 2

  return (
    <section
      ref={sectionRef}
      id="task1"
      className="relative min-h-screen flex items-center justify-center flex-col gap-8 px-6 py-20"
      style={{ background: 'linear-gradient(180deg, #0d0020 0%, #0a0a1a 100%)' }}
    >
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-tag">Challenge 1 of 3</div>
            <h2 className="text-2xl font-black text-white mb-3">Memory Matrix 🧠</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              Flip the cards and find all 8 matching pairs.<br />
              Two cards at a time — remember what you've seen.<br />
              Complete it to unlock the next secret.
            </p>
            <button className="btn-primary" onClick={startGame}>I'm Ready</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center z-10">
        <div className="section-label mb-2">Challenge 1 of 3</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">Memory Matrix</h2>
        {started && (
          <div className="mt-3 flex gap-8 justify-center text-sm text-white/45">
            <span>Matched: <strong className="text-white">{matchedPairs}/{totalPairs}</strong></span>
            <span>Moves: <strong className="text-white">{moves}</strong></span>
          </div>
        )}
      </div>

      {/* Card Grid */}
      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-3 max-w-sm w-full z-10">
          {cards.map(card => {
            const isFlipped  = !!flipped.find(c => c.id === card.id)
            const isMatched  = matched.has(card.id)
            const faceUp     = isFlipped || isMatched

            return (
              <div
                key={card.id}
                onClick={() => handleFlip(card)}
                className="aspect-square cursor-pointer"
                style={{ perspective: 600 }}
              >
                <div
                  className="relative w-full h-full rounded-xl transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: faceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-2xl font-bold text-white/15"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg,#1a1035,#0d0828)',
                      border: '1px solid rgba(108,99,255,0.3)',
                    }}
                  >
                    ?
                  </div>
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: isMatched
                        ? 'linear-gradient(135deg,#0d2e1a,#0a3320)'
                        : 'linear-gradient(135deg,#1e1060,#2d1b6e)',
                      border: isMatched ? '1px solid #00ff88' : '1px solid rgba(108,99,255,0.5)',
                      boxShadow: isMatched ? '0 0 20px rgba(0,255,136,0.3)' : 'none',
                    }}
                  >
                    {card.emoji}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {matchedPairs === totalPairs && totalPairs > 0 && (
        <div className="text-center z-10 mt-4 animate-pulse">
          <p className="text-neon-green text-lg font-bold tracking-wide">
            All pairs found! Scroll to continue ↓
          </p>
        </div>
      )}
    </section>
  )
}
