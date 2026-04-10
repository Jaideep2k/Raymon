"""
Raymon's Game Server — Python Flask (port 5050)
Serves three self-contained mini-game HTML pages.
Each game posts window.parent.postMessage({ type:'GAME_COMPLETE', gameId: N })
when the player wins, which the React frontend catches and unlocks scrolling.
"""

from flask import Flask, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────────────────────
#  Shared CSS / JS boilerplate injected into every game page
# ─────────────────────────────────────────────────────────────
BASE_CSS = """
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --gold: #f5c842;
  --neon-blue: #00d4ff;
  --neon-green: #00ff88;
  --neon-red: #ff3366;
  --neon-yellow: #ffee00;
}
html, body { width:100%; height:100%; overflow:hidden; }
body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #050510;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  user-select: none;
}
h2 { font-size: clamp(18px,3vw,26px); font-weight: 900; letter-spacing:-0.5px; }
.meta { font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing:0.5px; }
.win-msg {
  font-size: 18px; font-weight: 700;
  color: var(--neon-green);
  text-align: center;
  display: none;
}
"""

BASE_WIN_JS = """
function notifyWin(gameId) {
  window.parent.postMessage({ type: 'GAME_COMPLETE', gameId }, '*');
}
"""

# ─────────────────────────────────────────────────────────────────────────────
#  GAME 1 — Memory Card Flip
# ─────────────────────────────────────────────────────────────────────────────
GAME1_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Memory Matrix</title>
<style>
%(base_css)s
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 420px;
  width: 100%%;
}
@media(max-width:480px){ .grid { grid-template-columns: repeat(3,1fr); max-width:300px; } }
.card {
  aspect-ratio: 1;
  perspective: 600px;
  cursor: pointer;
}
.card-inner {
  width:100%%; height:100%%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(.34,1.56,.64,1);
  border-radius: 10px;
}
.card.flipped .card-inner,
.card.matched .card-inner { transform: rotateY(180deg); }
.face {
  position:absolute; inset:0; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.back {
  background: linear-gradient(135deg,#1a1035,#0d0828);
  border: 1px solid rgba(108,99,255,0.3);
  font-size: clamp(18px,3vw,24px);
  color: rgba(255,255,255,0.15);
  font-weight: 700;
}
.front {
  background: linear-gradient(135deg,#1e1060,#2d1b6e);
  border: 1px solid rgba(108,99,255,0.5);
  font-size: clamp(20px,3.5vw,30px);
  transform: rotateY(180deg);
}
.card.matched .front {
  background: linear-gradient(135deg,#0d2e1a,#0a3320);
  border-color: var(--neon-green);
  box-shadow: 0 0 18px rgba(0,255,136,0.35);
}
</style>
</head>
<body>
<h2>Memory Matrix 🧠</h2>
<div class="meta">Matched: <span id="mc">0</span>&thinsp;/&thinsp;<span id="mt">8</span> &nbsp;|&nbsp; Moves: <span id="mv">0</span></div>
<div class="grid" id="grid"></div>
<div class="win-msg" id="win">All matched! You're a natural. 🎉</div>

<script>
%(base_win_js)s
const emojis = ['🐍','⚛️','🦀','🐳','☁️','🔧','💡','🚀'];
let pairs = [...emojis,...emojis].sort(()=>Math.random()-0.5);
const isMobile = window.innerWidth<480;
if(isMobile){ pairs=[...emojis.slice(0,6),...emojis.slice(0,6)].sort(()=>Math.random()-0.5); document.getElementById('mt').textContent=6; }
const total = pairs.length/2;
let flipped=[], locked=false, matchCount=0, moves=0;

const grid = document.getElementById('grid');
if(isMobile) grid.style.gridTemplateColumns='repeat(3,1fr)';

pairs.forEach((emoji,i)=>{
  const card=document.createElement('div');
  card.className='card'; card.dataset.emoji=emoji; card.dataset.i=i;
  card.innerHTML=`<div class="card-inner"><div class="face back"></div><div class="face front">${emoji}</div></div>`;
  card.addEventListener('click',()=>flip(card));
  grid.appendChild(card);
});

function flip(card){
  if(locked||card.classList.contains('flipped')||card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flipped.push(card);
  if(flipped.length===2){
    locked=true; moves++;
    document.getElementById('mv').textContent=moves;
    const [a,b]=flipped;
    if(a.dataset.emoji===b.dataset.emoji){
      a.classList.replace('flipped','matched');
      b.classList.replace('flipped','matched');
      matchCount++;
      document.getElementById('mc').textContent=matchCount;
      flipped=[]; locked=false;
      if(matchCount===total){
        setTimeout(()=>{
          document.getElementById('win').style.display='block';
          setTimeout(()=>notifyWin(1), 800);
        },300);
      }
    } else {
      setTimeout(()=>{ a.classList.remove('flipped'); b.classList.remove('flipped'); flipped=[]; locked=false; }, 900);
    }
  }
}
</script>
</body>
</html>
""" % {'base_css': BASE_CSS, 'base_win_js': BASE_WIN_JS}


# ─────────────────────────────────────────────────────────────────────────────
#  GAME 2 — Simon Says Pattern
# ─────────────────────────────────────────────────────────────────────────────
GAME2_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Pattern Lock</title>
<style>
%(base_css)s
.round-info { font-size:14px; color:rgba(255,255,255,0.4); letter-spacing:0.5px; }
.status { font-size:14px; color:rgba(255,255,255,0.5); min-height:20px; }
.simon-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 14px;
  max-width: 300px;
  width: 100%%;
}
.btn {
  aspect-ratio:1; border-radius:18px; border:none;
  cursor:pointer; transition:all 0.1s;
}
.btn[data-c="blue"]   { background:#0a2a6e; }
.btn[data-c="red"]    { background:#6e0a20; }
.btn[data-c="green"]  { background:#0a4e28; }
.btn[data-c="yellow"] { background:#5a4a00; }
.btn.lit[data-c="blue"]   { background:var(--neon-blue);   box-shadow:0 0 40px rgba(0,212,255,.9); }
.btn.lit[data-c="red"]    { background:var(--neon-red);    box-shadow:0 0 40px rgba(255,51,102,.9); }
.btn.lit[data-c="green"]  { background:var(--neon-green);  box-shadow:0 0 40px rgba(0,255,136,.9); }
.btn.lit[data-c="yellow"] { background:var(--neon-yellow); box-shadow:0 0 40px rgba(255,238,0,.9); }
</style>
</head>
<body>
<h2>Pattern Lock 🎮</h2>
<div class="round-info">Round <span id="round">0</span> of 5</div>
<div class="status" id="status">Get ready...</div>
<div class="simon-grid" id="sgrid">
  <button class="btn" data-c="blue"></button>
  <button class="btn" data-c="red"></button>
  <button class="btn" data-c="green"></button>
  <button class="btn" data-c="yellow"></button>
</div>
<div class="win-msg" id="win">Pattern mastered! 🔓</div>

<script>
%(base_win_js)s
const COLORS=['blue','red','green','yellow'];
const FREQS={blue:261,red:329,green:392,yellow:523};
let seq=[], playerSeq=[], round=0, accepting=false;
let audioCtx=null;

function getCtx(){ if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function tone(freq,dur=0.35){
  try{
    const ctx=getCtx(), o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=freq; g.gain.setValueAtTime(0.25,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
    o.start(); o.stop(ctx.currentTime+dur);
  }catch(_){}
}

function flash(color){
  const btn=document.querySelector(`.btn[data-c="${color}"]`);
  tone(FREQS[color]); btn.classList.add('lit');
  setTimeout(()=>btn.classList.remove('lit'),400);
}

function nextRound(){
  playerSeq=[]; accepting=false;
  setButtons(false);
  const next=COLORS[Math.floor(Math.random()*4)];
  seq.push(next);
  round++;
  document.getElementById('round').textContent=round;
  document.getElementById('status').textContent='Watch the pattern...';
  seq.forEach((c,i)=>setTimeout(()=>flash(c),700+i*700));
  setTimeout(()=>{ accepting=true; setButtons(true); document.getElementById('status').textContent='Your turn!'; }, 700+seq.length*700+300);
}

function setButtons(on){
  document.querySelectorAll('.btn').forEach(b=>{ b.style.pointerEvents=on?'auto':'none'; });
}

document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(!accepting) return;
    const color=btn.dataset.c;
    flash(color);
    const idx=playerSeq.length;
    playerSeq.push(color);
    if(playerSeq[idx]!==seq[idx]){
      accepting=false; setButtons(false);
      document.getElementById('status').textContent='Wrong! Resetting...';
      tone(150,0.5);
      setTimeout(()=>{ seq=[]; round=0; nextRound(); },1600);
      return;
    }
    if(playerSeq.length===seq.length){
      accepting=false; setButtons(false);
      if(seq.length===5){
        document.getElementById('status').textContent='';
        document.getElementById('win').style.display='block';
        setTimeout(()=>notifyWin(2),700);
      } else {
        document.getElementById('status').textContent='Correct! Next round...';
        setTimeout(nextRound,900);
      }
    }
  });
});

// Auto-start
setTimeout(nextRound,600);
</script>
</body>
</html>
""" % {'base_css': BASE_CSS, 'base_win_js': BASE_WIN_JS}


# ─────────────────────────────────────────────────────────────────────────────
#  GAME 3 — Code Riddles Terminal
# ─────────────────────────────────────────────────────────────────────────────
GAME3_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>decode.exe</title>
<style>
%(base_css)s
body { background:#001400; justify-content:flex-start; padding:0; }
.terminal {
  width:100%%; height:100%%;
  display:flex; flex-direction:column;
  font-family:'Courier Prime','Courier New',monospace;
}
.titlebar {
  display:flex; align-items:center; gap:6px;
  background:#111; padding:9px 14px; flex-shrink:0;
}
.dot { width:12px; height:12px; border-radius:50%%; }
.titlebar span { margin-left:6px; font-size:11px; color:rgba(255,255,255,0.25); }
.body {
  flex:1; padding:20px 24px; overflow-y:auto;
  font-size: clamp(13px,1.8vw,15px);
  line-height:1.8;
}
.line { color:rgba(0,255,136,0.65); }
.comment { color:rgba(0,255,136,0.35); font-size:12px; }
#riddle-text {
  color:rgba(255,255,255,0.85);
  white-space:pre-wrap;
  min-height:60px;
  margin:14px 0;
}
.input-row { display:flex; align-items:center; gap:8px; margin-top:10px; }
.prompt { color:var(--neon-green); }
#ans {
  background:transparent; border:none;
  border-bottom:1px solid rgba(0,255,136,0.3);
  color:var(--neon-green); font-family:inherit;
  font-size:inherit; outline:none; flex:1; padding:3px 6px;
  caret-color:var(--neon-green);
}
#ans.wrong { animation:shake 0.4s ease; border-color:var(--neon-red); }
@keyframes shake {
  0%%,100%% { transform:translateX(0); }
  20%%     { transform:translateX(-8px); }
  40%%     { transform:translateX(8px); }
  60%%     { transform:translateX(-5px); }
  80%%     { transform:translateX(5px); }
}
#fb { font-size:13px; min-height:20px; margin-top:8px; transition:color .3s; }
#prog { font-size:12px; color:rgba(0,255,136,0.35); margin-top:16px; }
</style>
</head>
<body>
<div class="terminal">
  <div class="titlebar">
    <div class="dot" style="background:#ff5f57"></div>
    <div class="dot" style="background:#febc2e"></div>
    <div class="dot" style="background:#28c840"></div>
    <span>raymon-terminal — bash</span>
  </div>
  <div class="body">
    <div class="line">$ ./challenge --riddles 3</div>
    <div class="comment"># Three riddles. Unlimited attempts. Think like an engineer.</div>
    <div id="riddle-text"></div>
    <div class="input-row" id="input-row">
      <span class="prompt">›</span>
      <input id="ans" type="text" autocomplete="off" spellcheck="false" placeholder="type your answer..."/>
    </div>
    <div id="fb"></div>
    <div id="prog"></div>
  </div>
</div>

<script>
%(base_win_js)s

const RIDDLES = [
  { q:'I am always 0 or 1.\\nNever maybe. Never sometimes.\\nWhat am I?', answers:['bit','binary','boolean','bool'] },
  { q:'Developers spend more time reading me than writing me.\\nI am not documentation.\\nWhat am I?', answers:['code','source code','sourcecode'] },
  { q:'I have a head and a tail, but no body.\\nI am not a coin —\\nI am what you chase when production goes down.', answers:['stack trace','stacktrace','trace','log','error log','stack'] },
];
let idx=0, typing=false;
const rdEl=document.getElementById('riddle-text');
const fbEl=document.getElementById('fb');
const pgEl=document.getElementById('prog');
const ans =document.getElementById('ans');

function typeRiddle(text){
  rdEl.textContent=''; typing=true;
  let i=0;
  const id=setInterval(()=>{
    rdEl.textContent+=text[i]; i++;
    if(i>=text.length){ clearInterval(id); typing=false; }
  },22);
}

function showRiddle(i){
  ans.value=''; ans.className=''; fbEl.textContent=''; fbEl.style.color='';
  pgEl.textContent=`Riddle ${i+1} of ${RIDDLES.length}`;
  typeRiddle(RIDDLES[i].q);
  setTimeout(()=>ans.focus(),200);
}

ans.addEventListener('keydown',e=>{ if(e.key==='Enter') check(); });

function check(){
  if(typing) return;
  const val=ans.value.trim().toLowerCase();
  if(!val) return;
  if(RIDDLES[idx].answers.includes(val)){
    fbEl.style.color='var(--neon-green)';
    const ok=['Correct. You think like an engineer.','Exactly right. Sharp mind.','The machine approves.'];
    fbEl.textContent=ok[idx];
    idx++;
    if(idx>=RIDDLES.length){
      document.getElementById('input-row').style.display='none';
      fbEl.textContent='> All challenges complete. Access granted. 🔓';
      setTimeout(()=>notifyWin(3),900);
    } else {
      setTimeout(()=>showRiddle(idx),1000);
    }
  } else {
    ans.classList.add('wrong');
    fbEl.style.color='var(--neon-red)';
    fbEl.textContent=['Think again...','Not quite. Try another angle.','Keep thinking...'][Math.floor(Math.random()*3)];
    setTimeout(()=>ans.classList.remove('wrong'),450);
  }
}

showRiddle(0);
</script>
</body>
</html>
""" % {'base_css': BASE_CSS, 'base_win_js': BASE_WIN_JS}


# ─────────────────────────────────────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.route('/game/1')
def game1():
    return render_template_string(GAME1_HTML)

@app.route('/game/2')
def game2():
    return render_template_string(GAME2_HTML)

@app.route('/game/3')
def game3():
    return render_template_string(GAME3_HTML)

@app.route('/game/health')
def health():
    return {'ok': True}


if __name__ == '__main__':
    print('\n  🐍  Python game server running at http://localhost:5050')
    print('  Routes: /game/1  /game/2  /game/3\n')
    app.run(host='0.0.0.0', port=5050, debug=False)
