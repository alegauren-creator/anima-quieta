// Motore audio: suoni generati con Web Audio, nessun file esterno
const Sound = (() => {
  let ctx, master, verb, current = null, nodes = [], timers = [];
  const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18;
    master.connect(comp).connect(ctx.destination);
    verb = ctx.createConvolver(); verb.buffer = impulse(4.5, 2.6);
    const vg = ctx.createGain(); vg.gain.value = 0.55; verb.connect(vg).connect(master);
  }
  function impulse(sec, decay) {
    const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  function noiseBuf(type) {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
    return b;
  }
  function out(dry = 1, wet = 0.4) {
    const g = ctx.createGain(); g.gain.value = dry; g.connect(master);
    const w = ctx.createGain(); w.gain.value = wet; g.connect(w).connect(verb);
    nodes.push(g, w); return g;
  }
  function noise(type, filt, freq, q, gain, dest) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(type); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = filt; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    s.connect(f).connect(g).connect(dest); s.start(); nodes.push(s, f, g); return { s, f, g };
  }
  function lfo(param, rate, depth) {
    const o = ctx.createOscillator(); o.frequency.value = rate; const g = ctx.createGain(); g.gain.value = depth;
    o.connect(g).connect(param); o.start(); nodes.push(o, g);
  }
  function pad(freqs, gain, dest) {
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; f.Q.value = 0.3;
    const g = ctx.createGain(); g.gain.value = 0; g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 4);
    f.connect(g).connect(dest); nodes.push(f, g);
    freqs.forEach((fr, i) => [-4, 4].forEach(dt => {
      const o = ctx.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = fr; o.detune.value = dt;
      const og = ctx.createGain(); og.gain.value = 0.18 / freqs.length; o.connect(og).connect(f); o.start(); nodes.push(o, og);
    }));
    lfo(f.frequency, 0.05, 300); return g;
  }
  function bell(freq, vol, dest, dur = 4, partials = [1, 2.76, 5.4]) {
    const t = ctx.currentTime;
    partials.forEach((p, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq * p;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol / (i + 1), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (i * 0.6 + 1));
      o.connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.1);
    });
  }
  function every(minMs, maxMs, fn) {
    const loop = () => { fn(); timers.push(setTimeout(loop, minMs + Math.random() * (maxMs - minMs))); };
    timers.push(setTimeout(loop, 600));
  }
  function chord(dest, gain) {
    const chords = [[130.81, 196.0, 329.63, 392.0], [110.0, 164.81, 261.63, 329.63], [98.0, 146.83, 246.94, 293.66], [87.31, 130.81, 220.0, 329.63]];
    let i = 0, cur = pad(chords[0], gain, dest);
    timers.push(setInterval(() => {
      const old = cur; old.gain.linearRampToValueAtTime(0, ctx.currentTime + 6);
      i = (i + 1) % chords.length; cur = pad(chords[i], gain, dest);
    }, 16000));
  }
  const AMB = {
    spa() { const d = out(1, .6); chord(d, .5); every(1800, 4200, () => bell(PENTA[Math.random() * PENTA.length | 0] * 2, .05, d, 5)); noise('brown', 'lowpass', 500, .3, .06, d); },
    pioggia() { const d = out(1, .3); noise('white', 'bandpass', 2500, .6, .09, d); noise('brown', 'lowpass', 400, .5, .25, d);
      every(80, 400, () => { const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime; o.frequency.setValueAtTime(1800 + Math.random() * 2000, t); o.frequency.exponentialRampToValueAtTime(600, t + .05); g.gain.setValueAtTime(.012, t); g.gain.exponentialRampToValueAtTime(.0001, t + .06); o.connect(g).connect(d); o.start(t); o.stop(t + .08); }); },
    onde() { const d = out(1, .4); const n = noise('brown', 'lowpass', 600, .4, .2, d); lfo(n.g.gain, 0.08, .18); lfo(n.f.frequency, 0.08, 350);
      const s = noise('white', 'highpass', 3000, .3, .015, d); lfo(s.g.gain, 0.08, .012); pad([110, 164.81], .2, d); },
    foresta() { const d = out(1, .5); const w = noise('brown', 'bandpass', 700, .4, .18, d); lfo(w.f.frequency, .03, 250);
      every(1500, 5000, () => { const t = ctx.currentTime, base = 2200 + Math.random() * 1600, n = 2 + (Math.random() * 4 | 0);
        for (let k = 0; k < n; k++) { const o = ctx.createOscillator(), g = ctx.createGain(), st = t + k * .14; o.frequency.setValueAtTime(base, st); o.frequency.exponentialRampToValueAtTime(base * 1.4, st + .08);
          g.gain.setValueAtTime(0, st); g.gain.linearRampToValueAtTime(.018, st + .02); g.gain.exponentialRampToValueAtTime(.0001, st + .12); o.connect(g).connect(d); o.start(st); o.stop(st + .14); } }); },
    campane() { const d = out(1, .7); pad([65.41, 98.0], .25, d);
      every(5000, 9000, () => bell([196, 220, 261.63, 174.61][Math.random() * 4 | 0], .09, d, 12, [1, 2.71, 4.95, 7.3])); }
  };
  const NAMES = { spa: 'Spa', pioggia: 'Pioggia leggera', onde: 'Onde del mare', foresta: 'Foresta', campane: 'Campane tibetane' };
  let vol = +(localStorage.getItem('aq_vol') || 70) / 100;
  function stop(fade = 1.5) {
    if (!ctx || !current) return Promise.resolve();
    master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + fade);
    const old = nodes, ot = timers; nodes = []; timers = []; current = null;
    ot.forEach(t => { clearTimeout(t); clearInterval(t); });
    return new Promise(r => setTimeout(() => { old.forEach(n => { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} }); r(); }, fade * 1000 + 50));
  }
  async function play(name) {
    init(); if (ctx.state === 'suspended') await ctx.resume();
    if (current) await stop(.8);
    current = name; AMB[name]();
    master.gain.setValueAtTime(0, ctx.currentTime); master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 3);
  }
  function setVol(v) { vol = v; localStorage.setItem('aq_vol', Math.round(v * 100)); if (ctx && current) master.gain.linearRampToValueAtTime(v, ctx.currentTime + .3); }
  return { play, stop, setVol, get current() { return current; }, NAMES, get vol() { return vol; }, bell: (f) => { init(); ctx.resume(); bell(f, .06, master, 3); } };
})();
