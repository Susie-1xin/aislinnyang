/* ============================================================
   aislinnyang.com - welcome.js
   The onboarding entrance (its own page, welcome.html):
   data · cursor · onboarding questions · pixel dig animation · transitions.
   On finish it sets the `seen_intro` flag and navigates to the main site (/).
   Main-site behaviour lives in script.js.
   ============================================================ */

document.documentElement.classList.add('loading');

/* ── 1. Data & Constants ─────────────────────────────────── */

const QUESTIONS = [
  {
    q: "You found a map. First instinct?",
    opts: ['🗺 Read every detail', '🏃 Just start digging', '🤨 Check if it\'s a scam', '✨ Follow the shiny thing']
  },
  {
    q: "What's actually worth digging for?",
    opts: ['💡 A good idea', '🤝 The right people', '💼 A great team', '🌻 No clue, here for it']
  },
  {
    q: "If we strike gold, you want…",
    opts: ['🚀 to build something', '📈 to grow something', '☕ a good conversation', '🌍 to figure life out']
  }
];

/* Canvas config */
const W = window.innerWidth || 1200;
const H = window.innerHeight || 700;
const SC = 4; // pixel scale

/* Pixel animation config */
const GY_P = Math.round(H * 0.62);
const DIG_CX = Math.round(W * 0.42);
const TREE_CX = Math.round(W * 0.72);
const CHEST_FY = GY_P - 40;

/* ── 2. Cursor ───────────────────────────────────────────── */

const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  const over = document.elementFromPoint(e.clientX, e.clientY);
  if (over && (over.matches('button,a,[onclick],.work-item,.qbtn') || over.closest('button,a,[onclick],.work-item,.qbtn'))) {
    ring.classList.add('big');
  } else {
    ring.classList.remove('big');
  }
});

document.addEventListener('mousedown', () => ring.classList.add('clicking'));
document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

/* ── 3. Onboarding ───────────────────────────────────────── */

let qIdx = 0;

function renderQ(animate) {
  const q = QUESTIONS[qIdx];
  const qtxt = document.getElementById('qtxt');
  const optsEl = document.getElementById('opts');

  if (animate) {
    /* slide in from below, panel stays fixed */
    qtxt.style.transition = 'none';
    qtxt.style.opacity = '0';
    qtxt.style.transform = 'translateY(16px)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      qtxt.textContent = q.q;
      qtxt.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      qtxt.style.opacity = '1';
      qtxt.style.transform = 'translateY(0)';
    }));
  } else {
    qtxt.textContent = q.q;
  }

  optsEl.style.opacity = '0';
  optsEl.innerHTML = q.opts
    .map((o, i) => `<button class="qbtn" style="animation-delay:${0.1 + i * 0.09}s" onclick="ansQ()">${o}</button>`)
    .join('');
  setTimeout(() => {
    optsEl.style.transition = 'opacity 0.4s ease';
    optsEl.style.opacity = '1';
  }, animate ? 220 : 0);

  ['d0', 'd1', 'd2'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('active', i === qIdx);
  });
}

function ansQ() {
  qIdx++;
  const ob = document.getElementById('ob');
  const qtxt = document.getElementById('qtxt');
  const optsEl = document.getElementById('opts');

  if (qIdx >= QUESTIONS.length) {
    /* leave to pixel animation - fade whole panel */
    ob.classList.add('slide-out');
    setTimeout(() => { ob.style.display = 'none'; startPixel(); }, 500);
  } else {
    /* fade out just the content, panel stays still */
    qtxt.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    qtxt.style.opacity = '0';
    qtxt.style.transform = 'translateY(-10px)';
    optsEl.style.transition = 'opacity 0.25s ease';
    optsEl.style.opacity = '0';
    setTimeout(() => renderQ(true), 320);
  }
}

renderQ(false);

/* ── 4. Pixel Animation ──────────────────────────────────── */

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');

let appState = 'onboard';
let pixPhase = 'walk1';
let pixT = 0, waitTmr = 0, flashAl = 0;
let charX = -60, chestY = 0, chestOpen = 0;
let ptcls = [];
let lastT = 0;

const pxStars = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 179.3) % W,
  y: 22 + (i * 61.7) % (GY_P - 55),
  r: 0.7 + (i * 13.1) % 1.1
}));

const pxClouds = [
  { ox: W * 0.10, y: GY_P * 0.18, speed: 11 },
  { ox: W * 0.50, y: GY_P * 0.32, speed:  7 },
  { ox: W * 0.78, y: GY_P * 0.12, speed:  9 },
];

function drawPixelCloud(cx, cy) {
  const S = 5;
  ctx.fillStyle = 'rgba(255,255,255,0.52)';
  [[0,2,3,2],[2,0,6,2],[5,0,4,2],[0,3,10,2],[1,4,8,2]].forEach(([gx,gy,gw,gh]) => {
    ctx.fillRect(cx + gx*S, cy + gy*S, gw*S, gh*S);
  });
  ctx.fillStyle = 'rgba(240,238,234,0.3)';
  ctx.fillRect(cx + S, cy + S, 8*S, S);
}

function drawShovel(bx, by) {
  /* a shovel stuck in the ground at an angle */
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(0.22);
  /* handle */
  ctx.fillStyle = '#6B4218';
  ctx.fillRect(-3, -13*SC, 5, 13*SC);
  ctx.fillStyle = '#8B5A20';
  ctx.fillRect(-2, -13*SC, 3, 13*SC);
  ctx.fillStyle = '#A07030';
  ctx.fillRect(-1, -13*SC, 1, 13*SC);
  /* blade */
  ctx.fillStyle = '#707070';
  ctx.fillRect(-6, 0, 12, 8);
  ctx.fillStyle = '#999';
  ctx.fillRect(-5, 0, 10, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(-4, 1, 6, 2);
  ctx.restore();
}

function startPixel() {
  cv.style.display = 'block';
  cv.width = W;
  cv.height = H;
  appState = 'pixel';
  pixPhase = 'walk1';
  charX = -60; chestY = GY_P + 35;
  chestOpen = 0; flashAl = 0; pixT = 0; waitTmr = 0; ptcls = [];
  requestAnimationFrame(pixelFrame);
}

function spawnDirt(x, y) {
  for (let i = 0; i < 9; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    ptcls.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() * 6),
      vx: side * (1.5 + Math.random() * 4.5),
      vy: -Math.random() * 6 - 2,
      life: 0.8 + Math.random() * 0.5,
      s: Math.random() * 5 + 2,
      c: Math.random() > 0.5 ? '#8B6520' : '#6B4420'
    });
  }
}

/* Pixel grid helper: draw one grid-unit rect */
function gr(cx, cy, gx, gy, gw, gh, c) {
  ctx.fillStyle = c;
  ctx.fillRect(cx + gx * SC, cy + gy * SC, gw * SC, gh * SC);
}

function drawChar(cx, cy, wf, digging, df) {
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath();
  ctx.ellipse(cx + 6*SC, cy + 24*SC, 5*SC, 1.5*SC, 0, 0, Math.PI*2);
  ctx.fill();
  /* hair  */ gr(cx,cy,3,0,6,1,'#3A2010'); gr(cx,cy,2,1,8,1,'#3A2010');
              gr(cx,cy,2,1,1,2,'#3A2010'); gr(cx,cy,9,1,1,2,'#3A2010');
  /* face  */ gr(cx,cy,2,1,8,5,'#F4A87C');
  /* eyes  */ gr(cx,cy,3,3,2,1,'#1A0800'); gr(cx,cy,7,3,2,1,'#1A0800');
  /* mouth */ gr(cx,cy,4,5,4,1,'#C07050');
  /* shirt */ gr(cx,cy,2,6,8,7,'#E8613A');
  /* pants */ gr(cx,cy,2,13,4,7,'#2A3A9C'); gr(cx,cy,6,13,4,7,'#2A3A9C');
  /* shoes */ gr(cx,cy,1,20,5,2,'#4A2C0A'); gr(cx,cy,6,20,5,2,'#4A2C0A');
  if (digging) {
    const cycle = (df * 2.2) % 1;
    const raised = cycle < 0.35;
    if (raised) {
      gr(cx,cy,  0, 4, 3, 4, '#F4A87C');
      gr(cx,cy, -2, 0, 3, 5, '#F4A87C');
      gr(cx,cy, 10, 5, 3, 4, '#F4A87C');
      gr(cx,cy, -2,-6, 2,10, '#8B5A20');
      gr(cx,cy, -1,-5, 1, 8, '#A07030');
      gr(cx,cy, -7,-7,12, 2, '#888888');
      gr(cx,cy, -8,-7, 2, 5, '#666666');
      gr(cx,cy,  4,-7, 2, 5, '#666666');
      gr(cx,cy, -7,-6, 4, 1, '#CCCCCC');
    } else {
      gr(cx,cy, -2,10, 3, 5, '#F4A87C');
      gr(cx,cy, 10,10, 3, 5, '#F4A87C');
      gr(cx,cy,  2,13, 2, 8, '#8B5A20');
      gr(cx,cy,  3,13, 1, 6, '#A07030');
      gr(cx,cy, -2,20, 9, 2, '#888888');
      gr(cx,cy, -3,18, 2, 5, '#666666');
      gr(cx,cy,  6,20, 2, 3, '#666666');
      gr(cx,cy, -2,20, 4, 1, '#CCCCCC');
    }
  } else {
    const wb = Math.floor(wf) % 2;
    gr(cx,cy,-1,6+(wb?1:-1),3,6,'#F4A87C');
    gr(cx,cy,10,6+(wb?-1:1),3,6,'#F4A87C');
  }
}

function drawTree(tx) {
  const TS = 7;  /* bigger pixels than SC=4 */
  const ty = GY_P - 21 * TS;
  const f = (gx,gy,gw,gh,c) => { ctx.fillStyle=c; ctx.fillRect(tx+gx*TS, ty+gy*TS, gw*TS, gh*TS); };
  /* trunk */
  f(5,12,2,14,'#4A2E12');
  f(7,12,3,14,'#5C3A1A');
  f(8,12,1,14,'#7A5230');   /* highlight */
  /* roots spreading at base */
  f(3,24,3,2,'#4A2E12'); f(9,24,3,2,'#4A2E12');
  f(4,25,2,1,'#4A2E12'); f(9,25,2,1,'#4A2E12');
  /* lower canopy (widest) */
  f(0, 9,14,6,'#245A18');
  f(1,10,12,4,'#2D6A1E');
  f(0,11,14,3,'#286020');
  /* shadow on right-bottom of canopy */
  f(9,12,4,3,'rgba(0,0,0,0.13)');
  /* middle canopy */
  f(2, 5,10,7,'#357824');
  f(3, 6, 8,5,'#3D8028');
  /* top canopy */
  f(4, 1, 6,6,'#428A2C');
  f(5, 2, 4,4,'#509040');
  f(6, 0, 2,3,'#5A9848');
  /* canopy highlights (top-left corner, lighter) */
  f(2, 5, 3,2,'rgba(140,200,90,0.32)');
  f(5, 1, 2,2,'rgba(140,200,90,0.38)');
  /* a few protruding leaf tufts */
  f(13, 9, 2,2,'#2D6A1E'); f(14,10, 1,2,'#245A18');
  f(-1,10, 2,2,'#2D6A1E'); f(-1,12, 1,2,'#245A18');
  f( 3, 3, 2,2,'#3D8028'); f(10, 4, 2,2,'#3D8028');
}

function drawChest(cx, cy, openAmt) {
  const cS = 3;
  const f = (gx,gy,gw,gh,c) => { ctx.fillStyle=c; ctx.fillRect(cx+gx*cS,cy+gy*cS,gw*cS,gh*cS); };
  const lo = -openAmt * 7;

  /* interior glow when open */
  if (openAmt > 0.1) {
    const ig = ctx.createRadialGradient(cx, cy - cS, 0, cx, cy - cS, 5*cS);
    ig.addColorStop(0, `rgba(255,230,80,${openAmt * 0.9})`);
    ig.addColorStop(1, 'rgba(255,200,50,0)');
    ctx.fillStyle = ig;
    ctx.fillRect(cx - 5*cS, cy - 4*cS, 10*cS, 5*cS);
  }

  /* lid */
  f(-6,lo-9,12,1,'#5C2E0A');          /* shadow edge */
  f(-6,lo-8,12,5,'#9B6528');          /* lid body */
  f(-5,lo-7,10,3,'#B07A32');          /* lid highlight */
  f(-6,lo-8,12,1,'#C89040');          /* gold top strip */
  f(-5,lo-8,10,1,'#E8C060');          /* gold shine */

  /* body */
  f(-6,-4,12,1,'#5C2E0A');            /* top shadow */
  f(-6,-3,12,9,'#8B5A20');            /* body */
  f(-5,-2,10,7,'#A06C28');            /* body highlight */
  f(-6,-3,12,1,'#C89040');            /* gold band */
  f(-5,-3,10,1,'#E8C060');            /* gold shine */
  f(-6, 2,12,1,'#C89040');            /* bottom gold band */

  /* corners (brass corners) */
  f(-6,-4,2,2,'#C8A020'); f(4,-4,2,2,'#C8A020');
  f(-6, 3,2,2,'#C8A020'); f(4, 3,2,2,'#C8A020');

  /* lock */
  f(-1,-2,3,1,'#A08010');
  f(-2,-1,5,3,'#C8A020');
  f(-1, 0,3,2,'#8B6810');
  f( 0, 0,1,2,'#E8C040');

  /* iron straps */
  f(-6,-4,1,9,'#4A3010'); f(5,-4,1,9,'#4A3010');
}

function drawPixelScene(t) {
  ctx.clearRect(0, 0, W, H);

  /* ── Sky gradient ── */
  const skyG = ctx.createLinearGradient(0, 0, 0, GY_P);
  skyG.addColorStop(0, '#EDE9E2');
  skyG.addColorStop(0.65, '#F5F2EC');
  skyG.addColorStop(1, '#F8F0E0');
  ctx.fillStyle = skyG; ctx.fillRect(0, 0, W, GY_P);

  /* subtle ambient dots */
  pxStars.forEach(s => {
    ctx.fillStyle = 'rgba(80,70,60,0.16)';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
  });

  /* ── Drifting clouds ── */
  pxClouds.forEach(c => {
    const cx = ((c.ox + t * c.speed) % (W + 160)) - 80;
    drawPixelCloud(cx, c.y);
  });

  /* ── Underground dirt ── */
  const dirtG = ctx.createLinearGradient(0, GY_P, 0, H);
  dirtG.addColorStop(0, '#8B6520');
  dirtG.addColorStop(0.3, '#7A5530');
  dirtG.addColorStop(0.7, '#6B4420');
  dirtG.addColorStop(1, '#5A3515');
  ctx.fillStyle = dirtG; ctx.fillRect(0, GY_P, W, H - GY_P);
  /* dirt texture */
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  pxStars.forEach(s => { ctx.fillRect(s.x % W, GY_P + (s.y % (H-GY_P)), s.r*2+1, s.r*2+1); });

  /* ── Grass ── */
  ctx.fillStyle = '#3A6018'; ctx.fillRect(0, GY_P - 8, W, 12);
  ctx.fillStyle = '#4A7828'; ctx.fillRect(0, GY_P - 14, W, 8);
  for (let gx = 0; gx < W; gx += 7) {
    const bh = 4 + Math.sin(gx * 0.28 + t * 0.6) * 2.5;
    ctx.fillStyle = gx % 14 < 7 ? '#5A8A3C' : '#4A7A2C';
    ctx.fillRect(gx, GY_P - 14 - bh, 3, bh + 1);
  }

  /* ── Tree ── */
  drawTree(TREE_CX - 28);

  /* ── Underground glow from dig hole ── */
  if (['stepside','found','rise','wait','open'].includes(pixPhase)) {
    const ga = pixPhase === 'rise'  ? Math.min(0.55, pixT * 0.28) :
               pixPhase === 'wait'  ? 0.38 + Math.sin(t * 2.5) * 0.14 : 0.5;
    const gg = ctx.createRadialGradient(DIG_CX + 24, GY_P, 0, DIG_CX + 24, GY_P, 58);
    gg.addColorStop(0, `rgba(255,215,70,${ga})`);
    gg.addColorStop(1, 'rgba(255,215,70,0)');
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.arc(DIG_CX + 24, GY_P, 58, 0, Math.PI*2); ctx.fill();
  }

  /* ── Light beam when chest rises ── */
  if (pixPhase === 'rise') {
    const ba = Math.min(0.18, pixT * 0.1);
    const bw = 22 + pixT * 12;
    ctx.fillStyle = `rgba(255,235,90,${ba})`;
    ctx.beginPath();
    ctx.moveTo(DIG_CX + 24 - 14, GY_P);
    ctx.lineTo(DIG_CX + 24 + 14, GY_P);
    ctx.lineTo(DIG_CX + 24 + bw, GY_P - 90);
    ctx.lineTo(DIG_CX + 24 - bw, GY_P - 90);
    ctx.closePath(); ctx.fill();
  }

  /* ── Dig hole shadow ── */
  if (['arrive','dig','stepside','found','rise','wait','open'].includes(pixPhase)) {
    ctx.fillStyle = 'rgba(40,22,6,0.7)';
    ctx.beginPath(); ctx.ellipse(DIG_CX + 24, GY_P, 22, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(20,10,2,0.5)';
    ctx.beginPath(); ctx.ellipse(DIG_CX + 24, GY_P + 3, 14, 5, 0, 0, Math.PI*2); ctx.fill();
  }

  /* ── Chest glow (found / wait / open) ── */
  if (['found','rise','wait','open'].includes(pixPhase) && chestY < GY_P + 20) {
    const cga = pixPhase === 'found'
      ? Math.min(1, waitTmr / 0.9) * (0.55 + Math.sin(t * 2.8) * 0.2)
      : pixPhase === 'wait'
        ? 0.48 + Math.sin(t * 2.4) * 0.18
        : Math.min(1, chestOpen * 1.5);
    const cgr = ctx.createRadialGradient(DIG_CX + 24, chestY - 4, 0, DIG_CX + 24, chestY, 80);
    cgr.addColorStop(0, `rgba(255,215,70,${0.45 * cga})`);
    cgr.addColorStop(1, 'rgba(255,215,70,0)');
    ctx.fillStyle = cgr;
    ctx.beginPath(); ctx.arc(DIG_CX + 24, chestY, 80, 0, Math.PI*2); ctx.fill();
  }

  /* ── Found phase: expanding rings + "you found something." + click prompt ── */
  if (pixPhase === 'found' || pixPhase === 'rise') {
    ctx.save();
    /* expanding rings pulse from chest */
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.65;
      const prog = Math.max(0, waitTmr - delay);
      if (prog <= 0) continue;
      const looped = prog % 1.8;
      const alpha = Math.max(0, (1 - looped / 1.8) * 0.5);
      ctx.strokeStyle = `rgba(200,165,35,${alpha})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(DIG_CX + 24, chestY - 2, looped * 58, 0, Math.PI*2); ctx.stroke();
    }
    /* "you found something." text */
    const textA = Math.min(1, Math.max(0, (waitTmr - 0.2) / 0.7));
    if (textA > 0) {
      ctx.globalAlpha = textA * 0.8;
      ctx.fillStyle = '#6A5030';
      ctx.font = '500 12px "DM Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('you found something.', DIG_CX + 24, chestY - 52);
    }
    /* blinking click prompt */
    if (pixPhase === 'found') {
      const promptA = Math.min(1, Math.max(0, (waitTmr - 0.9) / 0.5))
                    * (0.6 + Math.sin(t * 3.2) * 0.22);
      ctx.globalAlpha = promptA;
      ctx.fillStyle = '#9B7040';
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillText('click to reveal  ↑', DIG_CX + 24, chestY - 72);
    }
    ctx.restore();
  }

  /* ── Chest ── */
  if (chestY < GY_P + 12) drawChest(DIG_CX + 24, chestY, chestOpen);

  /* ── Shovel stuck in ground (after dig) ── */
  if (['stepside','found','rise','wait','open'].includes(pixPhase)) {
    drawShovel(DIG_CX + 44, GY_P - 2);
  }

  /* ── Dirt particles (colored) ── */
  ptcls.forEach(p => {
    ctx.fillStyle = p.c || 'rgba(90,55,20,0.75)';
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x - p.s/2, p.y - p.s/2, p.s, p.s);
  });
  ctx.globalAlpha = 1;

  /* ── Character ── */
  let charBob = 0;
  if (pixPhase === 'wait' || pixPhase === 'found') {
    charBob = Math.sin(pixT * 1.9) * 1.6;  /* gentle breathing bob */
  } else if (pixPhase === 'arrive') {
    charBob = Math.sin(Math.min(pixT / 0.5, 1) * Math.PI) * 4;  /* prep crouch */
  }
  const isDigging = pixPhase === 'dig' || pixPhase === 'arrive';
  const wfAnim = (pixPhase === 'walk1' || pixPhase === 'stepside') ? t * 5 : 0;
  drawChar(charX, GY_P - 22*SC + charBob, wfAnim, isDigging, t);

  /* ── Wait phase: orbiting sparkles + click prompt ── */
  if (pixPhase === 'wait') {
    for (let i = 0; i < 5; i++) {
      const sa = (t * 1.9 + i * Math.PI * 2 / 5) % (Math.PI * 2);
      const sr = 24 + Math.sin(t * 3.2 + i) * 6;
      const sx = DIG_CX + 24 + Math.cos(sa) * sr;
      const sy = chestY - 6 + Math.sin(sa) * sr * 0.42;
      ctx.globalAlpha = 0.5 + Math.sin(t * 3.8 + i) * 0.28;
      ctx.fillStyle = [i%3===0 ? '#C8A020' : i%3===1 ? '#E8613A' : '#F5D060'][0];
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (pixPhase === 'wait') {
      const pa = Math.min(1, waitTmr / 0.7) * (0.58 + Math.sin(t * 2.6) * 0.18);
      ctx.globalAlpha = pa;
      ctx.fillStyle = '#6A5030';
      ctx.font = '13px "DM Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('click to open  🌻', DIG_CX + 24, chestY - 34);
      ctx.globalAlpha = 1;
    }
  }

  /* ── Flash (chest opening) ── */
  if (flashAl > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flashAl})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function updatePixel(dt, t) {
  pixT += dt;
  ptcls.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=0.22; p.life-=dt*1.1; });
  ptcls = ptcls.filter(p => p.life > 0);
  if (pixPhase === 'walk1') {
    charX = Math.min(DIG_CX, charX + 200 * dt);
    if (charX >= DIG_CX) { pixPhase='arrive'; pixT=0; chestY=GY_P+35; }

  } else if (pixPhase === 'arrive') {
    /* pause and prepare - 1.1s */
    if (pixT > 1.1) { pixPhase='dig'; pixT=0; }

  } else if (pixPhase === 'dig') {
    if (Math.random() < 0.55) spawnDirt(DIG_CX + 24 + (Math.random()-0.5)*16, GY_P - 2);
    if (pixT > 3.8) { pixPhase='stepside'; pixT=0; }

  } else if (pixPhase === 'stepside') {
    /* character walks aside to reveal the chest */
    charX = Math.max(DIG_CX - 105, charX - 145 * dt);
    /* chest peeks up just above ground as character moves away */
    chestY = Math.max(GY_P + 6, chestY - 38 * dt);
    if (charX <= DIG_CX - 105) { pixPhase='found'; pixT=0; waitTmr=0; }

  } else if (pixPhase === 'found') {
    /* "you found something." - waiting for FIRST click to raise chest */
    waitTmr += dt;

  } else if (pixPhase === 'rise') {
    /* chest rises after first click */
    chestY = Math.max(CHEST_FY, chestY - 58 * dt);
    if (chestY <= CHEST_FY) {
      pixPhase='wait'; waitTmr=0;
      /* particle burst when chest locks into place */
      for (let i = 0; i < 14; i++) {
        const a = (Math.PI * 2 * i / 14);
        ptcls.push({ x:DIG_CX+24, y:CHEST_FY, vx:Math.cos(a)*4.2, vy:Math.sin(a)*4.2-2, life:1, s:2.5+Math.random()*3, c:i%2===0?'#C8A020':'#E8613A' });
      }
    }

  } else if (pixPhase === 'wait') {
    /* "click to open" - waiting for SECOND click */
    waitTmr += dt;
  } else if (pixPhase === 'open') {
    chestOpen = Math.min(1, chestOpen + dt*2.5);
    flashAl = Math.min(1, flashAl + dt*2.5);
    if (flashAl >= 1) {
      pixPhase = 'done';
      cv.style.display = 'none';
      document.getElementById('global-skip').style.display = 'none';
      gtag('event', 'pixel_animation_complete');
      showUnlock();   /* brief "found it" splash, then auto-enter the site */
    }
  }
}

/* ── Main game loop ──────────────────────────────────────── */

function pixelFrame(t) {
  const dt = Math.min((t - lastT) / 1000, 0.05);
  lastT = t;
  if (appState === 'pixel') {
    updatePixel(dt, t / 1000);
    drawPixelScene(t / 1000);
    if (pixPhase !== 'done') requestAnimationFrame(pixelFrame);
  }
}

/* Canvas click */
cv.addEventListener('click', e => {
  if (appState === 'pixel') {
    if (pixPhase === 'found') { pixPhase = 'rise'; pixT = 0; }
    else if (pixPhase === 'wait') pixPhase = 'open';
  }
});

/* Unlock splash - shows briefly, then auto-enters the site (no click) */
function showUnlock() {
  document.getElementById('global-skip').style.display = 'none';
  const unlk = document.getElementById('unlk');
  unlk.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => unlk.classList.add('unlk-visible')));
  gtag('event', 'treasure_opened');
  setTimeout(enterMainSite, 1500);
}

/* ── 6. Transitions ──────────────────────────────────────── */

function globalSkip() {
  pixPhase = 'done';
  /* explicit skip = go now, no fade/delay (that 600ms is only for the
     "treasure found" auto-finish). One click, straight to the main site. */
  try { sessionStorage.setItem('seen_intro', '1'); } catch (e) {}
  if (typeof gtag === 'function') gtag('event', 'skip_intro');
  location.replace('/');
}

/* Finish the intro: remember it for this session (so it doesn't replay when
   returning from a subpage) and head to the main site. A new browser/tab
   session replays it. The gate in index.html reads `seen_intro`. */
function enterMainSite() {
  const lw = document.getElementById('loading-wrapper');
  if (lw) lw.style.opacity = '0';
  try { sessionStorage.setItem('seen_intro', '1'); } catch (e) {}
  if (typeof gtag === 'function') gtag('event', 'entered_main_site');
  setTimeout(() => { location.replace('/'); }, 600);
}
