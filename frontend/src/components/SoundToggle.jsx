import { useGame } from '../context/GameContext'

export default function SoundToggle() {
  const { soundOn, toggleSound } = useGame()
  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-5 right-5 z-[9998] text-sm px-4 py-2 rounded-full
                 transition-all duration-300 cursor-pointer"
      style={{
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: soundOn ? '#fff' : 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {soundOn ? '🔊 Sound on' : '🔇 Sound off'}
    </button>
  )
}
