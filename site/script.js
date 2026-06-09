/* ============================================================
   aislinnyang.com - script.js
   The main editorial site ("Heliotrope" 🌻), served at / (index.html):
   cursor · heliotrope (sunflower + scroll stem) · daylight · easter eggs ·
   nav · curiosity garden · "out in the open" · reader + résumé modals.
   The onboarding entrance lives separately in welcome.js / welcome.html.
   ============================================================ */

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

/* ── Heliotrope: the sunflower rides the growing stem ──────
   As you scroll, the warm fill grows DOWN the stem and the sunflower sits at
   its tip - spinning like a wheel as it descends. A per-frame lerp keeps the
   motion floaty and alive. (Both are hidden during the loading experience and
   on touch / <900px screens, so this is a harmless no-op there.) */
const sunflower = document.getElementById('sunflower');
const spineFill = document.getElementById('spine-fill');

let _tip = 72, _spin = 0, _scale = 1, _prevY = 0, _bloomed = false;
/* idle / activity state: the sunflower nods when you're away, perks toward you when you move */
let _lean = 0, _droop = 0, _lastAct = Date.now(), _curXr = 0.5;
const _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const _wake = () => { _lastAct = Date.now(); };
window.addEventListener('mousemove', e => {
  _lastAct = Date.now(); _curXr = e.clientX / Math.max(1, window.innerWidth);
}, { passive: true });
window.addEventListener('scroll', _wake, { passive: true });
window.addEventListener('keydown', _wake);
window.addEventListener('touchstart', _wake, { passive: true });

function heliotropeFrame() {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - vh;
  const p = scrollable > 0 ? Math.min(1, Math.max(0, sy / scrollable)) : 0;
  const vel = Math.abs(sy - _prevY); _prevY = sy;       /* scroll speed, px/frame */
  const targetTip   = 72 + p * (vh - 144);              /* flower-centre y: rides 72 → vh-72 */
  const targetSpin  = sy * 0.18;                        /* rolls a little as it travels */
  const targetScale = 1 + Math.min(0.32, vel * 0.012);  /* swells while moving, back to 1 at rest */
  _tip   += (targetTip   - _tip)   * 0.12;
  _spin  += (targetSpin  - _spin)  * 0.12;
  _scale += (targetScale - _scale) * 0.16;
  if (spineFill) spineFill.style.height = _tip.toFixed(1) + 'px';
  /* idle → gentle nod ("breathing"); active → perk up + lean toward the pointer (the light) */
  const active = (Date.now() - _lastAct) < 2600;
  const tLean  = (_reducedMotion || !active) ? 0 : (_curXr - 0.5) * 16;
  const tDroop = (_reducedMotion ||  active) ? 0 : 7;
  _lean  += (tLean  - _lean)  * 0.06;
  _droop += (tDroop - _droop) * 0.05;
  const breathe = (_reducedMotion || active) ? 0 : Math.sin(Date.now() / 950) * 0.02;
  if (sunflower) {
    sunflower.style.top = (_tip - 32).toFixed(1) + 'px';
    sunflower.style.transform =
      'rotate(' + (_spin + _droop + _lean).toFixed(2) + 'deg) scale(' + (_scale + breathe).toFixed(3) + ')';
  }
  /* reach the very bottom → the flower blooms on its own (becoming, completed) */
  if (p > 0.98 && !_bloomed) { _bloomed = true; bloomSunflower(); }
  else if (p < 0.9 && _bloomed) { _bloomed = false; }
  requestAnimationFrame(heliotropeFrame);
}
requestAnimationFrame(heliotropeFrame);

/* ── Sunflower bloom - fired by a click, or by reaching the bottom ── */
function bloomSunflower() {
  if (!sunflower) return;
  sunflower.classList.remove('bloom');
  void sunflower.offsetWidth;            /* restart the animation */
  sunflower.classList.add('bloom');
  const r = sunflower.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;
  const bits = ['☀', '🌻', '✨', '🌼'];
  for (let i = 0; i < 7; i++) {
    const s = document.createElement('span');
    s.className = 'sun-spark';
    s.textContent = bits[i % bits.length];
    s.style.left = ox + 'px';
    s.style.top  = oy + 'px';
    s.style.setProperty('--dx', (Math.cos(i / 7 * Math.PI * 2) * 70).toFixed(0) + 'px');
    s.style.setProperty('--dy', (Math.sin(i / 7 * Math.PI * 2) * 70).toFixed(0) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
  if (typeof gtag === 'function') gtag('event', 'sunflower_bloom');
}
if (sunflower) sunflower.addEventListener('click', bloomSunflower);

/* ── 🌅 A day's light ──────────────────────────────────────
   The warm wash + sun glow shift with the visitor's local time,
   the way a sunflower follows the real sun: cooler at dawn, bright
   at noon, golden at dusk, dim and blue at night. Just colour, so it
   is safe under reduced-motion. */
function initDaylight() {
  const root = document.documentElement;
  const h = new Date().getHours();
  let warm, warm2;
  if      (h >= 5  && h < 9)  { warm = 'rgba(245, 197, 24, 0.10)'; warm2 = 'rgba(245, 197, 24, 0.44)'; } /* dawn */
  else if (h >= 9  && h < 17) { warm = 'rgba(245, 197, 24, 0.14)'; warm2 = 'rgba(245, 197, 24, 0.55)'; } /* day */
  else if (h >= 17 && h < 21) { warm = 'rgba(245, 197, 24, 0.12)'; warm2 = 'rgba(245, 197, 24, 0.48)'; } /* dusk */
  else                        { warm = 'rgba(245, 197, 24, 0.08)'; warm2 = 'rgba(245, 197, 24, 0.34)'; } /* night */
  root.style.setProperty('--warm', warm);
  root.style.setProperty('--warm-2', warm2);
}
initDaylight();
setInterval(initDaylight, 10 * 60 * 1000);

/* ── 🌻 Hidden bloom ───────────────────────────────────────
   Type "bloom" anywhere (or enter the Konami code) and the whole
   page bursts into flower. A small reward for the curious. */
function bloomEverything() {
  if (_reducedMotion) return;
  if (document.documentElement.classList.contains('loading')) return;
  bloomSunflower();
  const field = document.getElementById('garden-field');
  if (field) { field.classList.add('celebrate'); setTimeout(() => field.classList.remove('celebrate'), 1500); }
  const bits = ['🌻', '🌼', '🌸', '✨', '☀'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    p.className = 'petal-fall';
    p.textContent = bits[i % bits.length];
    p.style.left = (Math.random() * 100).toFixed(1) + 'vw';
    p.style.fontSize = (0.8 + Math.random() * 1.1).toFixed(2) + 'rem';
    p.style.setProperty('--drift', ((Math.random() * 2 - 1) * 140).toFixed(0) + 'px');
    p.style.setProperty('--rot', ((Math.random() * 2 - 1) * 540).toFixed(0) + 'deg');
    p.style.animationDelay = (Math.random() * 0.5).toFixed(2) + 's';
    p.style.animationDuration = (2.4 + Math.random() * 1.8).toFixed(2) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
  if (typeof gtag === 'function') gtag('event', 'bloom_easter_egg');
}

const _KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
let _typed = '', _kIdx = 0;
window.addEventListener('keydown', e => {
  const tag = ((e.target && e.target.tagName) || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  const key = (e.key || '').toLowerCase();
  if (/^[a-z]$/.test(key)) {
    _typed = (_typed + key).slice(-5);
    if (_typed === 'bloom') { bloomEverything(); _typed = ''; }
  }
  if (key === _KONAMI[_kIdx]) {
    if (++_kIdx === _KONAMI.length) { bloomEverything(); _kIdx = 0; }
  } else {
    _kIdx = (key === _KONAMI[0]) ? 1 : 0;
  }
});

/* ── Main site interactions (run after entering) ─────────── */
function initMainSite() {
  window.scrollTo(0, 0);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  setTimeout(() => {
    document.querySelectorAll('#hello .fade-in').forEach(el => el.classList.add('visible'));
  }, 80);

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open-anim')));
    } else {
      closeDrawer(hamburger, drawer);
    }
  });
  document.querySelectorAll('.drawer-link').forEach(a => {
    a.addEventListener('click', () => { hamburger.classList.remove('open'); closeDrawer(hamburger, drawer); });
  });

  initGarden();
  initJourneyFlowers();
  initOpen();
  initDelights();
}

/* ══════════════════════════════════════════════════════════
   🌻 Curiosity garden (heliotrope)
   A field of curiosities, each grown to the depth I've actually
   reached. Their heads turn toward the cursor like sunflowers
   turning toward the light.
   ══════════════════════════════════════════════════════════ */
const GARDEN = [
  { label: 'Thinking Better', stage: 'bud',
    note: "Trying to think better instead of just collecting smarter-sounding opinions. Slow, annoying, necessary." },
  { label: 'Engineering Mindset', stage: 'seed',
    note: "Not trying to become a full-time engineer. Trying to stop being scared of how things actually work." },
  { label: 'AI-Native Marketing', stage: 'bloom',
    note: "How AI changes search, distribution, content, and user behavior. This is the tab I keep reopening." },
  { label: 'Multi-Threaded Living', stage: 'sprout',
    note: "Several projects, countries, languages, and interests running at once. Not always elegant, very me." },
  { label: 'Building in Public', stage: 'bud',
    note: "Sharing before everything is perfectly polished, because apparently private overthinking was not enough." },
  { label: 'Rapid Learning', stage: 'sprout',
    note: "Walking into unfamiliar rooms, panicking for five minutes, then getting useful as fast as possible." },
];

const STAGE_WORD = { seed: 'just planted', sprout: 'sprouting', bud: 'budding', bloom: 'in bloom' };

function gardenPetals() {
  let s = '';
  for (let a = 0; a < 360; a += 30) {
    s += `<ellipse class="gf-petal" cx="60" cy="38" rx="5.5" ry="13" transform="rotate(${a} 60 60)"/>`;
  }
  return s;
}

function flowerSVG(stage) {
  let body;
  if (stage === 'bloom') {
    body = `
      <ellipse class="gf-shadow" cx="60" cy="212" rx="24" ry="5"/>
      <path class="gf-stem" d="M60 212 C 55 170 65 128 60 90"/>
      <ellipse class="gf-leaf" cx="40" cy="152" rx="16" ry="6.5" transform="rotate(26 40 152)"/>
      <ellipse class="gf-leaf" cx="80" cy="124" rx="16" ry="6.5" transform="rotate(-26 80 124)"/>
      <g class="gh">
        ${gardenPetals()}
        <circle class="gf-center" cx="60" cy="60" r="13.5"/>
        <circle class="gf-center-i" cx="60" cy="60" r="9"/>
      </g>`;
  } else if (stage === 'bud') {
    body = `
      <ellipse class="gf-shadow" cx="60" cy="212" rx="17" ry="4.5"/>
      <path class="gf-stem" d="M60 212 C 57 178 63 142 60 108"/>
      <ellipse class="gf-leaf" cx="44" cy="162" rx="13" ry="5.5" transform="rotate(26 44 162)"/>
      <ellipse class="gf-leaf" cx="76" cy="142" rx="12" ry="5" transform="rotate(-26 76 142)"/>
      <g class="gh">
        <path class="gf-bud" d="M60 72 C 75 78 77 100 60 108 C 43 100 45 78 60 72 Z"/>
        <path class="gf-bud-tip" d="M60 72 C 67 76 68 88 60 92 C 52 88 53 76 60 72 Z"/>
      </g>`;
  } else if (stage === 'sprout') {
    body = `
      <ellipse class="gf-shadow" cx="60" cy="212" rx="13" ry="4"/>
      <path class="gf-stem" d="M60 212 C 58 192 62 174 60 158"/>
      <g class="gh">
        <ellipse class="gf-leaf" cx="49" cy="152" rx="11" ry="4.8" transform="rotate(38 49 152)"/>
        <ellipse class="gf-leaf" cx="71" cy="152" rx="11" ry="4.8" transform="rotate(-38 71 152)"/>
      </g>`;
  } else { /* seed */
    body = `
      <ellipse class="gf-shadow" cx="60" cy="210" rx="20" ry="6"/>
      <circle class="gf-seed" cx="60" cy="202" r="3"/>
      <path class="gf-stem" d="M60 204 C 59 196 61 190 60 184"/>
      <g class="gh">
        <ellipse class="gf-leaf" cx="53" cy="182" rx="7" ry="3.2" transform="rotate(34 53 182)"/>
        <ellipse class="gf-leaf" cx="67" cy="182" rx="7" ry="3.2" transform="rotate(-34 67 182)"/>
      </g>`;
  }
  return `<svg class="gf-svg" viewBox="0 0 120 220" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

/* journey chapters: grow the same garden flower beside each city, seed → bud → bloom */
function initJourneyFlowers() {
  document.querySelectorAll('.era-flower[data-stage]').forEach(el => {
    el.innerHTML = flowerSVG(el.dataset.stage);
  });
}

function initGarden() {
  const field = document.getElementById('garden-field');
  const readout = document.getElementById('garden-readout');
  if (!field) return;

  /* touch devices have no hover/cursor: tell them to tap, and do it before
     we snapshot the readout's resting text so the default reads "Tap…" too. */
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) {
    const grow = document.querySelector('.explore-grow');
    if (grow) grow.textContent =
      grow.textContent.replace('Move your cursor across them.', 'Tap each one to see where I am with it.');
    const rest = readout && readout.querySelector('.gr-rest');
    if (rest) rest.textContent = 'Tap a flower to see where I am with it 🌱';
  }

  const restHTML = readout ? readout.innerHTML : '';
  const clearActive = () =>
    field.querySelectorAll('.garden-flower').forEach(el => el.classList.remove('is-active'));

  GARDEN.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'garden-flower';
    btn.setAttribute('aria-label', `${f.label}, ${STAGE_WORD[f.stage]}. ${f.note}`);
    btn.innerHTML = flowerSVG(f.stage) + `<span class="gf-label">${f.label}</span>`;

    const show = () => {
      clearActive();
      btn.classList.add('is-active');
      if (readout) {
        readout.innerHTML =
          `<span class="gr-topic">${f.label}</span> ` +
          `<span class="gr-stage">${STAGE_WORD[f.stage]}</span> ${f.note}`;
      }
    };
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('click', show);
    field.appendChild(btn);
  });

  if (readout) {
    field.addEventListener('mouseleave', () => { clearActive(); readout.innerHTML = restHTML; });
  }

  /* heliotropism: the heads lean toward the cursor (the light).
     skipped on touch + reduced-motion, same as the rest of the site. */
  const noTurn = window.matchMedia('(hover: none), (pointer: coarse)').matches ||
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noTurn) return;

  const heads = [...field.querySelectorAll('.gh')];
  let raf = 0, cursorX = 0, turning = false;
  const apply = () => {
    raf = 0;
    heads.forEach(h => {
      const r = h.getBoundingClientRect();
      const hx = r.left + r.width / 2;
      const lean = turning ? Math.max(-22, Math.min(22, (cursorX - hx) * 0.06)) : 0;
      h.style.setProperty('--lean', lean.toFixed(1) + 'deg');
    });
  };
  field.addEventListener('mousemove', e => {
    cursorX = e.clientX; turning = true;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  field.addEventListener('mouseleave', () => {
    turning = false;
    if (!raf) raf = requestAnimationFrame(apply);
  });
}

/* ── Little delights ──────────────────────────────────────── */
function initDelights() {
  /* click the email → copy it to the clipboard, with a tiny toast */
  const email = document.querySelector('.contact-email');
  if (email) {
    email.addEventListener('click', e => {
      e.preventDefault();
      const addr = email.textContent.trim();
      if (navigator.clipboard) navigator.clipboard.writeText(addr).catch(() => {});
      miniToast('copied 🌻');
      if (typeof gtag === 'function') gtag('event', 'email_copied');
    });
  }

  /* switch the tab away → a cheeky title, restored when you come back */
  const realTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '🌻 still becoming…' : realTitle;
  });

  /* hero: the warm light drifts toward the cursor (the sun it grows toward);
     the photo tilts a touch in 3D */
  const hero  = document.getElementById('hello');
  const light = hero && hero.querySelector('.hero-light');
  const card  = document.getElementById('hero-flip');
  if (hero && (light || card)) {
    hero.addEventListener('mousemove', e => {
      const cx = e.clientX / window.innerWidth  - 0.5;   /* -0.5 … 0.5 */
      const cy = e.clientY / window.innerHeight - 0.5;
      if (light) light.style.transform = `translate(${(cx * 50).toFixed(1)}px, ${(cy * 50).toFixed(1)}px)`;
      if (card)  card.style.transform  = `rotateY(${(cx * 9).toFixed(2)}deg) rotateX(${(-cy * 9).toFixed(2)}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      if (light) light.style.transform = '';
      if (card)  card.style.transform  = '';
    });
  }
}

function miniToast(msg) {
  const t = document.createElement('div');
  t.className = 'mini-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 1400);
}
function closeDrawer(hamburger, drawer) {
  drawer.classList.remove('open-anim');
  document.body.style.overflow = '';
  setTimeout(() => drawer.classList.remove('open'), 380);
}

/* ── Résumé modal (中文 ready · English coming soon) ──────── */
function openResumeModal(lang) {
  const modal = document.getElementById('resume-modal');
  setResumeLang(lang || 'zh');
  modal.classList.add('open');
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open-anim')));
  document.body.style.overflow = 'hidden';
  if (typeof gtag === 'function') gtag('event', 'resume_preview', { cv_lang: lang || 'zh' });
}
function setResumeLang(lang) {
  const iframe = document.getElementById('res-iframe');
  const soon = document.getElementById('res-soon');
  const dl = document.getElementById('rm-dl');
  document.querySelectorAll('.rm-lang-btn').forEach(b =>
    b.classList.toggle('is-active', b.dataset.lang === lang));
  if (lang === 'en') {
    // English CV not ready yet → show the coming-soon panel
    iframe.hidden = true;
    iframe.removeAttribute('src');   // stop loading the PDF
    dl.hidden = true;
    soon.hidden = false;
  } else {
    soon.hidden = true;
    iframe.hidden = false;
    iframe.src = 'assets/resume-zh.pdf';
    dl.hidden = false;
    dl.href = 'assets/resume-zh.pdf';
  }
}
function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  modal.classList.remove('open-anim');
  setTimeout(() => { modal.classList.remove('open'); document.body.style.overflow = ''; }, 380);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeResumeModal(); closePostModal(); }
});

/* ══════════════════════════════════════════════════════════
   📂 Out in the open (writing + building, one wall)
   One calm card system for everything she's put into the world.
   Two families: `written` (Rednote / podcast / Substack) and
   `built` (sites / skills). Written + podcast open the on-site
   reader (the podcast embeds the Apple player); sites link out;
   skills carry a muted note. Filter toggles the two families.
   ══════════════════════════════════════════════════════════ */
const KIND = {
  rednote:  { label: 'Rednote',        icon: '📕', family: 'written' },
  podcast:  { label: 'Apple Podcasts', icon: '🎙️', family: 'written' },
  substack: { label: 'Substack',       icon: '✍️', family: 'written' },
  site:     { label: 'Site',           icon: '🌐', family: 'built'   },
  skill:    { label: 'Skill',          icon: '🧩', family: 'built'   },
};

const OPEN_ITEMS = [
  /* ── written ── */
  {
    kind: 'rednote',
    title: 'AI 时代根本没有小而美,只有又快又好又能 scale',
    blurb: 'AI 把 build 速度拉平了,小而美不再是护城河。真正的壁垒是快、好、能 scale,而这恰好是 taste 的游戏。',
    url: 'https://www.xiaohongshu.com/discovery/item/69e40087000000002102fab8?source=webshare&xhsshare=pc_web&xsec_token=ABOVZdFUwtCLQ-0tDn-eoFNmtzflmj9-vG8gqs4VR8eTo=&xsec_source=pc_share',
    titleEn: "Fast, Good, Scalable: The Only Moat Left in AI",
    blurbEn: "AI flattened everyone's build speed, so a small, defensible niche isn't a moat anymore. What's left is fast, good, and able to scale, and that turns out to be a game of taste.",
    fulltextEn: `<p>Honestly, AI replacing human work never felt real to me. I assumed it was a problem all of us would hit together, and that coding would get automated first. Marketing felt further down the list, AI is still weak at creative sense and at reading the subtle emotional stuff.</p>
<p>Then I hit a solid half-year of tech fatigue, didn't want to touch anything new. The mood was basically: I'm a marketer, why is half my day going into new tooling just to unblock myself on coding. Then the last two weeks humbled me. AI jumped past my expectations again.</p>
<p>The standard advice used to be: in the AI era, find a niche and build a small, defensible product. Half a year in, my take flipped. The genuinely small, niche product? I can just build it myself. With vibe coding I can stand up a tool that's tailored to me and skip subscribing to some generic horizontal SaaS.</p>
<p>So now I watch product after product bloat, bolting on features to become this all-in-one, foolproof wrapper. They keep telling you the others are thin while <em>we</em> do everything, one click and it's handled, all to manufacture a little differentiation and win the user. ChatGPT is swallowing search + coding + browser, Cursor keeps stacking agents, every product wants to be your everything app.</p>
<p>But look closer and the market is splitting into two ends. One end is the increasingly casual user, funneled into the everything app and the one-click fix. The other end is people who can build, all defaulting to rolling their own. The dangerous place is the squeezed middle: the micro-SaaS serving "prosumer" users, too small to ride platform economies of scale, and undercut from below by capable users who just vibe-code their own.</p>
<p>I'm at that second end. We're an AI-native team and we barely pay for anything past infrastructure. It's all in-house: auto-publishing, bulk outreach, bid strategy, all built ourselves.</p>
<p>Saw a great line recently: everyone wants to cut costs and everyone wants to make more, so people realize the thing they vibe-coded on a whim can be repackaged and sold, and suddenly there's a stampede of "small, defensible" products flooding in.</p>
<p>So where's the moat, really? Taste? Design sense? UX?</p>
<p>I sat with it, and my answer: the moat is shipping a genuinely high-quality product in almost no time, with taste and design sense, and then scaling it fast.</p>
<p>Fast, because AI lifted everyone's build speed; lag one iteration and someone else's version already shipped. Good, because features are table stakes now, anyone can copy them, but knowing what to build and what to kill is exactly what AI can't do, it only executes. Scale, because a single tailored product, however exquisite, has no leverage. In the end it's about who can distribute their taste to the most people.</p>
<p>Which is what makes me think marketing won't get automated as fast as I feared (cope). It's fundamentally a game of taste and timing, and that's the single hardest thing to train into a model.</p>`,
    fulltext: `<p>之前我对 AI 取代人类工作这件事，其实没什么实感。默认这是全人类一起面对的问题，而且最先被替代的肯定是 coding。marketing 反而更靠后，毕竟 AI 对 creative sense、对细微情绪的捕捉还是偏弱。</p>
<p>后来小半年经历了一个 tech fatigue，完全不想碰任何新技术。心态就是，我做 marketing 的，每天一大半时间在学新技术解决 coding 问题很烦。然后前两周被现实教育了，AI 这半年又一次跑到了我想象之外。</p>
<p>以前大家都在说 AI 时代的机会是找一个 niche，做小而美的产品。但半年过去我的观察反过来了：真正小而美的产品，我自己就能 build。靠 vibe coding 的能力，完全可以搭一个 tailored to me 的小工具，根本不需要去订阅那些很 general 的 SaaS。</p>
<p>所以现在我看到很多产品开始不断的，通过扩展产品功能，来试图达到一种，包裹式的傻瓜式的操作体验，这些产品不断告诉大家，人家产品很单薄，而我们囊括了更多，可以一键解决所有的事情，试图制造一些差异化达到争夺用户的目的。ChatGPT 在吃搜索+coding+browser，Cursor 在堆 agent，每个产品都想成为你的 everything app。</p>
<p>但仔细看会发现，市场其实在分裂成两头：一头是越来越 casual 的普通用户，被推向 everything app，一键解决；另一头是有 build 能力的用户，全都转向自建。真正危险的是卡在中间、服务"半专业"人群的小 SaaS，上够不着平台的规模效应，下被有能力的用户自建替代。</p>
<p>而我自己就在第二头，一个 AI native 的 team，我们除了基础设施几乎不订阅任何产品。一切都 in-house，自动发布、批量 outreach、广告出价策略，全部自己写。</p>
<p>刚看到一句很不错的话，大家都很想省钱，也都更想赚钱，发现自己随手 build 的产品包装一下完全可以拿出去卖，于是一大堆"小而美"蜂拥上来。</p>
<p>那产品的护城河到底在哪？在审美？在 sense？在 UX？</p>
<p>想了很久，我的答案是，护城河就是能在极短时间内 ship 出高质量的产品，有 sense、品味、审美，并且迅速 scale。</p>
<p>快，是因为 AI 把所有人的 build 速度都拉起来了，迭代慢一拍，别人的版本已经上线。好，是因为 feature 谁都能 copy，但"知道做什么、不做什么"AI 做不到，它只会 execute。scale，是因为单个 tailored 产品再精巧也没有 leverage，最终拼的是谁能把自己的 taste 复制给更多人。</p>
<p>这么想想 marketing 好像也没那么快被取代（自我安慰），毕竟它本质是 taste 和节奏感的游戏，而这恰好是 AI 最难训出来的东西。</p>`,
  },
  {
    kind: 'rednote',
    title: 'AI 产品三个月 SEO 流量增长 7 倍,我重新确认了哪些事是值得先做的',
    blurb: '从零 SEO 基础到三个月流量 7 倍增长,我第一次从头到尾亲自操盘一个 SEO 项目,复盘三个核心动作和两个关键判断。',
    url: 'https://www.xiaohongshu.com/discovery/item/695a861e0000000022032e76?source=webshare&xhsshare=pc_web&xsec_token=AB_hPfsNqThkmFCs2xh6wQVld-H1Ko58k_Yn6uqJk28_0=&xsec_source=pc_share',
    titleEn: "How I 7x'd an AI Product's SEO in 3 Months",
    blurbEn: "From zero SEO foundation to 7x traffic in three months. The first SEO project I ran end to end myself, and a debrief on the three core moves and two judgment calls behind it.",
    fulltextEn: `<p>Finally had some breathing room to finish this debrief I'd been putting off forever.</p>
<p>This was the first SEO project I ran end to end myself. Last September, an AI product founder found me on Rednote. After a few conversations, I started doing search optimization for an AI face-swap product with basically no SEO foundation. Lucky for us, three months later traffic spiked 7x.</p>
<p>So I wanted to write up the debrief, the lessons and the mistakes both.</p>
<p>The site already had a decent traffic base and solid domain authority, but almost all of its search traffic came from branded queries, with barely any coverage on non-branded keywords. So my job was to lift rankings on non-branded terms and capture that slice of SEO traffic.</p>
<h4>What I got right</h4>
<p><strong>1 · I moved on site architecture first.</strong></p>
<p>If even Google can't quickly tell which pages are core, then no matter how much content you pump out, you're just adding noise. So I re-mapped the whole site hierarchy, flattened it as much as possible, and rebuilt the header and footer. My rule was clear: any page that actually needs to rank and receive link equity has to live in the header. Everything non-core or supplementary gets demoted to the footer, in a logical order. Once the restructure shipped, the data came back fast, and honestly it surprised me. It reconfirmed something I think is badly underrated: structural clarity.</p>
<p><strong>2 · I split functionality crammed onto one page into separate landing pages.</strong></p>
<p>Face swap isn't a single need; on the search side it maps to completely different intents. Photo, video, GIF, group shots, these are different problems in the user's head. Put them all on one page and you're asking one page to answer several questions at once, which usually means none of them land well. So I gave every core intent its own landing page, each serving one clear search need. The head term stays tight to that intent, then fans out into a cluster of closely related long-tail keywords and variants, and everything on the page is written to solve that one specific problem, not to cram in more keywords. Only after this did non-branded coverage actually start to climb.</p>
<p><strong>3 · Localized pages.</strong></p>
<p>Localization wasn't the priority at first, but once the non-branded structure stabilized, I realized fast that a single-language market makes it hard to read the product's real ceiling in search. We ended up doing a dozen-plus languages. The process is simple: machine-translate to roll out fast, then hand-optimize the meta. I wasn't trying to polish content to perfection on day one; the only goal here was to validate each market's search response at minimum cost. Once the localized pages went live, the data was blunt. Some language regions took off fast, others gave almost nothing back. The real value of this step: it showed me clearly which markets were worth doubling down on.</p>
<h4>A few judgment calls</h4>
<p><strong>1 ·</strong> A lot of people get stuck on one judgment in SEO, me included, back in the day. Everyone knows you should build landing pages, but the moment they see those pages are already covered by a ton of big sites, the instinct is: doing it again just makes me cannon fodder.</p>
<p>That instinct is exactly the problem. Page count and site authority matter, sure, but they set the starting line, not whether a single page can win. Under a specific keyword, what actually opens the gap is whether your page is closer to the answer: is the content complete and fresh, is the structure clear, is it actually usable.</p>
<p>One thing that stuck with me: searching certain keywords in Arabic, I found tiny sites in the top ten, one with under 4K monthly visits, holding steady above sites hundreds of times its size. That's not luck, and it's not Google ignoring authority. In that specific search context, the small site's page just solved the user's problem more precisely than the big ones did.</p>
<p>So the opportunity is never about avoiding "the page types everyone is doing." It's a judgment call: under this keyword, have the existing results actually solved the problem well? If not, a page that's clearly better than the current average has every chance to rank.</p>
<p><strong>2 ·</strong> We rode a few sudden traffic spikes and a few drops too, and came out understanding Google's ranking system a lot better.</p>
<p>Google doesn't decide a page's fate in one shot. It first hands you a relatively conservative initial ranking band, based on the page's own quality, the site's history, and how similar pages generally perform. That ranking is just a starting point.</p>
<p>Then Google keeps validating whether the page deserves a higher spot through real user behavior: CTR, dwell time, whether people pogo-stick straight back to the results.</p>
<p>When those signals beat the average for its current band, the page might get bumped up temporarily. If it keeps earning consistent user choice in a more competitive slot, the ranking gradually gets confirmed and locked in. The moment user behavior can't hold it up, the ranking drops back fast.</p>
<p>Essentially, Google is constantly probing, weeding out pages that can't live up to their slot.</p>
<p>The real barrier in SEO was never technical, it's judgment. When to move on structure first, when to split pages, when localization is worth it, when it's just burning resources. Get those calls wrong and all the diligent execution in the world is just spinning your wheels.</p>`,
    fulltext: `<p>最近终于空下来，把这篇拖了很久的复盘写完。</p>
<p>这是我第一次从头到尾亲自操盘的 SEO 项目。去年九月，一位做 AI 产品的创始人在小红书上找到我。</p>
<p>几次沟通之后，我开始给一个几乎没有任何 SEO 基础的 AI Face Swap 产品做搜索优化。很幸运的是在三个月后我们迎来了流量的七倍暴增。</p>
<p>所以想写下这篇复盘，给大家提供更多的经验和教训。</p>
<p>这个网站已经有不错的整体流量基础，域名权威性也不低，但几乎所有搜索流量都来自品牌词，对非品牌关键词很少有覆盖。所以我要做的就是提升非品牌关键词的排名，拿到这部分 SEO 的流量。</p>
<h4>我做对了什么</h4>
<p><strong>1 · 第一步就先动了网站结构。</strong></p>
<p>如果连 Google 都没办法快速理解哪些页面是核心，内容做得再多，也只是增加噪音。所以我先重新梳理了整站层级，把结构压到尽量扁平，同时重做了 header 和 footer。我的原则很明确，真正需要传权、需要排名的页面，必须全部出现在 header。其余非核心页面和功能型补充页面，只能作为辅助，统一放在 footer，按逻辑顺序展开。结构调整完成后，数据反馈来得很快，让我非常惊喜，也让我确认了一件事，结构清晰度的重要性往往被严重低估。</p>
<p><strong>2 · 把原本集中在一个页面里的功能，彻底拆成多个落地页。</strong></p>
<p>Face swap 并不是一个单一需求，它在搜索端对应的是完全不同的使用意图。针对图片、视频、GIF、多人合照，这些场景在用户心里是不同的问题。如果全部放在一个页面里，本质上就是让一个页面同时回答多个问题，结果往往是每个问题都回答得不够好。所以我给每一个核心使用意图都单独拆了一个落地页，每个页面只服务一个明确的搜索需求。页面的主关键词只围绕这个意图展开，再向外发散一组高度相关的长尾关键词和变体，所有内容都围绕"解决这个具体问题"来写，而不是为了覆盖更多词而堆内容。这一步做完之后，非品牌关键词的覆盖才真正开始增长。</p>
<p><strong>3 · 多语言页面。</strong></p>
<p>多语言并不是这个项目一开始的重点，但在非品牌词结构逐渐稳定之后，我很快意识到，只靠单一语言市场，很难判断这个产品在搜索端的真实上限。我们最终做了十几种语言，整体流程并不复杂，先用机器翻译快速铺开，再针对 meta 信息进行人工优化。我并不指望一开始就把内容打磨到极致，这一阶段的目标只有一个，用最小成本，快速验证不同市场的搜索反馈。多语言页面上线之后，数据给得非常直接。有些语言区的流量起得很快，有些几乎没有任何反馈。这一步真正有价值的地方，是让我非常清楚地看到，哪些市场值得继续投入。</p>
<h4>一些关键判断</h4>
<p><strong>1 ·</strong> 很多人做 SEO 时都会被一个判断卡住，包括我自己以前也一样。大家都知道要做落地页，但一看到这些页面已经被大量网站覆盖，就会下意识觉得，再做只是在当炮灰。</p>
<p>这个判断本身就是问题所在。页面数量和站点权重当然重要，但它们决定的只是起跑线，而不是单个页面能不能赢。在具体关键词下，真正拉开差距的，往往是页面本身是否更接近答案，包括内容是否完整、新鲜，结构是否清晰，可用性是否足够强。</p>
<p>我印象很深的一次经历，是在用阿拉伯语搜索某些关键词时，发现排名前十里出现了体量非常小的网站，其中一个 monthly visits 甚至不到 4K，却能稳定排在体量是它几百倍的网站之前。这并不是偶然，也不是 Google 忽视了权重，而是因为在那个搜索场景下，小站页面比大站更准确地解决了用户的问题。</p>
<p>所以机会从来不在于避开"大家都在做的页面类型"，而在于判断：这个关键词下，现有结果是不是已经把问题真正解决好了。如果没有，那么只要页面明显优于当前平均水平，就完全有机会排在前面。</p>
<p><strong>2 ·</strong> 我们其实经历了好几波突如其来的流量暴涨，也经历了几次回落，对 Google 的排名机制也有了更多的理解。</p>
<p>Google 对每一个页面并不是一次性定生死，而是先基于页面自身质量、站点历史以及相似页面的整体表现，给出一个相对保守的初始排名区间。这个排名只是一个起点。</p>
<p>随后，Google 会通过真实用户行为来不断校验这个页面是否配得上更高的位置，包括点击率、停留时间、是否快速返回搜索结果等信号。</p>
<p>当这些表现优于当前排名区间的平均水平时，页面可能会被短暂提升到更高的位置。如果页面在更高竞争环境下依然能够获得稳定的用户选择，排名才会逐步被确认和巩固。一旦用户行为支撑不住，排名会迅速回落。</p>
<p>本质上，Google 是在通过不断试探，淘汰无法匹配排名位置的页面。</p>
<p>SEO 真正的门槛，从来不是技术，而是判断。什么时候该先动结构，什么时候该拆页面，什么时候多语言值得做，什么时候做了也只是消耗资源。这些问题如果判断错了，执行再勤奋也只是内耗。</p>`,
  },
  {
    kind: 'rednote',
    title: '产品增长近期复盘 ｜ 为什么给产品写了很多 blog,主关键词还是起不来',
    blurb: '写了几十篇 blog,主词还是没起来:问题不是内容量,是网站根本没有"中心"。',
    url: 'https://www.xiaohongshu.com/discovery/item/69a1b6b4000000001b015f6c?source=webshare&xhsshare=pc_web&xsec_token=ABIW3ZadSBFssiqs7pFiCf8r8iqH1B5Rm8FTG6FkloPis=&xsec_source=pc_share',
    titleEn: "Why Your Head Term Won't Rank",
    blurbEn: "Dozens of posts in, and the head term still wouldn't move. The problem wasn't volume, it's that the site had no center.",
    fulltextEn: `<p><em>(context: I'd been trying to push the head term up for a while. Banners injected into blogs to funnel traffic, internal links everywhere, backlinks, none of it moved the needle. But lately I think I found a new angle, so sharing.)</em></p>
<p>I used to just assume "SEO = write more." Whatever term had traffic, I'd write for it, stack up blog posts, spread landing pages everywhere, watch the numbers tick up a little and feel pretty good. At least it proved I wasn't slacking.</p>
<p>But the head term never moved.</p>
<p>Back then I'd blame it on not enough backlinks, domain authority too low, competitors too strong.</p>
<p>A lot of AI teams are doing the exact same thing right now. Product launches, blogging starts immediately. Tons of features, tons of use cases, so tons of content. Every keyword is worth a post, every scenario can be spun into an article. Let AI split it up and that's dozens of posts, straight into Claude, churning out hundreds a month.</p>
<p>But every article is fighting its own war. Each one grabs its own traffic, yet no single page ever gets reinforced. Internal links get slapped on at random, no centripetal structure. So authority just spreads out evenly. What the search engine sees is a pile of related pages, not one structure pushing consistently on a single topic.</p>
<p>The core of SEO is the search engine's process of understanding structure.</p>
<p>My thinking now: draw the mind map, define the core page first. Then everything related orbits it, split by scenario, by problem, by sub-need, and the related pages link naturally back to the core. Every article and landing page has a role, instead of just existing to grab traffic. Traffic-grab content still gets written, separately, but it can't scatter the site. Everything has to converge in one direction in the end.</p>
<p>So the heart of site architecture is letting the search engine clearly read your site's "topical center" and how authority flows through it.</p>
<p><strong>First, define the center.</strong><br>Your site needs one clear core (pillar) page carrying the head term. Google needs to know: under this topic, which page is your most important one. With no center, all your content just sits there flat, and the head term struggles to rise.</p>
<p><strong>Second, design the hierarchy.</strong><br>Structure isn't flat, it's layered. Home → core page → subtopics → supporting articles. Important pages sit close to the home page, secondary content unfolds layer by layer. The clearer the hierarchy, the more concentrated the topical signal.</p>
<p><strong>Third, control how authority flows.</strong><br>Internal links aren't decoration, they're how you route authority. Whichever page you want strong, point more related pages toward it. Random internal links spread authority thin. Centripetal, hub-and-spoke linking concentrates it.</p>
<p>A lot of AI products build a site and get no organic traffic, not necessarily for lack of effort, but because there was no center from the start.</p>`,
    fulltext: `<p>（context：最近一直想把主关键词做起来，做了各种 banner 插入 blog 导流，做了各种内链插入，做了外链，但都没啥效果，但最近感觉找到了一点新的方向跟大家 share 一下）</p>
<p>以前我会很自然地觉得"SEO 就是多写"。哪个词有流量就写哪个，博客堆起来，落地页铺开，看数据涨一点就挺开心。至少证明自己没白干。</p>
<p>但主关键词始终起不来。</p>
<p>那时候我会怪外链不够，怪域名权重太低，怪竞争对手太强。</p>
<p>很多 AI 团队现在也在做一样的事。产品一上线，马上开始写博客。产品功能很多，场景很多，于是内容也很多。每个关键词都值得写，每个场景都能拆一篇文章。用 AI 随便拆一拆就是几十篇内容，直接上 Claude 迅速产出，一个月能狂写几百篇。</p>
<p>但是所有文章都是在各自打仗。每一篇都在拿自己的流量，但没有任何一个页面被持续强化。内链是随便链接，没有向心结构。权重自然是平均分散的。搜索引擎看到的是一堆相关页面，而不是一个在某个主题上持续发力的结构。</p>
<p>SEO 的核心是搜索引擎理解结构的过程。</p>
<p>现在我的思路变成，画思维导图，先定义核心页。然后所有相关内容围绕它展开，拆场景、拆问题、拆细分需求，相关的页面自然链接回核心页。每一篇文章 / 落地页都有角色，而不是单纯为了攫取流量。同时，流量型内容另外写，但不能把网站写散。所有内容最终要往一个方向聚拢。</p>
<p>So 网站架构的核心，是让搜索引擎清晰地理解你的网站"主题中心"和"权重流向"。</p>
<p><strong>第一，明确中心。</strong><br>你的网站必须有一个清晰的核心页面，承载主关键词。Google 需要知道：在这个主题下，你最重要的是哪一页。如果没有中心，所有内容就是平铺的，主词很难起来。</p>
<p><strong>第二，设计层级。</strong><br>结构不是平面，是有层级的。首页 → 核心页 → 子主题 → 细分文章。重要页面要靠近首页，次级内容逐层展开。层级越清晰，主题信号越集中。</p>
<p><strong>第三，控制权重流向。</strong><br>内链不是装饰，是权重调度工具。你希望哪个页面强，就让更多相关页面往它聚拢。如果内链是随机的，权重就是平均分散的。如果内链是向心的，权重就会被集中。</p>
<p>很多 AI 产品做了网站却没自然流量，未必是因为不努力，而是因为一开始就没有中心。</p>`,
  },
  {
    kind: 'rednote',
    title: '我做 AI 出海增长,每天都在看的 Newsletter 清单',
    blurb: '做 AI 增长两年,我把每天必读的 Newsletter 整理出来了:信息密度高、废话少,三类方向全覆盖。',
    url: 'https://www.xiaohongshu.com/discovery/item/69a9fd5b000000001d011def?source=webshare&xhsshare=pc_web&xsec_token=AB8c2l6zx0Hi4oY70twAOWR1RddPmiwqK26cl8nMqLHDk=&xsec_source=pc_share',
    titleEn: "The Newsletters I Actually Read Every Day",
    blurbEn: "Two years into AI growth, I finally pulled together my daily must-reads. High signal, low fluff, across three areas.",
    fulltextEn: `<p>I've been meaning to pull together the newsletters that make up my daily information diet and do a proper write-up.</p>
<p>My bar for picking them: high signal density, restrained on the editorializing, as little filler as possible. Genuinely valuable free content is rare, and once information tips into overload it just becomes noise (everyone's already tired enough, I really don't want to wade through more fluff lol).</p>
<p>My daily habit: open the inbox first thing, check these newsletters, get a read on what happened today. Then I ease into work, it helps me gather focus and shift into a productive state.</p>
<p>Not all of these are about AI or going global, but they're mostly the directions I'm personally into and happy to spend time on: AI news, international affairs, and hands-on marketing and growth.</p>
<h4>1 · AI first</h4>
<p>Since I work in AI, this part is a daily must.</p>
<p>Top pick is <strong>Superhuman</strong>. It's basically a daily condensed digest of AI news: which vendors shipped which models, who updated which product line, which technical directions are starting to shift, all scannable at a glance. That long translated piece of mine that pulled a few hundred thousand impressions? The source material actually came from here.</p>
<p>Another aggregator in the same vein is <strong>Future Blueprint</strong>, similar style and function, not much difference for me.</p>
<p>For funding I only kept <strong>F6S</strong>, daily startup funding news. Tbh I don't know most of the companies, so the personal value is limited, but if you track venture activity it's genuinely useful.</p>
<p>A lot of the other AI newsletters are too padded for me, not much actionable substance, so I ended up keeping just these aggregator types. Side note: if anyone has good general-AI sources, please drop them in my comments. I genuinely haven't found a great AI newsletter, maybe because I haven't paid into certain communities lol, so I'm only seeing surface-level stuff. Most of it is just noise to me, a lot of it reads stale and self-important, or it's a "review" that's actually an ad. Even Lenny's newsletter, which everyone recommends, I don't find that amazing, and honestly I think his podcast beats the newsletter. So please, send me recs.</p>
<h4>2 · International affairs</h4>
<p>The category I read the most.</p>
<p><strong>Drop Site News</strong> is a site I really like, an independent investigative outlet, reader-funded, with its own newsletter. Daily roundups and commentary on world news, one scan and you basically know what happened globally today. They also do deep-dive reporting on specific events. They only launched in '24 but they're already substantial and serious, often getting first-hand international information fast. To me it reads relatively restrained, high in signal, good for getting up to speed.</p>
<p><strong>Alessandro Di Battista</strong> is an independent Italian writer I dug up on Substack and really love. His daily mission is basically skewering the hypocrisy of the Italian government and the EU, and of the US too (a guilt-free read, honestly). Sharp style, strong opinions. He's what I most look forward to in my inbox, watching him call out the EU's blatant double standards on certain geopolitical issues, and how much taxpayer money it pours into others. If you want a European contrarian's take, his newsletter is worth a subscribe, genuinely another lens on Europe. Since I'm studying in Europe myself right now, I'll just say he writes exactly what's on my mind.</p>
<p><strong>Persuasion</strong> is also worth a look, it tells the political stories of different countries in a fairly in-depth way. It recently ran a piece on why a certain leader's approval rating has stayed so high. Setting aside where you stand, as a foreign-media perspective it was really well done, and it gave me more insight into Japanese public opinion and the broader economy.</p>
<p>Beyond that I subscribe to newsletters from <strong>The Washington Post, The Guardian, The New York Times</strong> and others. Even without paying, getting breaking news by email is enough to build a timely picture of what's going on.</p>
<p>And various independent authors on Substack, I subscribe to a bunch. No specific recs, subscribing to some of the higher-ranked ones is fine. My principle on reading current affairs: observe how different interests and positions frame things, then synthesize my own view. Over time your read on world events gets steadier, harder to get pulled around by any single narrative.</p>
<h4>3 · Product growth and marketing</h4>
<p>Closest to my day job.</p>
<p><strong>Tom's Marketing Idea</strong> lists recent marketing ideas he rates highly. Clicking through is paywalled, but I prefer going to the source, so if something really grabs me I'll dig up the original and work out how they actually ran the campaign. That Cluely "creator program" ad on Reddit I dug up earlier? Found it through this newsletter.</p>
<p><strong>Seer Interactive</strong> is another favorite. Its blog collects a lot of real growth and marketing practice, not the generic hand-wavy kind but actual experiment detail: how they do GEO, what A/B tests they ran, what the results were. Downside is it updates slowly, maybe one post a month, but the quality is high.</p>
<p><strong>Growth Memo</strong> I find genuinely useful, but sometimes there are just too many ads, which sours the read. Occasionally a whole post exists just to push one, so I'm not a huge fan, though I'll admit it's often actually useful.</p>
<p>Since I'm mainly doing SEO right now, I also follow tools like <strong>Semrush</strong> and <strong>SimilarWeb</strong>, mostly to track data trends and industry shifts.</p>
<p>Last one I really like is <strong>Profound</strong>. I'm not subscribed, though I just checked and you apparently can. I drop by their site now and then for the latest blog posts, there's often fresh thinking and experiments on GEO and AEO, pretty good.</p>
<p>Overall, the biggest value of these is helping me build a daily input structure. Getting high-quality information at a fixed time each day, letting my brain enter thinking mode before executing, makes me noticeably more efficient. Long term, they're also building me a more three-dimensional worldview, so when I'm making calls on AI, on growth, on content, I've got a clearer frame of reference.</p>`,
    fulltext: `<p>最近一直想把我日常信息输入的一些 Newsletter 整理出来，做一次系统分享。</p>
<p>我挑选 Newsletter 的标准就是：信息密度高，立场尽量克制，尽量少水文。免费的内容里真正有价值的并不多，信息一旦过量就会变成噪音（人每天已经很累了，所以真的不想看到太多废话 hhh）。</p>
<p>我自己每天的习惯是早上先打开邮箱，去 check 一下这些 Newsletter，了解今天发生了什么大事。然后我再慢慢进入到工作中，帮助我慢慢集中注意力，转向一个高效的工作状态。</p>
<p>其实这些并不全是 AI 出海相关的，但主要都是我自己感兴趣的方向，我愿意花时间研究的，主要是 AI 时事、国际新闻、mkt 增长实操。</p>
<h4>1 · 先说 AI</h4>
<p>因为我自己做 AI，这部分是每天必读。</p>
<p>比较推荐的是 Superhuman。它基本上就是每日 AI 新闻的浓缩合集，各家厂商发布了什么模型，谁又更新了什么产品线，哪些技术路线开始有新动向，一眼就能扫清。我之前那篇获得几十万曝光的长篇翻译文章，素材其实就是在这里看到的。</p>
<p>类似的信息集合类还有 Future Blueprint，风格和功能差不多，对我来说差异不大。</p>
<p>融资类我只保留了 F6S，它每天更新公司融资新闻。不过 tbh，大部分公司我并不熟悉，所以对我个人价值有限，但如果你关注创投动态，这类信息会很有参考意义。</p>
<p>其他很多 AI Newsletter 在我看来废话偏多，真正可实操的内容不多，所以最后就只保留了这些信息类的。另外，大家如果有泛 AI 类的信息源推荐非常欢迎在我的评论区留言，我真的感觉我没有找到什么很好的 AI 类的 newsletter，也可能是因为我没给一些社群付费吧哈哈哈只能看到比较浅层的内容。大部分的信息真的对我来说全部都是噪音，老登味儿很重，要么就是表面上是测评，实际上是广告，包括大家一直推荐的 Lenny 的 newsletter 我觉得也没有那么那么好，并且我觉得他的播客比 Newsletter 会更好看，so 拜托大家给我推荐啦。</p>
<h4>2 · 国际新闻</h4>
<p>Drop Site News 是我很喜欢的一个网站，它是一家独立调查新闻媒体，受读者 sponsor，并且有自己的 Newsletter，每天发国际新闻合集和评论，扫一眼基本就知道今天全球国际新闻层面发生了什么。它也有针对具体事件的深度报道，他们虽然 24 年才成立但是体量和专业度都不小，很多时候能快速获得各种国际一手消息，在我看来整体相对克制，信息价值高，适合快速获取信息。</p>
<p>Alessandro Di Battista 是我在 substack 挖掘的非常喜欢的一位意大利的独立撰稿人，他每天的任务就是批评意大利政府和欧盟虚伪，批评美国虚伪 hhhh（看得本人很爽），文风犀利观点鲜明。我每天打开邮箱最期待的就是他的文章，看他指责欧盟在对待 yi 和 e 的态度上有多么双标，以及批判欧盟在 e 和 wu 上又投入了多少纳税人的钱 hhh。大家如果想看欧洲公知的文章可以去订阅他的 newsletter，真的是另一个视角看欧洲。因为主包自己目前就在欧洲读书，所以只能说这位完全写出我的心声 hhh。</p>
<p>Persuasion 也值得一看，它会用比较深度的方式讲不同国家的政治故事。它最近讲了一篇关于高/支持率为什么一直很高的原因。我觉得抛开立场这一篇至少从一个外国媒体的视角来看，写得非常好，也给我带来了对日本民意以及国内经济的更多见解。</p>
<p>除此之外我也会订阅 The Washington Post、The Guardian、The New York Times 等报纸的 Newsletter。哪怕没有付费订阅，通过邮件获取 Breaking News 也足够建立一个及时的新闻框架。</p>
<p>另外就是 Substack 上各种独立的作者，其实都订阅了一些。平时习惯接收各种各样的信息。这些的话就没有特别的推荐，订阅一些排名靠前的其实都不错。反正我在时政阅读上的原则是，尽量观察不同利益方和立场方的表达，然后自己做整合。长期下来会发现自己对国际局势的判断更稳，不容易被单一叙事牵着走。</p>
<h4>3 · 产品增长和营销</h4>
<p>Tom's Marketing Idea 他会列出一些最近发生的、他觉得非常好的 Marketing Idea。虽然点进去其实是需要付费的，但就我个人的习惯而言，我更喜欢追根溯源。如果看到非常感兴趣的内容，我会直接去翻原文，了解他们到底是怎么做这个 Campaign 的。包括我之前挖掘到的 Cluely 在 Reddit 上发的那个"创作者计划"的广告，也是我在这个 Newsletter 上发现的。</p>
<p>Seer Interactive 也是我很喜欢的一个，它的博客集合了很多增长和营销实践，不是那种泛泛而谈的内容，而是真的有实验细节，比如他们如何做 GEO，做了什么 A B Test，结果如何。缺点是更新慢，一个月可能才一篇，但质量很高。</p>
<p>Growth Memo 我觉得它其实是有用的，但有时候广告确实太多了，让我看的时候不是很喜欢。它可能写了一篇文章，最后我发现专门就是为了推广告，所以我不是特别喜欢它，但不得不说它有时候确实挺有用的。</p>
<p>因为我目前主要做 SEO，也会关注 Semrush、SimilarWeb 这类工具的 Newsletter，主要是为了了解数据趋势和行业变化。</p>
<p>最后一个我很喜欢的是 Profound。不过这个我没订阅，但我刚才看了一下，好像是可以订阅的。我一般会时不时上 Profound 的网站，去看一下他们最新写的一些博客。那里可能会有一些关于 GEO、AEO 之类的最新见解和实验，也挺不错的。</p>
<p>整体来说，这些 Newsletter 对我最大的意义就是帮我建立一种日常的输入结构。每天固定时间获取高质量信息，让大脑先进入思考状态，再去执行具体任务，效率会明显更高。长期来看，它们也在帮助我构建一个更立体的世界观，让我在做 AI、做增长、做内容判断时，有更清晰的参照系。</p>`,
  },
  {
    kind: 'rednote',
    title: '来到湾区,聊聊我对 AI 创业的看法',
    blurb: '在湾区疯狂 coffeechat 两周,密聊十几场 founder 之后,我对 AI 创业的 GTM 有了一些新的判断。',
    url: 'https://www.xiaohongshu.com/discovery/item/69c9678c0000000022002d14?source=webshare&xhsshare=pc_web&xsec_token=ABXqSfFQS8Uj0P9gGHh7qvJ_2yFNDAFn_VRQvEO_W4T3U=&xsec_source=pc_share',
    titleEn: "Notes from Two Weeks in the Bay Area",
    blurbEn: "Two weeks of nonstop coffee chats in the Bay, a dozen-plus founder conversations deep, and I've got some new takes on GTM for AI startups.",
    fulltextEn: `<p>These two weeks in the Bay I've basically been in nonstop coffee-chat mode, a dozen-plus back to back, plus a bunch of AI events, meeting tons of founders, marketers, and engineers.</p>
<p>I have to say the tech density here is genuinely insane. Fisherman's Wharf has OOH ads for every kind of AI product, there's a never-ending stream of demo days and founders pitching, Blue Bottle is packed with people networking IRL, you can't take a city walk without overhearing five separate AI conversations. It's basically heaven for anyone working in AI.</p>
<p>Feels like there are only three kinds of people in the Bay: engineers at tech companies, founders pitching products, and hyper-active VCs. After all those events, I realized there actually aren't that many growth people out here, and early-stage products don't really emphasize marketing as a skill, AI and agencies can cover it all.</p>
<p>In nearly every conversation, the founder and I would end up at the same question: how do you do GTM. Everyone's struggling with it. There's basically no universal answer; different products, different channels, 2B vs 2C, even open vs closed source are fundamentally different playbooks. Especially at the earliest stage, a lot of the regular growth tactics just stop working. With no data, no tooling, no scale, no name recognition, most startups can't pull off a good cold start. VC-backed products can buy traffic and influencers; bootstrapped ones either pitch like crazy to raise, or the founder personally leads and drives sales.</p>
<p>Which brings me back to the methodology I've always run on: just try things. Try enough and you realize the real problem isn't too many choices, it's that within your limited time, whichever channel you can get to work and to scale is the good one. After all, most of the time 99.99% of tactics don't pan out lol.</p>
<p>Traditional marketing only runs conventional plays on conventional channels, and to some degree every move is built on top of existing resources and platforms. AI products doing a cold start face much more of a survival problem, which is what I've kept reminding myself these past two years: get out of the traditional mindset. From building the founder into a full-on personal brand at one end, to aggressive automated outreach at scale at the other, whatever actually drives growth is fair game (). I know plenty of marketers make great content and great campaigns, but for an AI startup the scarcest things are distribution and visibility, getting the content in front of more people is what matters most.</p>
<p>(You can see why Cluely leans on such theatrical growth tactics, they're really good at hyping themselves and it works..)</p>
<hr>
<p>Two years of being steeped in Bay Area AI culture, and I slid right into this place, carried forward by the intensity of the energy here, going out to meet people, to connect, to try every possibility. The state feels familiar, and safe, like I've finally landed where I'm supposed to be. I hadn't felt this kind of steady, bright energy in a long time during my master's. Maybe I really do prefer places with water, Hangzhou or California, either one. Water makes the sky feel vast, gives the clouds weight, lets the green echo. When the air carries a little moisture and a breeze passes through, it's easy to sink in, forget everything for a moment, and land right back in yourself.</p>
<p>After all these chats I met so many brilliant people, all building genuinely interesting products, and I felt how much I still have to learn and got pushed by it (finally not the European WLB cruise mode). I need more collisions and more hands-on reps myself, so if anyone still wants to grab a coffee chat, DM me. I've got two years of hands-on AI product experience, worked on AI video, music, and social companionship, currently focused on SEO/GEO, and I love digging into all kinds of AI growth tactics. Always up for trading ideas, and if we can't meet IRL we can do it online.</p>
<p>Heading back to little Europe soon to crank the heating and ride out winter, but I'll be back when I get the chance!</p>`,
    fulltext: `<p>这两周在湾区基本进入疯狂约 coffeechat 的状态，密集聊了十几场，也参加了不少 ai 活动，认识了很多 founder，mkter，也有很多 eng。</p>
<p>不得不说湾区科技密度是真的很高，渔人码头有各种 ai 产品的 OOH，永远不缺的 demo day 活动和 pitch 产品的 founder，bluebottle 里挤满了线下 networking 的人，随便 city walk 都能听到 n 个人在聊 AI，完全是 AI 从业者的天堂。</p>
<p>感觉湾区只有三种人，tech 公司的 eng，pitch 产品的 founder，异常活跃的 vc。在参加完各种活动之后，发现其实整个湾区这边做增长的人其实并不多，并且其实产品在早期其实并不强调 mkt 的能力，ai 和 agency 可以解决一切。</p>
<p>聊着天中，我几乎跟所有 founder 最后都会聊到同一个问题，怎么做 gtm。大家都非常 struggle 在这里，这件事几乎没有统一解，不同产品、不同渠道、2B 和 2C，甚至开源还是闭源，本质上是完全不同的打法。尤其在最早期，很多 regular 的增长手段都是失效的没有任何作用。没有数据工具规模名气，绝大部分 startup 没有办法进行好的冷启动。vc backed 的产品可以买流量买红人，bootstrap 的产品要么疯狂 pitch 获得融资要么创始人亲自带头驱动销售。</p>
<p>所以又回到我自己一直以来贯彻的方法论，先试，试一试最后发现人面临的根本不是选择太多，而是只要在有限的时间里哪个渠道能跑通能 scale 哪个就是好方法。毕竟大部分时候 99.99% 的方法都没跑通哈哈。。</p>
<p>传统 mkt 只会做常规方法常规渠道，并且一定程度上所有动作建立在资源平台之上。而 AI 产品冷启动往往面临更多的生存问题，这也是我这两年里不断提醒自己的，从传统的思维模式里跳出来，上至炒作 founder 本人打造 roylee，下至 ai 一键抓取 email 疯狂发 spam 小广告，只要能增长的就是好方法（）。我知道很多 mkter 会做出很好的内容很好的 campaign，但是对于 ai startup 来讲最缺的是 distribution，是 visibility，能够让内容被更多人知才是最需要的。</p>
<p>（不难理解 cluely 为啥用那么抓马的增长方式了，人家善于炒作自己且有用啊。。</p>
<hr>
<p>由于我自己这两年也长期受到湾区 ai 文化影响，我很自然地融进了这里，也被一种强烈的能量推着往前走，去认识人、去连接、去尝试各种可能性。这种状态让我很熟悉，也很安心，像是终于到了自己该在的位置。最近一年我已经很久没有在读 master 的日子里感受到这样持续而明亮的情绪了。可能我确实更偏爱有水的地方，杭州也好，加州也好。水让天空变得辽阔，让云层有了重量，让绿色有了回声。当空气带着湿润的气息，风轻轻经过，人很容易就沉进去，短暂地忘记一切，也刚好回到自己。</p>
<p>跟大家聊完遇见了很多很多优秀的人，大家都在做非常有趣的产品，也发现自己还有很多的不足有被 push 到（终于不是欧洲的 wlb 松弛感了。我自己也需要经历更多的碰撞和实操，所以还有想约 coffeechat 的朋友欢迎在后台 dm 我，我有两年 ai 产品实操，做过 ai 视频音乐社交陪伴，目前 focus 在 seo/geo，喜欢研究各种 ai 增长手段。欢迎跟更多伙伴产生思想碰撞，后续没法线下了可以跟大家线上约。</p>
<p>马上回小欧洲继续吹暖气过冬天，以后有机会会再来的！</p>`,
  },
  /* ── built ── */
  {
    kind: 'site', self: true,
    title: 'aislinnyang.com',
    blurb: "This site. Hand-coded from scratch, because apparently a normal Notion page was too emotionally simple.",
    meta: 'HTML · CSS · JS · vibe-coded',
  },
  {
    kind: 'skill',
    title: 'Rednote ghostwriter',
    blurb: 'A Claude skill that drafts Rednote posts in my voice from a one-line idea, a messy draft, or the notes app chaos I call raw material.',
    meta: 'Claude skill · prompt design · voice modeling',
    note: 'coming soon on GitHub',
  },
  {
    kind: 'skill',
    title: 'Listicle engine',
    blurb: 'A Claude skill that researches top-ranking pages and drafts "Best X" listicles for the ShiftFlow blog, because content ops should not eat my entire week.',
    meta: 'Claude skill · SEO · content ops',
    note: 'coming soon on GitHub',
  },
  {
    kind: 'site',
    title: "A birthday site for Spancer",
    blurb: "A tiny birthday site for my friend Spancer. Not strategic, not scalable, just joyful, which is sometimes the whole point.",
    meta: 'HTML · CSS · JS · a birthday gift',
    url: 'https://happybirthdayspancer.com/',
  },
];

function openCard(item, i) {
  const k = KIND[item.kind];
  const opensModal = item.kind === 'rednote' || item.kind === 'substack'
                  || (item.kind === 'podcast' && item.embedUrl);
  const meta = item.meta ? `<p class="open-meta">${item.meta}</p>` : '';

  let action, attrs;
  if (opensModal) {
    const verb = item.kind === 'podcast' ? 'Listen here ↗' : 'Read here ↗';
    action = `<span class="open-action">${verb}</span>`;
    attrs = `class="open-card is-readable" data-family="${k.family}" data-read="${i}" role="button" tabindex="0"`;
  } else if (item.self) {
    action = `<span class="open-action open-action--muted">you're on it 🌻</span>`;
    attrs = `class="open-card" data-family="${k.family}"`;
  } else if (item.url) {
    action = `<a class="open-action" href="${item.url}" target="_blank" rel="noopener">Visit ↗</a>`;
    attrs = `class="open-card" data-family="${k.family}"`;
  } else {
    action = item.note ? `<span class="open-action open-action--muted">${item.note}</span>` : '';
    attrs = `class="open-card" data-family="${k.family}"`;
  }

  return `<article ${attrs}>
    <p class="open-kind">${k.icon} ${k.label}</p>
    <div class="open-main">
      <h3 class="open-title">${item.titleEn || item.title}</h3>
      <p class="open-blurb">${item.blurbEn || item.blurb}</p>
      ${meta}
    </div>
    ${action}
  </article>`;
}

function initOpen() {
  const grid = document.getElementById('open-grid');
  const filterEl = document.getElementById('open-filter');
  if (!grid) return;

  grid.innerHTML = OPEN_ITEMS.map(openCard).join('');

  /* understated text filter: All · Written · Built */
  const tabs = [
    { key: 'all',     label: 'All' },
    { key: 'written', label: 'Written' },
    { key: 'built',   label: 'Built' },
  ];
  filterEl.innerHTML = tabs
    .map((t, idx) => `<button class="open-tab${idx === 0 ? ' active' : ''}" data-filter="${t.key}">${t.label}</button>`)
    .join('');
  filterEl.addEventListener('click', e => {
    const btn = e.target.closest('.open-tab');
    if (!btn) return;
    filterEl.querySelectorAll('.open-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    grid.querySelectorAll('.open-card').forEach(card =>
      card.classList.toggle('is-hidden', f !== 'all' && card.dataset.family !== f));
  });

  /* click (or Enter/Space) on a readable card → on-site reader */
  grid.addEventListener('click', e => {
    const card = e.target.closest('.open-card[data-read]');
    if (card) openPostModal(OPEN_ITEMS[+card.dataset.read]);
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.open-card[data-read]');
    if (card) { e.preventDefault(); openPostModal(OPEN_ITEMS[+card.dataset.read]); }
  });
}

/* on-site reader: posts show fulltext (English first, toggle to 中文);
   podcast embeds the Apple player; a folded corner links out to the original. */
let currentPost = null;

function openPostModal(item) {
  const modal = document.getElementById('post-modal');
  if (!modal) return;
  currentPost = item;
  const k = KIND[item.kind];
  modal.querySelector('.pm-source').textContent = `${k.icon} ${k.label}`;

  // language toggle only when both English and Chinese fulltext exist
  const langBox = modal.querySelector('.pm-lang');
  if (langBox) langBox.hidden = !(item.fulltextEn && item.fulltext);

  // folded corner links to the original (language-independent)
  const corner = modal.querySelector('.pm-corner');
  if (item.url) {
    corner.href = item.url;
    corner.querySelector('.pm-corner-label').textContent =
      item.kind === 'podcast' ? 'Listen on Apple Podcasts' : `View on ${k.label}`;
    corner.style.display = '';
  } else corner.style.display = 'none';

  setPostLang(item.fulltextEn ? 'en' : 'zh');   // English first when available

  modal.querySelector('.pm-inner').scrollTop = 0;
  modal.classList.add('open');
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open-anim')));
  document.body.style.overflow = 'hidden';
}

function setPostLang(lang) {
  const item = currentPost;
  if (!item) return;
  const modal = document.getElementById('post-modal');
  modal.querySelectorAll('.pm-lang-btn').forEach(b =>
    b.classList.toggle('is-active', b.dataset.lang === lang));

  const enTitle = item.titleEn || item.title;
  const zhTitle = item.title || item.titleEn;
  modal.querySelector('.pm-title').textContent = lang === 'zh' ? zhTitle : enTitle;

  let body;
  if (item.fulltext || item.fulltextEn) {
    const zh = item.fulltext || item.fulltextEn;
    const en = item.fulltextEn || item.fulltext;
    body = lang === 'zh' ? zh : en;
  } else if (item.embedUrl) {
    body = `<iframe class="pm-embed" src="${item.embedUrl}" loading="lazy"
      allow="autoplay *; encrypted-media *; clipboard-write" title="${enTitle}"></iframe>`;
  } else {
    body = `<p>${lang === 'zh' ? (item.blurb || '') : (item.blurbEn || item.blurb || '')}</p>`;
  }
  modal.querySelector('.pm-body').innerHTML = body;
  const scroller = modal.querySelector('.pm-article');
  if (scroller) scroller.scrollTop = 0;
}

function closePostModal() {
  const modal = document.getElementById('post-modal');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open-anim');
  setTimeout(() => { modal.classList.remove('open'); document.body.style.overflow = ''; }, 380);
}

/* ── Boot ─────────────────────────────────────────────────
   This page IS the main site (no in-page onboarding any more). The script
   tag sits at the end of <body>, so the DOM is ready: reveal #main-site
   (it is opacity:0 until .visible) and wire up the interactions. */
document.getElementById('main-site').classList.add('visible');
initMainSite();
