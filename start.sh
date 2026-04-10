#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  ============================================"
echo "   Raymon's Secret Website — Starting up..."
echo "  ============================================"
echo ""

# ── Python game server ────────────────────────────────────────
echo "  [1/3] Starting Python game server (port 5050)..."
cd "$SCRIPT_DIR/games"
[ ! -d venv ] && python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt -q
python app.py &
PYTHON_PID=$!
cd "$SCRIPT_DIR"

# ── Node backend ──────────────────────────────────────────────
echo "  [2/3] Starting Node.js backend (port 5001)..."
cd "$SCRIPT_DIR/backend"
[ ! -d node_modules ] && npm install
npm start &
NODE_PID=$!
cd "$SCRIPT_DIR"

# ── React frontend ────────────────────────────────────────────
echo "  [3/3] Starting React frontend (port 5173)..."
cd "$SCRIPT_DIR/frontend"
[ ! -d node_modules ] && npm install
npm run dev &
VITE_PID=$!
cd "$SCRIPT_DIR"

sleep 4
echo ""
echo "  ============================================"
echo "   Frontend : http://localhost:5173"
echo "   Backend  : http://localhost:5001"
echo "   Games    : http://localhost:5050"
echo "  ============================================"
echo ""

# Open browser (macOS / Linux)
if command -v open &>/dev/null; then open http://localhost:5173
elif command -v xdg-open &>/dev/null; then xdg-open http://localhost:5173; fi

# Keep alive — Ctrl+C stops all
trap "kill $PYTHON_PID $NODE_PID $VITE_PID 2>/dev/null; exit" INT
wait
