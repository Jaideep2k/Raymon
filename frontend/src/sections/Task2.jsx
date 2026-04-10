import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGame } from '../context/GameContext'

const COLORS = ['blue', 'red', 'green', 'yellow']
const FREQS  = { blue: 261, red: 329, green: 392, yellow: 523 }
const DIM_STYLE = {
  blue:   { background: '#0a2a6e', boxShadow: 'none' },
  red:    { background: '#6e0a20', boxShadow: 'none' },
  green:  { background: '#0a4e28', boxShadow: 'none' },
  yellow: { background: '#5a4a00', boxShadow: 'none' },
}
const LIT_STYLE = {
  blue:   { background: '#00d4ff', boxShadow: '0 0 40px rgba(0,212,255,0.9)' },
  red:    { background: '#ff3366', boxShadow: '0 0 40px rgba(255,51,102,0.9)' },
  green:  { background: '#00ff88', boxShadow: '0 0 40px rgba(0,255,136,0.9)' },
  yellow: { background: '#ffee00', boxShadow: '0 0 40px rgba(255,238,0,0.9)' },
}
const MAX_ROUNDS = 5

export default function Task2() {
  const { markComplete, playTone, playWin } = useGame()
  const [showModal, setShowModal] = useState(false)
  const [lit, setLit]             = useState(null)
  const [sequence, setSequence]   = useState([])
  const [round, setRound]         = useState(0)
  const [status, setStatus]       = useState('Watch the pattern...')
  const [accepting, setAccepting] = useState(false)
  const playerSeqRef = useRef([])
  const sectionRef   = useRef(null)
  const observedRef  = useRef(false)
  const gridRef      = useRef(null)

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

  const flashColor = useCallback((color) => {
    playTone(FREQS[color], 0.35)
    setLit(color)
    setTimeout(() => setLit(null), 400)
  }, [playTone])

  function startGame() {
    setShowModal(false)
    setSequence([])
    setRound(0)
    playerSeqRef.current = []
    window.__lenis?.start()
    setTimeout(() => nextRound([]), 400)
  }

  function nextRound(seq) {
    const next = COLORS[Math.floor(Math.random() * 4)]
    const newSeq = [...seq, next]
    setSequence(newSeq)
    const r = newSeq.length
    setRound(r)
    setStatus('Watch the pattern...')
    setAccepting(false)
    playerSeqRef.current = []

    newSeq.forEach((color, i) => {
      setTimeout(() => flashColor(color), 700 + i * 700)
    })
    setTimeout(() => {
      setAccepting(true)
      setStatus('Your turn — repeat the pattern!')
    }, 700 + newSeq.length * 700 + 300)
  }

  function handlePress(color) {
    if (!accepting) return
    flashColor(color)
    const idx = playerSeqRef.current.length
    playerSeqRef.current.push(color)

    if (playerSeqRef.current[idx] !== sequence[idx]) {
      // Wrong
      setAccepting(false)
      setStatus('Wrong! Resetting to round 1...')
      gsap.to(gridRef.current, { x: -8, duration: 0.05, yoyo: true, repeat: 7, ease: 'none' })
      playTone(150, 0.5, 'sawtooth')
      setTimeout(() => nextRound([]), 1600)
      return
    }

    if (playerSeqRef.current.length === sequence.length) {
      setAccepting(false)
      if (sequence.length === MAX_ROUNDS) {
        setStatus('Pattern mastered! 🔓')
        playWin()
        setTimeout(() => markComplete(2), 800)
      } else {
        setStatus('Correct! Next round...')
        setTimeout(() => nextRound(sequence), 900)
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      id="task2"
      className="relative min-h-screen flex items-center justify-center flex-col gap-8 px-6 py-20"
      style={{ background: '#000' }}
    >
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-tag">Challenge 2 of 3</div>
            <h2 className="text-2xl font-black text-white mb-3">Pattern Lock 🎮</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              Watch the sequence of flashing buttons, then repeat it in the same order.<br />
              Complete <strong className="text-white">5 rounds</strong> to unlock the next secret.<br />
              Wrong? No worries — you'll reset and try again.
            </p>
            <button className="btn-primary" onClick={startGame}>Let's Go</button>
          </div>
        </div>
      )}

      <div className="text-center z-10">
        <div className="section-label mb-2">Challenge 2 of 3</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">Pattern Lock</h2>
        {round > 0 && (
          <p className="mt-2 text-white/40 text-sm">
            Round <strong className="text-white">{round}</strong> of {MAX_ROUNDS}
          </p>
        )}
        <p className="mt-2 text-white/50 text-sm tracking-wide min-h-[22px]">{status}</p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 max-w-xs w-full z-10"
      >
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => handlePress(color)}
            className="aspect-square rounded-2xl border-none cursor-pointer transition-all duration-150"
            style={lit === color ? LIT_STYLE[color] : DIM_STYLE[color]}
          />
        ))}
      </div>

      {/* Grid pattern bg */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </section>
  )
}
