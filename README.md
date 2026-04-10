# Raymon's Secret Website 🎉

A scroll-driven entertainment experience with 3 mini-games, cinematic animations, and a secret message reveal — built for Raymon Chawla.

---

## Stack

| Layer     | Tech                                      | Port  |
|-----------|-------------------------------------------|-------|
| Frontend  | React 18 + Vite + GSAP + Lenis + Tailwind | 5173  |
| Backend   | Node.js + Express (proxies game routes)   | 5001  |
| Games     | Python 3 + Flask                          | 5050  |

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Python 3.9+** — [python.org](https://python.org)
- **npm** (comes with Node)

---

## Quick Start (Windows)

```bat
double-click start.bat
```

That's it — it installs everything and opens the browser automatically.

---

## Quick Start (Mac / Linux)

```bash
chmod +x start.sh
./start.sh
```

---

## Manual Start (3 terminals)

**Terminal 1 — Python game server:**
```bash
cd games
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

**Terminal 2 — Node backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 3 — React frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**

---

## The Experience

| Section | What happens |
|---------|-------------|
| Preloader | Pulsing orb, dramatic fade-in |
| Hero | 1800-particle canvas field, GSAP typewriter headline |
| Mystery | Word-by-word reveal, blurry silhouette sharpens on scroll |
| **Game 1** | Memory card flip — match all 8 tech emoji pairs |
| Clue Cards | Horizontal scroll through 4 terminal-style hint cards |
| **Game 2** | Simon Says — repeat 5 rounds of color patterns |
| Evidence | Animated stat counters, live GitHub contribution graph |
| **Game 3** | Code riddles in a terminal — 3 engineering puzzles |
| Buildup | Countdown 3→2→1, door SVG swings open |
| **Reveal** | Confetti explosion, gold shimmer: "RAYMON CHAWLA is a certified genius & an exceptional software engineer" |

---

## Project Structure

```
Raymon/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/    # Preloader, ParticleCanvas, ProgressTracker, SoundToggle
│   │   ├── sections/      # Hero, Mystery, Task1-3, ClueCards, Evidence, Buildup, Reveal
│   │   ├── context/       # GameContext (state, audio, win detection)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/           # Node.js Express server
│   ├── server.js
│   └── package.json
├── games/             # Python Flask game server
│   ├── app.py         # All 3 games as inline HTML templates
│   └── requirements.txt
├── start.bat          # Windows one-click launcher
├── start.sh           # Mac/Linux one-click launcher
└── README.md
```
