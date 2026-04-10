import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [completed, setCompleted] = useState({ 1: false, 2: false, 3: false })
  const [soundOn, setSoundOn] = useState(false)
  const [audioCtx, setAudioCtx] = useState(null)

  // Listen for postMessage from game iframes
  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === 'GAME_COMPLETE') {
        const id = e.data.gameId
        setCompleted(prev => ({ ...prev, [id]: true }))
        window.__lenis?.start()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const markComplete = useCallback((id) => {
    setCompleted(prev => ({ ...prev, [id]: true }))
    window.__lenis?.start()
  }, [])

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      if (!prev && !audioCtx) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        setAudioCtx(ctx)
      }
      return !prev
    })
  }, [audioCtx])

  const playTone = useCallback((freq, dur = 0.2, type = 'sine', vol = 0.25) => {
    if (!soundOn || !audioCtx) return
    try {
      const osc  = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = type
      osc.frequency.value = freq
      gain.gain.setValueAtTime(vol, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur)
      osc.start()
      osc.stop(audioCtx.currentTime + dur)
    } catch (_) {}
  }, [soundOn, audioCtx])

  const playWin = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.3), i * 110))
  }, [playTone])

  const playFanfare = useCallback(() => {
    [523, 659, 784, 880, 1047, 1319, 1568].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.4, 'triangle', 0.2), i * 90))
  }, [playTone])

  return (
    <GameContext.Provider value={{ completed, markComplete, soundOn, toggleSound, playTone, playWin, playFanfare }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
