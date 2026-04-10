import React from 'react'
import ReactDOM from 'react-dom/client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

// Smooth scroll via Lenis, integrated with GSAP ticker
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Expose lenis globally so sections can use lenis.stop() / lenis.start()
window.__lenis = lenis

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
