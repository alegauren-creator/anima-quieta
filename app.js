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
function go(name, push = true) {
  if (name === curView) return; const from = $('#v-' + curView), to = $('#v-' + name); if (!to) return;
  sweep(); from.classList.add('leaving');
  setTimeout(() => { from.hidden = true; from.classList.remove('leaving'); to.hidden = false; stagger(to); scrollTo(0, 0); setScene(to.dataset.scene); parallax(); }, RM ? 0 : 380);
  curView = name; $$('.bottom button').forEach(b => b.classList.toggle('on', b.dataset.go === name));
  if (push) history.pushState({ v: name }, '', '#' + name);
  if (name !== 'respiro') stopBreath();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
addEventListener('popstate', e => go((e.state && e.state.v) || 'home', false));

/* ---------- Splash ---------- */
const h = new Date().getHours(); $('#hello').textContent = h < 12 ? 'Buongiorno 🌅' : h < 18 ? 'Buon pomeriggio ☀️' : 'Buonasera 🌙';
setScene('alba'); stagger($('#v-home'));
setTimeout(() => { $('#splash').classList.add('out'); setTimeout(() => $('#splash').remove(), 1100); }, RM ? 300 : 2600);
const start = location.hash.slice(1); if (start && $('#v-' + start) && start !== 'home') setTimeout(() => go(start, false), 50);

/* ---------- Tabs meditazione ---------- */
$$('[data-tab]').forEach(b => b.onclick = () => { $$('[data-tab]').forEach(x => x.classList.toggle('on', x === b)); $$('#v-medita .tab').forEach(t => { t.classList.toggle('on', t.id === b.dataset.tab); }); stagger($('#' + b.dataset.tab)); });

/* ---------- Posizioni ---------- */
const S = '#5f6f78';
const fig = (body) => `<svg viewBox="0 0 100 100" role="img"><ellipse cx="50" cy="92" rx="38" ry="5" fill="#cfe3d4"/><g class="fig" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const POS = [
  ['Sukhasana · gambe incrociate', 'La posizione "facile". Siediti su un cuscino, incrocia le gambe con i piedi sotto le ginocchia opposte. Il cuscino alza il bacino così le ginocchia scendono verso il pavimento e la schiena resta dritta. Mani sulle ginocchia o in grembo.', 'Per tutti, ideale per iniziare.', fig('<circle cx="50" cy="20" r="8" fill="#fde3d4"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 30 66 M50 38 Q64 48 70 66"/><path d="M22 76 Q50 64 78 76 M28 80 Q50 72 72 80"/>')],
  ['Mezzo loto', 'Da gambe incrociate, appoggia un solo piede sulla coscia opposta, con la pianta verso l\'alto; l\'altro piede resta sotto la gamba. Alterna il lato nei vari giorni.', 'Intermedio: serve un po\' di apertura delle anche. Mai forzare il ginocchio.', fig('<circle cx="50" cy="20" r="8" fill="#e3d9f2"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 30 66 M50 38 Q64 48 70 66"/><path d="M22 76 Q50 64 78 76"/><path d="M56 68 l14 -4"/>')],
  ['Loto completo', 'Entrambi i piedi sulle cosce opposte. È molto stabile ma richiede grande flessibilità di anche e ginocchia.', 'Avanzato: solo se il corpo è pronto. Se senti dolore al ginocchio, scegli un\'altra posizione.', fig('<circle cx="50" cy="20" r="8" fill="#f8dbe3"/><path d="M50 29 L50 60"/><path d="M50 38 Q36 48 34 64 M50 38 Q64 48 66 64"/><path d="M22 76 Q50 62 78 76"/><path d="M30 68 l14 -4 M56 64 l14 4"/>')],
  ['Seiza · in ginocchio', 'Inginocchiati e siediti sui talloni, oppure su un cuscino o una panchetta messi tra i piedi. La schiena si raddrizza in modo naturale.', 'Utile a chi non sta comodo a gambe incrociate. Con dolori alle ginocchia usa la sedia.', fig('<circle cx="50" cy="18" r="8" fill="#d6ebf7"/><path d="M50 27 L50 58"/><path d="M50 36 Q42 48 46 60"/><path d="M50 58 L70 62 L70 84 L32 84"/>')],
  ['Su una sedia', 'Siediti vicino al bordo, piedi appoggiati a terra alla larghezza delle anche, schiena staccata dallo schienale, mani sulle cosce. È una posizione completa e rispettabile quanto le altre.', 'Per tutti, anche anziani o con dolori.', fig('<circle cx="46" cy="18" r="8" fill="#cfe3d4"/><path d="M46 27 L46 56"/><path d="M46 36 Q54 46 60 54"/><path d="M46 56 L66 56 L66 84"/><path d="M30 50 L30 86 M30 60 L72 60 M72 60 L72 86" stroke="#c4a98f"/>')],
  ['Sdraiati · savasana', 'Distenditi sulla schiena, gambe leggermente aperte, braccia lungo il corpo con i palmi in su. Perfetta per il rilassamento e la scansione del corpo.', 'Attenzione: è facile addormentarsi. Va benissimo la sera.', fig('<circle cx="16" cy="74" r="7" fill="#fde3d4"/><path d="M24 76 L66 78 L88 80 M66 78 L88 74 M32 80 L56 84"/>')]
];
$('#postures').innerHTML = POS.map(([t, d, n, svg], i) => `<div class="card ${['c-sage', 'c-lav', 'c-rose', 'c-sky', 'c-peach', 'c-sage'][i]} stag"><div class="pos">${svg}<div><h3>${t}</h3></div></div><p>${d}</p><p class="muted">${n}</p></div>`).join('') +
  `<div class="card c-peach stag"><h3>In ogni posizione</h3><ul class="dots"><li>Schiena dritta ma non rigida, come se un filo ti tirasse dolcemente verso l'alto.</li><li>Spalle basse e rilassate, mento leggermente rientrato.</li><li>Mani appoggiate sulle cosce o una sull'altra in grembo.</li><li>Il comfort viene prima della forma: se qualcosa fa male, cambia.</li></ul></div>`;

/* ---------- Meditazioni guidate ---------- */
const GUIDES = [
  ['🌱 Principianti · Respiro e presenza (5 min)', 'c-sage', 25, ['Siediti comodo e chiudi gli occhi.', 'Fai tre respiri un po\' più profondi del solito.', 'Ora lascia il respiro libero, naturale.', 'Senti l\'aria fresca che entra dal naso…', '…e l\'aria tiepida che esce.', 'Se arriva un pensiero, va bene. Notalo e torna al respiro.', 'Senti il peso del corpo appoggiato.', 'Ogni respiro ti porta un po\' più qui.', 'Ancora qualche respiro, con calma.', 'Muovi piano mani e piedi.', 'Quando vuoi, riapri gli occhi. Grazie per questo momento.']],
  ['🌿 Principianti · Scansione del corpo (6 min)', 'c-sky', 30, ['Mettiti comodo, seduto o sdraiato.', 'Porta l\'attenzione ai piedi. Senti com\'è il contatto.', 'Sali alle caviglie e ai polpacci. Lasciali morbidi.', 'Ginocchia e cosce: rilassale.', 'Il bacino e la pancia, che si muovono col respiro.', 'La schiena: lascia andare ogni tensione.', 'Le spalle scendono, le braccia diventano pesanti.', 'Il collo, la mascella, la fronte: tutto morbido.', 'Senti il corpo intero, che respira.', 'Fai un respiro profondo e torna piano qui.']],
  ['🌸 Intermedio · Gentilezza amorevole (8 min)', 'c-rose', 40, ['Siediti con la schiena dritta e il cuore aperto.', 'Pensa a te stesso e ripeti dentro: "Che io possa stare bene."', '"Che io possa essere sereno. Che io possa essere in pace."', 'Ora pensa a una persona che ami. Augurale lo stesso.', '"Che tu possa stare bene, essere serena, essere in pace."', 'Pensa a una persona che conosci appena.', 'Augura anche a lei serenità e pace.', 'Se ti senti pronto, pensa a qualcuno con cui hai difficoltà. Augurale bene, per quanto puoi.', 'Allarga l\'augurio a tutti gli esseri viventi.', 'Resta qualche istante in questo calore. Poi riapri gli occhi.']],
  ['🍃 Intermedio · Ascolto dei suoni (7 min)', 'c-lav', 35, ['Chiudi gli occhi e resta immobile.', 'Ascolta i suoni più lontani.', 'Poi quelli più vicini.', 'Non dare nomi ai suoni: ascoltali e basta.', 'Nota anche il silenzio tra un suono e l\'altro.', 'Se arriva un pensiero, trattalo come un suono che passa.', 'Allarga l\'ascolto a tutto, insieme.', 'Torna al respiro, poi riapri gli occhi.']],
  ['🪷 Esperti · Consapevolezza aperta (15 min)', 'c-peach', 75, ['Siediti nella tua posizione stabile. Stabilizza la mente con il respiro.', 'Lascia andare l\'àncora del respiro. Resta aperto a tutto ciò che arriva.', 'Sensazioni, suoni, pensieri, emozioni: osservali sorgere e svanire.', 'Non trattenere, non respingere. Sii come il cielo che accoglie le nuvole.', 'Nota chi osserva. Riposa nella consapevolezza stessa.', 'Quando ti perdi, riconoscilo con dolcezza e torna ad aprirti.', 'Resta nel silenzio, senza fare nulla.', 'Raccogli l\'attenzione nel respiro, poi riapri gli occhi lentamente.']],
  ['🔥 Esperti · Respiro contato in silenzio (20 min)', 'c-sage', 120, ['Posizione stabile, sguardo basso o occhi chiusi.', 'Conta le espirazioni da 1 a 10, poi ricomincia.', 'Se perdi il conto, riparti da 1 senza giudizio.', 'Dopo un po\', lascia il conteggio e segui solo il respiro.', 'Infine, lascia anche il respiro: solo presenza.', 'Mantieni la posizione immobile e la mente vigile.', 'Chiudi con tre respiri profondi e un momento di gratitudine.']]
];
let gTimer = null;
$('#guides').innerHTML = GUIDES.map(([t, c, , st], i) => `<div class="card ${c} stag" data-g="${i}"><h3>${t}</h3><p class="gtext">${st[0]}</p><div class="prog"><i></i></div><div class="row"><button class="btn primary gstart">Inizia</button><button class="btn ghost gnext">Avanti ›</button></div></div>`).join('');
function stopGuide() { clearInterval(gTimer); gTimer = null; $$('.gstart').forEach(b => b.textContent = 'Inizia'); }
$$('#guides .card').forEach(card => {
  const [, , sec, st] = GUIDES[card.dataset.g]; let i = 0; const tx = card.querySelector('.gtext'), bar = card.querySelector('.prog i');
  const show = n => { i = n; tx.classList.add('fade'); setTimeout(() => { tx.textContent = st[i]; tx.classList.remove('fade'); }, 400); bar.style.width = ((i + 1) / st.length * 100) + '%'; if (i >= st.length - 1) stopGuide(); };
  card.querySelector('.gnext').onclick = () => show(Math.min(i + 1, st.length - 1));
  card.querySelector('.gstart').onclick = e => { const running = gTimer && e.target.textContent === 'Pausa'; stopGuide(); if (running) return; if (i >= st.length - 1) show(0); else bar.style.width = ((i + 1) / st.length * 100) + '%'; e.target.textContent = 'Pausa'; gTimer = setInterval(() => show(i + 1), sec * 1000); };
});

/* ---------- Respiro guidato ---------- */
const BR = {
  '478': { d: 'Inspira dal naso per 4, trattieni per 7, espira dalla bocca per 8. Calma il corpo, ottimo prima di dormire. Inizia con 4 cicli.', ph: [['Inspira', 4, 1.7], ['Trattieni', 7, 1.7], ['Espira', 8, 1]], cyc: 4 },
  box: { d: 'Respiro quadrato: inspira 4, trattieni 4, espira 4, trattieni 4. Come i lati di un quadrato. Aiuta concentrazione e calma.', ph: [['Inspira', 4, 1.7], ['Trattieni', 4, 1.7], ['Espira', 4, 1], ['Trattieni', 4, 1]], cyc: 6 },
  dia: { d: 'Respiro diaframmatico: una mano sul petto, una sulla pancia. Inspirando gonfia la pancia (il petto resta fermo), espirando lasciala scendere. Inspira 4, espira 6.', ph: [['Inspira con la pancia', 4, 1.7], ['Espira piano', 6, 1]], cyc: 8 }
};
let brKey = '478', brT = null, brRun = false;
const bc = $('#bcircle');
function setBr(k) { brKey = k; $('#brDesc').textContent = BR[k].d; $$('#breathTabs button').forEach(b => b.classList.toggle('on', b.dataset.br === k)); stopBreath(); }
function stopBreath() { brRun = false; clearTimeout(brT); clearInterval(bc._c); bc.style.transitionDuration = '1s'; bc.style.transform = 'scale(1)'; $('#bphase').textContent = 'Pronto'; $('#bcount').textContent = ''; $('#bStart').textContent = 'Inizia'; $('#bCycles').textContent = ''; }
function runBreath() {
  const cfg = BR[brKey]; let p = 0, c = 0; brRun = true; $('#bStart').textContent = 'Ferma';
  const step = () => { if (!brRun) return;
    if (p === 0) { c++; if (c > cfg.cyc) { stopBreath(); $('#bphase').textContent = 'Ben fatto 🌿'; return; } $('#bCycles').textContent = `Ciclo ${c} di ${cfg.cyc}`; }
    const [name, sec, sc] = cfg.ph[p]; $('#bphase').textContent = name; let left = sec; $('#bcount').textContent = left;
    bc.style.transitionDuration = sec + 's'; bc.style.transform = `scale(${sc})`;
    clearInterval(bc._c); bc._c = setInterval(() => { left--; if (left > 0) $('#bcount').textContent = left; }, 1000);
    if (navigator.vibrate && name.startsWith('Inspira')) try { navigator.vibrate(30); } catch (e) {}
    p = (p + 1) % cfg.ph.length; brT = setTimeout(step, sec * 1000); };
  step();
}
$$('#breathTabs button').forEach(b => b.onclick = () => setBr(b.dataset.br));
$('#bStart').onclick = () => brRun ? stopBreath() : runBreath(); setBr('478');

/* ---------- Musica ---------- */
const AMBS = [['spa', '💆', 'c-lav', 'Pad caldi e campanelli'], ['pioggia', '🌧️', 'c-sky', 'Pioggia sottile'], ['onde', '🌊', 'c-sky', 'Mare che respira'], ['foresta', '🌲', 'c-sage', 'Vento e uccellini'], ['campane', '🔔', 'c-peach', 'Ciotole tibetane']];
$('#ambList').innerHTML = AMBS.map(([k, e, c, d]) => `<button class="${c} stag" data-amb="${k}" aria-pressed="false"><span class="em">${e}</span><b>${Sound.NAMES[k]}</b><br><small class="muted">${d}</small></button>`).join('');
function refreshMusic() { const cur = Sound.current; $$('[data-amb]').forEach(b => { b.classList.toggle('on', b.dataset.amb === cur); b.setAttribute('aria-pressed', b.dataset.amb === cur); }); $('#musicBtn').setAttribute('aria-pressed', !!cur); $('#musicBtn .lbl').textContent = cur ? Sound.NAMES[cur] : 'Musica'; }
$$('[data-amb]').forEach(b => b.onclick = async () => { if (Sound.current === b.dataset.amb) await Sound.stop(); else await Sound.play(b.dataset.amb); refreshMusic(); armTimer(); });
$('#musicBtn').onclick = async () => { if (Sound.current) await Sound.stop(); else await Sound.play(localStorage.getItem('aq_amb') || 'spa'); refreshMusic(); };
let tMin = 0, tEnd = 0, tInt;
function armTimer() { clearInterval(tInt); $('#timerLeft').textContent = ''; if (!tMin || !Sound.current) return; tEnd = Date.now() + tMin * 60000;
  tInt = setInterval(() => { const l = tEnd - Date.now(); if (l <= 0) { clearInterval(tInt); Sound.stop(4).then(refreshMusic); $('#timerLeft').textContent = 'Timer finito 🌙'; return; } $('#timerLeft').textContent = `Si spegne tra ${Math.floor(l / 60000)}:${String(Math.floor(l / 1000) % 60).padStart(2, '0')}`; }, 1000); }
$$('#timerChips button').forEach(b => b.onclick = () => { tMin = +b.dataset.min; $$('#timerChips button').forEach(x => x.classList.toggle('on', x === b)); armTimer(); });
$('#vol').value = Math.round(Sound.vol * 100); $('#vol').oninput = e => Sound.setVol(e.target.value / 100);
const origPlay = Sound.play; Sound.play = n => { localStorage.setItem('aq_amb', n); return origPlay(n); };

/* ---------- Consigli ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set('il lo la i gli le un uno una di a da in con su per tra fra e o ma che chi cosa come mi ti si ci vi non e sono sei ho hai ha io tu lui lei noi voi loro mio mia miei mie tuo tua mi del della dei delle al alla ai alle nel nella sul sulla questo questa quello quella molto tanto troppo piu poi anche se perche quando dove sempre mai ancora gia sto stai fare faccio posso devo vorrei voglio essere avere tutto tutti'.split(' '));
const SYN = { angoscia: 'ansia', preoccupato: 'ansia', preoccupata: 'ansia', insonnia: 'sonno', ragazza: 'amore', ragazzo: 'amore', moglie: 'amore', marito: 'amore', capoufficio: 'lavoro', soldi: 'soldi', euro: 'soldi', mangiare: 'mangi', meditare: 'medit', palestra: 'palestr', depresso: 'trist', depressa: 'trist', giu: 'trist', solo: 'solo' };
const TOPIC_NAMES = { ansia: 'Ansia', stress: 'Stress', amore: 'Amore', rottura: 'Cuore ferito', solitudine: 'Solitudine', amicizia: 'Amicizia', famiglia: 'Famiglia', lutto: 'Lutto', lavoro: 'Lavoro', soldi: 'Soldi', autostima: 'Autostima', paura: 'Paura', rabbia: 'Rabbia', cambiamento: 'Cambiamento', sonno: 'Sonno', salute: 'Corpo e movimento', alimentazione: 'Alimentazione consapevole', gratitudine: 'Gratitudine', perdono: 'Perdono', scopo: 'Senso della vita', creativita: 'Creatività', studio: 'Studio', motivazione: 'Motivazione', meditazione: 'Meditazione', natura: 'Natura', felicita: 'Felicità', tristezza: 'Tristezza', decisioni: 'Decisioni', presente: 'Vivere il presente', fiducia: 'Fiducia e spiritualità', gentilezza: 'Gentilezza', tempo: 'Il tempo', invecchiare: 'Gli anni che passano' };
const GENTLE = ['suicid', 'uccidermi', 'ammazzarmi', 'farla finita', 'togliermi la vita', 'voglio morire', 'non voglio piu vivere', 'farmi del male', 'autolesion', 'tagliarmi'];
const TOP = ADVICE.map(t => ({ ...t, kk: t.k.map(norm) }));
function match(q) {
  const n = norm(q); if (!n) return null;
  if (GENTLE.some(c => n.includes(c))) return { topic: null };
  const toks = n.split(' ').filter(w => w && !STOP.has(w)).map(w => SYN[w] || w);
  let best = null, bs = 0;
  TOP.forEach((t, ti) => { let s = 0; t.kk.forEach(k => {
    if (k.includes(' ')) { if (n.includes(k)) s += 3; }
    else if (k.length <= 3) { if (toks.includes(k)) s += 2; }
    else if (toks.some(w => w.startsWith(k) || (w.length >= 5 && k.startsWith(w)))) s += 2;
  }); if (s > bs) { bs = s; best = t; } });
  return best ? { topic: best } : { topic: null };
}
let lastTopic = null, lastIdx = -1;
const pick = arr => { let i; do i = Math.random() * arr.length | 0; while (arr.length > 1 && i === lastIdx); lastIdx = i; return arr[i]; };
function show(title, text) {
  const a = $('#answer'); a.hidden = false; a.style.animation = 'none'; a.offsetHeight; a.style.animation = '';
  $('#aTopic').textContent = title; $('#aText').innerHTML = text; a.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
}
function answer(q) {
  const m = match(q); if (!m) return;
  lastTopic = m.topic; if (m.topic) show(TOPIC_NAMES[m.topic.t] || m.topic.t, pick(m.topic.a)); else show('Una riflessione per te', pick(GENERAL));
}
window.__aq = { match };
$('#askForm').onsubmit = e => { e.preventDefault(); answer($('#q').value); };
$('#another').onclick = () => lastTopic ? show(TOPIC_NAMES[lastTopic.t], pick(lastTopic.a)) : show('Una riflessione per te', pick(GENERAL));
$('#randomTip').onclick = () => { const t = ADVICE[Math.random() * ADVICE.length | 0]; lastTopic = t; show(TOPIC_NAMES[t.t], pick(t.a)); };
$('#copyA').onclick = () => { navigator.clipboard && navigator.clipboard.writeText($('#aText').textContent + ' — Anima Quieta').then(() => { $('#copyA').textContent = 'Copiato ✓'; setTimeout(() => $('#copyA').textContent = 'Copia', 1500); }, () => {}); };
['Mi sento in ansia', 'Non riesco a dormire', 'Mi ha lasciato', 'Come inizio a meditare?', 'Non ho motivazione'].forEach(s => { const b = document.createElement('button'); b.textContent = s; b.onclick = () => { $('#q').value = s; answer(s); }; $('#suggest').appendChild(b); });
// consiglio del giorno
const all = ADVICE.flatMap(t => t.a), day = Math.floor(Date.now() / 864e5); $('#dailyTip').textContent = all[(day * 37) % all.length];

/* ---------- Offline ---------- */
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
