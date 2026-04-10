@echo off
title Raymon's Secret Website - Launcher
color 0A

echo.
echo  ============================================
echo   Raymon's Secret Website - Starting up...
echo  ============================================
echo.

:: ── Python game server ────────────────────────────────────────
echo  [1/3] Starting Python game server (port 5050)...
cd /d "%~dp0games"
if not exist venv (
    echo       Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
start "Games Server" cmd /k "call venv\Scripts\activate.bat && python app.py"
cd /d "%~dp0"

:: ── Node backend ──────────────────────────────────────────────
echo  [2/3] Starting Node.js backend (port 5001)...
cd /d "%~dp0backend"
if not exist node_modules (
    echo       Installing Node dependencies...
    npm install
)
start "Node Backend" cmd /k "npm start"
cd /d "%~dp0"

:: ── React frontend ────────────────────────────────────────────
echo  [3/3] Starting React frontend (port 5173)...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo       Installing frontend dependencies...
    npm install
)
start "React Frontend" cmd /k "npm run dev"
cd /d "%~dp0"

:: ── Wait then open browser ────────────────────────────────────
echo.
echo  All servers launching... opening browser in 5 seconds.
echo.
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo  ============================================
echo   Website is running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5001
echo   Games    : http://localhost:5050
echo  ============================================
echo.
pause
