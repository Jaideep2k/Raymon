import { useEffect, useRef } from 'react'
import { GameProvider } from './context/GameContext'
import Preloader       from './components/Preloader'
import ProgressTracker from './components/ProgressTracker'
import ParticleCanvas  from './components/ParticleCanvas'
import SoundToggle     from './components/SoundToggle'
import Hero            from './sections/Hero'
import Mystery         from './sections/Mystery'
import Task1           from './sections/Task1'
import ClueCards       from './sections/ClueCards'
import Task2           from './sections/Task2'
import Evidence        from './sections/Evidence'
import Task3           from './sections/Task3'
import Buildup         from './sections/Buildup'
import Reveal          from './sections/Reveal'

export default function App() {
  return (
    <GameProvider>
      <Preloader />
      <ProgressTracker />
      <SoundToggle />
      <ParticleCanvas />

      <main>
        <Hero />
        <Mystery />
        <Task1 />
        <ClueCards />
        <Task2 />
        <Evidence />
        <Task3 />
        <Buildup />
        <Reveal />
      </main>
    </GameProvider>
  )
}
