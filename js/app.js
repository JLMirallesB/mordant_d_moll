/* ═══════════════════════════════════════════════════════
   BWV 565 · Musical Representations · app.js
   ═══════════════════════════════════════════════════════ */

'use strict';

const ASSET = path => `./assets/bwv565/${path}`;

/* ── Boot ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAxis();
  initStickyPlayer();
  initWaveformSection();
  initSpectrogramSection();
  initPDFSections();
  initPNGSection();
  initSVGLayerDemo();
  initMidiSections();
  initMsczExplorer();
  initMusicXMLViewer();
  initLilypondViewer();
  initAbcViewer();
  initMeiViewer();
  initKernViewer();
  initCodeSections();
  initMidiHexDisplay({
    hexId: 'midi-lit-hex', eventsId: 'midi-lit-events', tabsId: 'midi-lit-tabs',
    hlBarId: 'hex-hl-bar', file: 'midi-literal.mid',
    ranges: {
      mtrk:    { start: 116, end: 123, cls: 'hl-mtrk' },
      keysig:  { start: 124, end: 129, cls: 'hl-keysig' },
      noteon:  { start: 130, end: 133, cls: 'hl-noteon' },
      delta:   { start: 130, end: 130, cls: 'hl-delta' },
      status:  { start: 131, end: 131, cls: 'hl-status' },
      noteid:  { start: 132, end: 132, cls: 'hl-noteid' },
      veloc:   { start: 133, end: 133, cls: 'hl-veloc' },
      noteoff: { start: 134, end: 138, cls: 'hl-noteoff' },
      eot:     { start: 139, end: 143, cls: 'hl-eot' },
    }
  });
  initMidiHexDisplay({
    hexId: 'midi-int-hex', eventsId: 'midi-int-events', tabsId: 'midi-int-tabs',
    hlBarId: 'hex-int-hl-bar', file: 'midi-interpreted.mid',
    ranges: {
      non_a1:  { start: 107, end: 114, cls: 'hl-non-a1' },
      noff_a1: { start: 115, end: 122, cls: 'hl-noff-a1' },
      non_gs:  { start: 123, end: 130, cls: 'hl-non-gs' },
      noff_gs: { start: 131, end: 138, cls: 'hl-noff-gs' },
      non_a2:  { start: 139, end: 146, cls: 'hl-non-a2' },
      noff_a2: { start: 147, end: 155, cls: 'hl-noff-a2' },
    }
  });
});

/* ══════════════════════════════════════════════════════
   AXIS — Intersection Observer syncs dots with scroll
   ══════════════════════════════════════════════════════ */
function initAxis() {
  const dots = document.querySelectorAll('.axis-dot');
  const sections = document.querySelectorAll('.rep-section');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      dots.forEach(d => {
        d.classList.toggle('active', d.dataset.target === id);
      });
      // Scroll active dot into view in the axis
      const activeDot = document.querySelector(`.axis-dot[data-target="${id}"]`);
      if (activeDot) {
        activeDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════════════════
   STICKY PLAYER — WaveSurfer mini + play/pause
   ══════════════════════════════════════════════════════ */
let wsMain = null;

function initStickyPlayer() {
  wsMain = WaveSurfer.create({
    container: '#mini-wave',
    waveColor: 'rgba(200,168,75,0.4)',
    progressColor: '#c8a84b',
    cursorColor: 'transparent',
    barWidth: 2,
    barRadius: 2,
    height: 32,
    normalize: true,
    interact: true,
  });

  wsMain.load(ASSET('audio.wav'));

  const playBtn   = document.getElementById('play-btn');
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const timeCur   = document.getElementById('current-time');
  const timeTotal = document.getElementById('total-time');

  playBtn.addEventListener('click', () => wsMain.playPause());

  wsMain.on('play',  () => { iconPlay.style.display = 'none'; iconPause.style.display = ''; });
  wsMain.on('pause', () => { iconPlay.style.display = ''; iconPause.style.display = 'none'; });
  wsMain.on('finish',() => { iconPlay.style.display = ''; iconPause.style.display = 'none'; });

  wsMain.on('audioprocess', t => { timeCur.textContent = fmt(t); });
  wsMain.on('ready', dur => { timeTotal.textContent = fmt(dur); });

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}

/* ══════════════════════════════════════════════════════
   WAVEFORM SECTION — Exact sample viewer with zoom
   ══════════════════════════════════════════════════════ */
function initWaveformSection() {
  const canvas = document.getElementById('waveform-exact');
  if (!canvas) return;

  let samples = null, totalN = 0, sampleRate = 44100;
  let visible = 0, offset = 0, yZoom = 1.0;

  const loadingEl = document.getElementById('wf-loading');

  fetch(ASSET('audio.wav'))
    .then(r => r.arrayBuffer())
    .then(buf => new (window.AudioContext || window.webkitAudioContext)().decodeAudioData(buf))
    .then(ab => {
      samples    = ab.getChannelData(0);
      totalN     = samples.length;
      sampleRate = ab.sampleRate;
      visible    = totalN;
      offset     = 0;
      if (loadingEl) loadingEl.style.display = 'none';
      resize();
    })
    .catch(() => { if (loadingEl) loadingEl.textContent = 'Disponible solo con servidor HTTP.'; });

  /* ── Draw ──────────────────────────────────────── */
  function draw() {
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    const PL = 46, PR = 8, PT = 8, PB = 22;
    const pw = W - PL - PR, ph = H - PT - PB;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, W, H);

    // Y grid + labels (dynamic with yZoom)
    const yRange = 1 / yZoom;
    const fmtY = v => v === 0 ? '0.0' : Math.abs(v) >= 0.095 ? v.toFixed(2) : v.toFixed(3);
    ctx.font = '10px "JetBrains Mono", monospace';
    [yRange, yRange / 2, 0, -yRange / 2, -yRange].forEach(v => {
      const y = PT + ph * (1 - v / yRange) / 2;
      ctx.strokeStyle = v === 0 ? '#2d3060' : '#191b2e';
      ctx.lineWidth = v === 0 ? 1.5 : 1;
      ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
      ctx.fillStyle = '#6870a0';
      ctx.textAlign = 'right';
      ctx.fillText(fmtY(v), PL - 5, y + 3.5);
    });

    // Y axis border
    ctx.strokeStyle = '#1e2040'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, H - PB); ctx.stroke();

    if (!samples) return;

    const end  = Math.min(offset + visible, totalN);
    const avis = end - offset;

    // X labels
    const nLab = Math.min(8, avis);
    ctx.fillStyle = '#6870a0'; ctx.textAlign = 'center';
    for (let i = 0; i <= nLab; i++) {
      const si = Math.round(offset + (i / nLab) * avis);
      const x  = PL + (i / nLab) * pw;
      ctx.fillText(avis < 500 ? `#${si}` : `${(si / sampleRate).toFixed(3)}s`, x, H - 5);
    }

    const THRESH = 500;
    if (avis <= THRESH) {
      // Individual sample mode
      const r = Math.min(5, Math.max(1.5, pw / avis / 2.5));
      ctx.strokeStyle = 'rgba(59,130,246,0.55)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < avis; i++) {
        const x = PL + (i / (avis - 1)) * pw;
        const y = PT + ph * (1 - samples[offset + i] / yRange) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = '#60a5fa';
      for (let i = 0; i < avis; i++) {
        const x = PL + (i / (avis - 1)) * pw;
        const y = PT + ph * (1 - samples[offset + i] / yRange) / 2;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      // Overview: min/max bars per pixel
      for (let px = 0; px < pw; px++) {
        const s0 = Math.floor(offset + (px / pw) * avis);
        const s1 = Math.ceil(offset + ((px + 1) / pw) * avis);
        let mn = Infinity, mx = -Infinity;
        for (let s = s0; s < s1 && s < totalN; s++) {
          if (samples[s] < mn) mn = samples[s];
          if (samples[s] > mx) mx = samples[s];
        }
        const yTop = PT + ph * (1 - mx / yRange) / 2;
        const yBot = PT + ph * (1 - mn / yRange) / 2;
        ctx.fillStyle = 'rgba(59,130,246,0.7)';
        ctx.fillRect(PL + px, yTop, 1, Math.max(1, yBot - yTop));
      }
    }

    // Info bar
    const el = document.getElementById('wf-info');
    if (el) {
      const t0 = (offset / sampleRate).toFixed(4);
      const t1 = ((offset + avis - 1) / sampleRate).toFixed(4);
      const mode = avis <= THRESH ? ' · modo muestra individual' : '';
      el.textContent = `Muestras ${offset.toLocaleString('es')}–${(offset + avis - 1).toLocaleString('es')} · ${t0}s–${t1}s · ${avis.toLocaleString('es')} visibles${mode}`;
    }
  }

  /* ── Resize ──────────────────────────────────────── */
  function resize() {
    canvas.width  = canvas.parentElement.clientWidth || 800;
    canvas.height = 220;
    draw();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);

  /* ── Zoom ────────────────────────────────────────── */
  function setZoom(newVis, pivot = 0.5) {
    if (!samples) return;
    newVis = Math.max(32, Math.min(totalN, Math.round(newVis)));
    const anchor = offset + pivot * visible;
    offset  = Math.max(0, Math.min(totalN - newVis, Math.round(anchor - pivot * newVis)));
    visible = newVis;
    if (visible >= totalN) { visible = totalN; offset = 0; }
    syncSlider();
    draw();
  }

  function syncSlider() {
    const sl = document.getElementById('wf-zoom-slider');
    if (!sl || !totalN) return;
    const range = Math.log2(totalN) - Math.log2(32);
    sl.value = ((Math.log2(totalN) - Math.log2(Math.max(32, visible))) / range) * 100;
  }

  document.getElementById('wf-zoom-in') ?.addEventListener('click', () => setZoom(visible / 4));
  document.getElementById('wf-zoom-out')?.addEventListener('click', () => setZoom(visible * 4));

  document.getElementById('wf-yzoom-in') ?.addEventListener('click', () => { yZoom = Math.min(128, yZoom * 2); draw(); });
  document.getElementById('wf-yzoom-out')?.addEventListener('click', () => { yZoom = Math.max(1, yZoom / 2); draw(); });
  document.getElementById('wf-zoom-slider')?.addEventListener('input', e => {
    if (!totalN) return;
    const range = Math.log2(totalN) - Math.log2(32);
    setZoom(Math.round(Math.pow(2, Math.log2(totalN) - (e.target.value / 100) * range)));
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const pivot = Math.max(0, Math.min(1, (e.offsetX - 46) / (canvas.width - 54)));
    setZoom(visible * (e.deltaY > 0 ? 3 : 1 / 3), pivot);
  }, { passive: false });

  /* ── Pan ─────────────────────────────────────────── */
  let drag = null;
  canvas.addEventListener('mousedown', e => {
    drag = { x: e.clientX, off: offset };
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!drag || !samples) return;
    const spp = visible / (canvas.width - 54);
    offset = Math.max(0, Math.min(totalN - visible, Math.round(drag.off - (e.clientX - drag.x) * spp)));
    draw();
  });
  window.addEventListener('mouseup', () => { drag = null; canvas.style.cursor = 'crosshair'; });

  /* ── Hover tooltip ───────────────────────────────── */
  canvas.addEventListener('mousemove', e => {
    if (drag || !samples) return;
    const px = e.offsetX - 46;
    if (px < 0) return;
    const si  = Math.min(totalN - 1, Math.round(offset + (px / (canvas.width - 54)) * visible));
    const v   = samples[si];
    const tip = document.getElementById('wf-tooltip');
    if (tip) tip.textContent = `#${si.toLocaleString('es')} · t = ${(si / sampleRate).toFixed(5)} s · amp = ${v.toFixed(5)} · PCM = ${Math.round(v * 32767)}`;
  });
}

/* ══════════════════════════════════════════════════════
   SPECTROGRAM SECTION — STFT canvas renderer with zoom
   ══════════════════════════════════════════════════════ */
function initSpectrogramSection() {
  const canvas = document.getElementById('spectrogram-exact');
  if (!canvas) return;

  const FFT_SIZE = 2048, HOP = 512, SR = 44100;
  const N_BINS = FFT_SIZE >> 1;           // 1024 bins
  const HZ_PER_BIN = SR / FFT_SIZE;       // ≈ 21.53 Hz/bin

  let spec = null, nFrames = 0;
  let visFrames = 0, frameOffset = 0;
  let visBins = Math.round(6000 / HZ_PER_BIN); // default: 0–6000 Hz
  let binOffset = 0;
  let dbMin = -80, dbMax = 0;

  const loadingEl = document.getElementById('spec-loading');

  /* ── Radix-2 Cooley-Tukey FFT (in-place) ──────── */
  function doFFT(re, im) {
    const N = re.length;
    let j = 0;
    for (let i = 1; i < N; i++) {
      let bit = N >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        let t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (let len = 2; len <= N; len <<= 1) {
      const ang = -2 * Math.PI / len;
      const wRe = Math.cos(ang), wIm = Math.sin(ang);
      for (let i = 0; i < N; i += len) {
        let uRe = 1, uIm = 0;
        for (let k = 0; k < (len >> 1); k++) {
          const oi = i + k + (len >> 1);
          const tRe = uRe * re[oi] - uIm * im[oi];
          const tIm = uRe * im[oi] + uIm * re[oi];
          re[oi] = re[i + k] - tRe; im[oi] = im[i + k] - tIm;
          re[i + k] += tRe;         im[i + k] += tIm;
          const nRe = uRe * wRe - uIm * wIm;
          uIm = uRe * wIm + uIm * wRe; uRe = nRe;
        }
      }
    }
  }

  /* ── Inferno-like color map ────────────────────── */
  function heatColor(t) {
    const stops = [
      [0,    [0,   0,   0  ]],
      [0.25, [60,  0,   130]],
      [0.5,  [210, 30,  70 ]],
      [0.75, [255, 180, 0  ]],
      [1,    [255, 255, 255]],
    ];
    let i = 0;
    while (i < stops.length - 2 && t > stops[i + 1][0]) i++;
    const [t0, c0] = stops[i], [t1, c1] = stops[i + 1];
    const f = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
    return [
      Math.round(c0[0] + f * (c1[0] - c0[0])),
      Math.round(c0[1] + f * (c1[1] - c0[1])),
      Math.round(c0[2] + f * (c1[2] - c0[2])),
    ];
  }

  /* ── Compute STFT ────────────────────────────────── */
  function computeSTFT(samples) {
    const hann = new Float32Array(FFT_SIZE);
    for (let i = 0; i < FFT_SIZE; i++)
      hann[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (FFT_SIZE - 1)));

    const totalFrames = Math.floor((samples.length - FFT_SIZE) / HOP) + 1;
    const result = [];
    let gMin = Infinity, gMax = -Infinity;
    const re = new Float64Array(FFT_SIZE);
    const im = new Float64Array(FFT_SIZE);

    for (let f = 0; f < totalFrames; f++) {
      const start = f * HOP;
      for (let i = 0; i < FFT_SIZE; i++) {
        re[i] = (start + i < samples.length ? samples[start + i] : 0) * hann[i];
        im[i] = 0;
      }
      doFFT(re, im);
      const bins = new Float32Array(N_BINS);
      for (let b = 0; b < N_BINS; b++) {
        const mag = Math.sqrt(re[b] * re[b] + im[b] * im[b]) / (FFT_SIZE / 2);
        const db = 20 * Math.log10(mag + 1e-10);
        bins[b] = db;
        if (db > gMax) gMax = db;
        if (db < gMin) gMin = db;
      }
      result.push(bins);
    }
    dbMin = Math.max(gMin, gMax - 80); // 80 dB dynamic range
    dbMax = gMax;
    return result;
  }

  /* ── Load audio ──────────────────────────────────── */
  fetch(ASSET('audio.wav'))
    .then(r => r.arrayBuffer())
    .then(buf => new (window.AudioContext || window.webkitAudioContext)().decodeAudioData(buf))
    .then(ab => {
      const samples = ab.getChannelData(0);
      setTimeout(() => {
        spec        = computeSTFT(samples);
        nFrames     = spec.length;
        visFrames   = nFrames;
        frameOffset = 0;
        visBins     = Math.min(N_BINS, Math.round(6000 / HZ_PER_BIN));
        binOffset   = 0;
        if (loadingEl) loadingEl.style.display = 'none';
        resize();
      }, 0);
    })
    .catch(() => {
      if (loadingEl) loadingEl.textContent = 'Disponible solo con servidor HTTP.';
    });

  /* ── Draw ──────────────────────────────────────── */
  function draw() {
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    const PL = 50, PR = 8, PT = 8, PB = 22;
    const pw = W - PL - PR, ph = H - PT - PB;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, W, H);

    if (!spec) return;

    const endF  = Math.min(frameOffset + visFrames, nFrames);
    const avisF = endF - frameOffset;
    const endB  = Math.min(binOffset + visBins, N_BINS);
    const avisB = endB - binOffset;

    // Render spectrogram pixels via ImageData
    const imgData = ctx.createImageData(pw, ph);
    const data    = imgData.data;
    for (let py = 0; py < ph; py++) {
      const b = binOffset + Math.floor((ph - 1 - py) / ph * avisB);
      for (let px = 0; px < pw; px++) {
        const f  = frameOffset + Math.floor(px / pw * avisF);
        const db = (f < nFrames && b < N_BINS) ? spec[f][b] : dbMin;
        const t  = Math.max(0, Math.min(1, (db - dbMin) / (dbMax - dbMin)));
        const [r, g, bv] = heatColor(t);
        const idx = (py * pw + px) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = bv; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, PL, PT);

    // Y axis border
    ctx.strokeStyle = '#1e2040'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, PT); ctx.lineTo(PL, H - PB); ctx.stroke();

    // Y axis labels (frequency)
    const fMin   = binOffset * HZ_PER_BIN;
    const fMax   = (binOffset + avisB) * HZ_PER_BIN;
    const fRange = fMax - fMin;
    const rawStep = fRange / 5;
    const step = rawStep < 100 ? 50 : rawStep < 250 ? 100 : rawStep < 750 ? 200 : rawStep < 1500 ? 500 : 1000;
    const firstLabel = Math.ceil(fMin / step) * step;

    ctx.font = '10px "JetBrains Mono", monospace';
    for (let hz = firstLabel; hz <= fMax + 1; hz += step) {
      const frac = (hz - fMin) / fRange;
      const y = PT + ph * (1 - frac);
      ctx.strokeStyle = '#1e2040'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
      ctx.fillStyle = '#6870a0'; ctx.textAlign = 'right';
      ctx.fillText(hz >= 1000 ? (hz / 1000).toFixed(hz % 500 === 0 ? 1 : 0) + 'k' : hz, PL - 4, y + 3.5);
    }

    // X axis labels (time)
    const tMin = frameOffset * HOP / SR;
    const tMax = (frameOffset + avisF - 1) * HOP / SR;
    const nLab = Math.min(8, avisF);
    ctx.fillStyle = '#6870a0'; ctx.textAlign = 'center';
    for (let i = 0; i <= nLab; i++) {
      const t = tMin + (i / nLab) * (tMax - tMin);
      const x = PL + (i / nLab) * pw;
      ctx.fillText(t.toFixed(3) + 's', x, H - 5);
    }

    // Info bar
    const el = document.getElementById('spec-info');
    if (el) el.textContent =
      `${tMin.toFixed(3)}s–${tMax.toFixed(3)}s · ${Math.round(fMin)}–${Math.round(fMax)} Hz · ${avisF} fotogramas`;
  }

  /* ── Resize ──────────────────────────────────────── */
  function resize() {
    canvas.width  = canvas.parentElement.clientWidth || 800;
    canvas.height = 240;
    draw();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);

  /* ── Time zoom ───────────────────────────────────── */
  function setTimeZoom(newVis, pivot = 0.5) {
    if (!spec) return;
    newVis = Math.max(4, Math.min(nFrames, Math.round(newVis)));
    const anchor = frameOffset + pivot * visFrames;
    frameOffset = Math.max(0, Math.min(nFrames - newVis, Math.round(anchor - pivot * newVis)));
    visFrames   = newVis;
    if (visFrames >= nFrames) { visFrames = nFrames; frameOffset = 0; }
    syncSlider();
    draw();
  }

  function syncSlider() {
    const sl = document.getElementById('spec-zoom-slider');
    if (!sl || !nFrames) return;
    const range = Math.log2(nFrames) - Math.log2(4);
    sl.value = ((Math.log2(nFrames) - Math.log2(Math.max(4, visFrames))) / range) * 100;
  }

  document.getElementById('spec-zoom-in') ?.addEventListener('click', () => setTimeZoom(visFrames / 4));
  document.getElementById('spec-zoom-out')?.addEventListener('click', () => setTimeZoom(visFrames * 4));

  document.getElementById('spec-zoom-slider')?.addEventListener('input', e => {
    if (!nFrames) return;
    const range = Math.log2(nFrames) - Math.log2(4);
    setTimeZoom(Math.round(Math.pow(2, Math.log2(nFrames) - (e.target.value / 100) * range)));
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const pivot = Math.max(0, Math.min(1, (e.offsetX - PL_CONST()) / (canvas.width - PL_CONST() - 8)));
    setTimeZoom(visFrames * (e.deltaY > 0 ? 3 : 1 / 3), pivot);
  }, { passive: false });
  function PL_CONST() { return 50; }

  /* ── Frequency zoom ──────────────────────────────── */
  document.getElementById('spec-fzoom-in')?.addEventListener('click', () => {
    if (!spec) return;
    const center = binOffset + visBins / 2;
    visBins   = Math.max(8, Math.floor(visBins / 2));
    binOffset = Math.max(0, Math.min(N_BINS - visBins, Math.round(center - visBins / 2)));
    draw();
  });
  document.getElementById('spec-fzoom-out')?.addEventListener('click', () => {
    if (!spec) return;
    const center = binOffset + visBins / 2;
    visBins   = Math.min(N_BINS, Math.floor(visBins * 2));
    binOffset = Math.max(0, Math.min(N_BINS - visBins, Math.round(center - visBins / 2)));
    draw();
  });

  /* ── Pan ─────────────────────────────────────────── */
  let drag = null;
  canvas.addEventListener('mousedown', e => {
    drag = { x: e.clientX, off: frameOffset };
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!drag || !spec) return;
    const fpp = visFrames / (canvas.width - 58);
    frameOffset = Math.max(0, Math.min(nFrames - visFrames,
      Math.round(drag.off - (e.clientX - drag.x) * fpp)));
    draw();
  });
  window.addEventListener('mouseup', () => { drag = null; canvas.style.cursor = 'crosshair'; });

  /* ── Hover tooltip ───────────────────────────────── */
  canvas.addEventListener('mousemove', e => {
    if (drag || !spec) return;
    const px = e.offsetX - 50;
    const py = e.offsetY - 8;
    const pw = canvas.width - 58;
    const ph = canvas.height - 30;
    if (px < 0 || px > pw || py < 0 || py > ph) return;
    const fi = Math.min(nFrames - 1, frameOffset + Math.floor(px / pw * visFrames));
    const avisB = Math.min(visBins, N_BINS - binOffset);
    const bi = Math.min(N_BINS - 1, binOffset + Math.floor((ph - py) / ph * avisB));
    const t   = (fi * HOP / SR).toFixed(4);
    const hz  = (bi * HZ_PER_BIN).toFixed(1);
    const db  = spec[fi]?.[bi]?.toFixed(1) ?? '—';
    const tip = document.getElementById('spec-tooltip');
    if (tip) tip.textContent = `t = ${t} s · f = ${hz} Hz · ${db} dB`;
  });
}

/* ══════════════════════════════════════════════════════
   PDF SECTIONS
   ══════════════════════════════════════════════════════ */
function initPDFSections() {
  if (typeof pdfjsLib === 'undefined') return;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  renderPDF(ASSET('manuscript.pdf'),    'canvas-manuscript', 'load-manuscript');
  initScanSection();
  initVectorSection();
}

function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function initScanSection() {
  const canvas  = document.getElementById('canvas-scan');
  const loading = document.getElementById('load-scan');
  const hint    = document.getElementById('scan-hint');
  const info    = document.getElementById('scan-info');
  if (!canvas) return;

  try {
    // Load PDF + both zoom images in parallel
    const [pdf, img1, img2] = await Promise.all([
      pdfjsLib.getDocument(ASSET('score-scan.pdf')).promise,
      loadImg(ASSET('scan-zoom1.png')),
      loadImg(ASSET('scan-zoom2.png')),
    ]);

    const page = await pdf.getPage(1);
    const containerWidth = canvas.parentElement.clientWidth || 800;
    const nativeVP = page.getViewport({ scale: 1 });
    const scale = Math.min((containerWidth - 32) / nativeVP.width, 2);
    const viewport = page.getViewport({ scale });

    // Render PDF to offscreen canvas
    const off = document.createElement('canvas');
    off.width  = viewport.width;
    off.height = viewport.height;
    await page.render({ canvasContext: off.getContext('2d'), viewport }).promise;

    // Setup display canvas
    canvas.width  = off.width;
    canvas.height = off.height;

    if (loading) loading.classList.add('done');

    const SOURCES = [off, img1, img2];
    const HINTS   = ['clic → mordente', 'clic → píxeles', 'clic → vista completa'];
    const INFOS   = [
      'Vista completa · PDF escaneado · haz clic para ampliar el mordente inicial',
      'Ampliación · mordente inicial — Re con Pralltriller · haz clic para ver los píxeles',
      'Píxeles del escáner · naturaleza ráster del archivo · haz clic para volver',
    ];

    let state = 0;

    function draw() {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(SOURCES[state], 0, 0, canvas.width, canvas.height);
      canvas.style.cursor = state === 2 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = HINTS[state];
      if (info) info.textContent = INFOS[state];
    }

    canvas.addEventListener('click', () => {
      state = (state + 1) % 3;
      draw();
    });

    draw();

  } catch (e) {
    if (loading) loading.textContent = 'Error al cargar el PDF.';
    console.error('Scan section error:', e);
  }
}

async function initVectorSection() {
  const canvas  = document.getElementById('canvas-vector');
  const loading = document.getElementById('load-vector');
  const hint    = document.getElementById('vector-hint');
  const info    = document.getElementById('vector-info');
  if (!canvas) return;

  try {
    const [pdf, img1, img2] = await Promise.all([
      pdfjsLib.getDocument(ASSET('score-vector.pdf')).promise,
      loadImg(ASSET('vector-zoom1.png')),
      loadImg(ASSET('vector-zoom2.png')),
    ]);

    const page = await pdf.getPage(1);
    const containerWidth = canvas.parentElement.clientWidth || 800;
    const nativeVP = page.getViewport({ scale: 1 });
    const scale = Math.min((containerWidth - 32) / nativeVP.width, 2);
    const viewport = page.getViewport({ scale });

    const off = document.createElement('canvas');
    off.width  = viewport.width;
    off.height = viewport.height;
    await page.render({ canvasContext: off.getContext('2d'), viewport }).promise;

    canvas.width  = off.width;
    canvas.height = off.height;

    if (loading) loading.classList.add('done');

    const SOURCES = [off, img1, img2];
    const HINTS   = ['clic → mordente', 'clic → detalle vectorial', 'clic → vista completa'];
    const INFOS   = [
      'Vista completa · PDF vectorial · haz clic para ampliar el mordente inicial',
      'Ampliación · mordente inicial — La con Pralltriller · haz clic para ver el detalle vectorial',
      'Detalle vectorial · curvas perfectas sin píxeles · haz clic para volver',
    ];

    let state = 0;

    function draw() {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(SOURCES[state], 0, 0, canvas.width, canvas.height);
      canvas.style.cursor = state === 2 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = HINTS[state];
      if (info) info.textContent = INFOS[state];
    }

    canvas.addEventListener('click', () => {
      state = (state + 1) % 3;
      draw();
    });

    draw();

  } catch (e) {
    if (loading) loading.textContent = 'Error al cargar el PDF.';
    console.error('Vector section error:', e);
  }
}

async function initPNGSection() {
  const canvas  = document.getElementById('canvas-png');
  const loading = document.getElementById('load-png');
  const hint    = document.getElementById('png-hint');
  const info    = document.getElementById('png-info');
  if (!canvas) return;

  try {
    const [img0, img1] = await Promise.all([
      loadImg(ASSET('score.png')),
      loadImg(ASSET('png-zoom1.png')),
    ]);

    const containerWidth = canvas.parentElement.clientWidth || 800;
    canvas.width  = Math.min(img0.naturalWidth, containerWidth - 32);
    canvas.height = Math.round(img0.naturalHeight * (canvas.width / img0.naturalWidth));

    if (loading) loading.classList.add('done');

    const SOURCES = [img0, img1];
    const HINTS   = ['clic → ver píxeles', 'clic → vista completa'];
    const INFOS   = [
      'Vista completa · PNG exportado por LilyPond 2.24.4 · haz clic para ampliar',
      'Píxeles del PNG · aliasing en bordes de líneas · haz clic para volver',
    ];

    let state = 0;

    function draw() {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = state === 0;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(SOURCES[state], 0, 0, canvas.width, canvas.height);
      canvas.style.cursor = state === 1 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = HINTS[state];
      if (info) info.textContent = INFOS[state];
    }

    canvas.addEventListener('click', () => { state = (state + 1) % 2; draw(); });
    draw();

  } catch (e) {
    if (loading) loading.textContent = 'Error al cargar la imagen.';
    console.error('PNG section error:', e);
  }
}

function initSVGLayerDemo() {
  const controls = document.getElementById('svg-layer-controls');
  const snip     = document.getElementById('svg-layer-snip');
  if (!controls || !snip) return;

  const LAYERS = [
    { id: 'demo-staff',    label: '① Pentagrama',      code: '<line x1="20" y1="50" x2="200" y2="50"\n  stroke="currentColor" stroke-width="1.2"/>' },
    { id: 'demo-ledger',   label: '② Línea auxiliar',  code: '<line x1="88" y1="34" x2="120" y2="34"\n  stroke="currentColor" stroke-width="1.2"/>' },
    { id: 'demo-notehead', label: '③ Cabeza de nota',  code: '<ellipse cx="103" cy="34" rx="7" ry="5"\n  fill="currentColor"\n  transform="rotate(-15,103,34)"/>' },
    { id: 'demo-stem',     label: '④ Plica',            code: '<line x1="110" y1="30" x2="110" y2="74"\n  stroke="currentColor" stroke-width="1.5"/>' },
    { id: 'demo-ornament', label: '⑤ Pralltriller',    code: '<path d="M83,20 Q89,12 95,20 Q101,12 107,20\n  Q113,12 119,20 Q125,12 127,20"\n  stroke="currentColor" fill="none"\n  stroke-width="1.5"/>' },
  ];

  const visible = new Set(LAYERS.map(l => l.id));

  LAYERS.forEach(({ id, label, code }) => {
    const btn = document.createElement('button');
    btn.className = 'layer-btn on';
    btn.textContent = label;

    btn.addEventListener('click', () => {
      const g = document.getElementById(id);
      if (visible.has(id)) {
        visible.delete(id);
        btn.classList.remove('on');
        if (g) { g.style.opacity = '0.15'; g.style.color = 'var(--text)'; }
      } else {
        visible.add(id);
        btn.classList.add('on');
        if (g) { g.style.opacity = ''; g.style.color = 'var(--text)'; }
      }
    });

    btn.addEventListener('mouseenter', () => {
      const g = document.getElementById(id);
      if (g && visible.has(id)) g.style.color = 'var(--accent)';
      snip.textContent = code;
    });

    btn.addEventListener('mouseleave', () => {
      const g = document.getElementById(id);
      if (g) g.style.color = 'var(--text)';
      snip.textContent = ' ';
    });

    controls.appendChild(btn);
  });
}

async function renderPDF(url, canvasId, loadingId) {
  const loading = document.getElementById(loadingId);
  try {
    const pdf  = await pdfjsLib.getDocument(url).promise;
    const page = await pdf.getPage(1);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const containerWidth = canvas.parentElement.clientWidth || 800;
    const nativeVP = page.getViewport({ scale: 1 });
    const scale = Math.min((containerWidth - 32) / nativeVP.width, 2);
    const viewport = page.getViewport({ scale });

    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    canvas.style.maxWidth = '100%';

    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    if (loading) loading.classList.add('done');
  } catch (e) {
    if (loading) loading.textContent = 'Error al cargar el PDF.';
    console.error('PDF error:', url, e);
  }
}

/* ══════════════════════════════════════════════════════
   SCORE — OpenSheetMusicDisplay
   ══════════════════════════════════════════════════════ */
function initScoreSection() {
  if (typeof opensheetmusicdisplay === 'undefined') return;

  const container = document.getElementById('osmd-container');
  const loading   = document.getElementById('osmd-loading');

  const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(container, {
    autoResize: true,
    drawTitle: false,
    drawSubtitle: false,
    drawComposer: false,
    drawCredits: false,
    backend: 'svg',
  });

  fetch(ASSET('score.musicxml'))
    .then(r => r.text())
    .then(xml => osmd.load(xml))
    .then(() => {
      osmd.render();
      if (loading) loading.style.display = 'none';
      // Invert SVG to suit dark background
      const svg = container.querySelector('svg');
      if (svg) {
        svg.style.filter = 'invert(1) hue-rotate(180deg)';
        svg.style.background = 'transparent';
      }
    })
    .catch(e => {
      if (loading) loading.textContent = 'Error al renderizar la partitura.';
      console.error('OSMD error:', e);
    });
}

/* ══════════════════════════════════════════════════════
   MIDI DATA — hex dump + SMF event parser
   ══════════════════════════════════════════════════════ */
async function initMidiHexDisplay(cfg) {
  const hexEl    = document.getElementById(cfg.hexId);
  const eventsEl = document.getElementById(cfg.eventsId);
  const tabsEl   = cfg.tabsId ? document.getElementById(cfg.tabsId) : null;
  if (!hexEl && !eventsEl) return;

  // Tab switching
  if (tabsEl) {
    tabsEl.addEventListener('click', e => {
      const btn = e.target.closest('.midi-tab');
      if (!btn) return;
      tabsEl.querySelectorAll('.midi-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (hexEl)    hexEl.style.display    = tab === 'hex'    ? '' : 'none';
      if (eventsEl) eventsEl.style.display = tab === 'events' ? '' : 'none';
    });
  }

  let bytes;
  try {
    const res = await fetch(ASSET(cfg.file));
    if (!res.ok) throw new Error(res.status);
    bytes = new Uint8Array(await res.arrayBuffer());
  } catch (e) {
    const msg = '(No disponible; abre con un servidor HTTP o en GitHub Pages)';
    if (hexEl)    hexEl.textContent    = msg;
    if (eventsEl) eventsEl.textContent = msg;
    return;
  }

  // ── Hex dump (xxd-style, per-byte spans for highlighting) ───
  if (hexEl) {
    const COLS  = 16;
    const esc   = c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c] ?? c);
    let html    = '';
    for (let i = 0; i < bytes.length; i += COLS) {
      const chunk = bytes.slice(i, i + COLS);
      html += `${i.toString(16).padStart(8,'0')}:  `;
      for (let j = 0; j < COLS; j++) {
        if (j < chunk.length) {
          html += `<span class="hb" data-o="${i+j}">${chunk[j].toString(16).padStart(2,'0')}</span> `;
        } else {
          html += '   ';
        }
      }
      html += ' ';
      for (let j = 0; j < chunk.length; j++) {
        const b  = chunk[j];
        const ch = (b >= 32 && b < 127) ? esc(String.fromCharCode(b)) : '.';
        html += `<span class="hb" data-o="${i+j}">${ch}</span>`;
      }
      html += '\n';
    }
    hexEl.innerHTML = html;
  }

  // ── Highlight buttons ─────────────────────────────────
  const hlBar = cfg.hlBarId ? document.getElementById(cfg.hlBarId) : null;
  if (hlBar && hexEl) {
    hlBar.addEventListener('click', e => {
      const btn = e.target.closest('.hex-hl-btn');
      if (!btn) return;
      const range = cfg.ranges[btn.dataset.range];
      if (!range) return;
      const { start, end, cls } = range;
      btn.classList.toggle('on');
      const active = btn.classList.contains('on');
      hexEl.querySelectorAll('.hb').forEach(span => {
        const o = +span.dataset.o;
        if (o >= start && o <= end) span.classList.toggle(cls, active);
      });
    });
  }

  // ── SMF event parser ─────────────────────────────────
  if (eventsEl) {
    let pos = 0;
    const out = [];

    function readBytes(n) { const v = bytes.slice(pos, pos + n); pos += n; return v; }
    function readU32()    { const b = readBytes(4); return ((b[0]<<24)|(b[1]<<16)|(b[2]<<8)|b[3]) >>> 0; }
    function readU16()    { const b = readBytes(2); return (b[0]<<8)|b[1]; }
    function readVLQ()    { let v = 0, b; do { b = bytes[pos++]; v = (v<<7)|(b&0x7F); } while (b&0x80); return v; }

    const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const noteName   = n => NOTE_NAMES[n % 12] + (Math.floor(n / 12) - 1);

    try {
      // MThd
      const mthd = String.fromCharCode(...readBytes(4));
      const hLen = readU32();
      const fmt  = readU16();
      const nTrk = readU16();
      const div  = readU16();
      out.push(`${mthd}  len=${hLen}  format=${fmt}  tracks=${nTrk}  division=${div} ticks/beat`);

      for (let t = 0; t < nTrk; t++) {
        const tag  = String.fromCharCode(...readBytes(4));
        const tLen = readU32();
        const tEnd = pos + tLen;
        out.push(`\n${tag}  len=${tLen}  (track ${t})`);

        let tick = 0, running = 0;
        while (pos < tEnd) {
          const delta = readVLQ();
          tick += delta;
          const peek = bytes[pos];

          if (peek === 0xFF) {                         // Meta event
            pos++;
            const mt = bytes[pos++];
            const ml = readVLQ();
            const md = readBytes(ml);
            let desc = '';
            if      (mt === 0x01) desc = `text: "${String.fromCharCode(...md)}"`;
            else if (mt === 0x02) desc = `copyright: "${String.fromCharCode(...md)}"`;
            else if (mt === 0x03) desc = `track_name: "${String.fromCharCode(...md)}"`;
            else if (mt === 0x04) desc = `instrument: "${String.fromCharCode(...md)}"`;
            else if (mt === 0x2F) desc = `end_of_track`;
            else if (mt === 0x51) {
              const µs = (md[0]<<16)|(md[1]<<8)|md[2];
              desc = `set_tempo: ${µs.toLocaleString('es-ES')} µs/beat  →  ${Math.round(60e6/µs)} BPM`;
            }
            else if (mt === 0x58) desc = `time_signature: ${md[0]}/${1<<md[1]}  click=${md[2]}  32nd/beat=${md[3]}`;
            else if (mt === 0x59) {
              const sf = md[0] > 127 ? md[0]-256 : md[0];
              desc = `key_signature: ${sf>=0 ? sf+'#' : Math.abs(sf)+'b'}  ${md[1]?'minor':'major'}`;
            }
            else desc = `meta_0x${mt.toString(16).padStart(2,'0')}  len=${ml}`;
            out.push(`  [${String(tick).padStart(6)}]  ${desc}`);

          } else if (peek === 0xF0 || peek === 0xF7) { // Sysex
            pos++;
            const sl = readVLQ();
            readBytes(sl);
            out.push(`  [${String(tick).padStart(6)}]  sysex  len=${sl}`);

          } else {                                     // MIDI event
            if (peek & 0x80) { running = peek; pos++; }
            const type = running >> 4;
            const ch   = running & 0x0F;
            let desc   = '';
            if      (type===0x9) { const n=bytes[pos++],v=bytes[pos++]; desc=`note_on   ch=${ch}  note=${n} (${noteName(n)})  vel=${v}`; }
            else if (type===0x8) { const n=bytes[pos++],v=bytes[pos++]; desc=`note_off  ch=${ch}  note=${n} (${noteName(n)})  vel=${v}`; }
            else if (type===0xA) { const n=bytes[pos++],p=bytes[pos++]; desc=`aftertouch  ch=${ch}  note=${n}  pres=${p}`; }
            else if (type===0xB) { const c=bytes[pos++],v=bytes[pos++]; desc=`control_change  ch=${ch}  cc=${c}  val=${v}`; }
            else if (type===0xC) { const p=bytes[pos++]; desc=`program_change  ch=${ch}  prog=${p}`; }
            else if (type===0xD) { const p=bytes[pos++]; desc=`channel_pressure  ch=${ch}  pres=${p}`; }
            else if (type===0xE) { const l=bytes[pos++],m=bytes[pos++]; desc=`pitch_bend  ch=${ch}  val=${(m<<7)|l}`; }
            else { pos++; desc=`unknown_0x${running.toString(16)}`; }
            out.push(`  [${String(tick).padStart(6)}]  ${desc}`);
          }
        }
        pos = tEnd; // safety
      }
    } catch (parseErr) {
      out.push(`\n[Error al parsear: ${parseErr.message}]`);
    }
    eventsEl.textContent = out.join('\n');
  }
}

/* ══════════════════════════════════════════════════════
   MSCZ EXPLORER — JSZip + Prism viewer
   ══════════════════════════════════════════════════════ */
async function initMsczExplorer() {
  const explorer = document.getElementById('mscz-explorer');
  if (!explorer || !window.JSZip) return;

  let zip;
  try {
    const res = await fetch(ASSET('score.mscz'));
    if (!res.ok) throw new Error(res.status);
    zip = await JSZip.loadAsync(await res.arrayBuffer());
  } catch { return; }

  const fnameEl  = document.getElementById('mscz-fname');
  const noteEl   = document.getElementById('mscz-note');
  const codePre  = document.getElementById('mscz-code');
  const codeEl   = document.getElementById('mscz-code-inner');
  const imgPanel = document.getElementById('mscz-img');
  const imgEl    = document.getElementById('mscz-img-el');
  const MAX_LINES = 60;

  explorer.addEventListener('click', async e => {
    const item = e.target.closest('.mscz-file');
    if (!item) return;
    explorer.querySelectorAll('.mscz-file').forEach(f => f.classList.remove('active'));
    item.classList.add('active');

    const fname = item.dataset.file;
    const lang  = item.dataset.lang;
    fnameEl.textContent = fname;
    noteEl.textContent  = '';

    const zipFile = zip.file(fname);
    if (!zipFile) return;

    if (lang === 'img') {
      const blob = await zipFile.async('blob');
      imgEl.src = URL.createObjectURL(blob);
      codePre.style.display = 'none';
      imgPanel.style.display = '';
    } else {
      const text = await zipFile.async('string');
      const lines = text.split('\n');
      const noTrunc = 'notrunc' in item.dataset;
      let display = text;
      if (!noTrunc && lines.length > MAX_LINES) {
        display = lines.slice(0, MAX_LINES).join('\n');
        noteEl.textContent = `primeras ${MAX_LINES} de ${lines.length} líneas`;
      }
      const grammar = lang === 'json' ? Prism.languages.json : Prism.languages.markup;
      codeEl.className = `language-${lang === 'json' ? 'json' : 'xml'}`;
      let highlighted = Prism.highlight(display, grammar, lang);

      // Highlight <Note> blocks if requested
      if ('highlightnotes' in item.dataset) {
        const rawLines = display.split('\n');
        const noteRanges = [];
        let start = -1;
        rawLines.forEach((l, i) => {
          if (/<Note[\s>]/.test(l)) start = i;
          if (l.includes('</Note>') && start >= 0) { noteRanges.push([start, i]); start = -1; }
        });
        const hlLines = highlighted.split('\n');
        [...noteRanges].reverse().forEach(([s, e]) => {
          hlLines[s] = `<mark class="xml-note-hl">${hlLines[s]}`;
          hlLines[e] = `${hlLines[e]}</mark>`;
        });
        highlighted = hlLines.join('\n');
        if (noteRanges.length) noteEl.textContent += `  ·  ${noteRanges.length} nota${noteRanges.length > 1 ? 's' : ''} resaltada${noteRanges.length > 1 ? 's' : ''}`;
      }

      codeEl.innerHTML = highlighted;
      codePre.style.display = '';
      imgPanel.style.display = 'none';
    }
  });
}

/* ══════════════════════════════════════════════════════
   MUSICXML VIEWER — semantic category highlighting
   ══════════════════════════════════════════════════════ */
async function initMusicXMLViewer() {
  const codeEl = document.getElementById('code-musicxml');
  const preEl  = document.getElementById('code-pre-musicxml');
  const bar    = document.getElementById('xml-hl-bar');
  if (!codeEl || !preEl || !bar) return;

  let text;
  try {
    const res = await fetch(ASSET('score.musicxml'));
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    codeEl.textContent = '(No disponible en file://; abre con un servidor HTTP)';
    codeEl.style.color = 'var(--text-dim)';
    return;
  }

  const rawLines = text.split('\n');
  const total = rawLines.length;

  // Build per-line category map (0-indexed)
  const CATS = Array(total).fill('otro');
  for (let i = 0; i <= 17; i++) CATS[i] = 'meta';
  [[18,60],[112,120],[218,220],[225,229],[273,275],[280,284],[305,307]].forEach(([s,e]) => {
    for (let i = s; i <= e; i++) CATS[i] = 'apariencia';
  });
  for (let i = 61; i <= 109; i++) CATS[i] = 'instrumentacion';
  [[121,135],[230,244],[285,299]].forEach(([s,e]) => {
    for (let i = s; i <= e; i++) CATS[i] = 'atributos';
  });
  for (let i = 136; i <= 146; i++) CATS[i] = 'indicaciones';
  [[147,217],[245,272],[300,304]].forEach(([s,e]) => {
    for (let i = s; i <= e; i++) CATS[i] = 'notas';
  });

  // Prism-highlight full text → split → wrap per line with data-cat span
  let highlighted;
  if (typeof Prism !== 'undefined') {
    highlighted = Prism.highlight(text, Prism.languages.markup, 'xml');
  } else {
    highlighted = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  const hlLines = highlighted.split('\n');
  const wrapped = hlLines.map((hl, i) => `<span data-cat="${CATS[i] || 'otro'}">${hl}</span>`);
  codeEl.className = 'language-xml';
  codeEl.innerHTML = wrapped.join('\n');

  // Button toggle logic
  const buttons = bar.querySelectorAll('.xml-hl-btn');
  const statsEl = document.getElementById('xml-hl-stats');
  const PCTS = { notas: 33, apariencia: 23, instrumentacion: 16, atributos: 14, meta: 6, indicaciones: 4 };
  const BASE_STATS = 'De las 312 líneas: 33% notas · 63% metadato/apariencia/config';

  const updateStats = () => {
    const active = [...bar.querySelectorAll('.xml-hl-btn.active')];
    if (!statsEl) return;
    if (!active.length) {
      statsEl.textContent = BASE_STATS;
    } else {
      statsEl.textContent = active.map(b => `${b.textContent} ~${PCTS[b.dataset.cat] || 0}%`).join(' · ');
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const isActive = btn.classList.toggle('active');
      const hl = preEl.dataset.hl ? preEl.dataset.hl.split(' ').filter(Boolean) : [];
      if (isActive) { if (!hl.includes(cat)) hl.push(cat); }
      else { const idx = hl.indexOf(cat); if (idx >= 0) hl.splice(idx, 1); }
      preEl.dataset.hl = hl.join(' ');
      updateStats();
    });
  });

  if (statsEl) statsEl.textContent = BASE_STATS;
}

/* ══════════════════════════════════════════════════════
   LILYPOND VIEWER — mordent motif highlight
   ══════════════════════════════════════════════════════ */
async function initLilypondViewer() {
  const codeEl = document.getElementById('code-lilypond');
  const preEl  = document.getElementById('code-pre-lilypond');
  const bar    = document.getElementById('ly-hl-bar');
  if (!codeEl || !preEl || !bar) return;

  let text;
  try {
    const res = await fetch(ASSET('score.ly'));
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    codeEl.textContent = '(No disponible en file://; abre con un servidor HTTP)';
    codeEl.style.color = 'var(--text-dim)';
    return;
  }

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const rawLines = text.split('\n');
  const wrapped = rawLines.map(line => {
    const hasMordent = line.includes('\\mordent\\fermata');
    return `<span${hasMordent ? ' data-motif="mordent"' : ''}>${esc(line)}</span>`;
  });
  codeEl.className = 'language-text';
  codeEl.innerHTML = wrapped.join('\n');

  const btn = bar.querySelector('.xml-hl-btn[data-motif]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isActive = btn.classList.toggle('active');
    preEl.dataset.hl = isActive ? 'mordent' : '';
  });
}

/* ══════════════════════════════════════════════════════
   ABC VIEWER — mordent+fermata note highlight
   ══════════════════════════════════════════════════════ */
async function initAbcViewer() {
  const codeEl = document.getElementById('code-abc');
  const preEl  = document.getElementById('code-pre-abc');
  const bar    = document.getElementById('abc-hl-bar');
  if (!codeEl || !preEl || !bar) return;

  let text;
  try {
    const res = await fetch(ASSET('score.abc'), { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    codeEl.textContent = '(No disponible en file://; abre con un servidor HTTP)';
    codeEl.style.color = 'var(--text-dim)';
    return;
  }

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const rawLines = text.split('\n');
  const wrapped = rawLines.map(line => {
    const hasNote = line.includes('!mordent!!fermata!');
    return `<span${hasNote ? ' data-motif="note"' : ''}>${esc(line)}</span>`;
  });
  codeEl.className = 'language-text';
  codeEl.innerHTML = wrapped.join('\n');

  const btn = bar.querySelector('.xml-hl-btn[data-motif]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isActive = btn.classList.toggle('active');
    preEl.dataset.hl = isActive ? 'note' : '';
  });
}

/* ══════════════════════════════════════════════════════
   MEI VIEWER — note n1 highlight
   ══════════════════════════════════════════════════════ */
async function initMeiViewer() {
  const codeEl = document.getElementById('code-mei');
  const preEl  = document.getElementById('code-pre-mei');
  const bar    = document.getElementById('mei-hl-bar');
  if (!codeEl || !preEl || !bar) return;

  let text;
  try {
    const res = await fetch(ASSET('score.mei'), { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    codeEl.textContent = '(No disponible en file://; abre con un servidor HTTP)';
    codeEl.style.color = 'var(--text-dim)';
    return;
  }

  const rawLines = text.split('\n');
  let highlighted;
  if (typeof Prism !== 'undefined') {
    highlighted = Prism.highlight(text, Prism.languages.markup, 'xml');
  } else {
    highlighted = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  const hlLines = highlighted.split('\n');
  const wrapped = hlLines.map((hl, i) => {
    const hasN1 = rawLines[i] && rawLines[i].includes('<note') && rawLines[i].includes('xml:id="n1"');
    return `<span class="mei-line"${hasN1 ? ' data-motif="n1"' : ''}>${hl}</span>`;
  });
  codeEl.className = 'language-xml';
  codeEl.innerHTML = wrapped.join('\n');

  const btn = bar.querySelector('.xml-hl-btn[data-motif]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isActive = btn.classList.toggle('active');
    preEl.dataset.hl = isActive ? 'n1' : '';
    if (isActive) preEl.querySelector('span[data-motif="n1"]')?.scrollIntoView({behavior:'smooth', block:'center'});
  });
}

/* ══════════════════════════════════════════════════════
   KERN / HUMDRUM VIEWER
   ══════════════════════════════════════════════════════ */
async function initKernViewer() {
  const codeEl = document.getElementById('code-kern');
  const preEl  = document.getElementById('code-pre-kern');
  const bar    = document.getElementById('kern-hl-bar');
  if (!codeEl || !preEl || !bar) return;

  let text;
  try {
    const res = await fetch(ASSET('score.krn'), { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    codeEl.textContent = '(No disponible en file://; abre con un servidor HTTP)';
    codeEl.style.color = 'var(--text-dim)';
    return;
  }

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const rawLines = text.split('\n');
  const wrapped = rawLines.map(line => {
    const hasNote = line.includes('8a;M') && line.includes('8aa;M');
    return `<span${hasNote ? ' data-motif="note"' : ''}>${esc(line)}</span>`;
  });
  codeEl.className = 'language-text';
  codeEl.innerHTML = wrapped.join('\n');

  const btn = bar.querySelector('.xml-hl-btn[data-motif]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isActive = btn.classList.toggle('active');
    preEl.dataset.hl = isActive ? 'note' : '';
    if (isActive) preEl.querySelector('span[data-motif="note"]')?.scrollIntoView({behavior:'smooth', block:'center'});
  });
}

/* ══════════════════════════════════════════════════════
   CODE SECTIONS — fetch + Prism highlight
   ══════════════════════════════════════════════════════ */
function initCodeSections() {
  const sections = [
    { id: 'code-musedata', file: 'score.musedata',  lang: 'text' },
  ];

  sections.forEach(({ id, file, lang }) => {
    const el = document.getElementById(id);
    if (!el) return;

    fetch(ASSET(file))
      .then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(text => {
        el.textContent = text;
        el.className = `language-${lang}`;
        if (typeof Prism !== 'undefined') Prism.highlightElement(el);
      })
      .catch(() => {
        el.textContent = '(No disponible en file://; abre con un servidor HTTP o GitHub Pages)';
        el.style.color = 'var(--text-dim)';
      });
  });
}

/* ══════════════════════════════════════════════════════
   MIDI SECTIONS — html-midi-player custom styling
   ══════════════════════════════════════════════════════ */
function initMidiSections() {
  // html-midi-player is a custom element; it loads lazily.
  // We just ensure the elements are in the DOM (done in HTML).
  // Optionally customize colors via CSS parts when supported.
  const players = document.querySelectorAll('midi-player');
  players.forEach(p => {
    p.addEventListener('load', () => {
      // Player loaded, visualizer will auto-render
    });
  });
}
