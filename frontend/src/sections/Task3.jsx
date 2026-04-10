import { useState, useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'

const RIDDLES = [
  {
    q: 'I am always 0 or 1. Never maybe. Never sometimes.\nWhat am I?',
    answers: ['bit', 'binary', 'boolean', 'bool'],
  },
  {
    q: 'Developers spend more time reading me than writing me.\nI am not documentation.\nWhat am I?',
    answers: ['code', 'source code', 'sourcecode'],
  },
  {
    q: 'I have a head and a tail, but no body.\nI\'m not a coin — I\'m what you chase when production goes down.',
    answers: ['stack trace', 'stacktrace', 'trace', 'log', 'error log', 'stack'],
  },
]

function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { displayed, done }
}

export default function Task3() {
  const { markComplete, playTone, playWin } = useGame()
  const [showModal, setShowModal] = useState(false)
  const [started, setStarted]     = useState(false)
  const [riddleIdx, setRiddleIdx] = useState(0)
  const [answer, setAnswer]       = useState('')
  const [feedback, setFeedback]   = useState(null) // {msg, ok}
  const [shake, setShake]         = useState(false)
  const sectionRef  = useRef(null)
  const observedRef = useRef(false)
  const inputRef    = useRef(null)

  const { displayed, done } = useTypewriter(
    started ? RIDDLES[riddleIdx]?.q ?? '' : '',
    20
  )

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
    setShowModal(false)
    setStarted(true)
    setRiddleIdx(0)
    setAnswer('')
    setFeedback(null)
    window.__lenis?.start()
    setTimeout(() => inputRef.current?.focus(), 400)
  }

  function checkAnswer() {
    if (!done) return
    const val = answer.trim().toLowerCase()
    if (RIDDLES[riddleIdx].answers.includes(val)) {
      playTone(880, 0.3)
      const msgs = ['Correct. You think like an engineer.', 'Exactly right. Sharp.', 'The machine approves.']
      setFeedback({ msg: msgs[riddleIdx], ok: true })
      setAnswer('')
      if (riddleIdx + 1 >= RIDDLES.length) {
        setTimeout(() => {
          playWin()
          setFeedback({ msg: '> All challenges complete. Access granted. 🔓', ok: true })
          setTimeout(() => markComplete(3), 900)
        }, 800)
      } else {
        setTimeout(() => {
          setFeedback(null)
          setRiddleIdx(i => i + 1)
          setTimeout(() => inputRef.current?.focus(), 200)
        }, 1000)
      }
    } else {
      playTone(180, 0.35, 'sawtooth')
      const msgs = ['Think again...', 'Not quite. Try another angle.', 'Keep thinking...']
      setFeedback({ msg: msgs[Math.floor(Math.random() * msgs.length)], ok: false })
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const allDone = riddleIdx >= RIDDLES.length

  return (
    <section
      ref={sectionRef}
      id="task3"
      className="relative min-h-screen flex items-center justify-center flex-col gap-8 px-6 py-20"
      style={{ background: '#001a00' }}
    >
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-tag">Challenge 3 of 3</div>
            <h2 className="text-2xl font-black text-white mb-3">// decode.exe 🖥️</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              Three riddles stand between you and the truth.<br />
              Answer them like a software engineer.<br />
              Unlimited attempts — the answers are closer than you think.
            </p>
            <button className="btn-primary" onClick={startGame}>Accept the Challenge</button>
          </div>
        </div>
      )}

      <div className="text-center z-10">
        <div className="section-label mb-2" style={{ color: 'rgba(0,255,136,0.4)' }}>Challenge 3 of 3</div>
        <h2 className="text-3xl sm:text-4xl font-black font-mono" style={{ color: '#00ff88' }}>// decode.exe</h2>
        {started && !allDone && (
          <p className="mt-2 font-mono text-xs" style={{ color: 'rgba(0,255,136,0.4)' }}>
            Riddle {riddleIdx + 1} of {RIDDLES.length}
          </p>
        )}
      </div>

      {/* Terminal window */}
      <div
        className="max-w-xl w-full rounded-xl overflow-hidden z-10"
        style={{ boxShadow: '0 0 60px rgba(0,255,136,0.08)' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#1a1a1a' }}>
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-white/30">raymon-terminal — bash</span>
        </div>

        {/* Body */}
        <div className="p-7 font-mono min-h-[240px]" style={{ background: '#0a0a0a' }}>
          <p className="text-[#00ff88]/70 text-sm mb-1">
            <span className="text-[#00ff88]">$</span> ./challenge --riddles 3
          </p>
          <p className="text-[#00ff88]/40 text-xs mb-5"># Three riddles. Unlimited attempts. Think like an engineer.</p>

          {started && !allDone && (
            <>
              <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap mb-4 min-h-[60px]">
                {displayed}
                {!done && <span className="inline-block w-2 h-4 bg-[#00ff88]/60 animate-pulse align-middle ml-0.5" />}
              </p>

              {/* Input */}
              <div
                className="flex items-center gap-2 mt-4"
                style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}
              >
                <span className="text-[#00ff88] text-base">›</span>
                <input
                  ref={inputRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  placeholder="type your answer..."
                  className="flex-1 bg-transparent outline-none font-mono text-sm px-2 py-1"
                  style={{
                    borderBottom: feedback?.ok === false ? '1px solid #ff3366' : '1px solid rgba(0,255,136,0.3)',
                    color: '#00ff88',
                    caretColor: '#00ff88',
                  }}
                />
                <button
                  onClick={checkAnswer}
                  className="text-[#00ff88]/50 hover:text-[#00ff88] text-xs font-mono transition-colors"
                >
                  [enter]
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <p
                  className="mt-3 font-mono text-xs leading-relaxed"
                  style={{ color: feedback.ok ? '#00ff88' : '#ff3366' }}
                >
                  {feedback.msg}
                </p>
              )}
            </>
          )}

          {allDone && (
            <p className="text-[#00ff88] font-mono text-sm mt-4">
              {feedback?.msg || '> All challenges complete. Access granted. 🔓'}
            </p>
          )}
        </div>
      </div>

      {allDone && (
        <p className="text-neon-green font-mono text-sm animate-pulse z-10">
          Scroll to unlock the secret ↓
        </p>
      )}
    </section>
  )
}
