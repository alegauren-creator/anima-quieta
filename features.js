(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = () => window.__aq.lang();
const SITE = 'alegauren-creator.github.io/anima-quieta';
const S = {
 it: { st_h: 'Il tuo fiore', st_days: n => n === 1 ? '1 giorno di fila' : `${n} giorni di fila`, st_best: n => `Record: ${n}`, st_today: 'Oggi hai già praticato 🌿', st_todo: 'Medita o respira oggi per farlo crescere.', st_grew: 'Il tuo fiore è cresciuto 🌸', st_restart: 'Ogni giorno è un nuovo inizio. Il tuo fiore ricomincia dolcemente da un seme 🌱', st_go: 'Respira ora',
  stages: ['Seme', 'Germoglio', 'Bocciolo', 'Fiore', 'Giardino in fiore'],
  card_h: 'Carta del giorno', card_tap: 'Tocca per scoprire la tua intenzione di oggi', card_back: 'Intenzione di oggi',
  share: 'Condividi', sharing: 'Preparo l\'immagine…', saved: 'Immagine salvata ✓', share_title: 'Un pensiero per te',
  d_tile: 'Diario della gratitudine', d_tile_s: 'Tre cose belle di oggi',
  j_ttl: 'Diario della gratitudine', j_lead: 'Ogni sera, prima di dormire, scrivi tre cose belle della giornata. Anche piccolissime: un caffè caldo, una risata, il sole sul viso.', j_today: 'Oggi sono grato per…', j_ph: ['Una cosa bella di oggi…', 'Un\'altra…', 'E ancora…'], j_save: 'Salva', j_saved: 'Salvato con cura 🌼', j_empty1: 'Scrivi almeno una cosa 🌱', j_priv: '🔒 Il diario resta solo su questo telefono: non viene inviato a nessuno, e se cancelli i dati del browser o l\'app sparisce anche il diario.', j_past: 'I giorni passati', j_none: 'Qui appariranno i tuoi giorni di gratitudine.', j_del: 'Elimina', j_confirm: 'Tocca ancora per eliminare', j_evening: 'È sera: è il momento giusto per il diario 🌙', j_done: 'Hai già scritto oggi. Puoi modificarlo quando vuoi.', loc: 'it-IT' },
 en: { st_h: 'Your flower', st_days: n => n === 1 ? '1 day in a row' : `${n} days in a row`, st_best: n => `Best: ${n}`, st_today: "You've already practised today 🌿", st_todo: 'Meditate or breathe today to help it grow.', st_grew: 'Your flower has grown 🌸', st_restart: 'Every day is a new beginning. Your flower gently starts again from a seed 🌱', st_go: 'Breathe now',
  stages: ['Seed', 'Sprout', 'Bud', 'Flower', 'Garden in bloom'],
  card_h: 'Card of the day', card_tap: "Tap to reveal today's intention", card_back: "Today's intention",
  share: 'Share', sharing: 'Preparing the image…', saved: 'Image saved ✓', share_title: 'A thought for you',
  d_tile: 'Gratitude journal', d_tile_s: 'Three good things today',
  j_ttl: 'Gratitude journal', j_lead: 'Every evening, before sleep, write three good things from your day. Even tiny ones: a warm coffee, a laugh, sunshine on your face.', j_today: 'Today I am grateful for…', j_ph: ['Something good today…', 'Another one…', 'And one more…'], j_save: 'Save', j_saved: 'Saved with care 🌼', j_empty1: 'Write at least one thing 🌱', j_priv: '🔒 Your journal stays only on this phone: it is never sent anywhere. If you clear the browser data or remove the app, the journal is deleted too.', j_past: 'Past days', j_none: 'Your days of gratitude will appear here.', j_del: 'Delete', j_confirm: 'Tap again to delete', j_evening: "It's evening: the perfect time for your journal 🌙", j_done: "You've already written today. You can edit it any time.", loc: 'en-GB' },
 fr: { st_h: 'Ta fleur', st_days: n => n === 1 ? '1 jour d\'affilée' : `${n} jours d'affilée`, st_best: n => `Record : ${n}`, st_today: "Tu as déjà pratiqué aujourd'hui 🌿", st_todo: "Médite ou respire aujourd'hui pour la faire grandir.", st_grew: 'Ta fleur a grandi 🌸', st_restart: 'Chaque jour est un nouveau départ. Ta fleur recommence doucement à partir d\'une graine 🌱', st_go: 'Respirer',
  stages: ['Graine', 'Pousse', 'Bouton', 'Fleur', 'Jardin en fleurs'],
  card_h: 'Carte du jour', card_tap: "Touche pour découvrir ton intention du jour", card_back: 'Intention du jour',
  share: 'Partager', sharing: 'Préparation de l\'image…', saved: 'Image enregistrée ✓', share_title: 'Une pensée pour toi',
  d_tile: 'Journal de gratitude', d_tile_s: "Trois belles choses d'aujourd'hui",
  j_ttl: 'Journal de gratitude', j_lead: 'Chaque soir, avant de dormir, écris trois belles choses de ta journée. Même minuscules : un café chaud, un rire, le soleil sur le visage.', j_today: "Aujourd'hui, je suis reconnaissant pour…", j_ph: ["Une belle chose d'aujourd'hui…", 'Une autre…', 'Et encore une…'], j_save: 'Enregistrer', j_saved: 'Enregistré avec soin 🌼', j_empty1: 'Écris au moins une chose 🌱', j_priv: "🔒 Ton journal reste uniquement sur ce téléphone : il n'est envoyé nulle part. Si tu effaces les données du navigateur ou l'application, le journal disparaît aussi.", j_past: 'Les jours passés', j_none: 'Tes jours de gratitude apparaîtront ici.', j_del: 'Supprimer', j_confirm: 'Touche encore pour supprimer', j_evening: "C'est le soir : le bon moment pour ton journal 🌙", j_done: "Tu as déjà écrit aujourd'hui. Tu peux le modifier quand tu veux.", loc: 'fr-FR' }
};
const t = k => S[L()][k];
const pad = n => String(n).padStart(2, '0');
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayDiff = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

/* ---------- 1. Fiore dei giorni di fila ---------- */
let ST = load('aq_streak', { last: null, cur: 0, best: 0 }), restarted = false;
(function check() { if (ST.last && ST.cur > 0 && dayDiff(ST.last, dkey()) > 1) { ST.cur = 0; restarted = true; save('aq_streak', ST); } })();
const stageOf = n => n <= 0 ? 0 : n <= 2 ? 1 : n <= 6 ? 2 : n <= 13 ? 3 : 4;
function flowerSVG(stg) {
  const soil = '<ellipse cx="60" cy="104" rx="40" ry="8" fill="#d9c3ad"/>';
  const seed = '<ellipse class="fl-p" cx="60" cy="98" rx="6" ry="4" fill="#b98d6a"/>';
  const stem = h => `<path class="fl-stem" d="M60 100 Q${56} ${100 - h / 2} 60 ${100 - h}" stroke="#8fb89a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const leaf = (y, d) => `<path class="fl-p" d="M60 ${y} q${18 * d} -10 ${24 * d} 2 q${-14 * d} 10 ${-24 * d} -2z" fill="#9cc5a8"/>`;
  const bloom = (cx, cy, r, c1, c2) => { let p = ''; for (let i = 0; i < 6; i++) p += `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * .55}" ry="${r}" fill="${i % 2 ? c1 : c2}" transform="rotate(${i * 60} ${cx} ${cy})"/>`; return `<g class="fl-p fl-bloom">${p}<circle cx="${cx}" cy="${cy}" r="${r * .45}" fill="#ffe3a3"/></g>`; };
  let g = soil;
  if (stg === 0) g += seed;
  if (stg === 1) g += stem(22) + leaf(86, 1) + leaf(84, -1);
  if (stg === 2) g += stem(48) + leaf(80, 1) + leaf(72, -1) + '<ellipse class="fl-p" cx="60" cy="48" rx="8" ry="12" fill="#f4c6d3"/>';
  if (stg >= 3) g += stem(56) + leaf(82, 1) + leaf(72, -1) + bloom(60, 40, 13, '#f4c6d3', '#e3b5e8');
  if (stg >= 4) g += `<path class="fl-stem" d="M30 102 Q28 84 32 70" stroke="#8fb89a" stroke-width="3" fill="none"/>` + bloom(32, 64, 9, '#fde3d4', '#f2b8a2') + `<path class="fl-stem" d="M90 102 Q93 86 88 74" stroke="#8fb89a" stroke-width="3" fill="none"/>` + bloom(88, 68, 9, '#d6ebf7', '#b9a6e0');
  return `<svg viewBox="0 0 120 112" class="flower st${stg}" role="img" aria-label="${t('stages')[stg]}">${g}</svg>`;
}
function renderStreak(grew) {
  const today = ST.last === dkey(), stg = stageOf(ST.cur);
  $('#streak').innerHTML = `<div class="fl-wrap${grew ? ' grow' : ''}">${flowerSVG(stg)}${grew ? '<i class="spark"></i><i class="spark s2"></i><i class="spark s3"></i>' : ''}</div>
   <div class="st-info"><h3>${t('st_h')} · <span class="stage">${t('stages')[stg]}</span></h3><p class="st-n"><b>${t('st_days')(ST.cur)}</b> · <span class="muted">${t('st_best')(ST.best)}</span></p>
   <p class="muted st-msg">${grew ? t('st_grew') : restarted ? t('st_restart') : today ? t('st_today') : t('st_todo')}</p>${today ? '' : `<button class="btn ghost sm" data-go="respiro">${t('st_go')} 🌬️</button>`}</div>`;
}
function practice() {
  const k = dkey(); if (ST.last === k) return;
  ST.cur = ST.last && dayDiff(ST.last, k) === 1 ? ST.cur + 1 : 1; ST.last = k; ST.best = Math.max(ST.best, ST.cur); restarted = false; save('aq_streak', ST); renderStreak(true);
}
addEventListener('aq:practice', practice);

/* ---------- 2. Immagine da condividere ---------- */
function wrap(ctx, text, maxW) { const words = text.split(' '), lines = []; let l = ''; words.forEach(w => { const tt = l ? l + ' ' + w : w; if (ctx.measureText(tt).width > maxW && l) { lines.push(l); l = w; } else l = tt; }); if (l) lines.push(l); return lines; }
function leafAt(ctx, x, y, s, rot, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .7, 0, 0, s); ctx.quadraticCurveTo(-s * .7, 0, 0, -s); ctx.fill(); ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -s * .8); ctx.lineTo(0, s * .8); ctx.stroke(); ctx.restore(); }
function makeImage(text, title) {
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#fde3d4'); g.addColorStop(.35, '#f8dbe3'); g.addColorStop(.65, '#e3d9f2'); g.addColorStop(1, '#cfe3d4'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const sun = x.createRadialGradient(W * .72, H * .2, 0, W * .72, H * .2, 360); sun.addColorStop(0, '#ffffffcc'); sun.addColorStop(1, '#ffffff00'); x.fillStyle = sun; x.fillRect(0, 0, W, H);
  [['#d9cdee', 1500, 140], ['#bfd8c6', 1620, 110], ['#a9cdb3', 1740, 80]].forEach(([col, y, a], j) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); x.lineTo(0, y); for (let i = 0; i <= 6; i++) x.quadraticCurveTo(i * W / 6 - W / 12, y - a * (0.5 + 0.5 * Math.sin(i * 1.7 + j * 2)), i * W / 6, y - a * .2); x.lineTo(W, H); x.fill(); });
  const cols = ['#9cc5a8', '#b9a6e0', '#f2b8a2', '#f4c6d3', '#a8cde6']; let seed = text.length;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 22; i++) { x.globalAlpha = .45 + rnd() * .35; leafAt(x, rnd() * W, rnd() < .5 ? rnd() * 380 : 1250 + rnd() * 250, 22 + rnd() * 34, rnd() * 6.28, cols[i % 5]); }
  x.globalAlpha = 1;
  x.fillStyle = '#ffffffd9'; const bx = 90, bw = W - 180; x.font = '500 64px Georgia, "Times New Roman", serif';
  const lines = wrap(x, '“' + text + '”', bw - 140), lh = 92, bh = Math.max(560, lines.length * lh + 300), by = (H - bh) / 2 - 60;
  x.shadowColor = '#7f9aa544'; x.shadowBlur = 50; x.beginPath(); x.roundRect ? x.roundRect(bx, by, bw, bh, 60) : x.rect(bx, by, bw, bh); x.fill(); x.shadowBlur = 0;
  x.fillStyle = '#d9879f'; x.font = '700 38px "Nunito", system-ui, sans-serif'; x.textAlign = 'center'; x.fillText((title || '').toUpperCase(), W / 2, by + 120);
  x.fillStyle = '#3e4a52'; x.font = '500 64px Georgia, "Times New Roman", serif'; const ty = by + 150 + (bh - 230 - lines.length * lh) / 2 + lh * .8;
  lines.forEach((l, i) => x.fillText(l, W / 2, ty + i * lh));
  // lotus logo
  const lx = W / 2, ly = by + bh + 170; x.save(); x.translate(lx, ly); x.scale(1.4, 1.4);
  [['#c9a7d8', 'M0 0C-25-25-19-65 0-90C19-65 25-25 0 0Z'], ['#f2b8a2', 'M0 0C-35-9-55-40-52-65C-28-56-6-30 0 0Z'], ['#f2b8a2', 'M0 0C35-9 55-40 52-65C28-56 6-30 0 0Z'], ['#9cc5a8', 'M0 3C-30 7-65-3-79-25C-50-29-20-18 0 3Z'], ['#9cc5a8', 'M0 3C30 7 65-3 79-25C50-29 20-18 0 3Z']].forEach(([c2, d]) => { x.fillStyle = c2; x.fill(new Path2D(d)); });
  x.restore();
  x.fillStyle = '#4f5d66'; x.font = '500 72px Georgia, serif'; x.fillText('Anima Quieta', W / 2, ly + 110);
  x.fillStyle = '#6f7b82'; x.font = '600 36px "Nunito", system-ui, sans-serif'; x.fillText(SITE, W / 2, ly + 170);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
async function shareText(text, title, btn) {
  const old = btn.innerHTML; btn.disabled = true; btn.textContent = t('sharing');
  try {
    const blob = await makeImage(text, title), file = new File([blob], 'anima-quieta.png', { type: 'image/png' });
    let done = false;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Anima Quieta', text: `${text}\n\n🌿 Anima Quieta · https://${SITE}/` }); done = true; } catch (e) { if (e.name === 'AbortError') done = true; }
    }
    if (!done) { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = 'anima-quieta-' + dkey() + '-' + Date.now().toString(36).slice(-4) + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); btn.textContent = t('saved'); await new Promise(r => setTimeout(r, 1600)); }
  } catch (e) {}
  btn.disabled = false; btn.innerHTML = old;
}
window.__aqShare = { makeImage };
function shareBtn(id, getText, getTitle) { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost share'; b.id = id; b.innerHTML = '📤 ' + t('share'); b.onclick = () => shareText(getText(), getTitle(), b); return b; }
$('#answer .row').appendChild(shareBtn('shareA', () => $('#aText').textContent, () => $('#aTopic').textContent));
$('#dailyRow').appendChild(shareBtn('shareDaily', () => $('#dailyTip').textContent, () => window.__aq.T('daily_h').replace(/^\S+\s/, '')));

/* ---------- 3. Carta del giorno ---------- */
const dayNum = Math.floor((new Date(dkey() + 'T12:00')).getTime() / 864e5);
let flipped = load('aq_card', '') === dkey();
function renderCard() {
  const phrase = INTENT[L()][(dayNum * 7 + 3) % INTENT[L()].length];
  $('#tarot').innerHTML = `<button class="tcard${flipped ? ' flip' : ''}" id="tcard" aria-pressed="${flipped}" aria-label="${t('card_h')}">
   <span class="tface tfront"><span class="tstar" aria-hidden="true">✦</span><span class="tmoon" aria-hidden="true">☾</span><b>${t('card_h')}</b><small>${t('card_tap')}</small></span>
   <span class="tface tback"><small>${t('card_back')}</small><span class="tphrase">${phrase}</span></span></button>
   <div class="row center tshare" ${flipped ? '' : 'hidden'}></div>`;
  const row = $('#tarot .tshare'); row.appendChild(shareBtn('shareCard', () => phrase, () => t('card_back')));
  $('#tcard').onclick = () => { if (flipped) return; flipped = true; save('aq_card', dkey()); $('#tcard').classList.add('flip'); $('#tcard').setAttribute('aria-pressed', 'true'); setTimeout(() => row.hidden = false, RM ? 0 : 700); };
}

/* ---------- 4. Diario della gratitudine ---------- */
let J = load('aq_journal', {});
function fmtDate(k) { return new Date(k + 'T12:00').toLocaleDateString(t('loc'), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
function renderJournal() {
  $('#tDiary').textContent = t('d_tile'); $('#tDiaryS').textContent = t('d_tile_s');
  $('#jTtl').textContent = t('j_ttl'); $('#jLead').textContent = t('j_lead'); $('#jPriv').textContent = t('j_priv'); $('#jPast').textContent = t('j_past'); $('#jSave').textContent = t('j_save');
  const today = J[dkey()], hr = new Date().getHours();
  $('#jToday').innerHTML = `${t('j_today')}<small class="muted jhint">${today ? t('j_done') : hr >= 18 ? t('j_evening') : ''}</small>`;
  ['j1', 'j2', 'j3'].forEach((id, i) => { const el = $('#' + id); el.placeholder = t('j_ph')[i]; el.setAttribute('aria-label', t('j_ph')[i]); if (today && document.activeElement !== el && !el.dataset.touched) el.value = today[i] || ''; });
  const keys = Object.keys(J).filter(k => k !== dkey()).sort().reverse();
  $('#jList').innerHTML = keys.length ? keys.map((k, n) => `<div class="card c-sage jday" style="--i:${n}"><div class="jhead"><b>${fmtDate(k)}</b><button class="btn ghost sm jdel" data-k="${k}" aria-label="${t('j_del')} ${fmtDate(k)}">🗑 ${t('j_del')}</button></div><ul class="dots">${J[k].filter(Boolean).map(s => `<li></li>`).join('')}</ul></div>`).join('') : `<p class="muted">${t('j_none')}</p>`;
  keys.forEach(k => { const lis = $(`.jdel[data-k="${k}"]`).closest('.jday').querySelectorAll('li'); J[k].filter(Boolean).forEach((s, i) => lis[i].textContent = s); });
  $$('.jdel').forEach(b => b.onclick = () => { if (!b.dataset.arm) { b.dataset.arm = 1; b.classList.add('arm'); b.textContent = t('j_confirm'); setTimeout(() => { if (b.isConnected) { delete b.dataset.arm; b.classList.remove('arm'); b.textContent = '🗑 ' + t('j_del'); } }, 3500); return; } const card = b.closest('.jday'); card.classList.add('bye'); setTimeout(() => { delete J[b.dataset.k]; save('aq_journal', J); renderJournal(); }, RM ? 0 : 450); });
}
['j1', 'j2', 'j3'].forEach(id => $('#' + id).addEventListener('input', e => e.target.dataset.touched = 1));
$('#jForm').onsubmit = e => { e.preventDefault(); const v = ['j1', 'j2', 'j3'].map(id => $('#' + id).value.trim().slice(0, 200));
  if (!v.some(Boolean)) { $('#jMsg').textContent = t('j_empty1'); return; }
  J[dkey()] = v; save('aq_journal', J); $('#jMsg').textContent = t('j_saved'); $('#jForm').classList.remove('saved'); void $('#jForm').offsetWidth; $('#jForm').classList.add('saved');
  ['j1', 'j2', 'j3'].forEach(id => delete $('#' + id).dataset.touched); renderJournal(); setTimeout(() => $('#jMsg').textContent = '', 3000); };

function renderAll() { renderStreak(false); renderCard(); renderJournal(); const s = $('#shareA'), d = $('#shareDaily'); [s, d].forEach(b => b && !b.disabled && (b.innerHTML = '📤 ' + t('share'))); }
addEventListener('aq:lang', renderAll);
renderAll();
})();
