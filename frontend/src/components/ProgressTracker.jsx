import { useGame } from '../context/GameContext'

export default function ProgressTracker() {
  const { completed } = useGame()

  return (
    <div className="fixed top-5 right-5 z-[9998] flex gap-2">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          title={`Challenge ${id}`}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
          style={completed[id] ? {
            border: '2px solid #00ff88',
            color: '#00ff88',
            background: 'rgba(0,255,136,0.12)',
            boxShadow: '0 0 14px rgba(0,255,136,0.45)',
          } : {
            border: '2px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.25)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {completed[id] ? '✓' : id}
        </div>
      ))}
    </div>
  )
}
