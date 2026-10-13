(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scene (paesaggi a strati con parallasse) ---------- */
function hills(y, amp, n, seed) { let d = `M0 ${y}`; for (let i = 1; i <= n; i++) { const x = i * 1000 / n, cy = y - amp * (0.5 + 0.5 * Math.sin(seed + i * 1.7)); d += ` Q${x - 500 / n} ${cy} ${x} ${y - amp * 0.3 * Math.cos(seed + i)}`; } return d + ' L1000 400 L0 400Z'; }
function waves(y, amp, n) { let d = `M0 ${y}`; for (let i = 0; i < n; i++) { const x = (i + .5) * 1000 / n; d += ` Q${x} ${y + (i % 2 ? amp : -amp)} ${(i + 1) * 1000 / n} ${y}`; } return d + ' L1000 400 L0 400Z'; }
const layer = (d, fill, speed, h = 46, cls = '') => `<svg class="ly ${cls}" data-speed="${speed}" style="height:${h}vh" viewBox="0 0 1000 400" preserveAspectRatio="none"><path d="${d}" fill="${fill}"/></svg>`;
function trees(fill, speed) { let s = ''; for (let i = 0; i < 14; i++) { const x = i * 75 + (i % 3) * 12, h = 70 + (i * 37 % 60); s += `<path d="M${x} 400 L${x} ${330 - h * .2} L${x - 28} ${330} L${x} ${300 - h} L${x + 28} 330 L${x} ${330 - h * .2}Z"/>`; } return `<svg class="ly" data-speed="${speed}" style="height:40vh" viewBox="0 0 1000 400" preserveAspectRatio="none"><g fill="${fill}">${s}</g><rect y="325" width="1000" height="80" fill="${fill}"/></svg>`; }
function lotus() { let s = ''; [[180, 330], [520, 360], [820, 320]].forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y + 10}" rx="60" ry="10" fill="#9cc5a8"/><path d="M${x} ${y} c-12-16-6-34 0-42 c6 8 12 26 0 42z M${x} ${y} c-24-4-34-18-34-28 c14 2 28 12 34 28z M${x} ${y} c24-4 34-18 34-28 c-14 2-28 12-34 28z" fill="#f4c6d3"/>`; }); return `<svg class="ly wave" data-speed="0.25" style="height:38vh" viewBox="0 0 1000 400" preserveAspectRatio="none">${s}</svg>`; }
const SCENES = {
  alba: { sky: 'linear-gradient(180deg,#fde3d4 0%,#f8dbe3 35%,#e3d9f2 70%,#eef6f1)', sun: ['#ffd9b8', '70%', '18%', 120], body: layer(hills(230, 120, 4, 1), '#d9cdee', .08) + layer(hills(280, 90, 5, 3), '#bfd8c6', .15) + layer(hills(330, 60, 6, 5), '#a9cdb3', .25) },
  loto: { sky: 'linear-gradient(180deg,#e3d9f2,#f8dbe3 50%,#d6ebf7)', sun: ['#fff1e6', '20%', '14%', 90], body: layer(hills(260, 70, 4, 2), '#d6c9ea', .08) + layer(waves(300, 10, 8), '#c4dff0', .15, 40, 'wave') + layer(waves(330, 8, 10), '#b2d4e8', .2, 36, 'wave') + lotus() },
  cielo: { sky: 'linear-gradient(180deg,#d6ebf7,#eef6f1 60%,#fde3d4)', sun: ['#fff6d6', '78%', '12%', 80], body: layer(hills(320, 60, 3, 4), '#cfe3d4', .12, 30) + layer(hills(350, 40, 5, 7), '#b9d9c4', .2, 24) },
  mare: { sky: 'linear-gradient(180deg,#fde3d4,#d6ebf7 55%)', sun: ['#ffd2b0', '50%', '30%', 140], body: layer(waves(250, 14, 6), '#b8d8ec', .08, 44, 'wave') + layer(waves(290, 12, 8), '#9fc9e3', .15, 40, 'wave') + layer(waves(330, 10, 10), '#8bbcd9', .22, 34, 'wave') },
  bosco: { sky: 'linear-gradient(180deg,#eef6f1,#cfe3d4 60%,#e3d9f2)', sun: ['#fff6e0', '25%', '10%', 70], body: layer(hills(250, 80, 4, 6), '#c9dfd0', .06) + trees('#a7cbb2', .14) + trees('#8fb89a', .24) },
  prato: { sky: 'linear-gradient(180deg,#f8dbe3,#fde3d4 40%,#fff3e3)', sun: ['#ffc9a8', '60%', '35%', 150], body: layer(hills(290, 50, 3, 8), '#e5d3c4', .08) + layer(hills(320, 40, 5, 9), '#c7dcb9', .16) + layer(hills(350, 30, 7, 2), '#b3d1a4', .26) }
};
const scene = $('#scene');
for (const [k, s] of Object.entries(SCENES)) {
  const [c, x, y, r] = s.sun; const el = document.createElement('div'); el.className = 'sc'; el.dataset.k = k;
  el.innerHTML = `<div class="sky" style="background:${s.sky}"></div><div class="sun" style="background:radial-gradient(circle,${c},${c}00 70%);left:${x};top:${y};width:${r * 2}px;height:${r * 2}px;margin-left:-${r}px"></div>` +
    [12, 22, 30].map((t, i) => `<div class="cloud" style="top:${t}%;width:${120 + i * 50}px;animation-delay:-${i * 20}s;animation-duration:${60 + i * 25}s"></div>`).join('') + s.body;
  scene.appendChild(el);
}
function setScene(k) { $$('#scene .sc').forEach(e => e.classList.toggle('on', e.dataset.k === k)); }
let tx = 0, ty = 0;
function parallax() { const y = scrollY; $$('#scene .sc.on .ly').forEach(l => l.style.transform = `translate3d(${tx * l.dataset.speed * 40}px,${y * l.dataset.speed}px,0)`); }
if (!RM) { addEventListener('scroll', () => requestAnimationFrame(parallax), { passive: true });
  addEventListener('deviceorientation', e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); requestAnimationFrame(parallax); });
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; tx = e.clientX / innerWidth - .5; requestAnimationFrame(parallax); }); }

/* ---------- Particelle: foglie, petali, luci ---------- */
const cv = $('#particles'), cx = cv.getContext('2d'); let P = [], W, H;
const COLS = ['#9cc5a8', '#b9a6e0', '#f2b8a2', '#f4c6d3', '#a8cde6'];
function rs() { const d = Math.min(devicePixelRatio, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; cx.setTransform(d, 0, 0, d, 0, 0); }
function mk(top) { const kind = Math.random() < .3 ? 'light' : Math.random() < .55 ? 'leaf' : 'petal'; return { kind, x: Math.random() * innerWidth, y: top ? Math.random() * innerHeight : -20, s: kind === 'light' ? 1.5 + Math.random() * 3 : 6 + Math.random() * 8, vy: .15 + Math.random() * .35, ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .02, c: COLS[Math.random() * COLS.length | 0] }; }
function draw(t) {
  cx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of P) {
    p.y += p.kind === 'light' ? -p.vy * .5 : p.vy; p.x += Math.sin(t / 2000 + p.ph) * .4; p.rot += p.vr;
    if (p.y > innerHeight + 20) Object.assign(p, mk(false)); if (p.y < -20) p.y = innerHeight + 10;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + Math.sin(t / 1500 + p.ph) * .5);
    if (p.kind === 'light') { cx.globalAlpha = .4 + .4 * Math.sin(t / 700 + p.ph); const g = cx.createRadialGradient(0, 0, 0, 0, 0, p.s * 3); g.addColorStop(0, '#fff'); g.addColorStop(1, '#fff0'); cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, p.s * 3, 0, 6.28); cx.fill(); }
    else { cx.globalAlpha = .55; cx.fillStyle = p.c; cx.beginPath();
      if (p.kind === 'leaf') { cx.moveTo(0, -p.s); cx.quadraticCurveTo(p.s * .7, 0, 0, p.s); cx.quadraticCurveTo(-p.s * .7, 0, 0, -p.s); }
      else cx.ellipse(0, 0, p.s * .5, p.s * .35, 0, 0, 6.28);
      cx.fill(); }
    cx.restore();
  }
  if (!document.hidden) requestAnimationFrame(draw); else setTimeout(() => requestAnimationFrame(draw), 500);
}
if (!RM) { rs(); addEventListener('resize', rs); P = Array.from({ length: innerWidth < 500 ? 18 : 28 }, () => mk(true)); requestAnimationFrame(draw); }

/* ---------- Navigazione con transizioni ---------- */
let curView = 'home';
function sweep() { if (RM) return; const s = $('#sweep'); s.innerHTML = ''; ['🍃', '🌸', '🍃', '🌿', '🍂', '🌸', '🍃'].forEach((e, i) => { const el = document.createElement('i'); el.textContent = e; el.style.top = (25 + i * 10 + Math.random() * 8) + '%'; el.style.animationDelay = i * 60 + 'ms'; s.appendChild(el); }); setTimeout(() => s.innerHTML = '', 1600); }
function stagger(v) { [...v.querySelectorAll('.stag')].forEach((e, i) => { e.style.setProperty('--i', i); e.style.animation = 'none'; e.offsetHeight; e.style.animation = ''; }); }
let navT = null, pendingFn = null;
function go(name, push = true) {
  if (name === curView) return; const from = $('#v-' + curView), to = $('#v-' + name); if (!to) return;
  if (navT) { clearTimeout(navT); pendingFn(); }
  sweep(); from.classList.add('leaving');
  pendingFn = () => { navT = null; $$('.view').forEach(v => { if (v !== to) v.hidden = true; v.classList.remove('leaving'); }); to.hidden = false; stagger(to); scrollTo(0, 0); setScene(to.dataset.scene); parallax(); };
  navT = setTimeout(pendingFn, RM ? 0 : 380);
  curView = name; $$('.bottom button').forEach(b => { b.classList.toggle('on', b.dataset.go === name); b.toggleAttribute('aria-current', b.dataset.go === name); });
  if (push) history.pushState({ v: name }, '', '#' + name);
  if (name !== 'respiro') stopBreath();
  if (name !== 'medita') stopGuide();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
addEventListener('popstate', e => go((e.state && e.state.v) || location.hash.slice(1) || 'home', false));


/* ---------- Lingua ---------- */
const LANGS = ['it', 'en', 'fr'];
let L = localStorage.getItem('aq_lang'); if (!LANGS.includes(L)) L = 'it';
const T = k => (I18N[L][k] !== undefined ? I18N[L][k] : I18N.it[k]);
const fmt = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => o[k]);

/* ---------- Posizioni ---------- */
const S = '#5f6f78';
const fig = (body) => `<svg viewBox="0 0 100 100" role="img"><ellipse cx="50" cy="92" rx="38" ry="5" fill="#cfe3d4"/><g class="fig" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const FIGS = [fig('<circle cx="50" cy="20" r="8" fill="#fde3d4"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 30 66 M50 38 Q64 48 70 66"/><path d="M22 76 Q50 64 78 76 M28 80 Q50 72 72 80"/>'),fig('<circle cx="50" cy="20" r="8" fill="#e3d9f2"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 30 66 M50 38 Q64 48 70 66"/><path d="M22 76 Q50 64 78 76"/><path d="M56 68 l14 -4"/>'),fig('<circle cx="50" cy="20" r="8" fill="#f8dbe3"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 34 64 M50 38 Q64 48 66 64"/><path d="M22 76 Q50 62 78 76"/><path d="M30 68 l14 -4 M56 64 l14 4"/>'),fig('<circle cx="50" cy="18" r="8" fill="#d6ebf7"/><path d="M50 27 L50 58"/><path d="M50 36 Q42 48 46 60"/><path d="M50 58 L70 62 L70 84 L32 84"/>'),fig('<circle cx="46" cy="18" r="8" fill="#cfe3d4"/><path d="M46 27 L46 56"/><path d="M46 36 Q54 46 60 54"/><path d="M46 56 L66 56 L66 84"/><path d="M30 50 L30 86 M30 60 L72 60 M72 60 L72 86" stroke="#c4a98f"/>'),fig('<circle cx="16" cy="74" r="7" fill="#fde3d4"/><path d="M24 76 L66 78 L88 80 M66 78 L88 74 M32 80 L56 84"/>')];
const PCOL = ['c-sage', 'c-lav', 'c-rose', 'c-sky', 'c-peach', 'c-sage'];
function renderPostures() {
  $('#postures').innerHTML = T('pos').map(([t, d, n], i) => `<div class="card ${PCOL[i]} stag"><div class="pos">${FIGS[i].replace('role="img"', `role="img" aria-label="${t}"`)}<h3>${t}</h3></div><p>${d}</p><p class="muted">${n}</p></div>`).join('') + `<div class="card c-peach stag">${T('pos_all')}</div>`;
}

/* ---------- Meditazioni guidate ---------- */
const GMETA = [['c-sage', 25], ['c-sky', 30], ['c-rose', 40], ['c-lav', 35], ['c-peach', 75], ['c-sage', 120]];
let gTimer = null, gBtn = null;
function stopGuide() { clearInterval(gTimer); gTimer = null; if (gBtn) gBtn.textContent = T('g_start'); gBtn = null; }
function renderGuides() {
  stopGuide();
  $('#guides').innerHTML = T('guides').map(([t, st], i) => `<div class="card ${GMETA[i][0]} stag" data-g="${i}"><h3>${t}</h3><p class="gtext" aria-live="polite">${st[0]}</p><div class="prog" role="progressbar" aria-valuemin="1" aria-valuemax="${st.length}" aria-valuenow="1"><i style="width:${100 / st.length}%"></i></div><div class="row"><button class="btn primary gstart">${T('g_start')}</button><button class="btn ghost gnext">${T('g_next')}</button></div></div>`).join('');
  $$('#guides .card').forEach(card => {
    const gi = +card.dataset.g, sec = GMETA[gi][1], st = T('guides')[gi][1]; let i = 0;
    const tx = card.querySelector('.gtext'), bar = card.querySelector('.prog i'), pg = card.querySelector('.prog'), sb = card.querySelector('.gstart');
    const show = n => { i = n; tx.classList.add('fade'); setTimeout(() => { tx.textContent = st[i]; tx.classList.remove('fade'); }, RM ? 0 : 400); bar.style.width = ((i + 1) / st.length * 100) + '%'; pg.setAttribute('aria-valuenow', i + 1); if (i >= st.length - 1) { if (gBtn === sb) stopGuide(); dispatchEvent(new CustomEvent('aq:practice', { detail: 'guide' })); } };
    card.querySelector('.gnext').onclick = () => show(Math.min(i + 1, st.length - 1));
    sb.onclick = () => { const mine = gBtn === sb; stopGuide(); if (mine) return; if (i >= st.length - 1) show(0); gBtn = sb; sb.textContent = T('g_pause'); gTimer = setInterval(() => show(i + 1), sec * 1000); };
  });
}

/* ---------- Tabs meditazione ---------- */
$$('[data-tab]').forEach(b => b.onclick = () => { $$('[data-tab]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); $$('#v-medita .tab').forEach(t => t.classList.toggle('on', t.id === b.dataset.tab)); stagger($('#' + b.dataset.tab)); });

/* ---------- Respiro guidato ---------- */
const BRT = { '478': { s: [[4, 1.7], [7, 1.7], [8, 1]], cyc: 4 }, box: { s: [[4, 1.7], [4, 1.7], [4, 1], [4, 1]], cyc: 6 }, dia: { s: [[4, 1.7], [6, 1]], cyc: 8 } };
let brKey = '478', brT = null, brRun = false, brDone = false;
const bc = $('#bcircle');
function setBr(k) { brKey = k; $('#brDesc').textContent = T('br')[k][0]; $$('#breathTabs button').forEach(b => b.classList.toggle('on', b.dataset.br === k)); stopBreath(); }
function stopBreath() { brRun = false; clearTimeout(brT); clearInterval(bc._c); bc.style.transitionDuration = '1.2s'; bc.style.transform = 'scale(1)'; $('#bphase').textContent = brDone ? T('br_done') : T('br_ready'); $('#bcount').textContent = ''; $('#bStart').textContent = T('br_start'); $('#bCycles').textContent = ''; brDone = false; }
function runBreath() {
  const cfg = BRT[brKey]; let p = 0, c = 0; brRun = true; $('#bStart').textContent = T('br_stop');
  const step = () => { if (!brRun) return;
    if (p === 0) { c++; if (c > cfg.cyc) { brDone = true; stopBreath(); dispatchEvent(new CustomEvent('aq:practice', { detail: 'breath' })); return; } $('#bCycles').textContent = fmt(T('br_cycle'), { a: c, b: cfg.cyc }); }
    const [sec, sc] = cfg.s[p], name = T('br')[brKey][1][p]; $('#bphase').textContent = name; let left = sec; $('#bcount').textContent = left;
    bc.style.transitionDuration = sec + 's'; bc.style.transform = `scale(${sc})`;
    clearInterval(bc._c); bc._c = setInterval(() => { left--; if (left > 0) $('#bcount').textContent = left; }, 1000);
    p = (p + 1) % cfg.s.length; brT = setTimeout(step, sec * 1000); };
  step();
}
$$('#breathTabs button').forEach(b => b.onclick = () => setBr(b.dataset.br));
$('#bStart').onclick = () => brRun ? stopBreath() : runBreath();

/* ---------- Musica ---------- */
const AMBS = [['spa', '💆', 'c-lav'], ['pioggia', '🌧️', 'c-sky'], ['onde', '🌊', 'c-sky'], ['foresta', '🌲', 'c-sage'], ['campane', '🔔', 'c-peach']];
$('#ambList').innerHTML = AMBS.map(([k, e, c]) => `<button class="${c} stag" data-amb="${k}" aria-pressed="false"><span class="em" aria-hidden="true">${e}</span><b></b><br><small class="muted"></small></button>`).join('');
function refreshMusic() { const cur = Sound.current; $$('[data-amb]').forEach(b => { const k = b.dataset.amb; b.querySelector('b').textContent = T('amb')[k][0]; b.querySelector('small').textContent = T('amb')[k][1]; b.classList.toggle('on', k === cur); b.setAttribute('aria-pressed', k === cur); }); $('#musicBtn').setAttribute('aria-pressed', !!cur); $('#musicBtn .lbl').textContent = cur ? T('amb')[cur][0] : T('music'); }
const playAmb = n => { localStorage.setItem('aq_amb', n); return Sound.play(n); };
$$('[data-amb]').forEach(b => b.onclick = async () => { if (Sound.current === b.dataset.amb) await Sound.stop(); else await playAmb(b.dataset.amb); refreshMusic(); armTimer(); });
$('#musicBtn').onclick = async () => { if (Sound.current) await Sound.stop(); else await playAmb(localStorage.getItem('aq_amb') || 'spa'); refreshMusic(); armTimer(); };
let tMin = 0, tEnd = 0, tInt, tDone = false;
function tick() { const l = tEnd - Date.now(); if (l <= 0) { clearInterval(tInt); tDone = true; Sound.stop(4).then(refreshMusic); $('#timerLeft').textContent = T('timer_done'); return; } $('#timerLeft').textContent = fmt(T('timer_left'), { t: `${Math.floor(l / 60000)}:${String(Math.floor(l / 1000) % 60).padStart(2, '0')}` }); }
function armTimer() { clearInterval(tInt); tDone = false; $('#timerLeft').textContent = ''; if (!tMin || !Sound.current) return; tEnd = Date.now() + tMin * 60000; tick(); tInt = setInterval(tick, 1000); }
$$('#timerChips button').forEach(b => b.onclick = () => { tMin = +b.dataset.min; $$('#timerChips button').forEach(x => x.classList.toggle('on', x === b)); armTimer(); });
$('#vol').value = Math.round(Sound.vol * 100); $('#vol').oninput = e => Sound.setVol(e.target.value / 100);

/* ---------- Consigli (matching in IT/EN/FR) ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’'`]/g, ' ').replace(/[^a-z0-9 -]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set((
  'il lo la i gli le un uno una di a da in con su per tra fra e o ma che chi cosa come mi ti si ci vi non sono sei ho hai ha io tu lui lei noi voi loro mio mia miei mie tuo tua del della dei delle al alla ai alle nel nella sul sulla questo questa quello quella molto tanto troppo piu poi anche se perche quando dove sempre mai ancora gia sto stai fare faccio posso devo vorrei voglio essere avere tutto tutti ' +
  'the an and or but of to in on at for with is are am was be been i me my you your he she it we they them this that what how why when where do does did can could should would will have has had not no so very really just feel feeling im dont about from get any some there ' +
  'le les un une des de du et ou mais je tu il elle nous vous ils elles me te se mon ma mes ton ta tes son sa ses ce cet cette ces que qui quoi comment pourquoi quand ou est suis es sont ai as a pas ne plus tres trop dans sur pour avec par en y au aux moi toi lui leur faire fais peux dois veux voudrais etre avoir tout tous bien'
).split(' '));
const SYN = { angoscia: 'ansia', preoccupato: 'ansia', preoccupata: 'ansia', insonnia: 'sonno', ragazza: 'amore', ragazzo: 'amore', moglie: 'amore', marito: 'amore', capoufficio: 'lavoro', euro: 'soldi', mangiare: 'mangi', meditare: 'medit', palestra: 'palestr', depresso: 'trist', depressa: 'trist', giu: 'trist',
  sleepless: 'insomnia', jobless: 'unemploy', girlfriend: 'girlfriend', exhausted: 'exhaust', mum: 'mum', meditating: 'meditat', lonely: 'lonely', cash: 'money', grandma: 'grandm', grandpa: 'grandf',
  copine: 'copine', boulot: 'travail', dodo: 'dormir', thune: 'argent', deprime: 'deprim', angoisse: 'angoiss' };
const ALLK = {}; ADVICE.forEach(t => ALLK[t.t] = [...t.k, ...(ADVICE_EN[t.t] || { k: [] }).k, ...(ADVICE_FR[t.t] || { k: [] }).k].map(norm));
const GENTLE = ['suicid', 'uccidermi', 'ammazzarmi', 'farla finita', 'togliermi la vita', 'voglio morire', 'non voglio piu vivere', 'farmi del male', 'autolesion', 'tagliarmi', 'kill myself', 'end it all', 'want to die', 'hurt myself', 'me tuer', 'en finir', 'veux mourir', 'me faire du mal'];
const PRI = { lutto: 2, rottura: 1 };
function match(q) {
  const n = norm(q); if (!n) return null;
  if (GENTLE.some(c => n.includes(c))) return { topic: null };
  const toks = n.split(/[ -]/).filter(w => w && !STOP.has(w)).map(w => SYN[w] || w);
  let best = null, bs = 0;
  for (const t in ALLK) { let s = 0; const ks = ALLK[t];
    ks.forEach(k => { if (k.includes(' ') && (' ' + n + ' ').includes(' ' + k + (k.endsWith(' ') ? '' : ''))) s += 3; });
    toks.forEach(w => { if (ks.some(k => !k.includes(' ') && (k.length <= 3 ? w === k : (w.startsWith(k) || (w.length >= 6 && k.startsWith(w)))))) s += 2; });
    if (s > bs || (s && s === bs && (PRI[t] || 0) > (PRI[best] || 0))) { bs = s; best = t; } }
  return { topic: best };
}
const adviceOf = t => L === 'en' ? ADVICE_EN[t].a : L === 'fr' ? ADVICE_FR[t].a : ADVICE.find(x => x.t === t).a;
const generalOf = () => L === 'en' ? GENERAL_EN : L === 'fr' ? GENERAL_FR : GENERAL;
let lastTopic = null, lastIdx = -1, shown = null;
const pick = arr => { let i; do i = Math.random() * arr.length | 0; while (arr.length > 1 && i === lastIdx); lastIdx = i; return i; };
function display() {
  if (!shown) return; const a = $('#answer');
  $('#aTopic').textContent = shown.t ? T('topics')[shown.t] : T('reflection');
  $('#aText').textContent = (shown.t ? adviceOf(shown.t) : generalOf())[shown.i];
  a.hidden = false;
}
function show(t, anim = true) {
  shown = { t, i: pick(t ? adviceOf(t) : generalOf()) }; display();
  const a = $('#answer'); if (anim) { a.style.animation = 'none'; a.offsetHeight; a.style.animation = ''; }
  a.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
}
function answer(q) { const m = match(q); if (!m) return; lastTopic = m.topic; show(m.topic); }
window.__aq = { match, lang: () => L, T: k => T(k), go: v => go(v) };
$('#askForm').onsubmit = e => { e.preventDefault(); answer($('#q').value); };
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); answer($('#q').value); } });
$('#another').onclick = () => show(lastTopic);
$('#randomTip').onclick = () => { const t = ADVICE[Math.random() * ADVICE.length | 0].t; lastTopic = t; show(t); };
$('#copyA').onclick = () => { const b = $('#copyA'); if (!navigator.clipboard) return; navigator.clipboard.writeText($('#aText').textContent + ' — ' + T('share_sig')).then(() => { b.textContent = T('copied'); setTimeout(() => b.textContent = T('copy'), 1500); }, () => {}); };
const DAYLIST = ADVICE.flatMap(t => t.a.map((_, i) => [t.t, i])), day = Math.floor(Date.now() / 864e5), DT = DAYLIST[(day * 37) % DAYLIST.length];

/* ---------- Applica lingua ---------- */
function applyLang(l) {
  L = l; localStorage.setItem('aq_lang', l); document.documentElement.lang = l;
  $$('[data-i18n]').forEach(e => e.innerHTML = T(e.dataset.i18n));
  $$('[data-i18n-ph]').forEach(e => e.placeholder = T(e.dataset.i18nPh));
  $$('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', T(e.dataset.i18nAria)));
  $$('[data-tab]').forEach((b, i) => b.textContent = T('tabs')[i]);
  $$('#breathTabs button').forEach((b, i) => b.textContent = T('br_tabs')[i]);
  $$('.bottom button em').forEach((e, i) => e.textContent = T('nav')[i]);
  $$('[data-lang]').forEach(b => { b.classList.toggle('on', b.dataset.lang === l); b.setAttribute('aria-pressed', b.dataset.lang === l); });
  const hr = new Date().getHours(); $('#hello').textContent = T('hello')[hr < 12 ? 0 : hr < 18 ? 1 : 2];
  const sp = $('#spSub'); if (sp) sp.textContent = T('sp_sub');
  $('#dailyTip').textContent = adviceOf(DT[0])[DT[1]];
  $('#suggest').innerHTML = ''; T('suggest').forEach(s => { const b = document.createElement('button'); b.type = 'button'; b.textContent = s; b.onclick = () => { $('#q').value = s; answer(s); }; $('#suggest').appendChild(b); });
  renderPostures(); renderGuides(); setBr(brKey); refreshMusic(); display();
  if (tDone) $('#timerLeft').textContent = T('timer_done'); else if (tInt && tMin && Sound.current) tick();
  dispatchEvent(new CustomEvent('aq:lang', { detail: l }));
  document.title = 'Anima Quieta · ' + (l === 'it' ? 'di' : l === 'en' ? 'by' : 'par') + ' Alessio';
}
$$('[data-lang]').forEach(b => b.onclick = () => { if (b.dataset.lang !== L) { applyLang(b.dataset.lang); stagger($('#v-' + curView)); } });
applyLang(L);

/* ---------- Avvio / splash ---------- */
setScene('alba'); stagger($('#v-home'));
setTimeout(() => { const s = $('#splash'); s.classList.add('out'); setTimeout(() => s.remove(), 1100); }, RM ? 300 : 2600);
const start = location.hash.slice(1); if (start && $('#v-' + start) && start !== 'home') setTimeout(() => go(start, false), 50);

/* ---------- Offline ---------- */
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
