import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app  = express()
const PORT = process.env.PORT || 5001

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true, time: Date.now() }))

// ── Proxy game routes to Python Flask (port 5050) ─────────────────────────────
app.use(
  '/game',
  createProxyMiddleware({
    target: 'http://localhost:5050',
    changeOrigin: true,
  })
)

// ── Progress persistence (in-memory, session-like) ────────────────────────────
const sessions = new Map()

function getSession(id) {
  if (!sessions.has(id)) sessions.set(id, { completed: {} })
  return sessions.get(id)
}

app.get('/api/progress/:sessionId', (req, res) => {
  res.json(getSession(req.params.sessionId))
})

app.post('/api/progress/:sessionId/complete', (req, res) => {
  const { gameId } = req.body
  const session = getSession(req.params.sessionId)
  session.completed[gameId] = true
  res.json(session)
})

app.listen(PORT, () => {
  console.log(`\n  🚀  Node backend running at http://localhost:${PORT}`)
  console.log(`  Proxying /game/* → http://localhost:5050\n`)
})
