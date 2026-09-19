/* ═══════════════════════════════════════════════════════
   BWV 565 · Musical Representations · app.js
   ═══════════════════════════════════════════════════════ */

'use strict';

const ASSET = path => `./assets/bwv565/${path}`;

/* ── Boot ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  I18N.applyLang();
  document.getElementById('lang-btn')?.addEventListener('click', () => {
    I18N.setLang(I18N.getLang() === 'es' ? 'en' : 'es');
  });
  initAboutCard();
  initAxis();
  initAxisFilter();
  initStickyPlayer();
  initWaveformSection();
  initSpectrogramSection();
  initCodecSizes();
  initFlacSection();
  initMp3Section();
  initRollSection();
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
   ABOUT CARD
   ══════════════════════════════════════════════════════ */
function initAboutCard() {
  const btn  = document.getElementById('about-btn');
  const card = document.getElementById('about-card');
  if (!btn || !card) return;
  btn.addEventListener('click', () => {
    const open = card.hasAttribute('hidden');
    if (open) {
      card.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      card.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ══════════════════════════════════════════════════════
   AXIS FILTER — category buttons highlight/show dot labels
   ══════════════════════════════════════════════════════ */
function initAxisFilter() {
  const axis = document.getElementById('axis');
  const btns = document.querySelectorAll('.cat-filter-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');

      const active = [...btns]
        .filter(b => b.classList.contains('active'))
        .map(b => b.dataset.filter);

      if (active.length > 0) {
        axis.dataset.filter = active.join(' ');
      } else {
        delete axis.dataset.filter;
      }
    });
  });
}

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
  wsMain.on('ready', () => { timeTotal.textContent = fmt(wsMain.getDuration()); });

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }
}

/* ══════════════════════════════════════════════════════
   WAV LOADER — reads the PCM integers straight from the file.
   decodeAudioData would resample to the device rate (often
   48 kHz), so the stored samples are parsed by hand instead.
   ══════════════════════════════════════════════════════ */
const bytesCache = {};
let wavPromise = null;

function loadBytes(file) {
  if (!bytesCache[file]) {
    bytesCache[file] = fetch(ASSET(file))
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
  }
  return bytesCache[file];
}

function loadWav() {
  if (!wavPromise) wavPromise = loadBytes('audio.wav').then(parseWav);
  return wavPromise;
}

function parseWav(buf) {
  const v   = new DataView(buf);
  const tag = o => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('not a WAV file');

  let pos = 12, fmt = null;
  while (pos + 8 <= buf.byteLength) {
    const id = tag(pos), size = v.getUint32(pos + 4, true), body = pos + 8;
    if (id === 'fmt ') {
      fmt = {
        format:     v.getUint16(body, true),
        channels:   v.getUint16(body + 2, true),
        sampleRate: v.getUint32(body + 4, true),
        bits:       v.getUint16(body + 14, true),
      };
    } else if (id === 'data') {
      if (!fmt || (fmt.format !== 1 && fmt.format !== 0xFFFE) || fmt.bits !== 16)
        throw new Error('only 16-bit PCM is supported');
      const frames   = Math.floor(size / (2 * fmt.channels));
      const channels = Array.from({ length: fmt.channels }, () => new Int16Array(frames));
      for (let i = 0; i < frames; i++)
        for (let c = 0; c < fmt.channels; c++)
          channels[c][i] = v.getInt16(body + (i * fmt.channels + c) * 2, true);
      return { sampleRate: fmt.sampleRate, channels, frames };
    }
    pos = body + size + (size & 1);
  }
  throw new Error('no data chunk');
}

/* ══════════════════════════════════════════════════════
   WAVEFORM SECTION — Exact sample viewer with zoom
   ══════════════════════════════════════════════════════ */
function initWaveformSection() {
  const canvas = document.getElementById('waveform-exact');
  if (!canvas) return;

  let samples = null, pcm = null, totalN = 0, sampleRate = 44100;
  let visible = 0, offset = 0, yZoom = 1.0;
  let cssW = 800, cssH = 220, dpr = 1;

  const loadingEl = document.getElementById('wf-loading');

  loadWav()
    .then(wav => {
      pcm        = wav.channels[0];                       // left channel, raw integers
      samples    = Float32Array.from(pcm, v => v / 32768); // normalized −1…+1
      totalN     = samples.length;
      sampleRate = wav.sampleRate;
      visible    = totalN;
      offset     = 0;
      if (loadingEl) loadingEl.style.display = 'none';
      resize();
    })
    .catch(() => { if (loadingEl) loadingEl.textContent = I18N.t('ui.httpOnly'); });

  document.addEventListener('langchange', () => draw());

  /* ── Draw ──────────────────────────────────────── */
  function draw() {
    const W = cssW, H = cssH;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const mode = avis <= THRESH ? I18N.t('wf.sampleMode') : '';
      const loc  = I18N.t('locale');
      el.textContent = `${I18N.t('wf.samples')} ${offset.toLocaleString(loc)}–${(offset + avis - 1).toLocaleString(loc)} · ${t0}s–${t1}s · ${avis.toLocaleString(loc)} ${I18N.t('wf.visible')}${mode}`;
    }
  }

  /* ── Resize ──────────────────────────────────────── */
  function resize() {
    dpr  = window.devicePixelRatio || 1;
    cssW = canvas.parentElement.clientWidth || 800;
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + 'px';
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
    const pivot = Math.max(0, Math.min(1, (e.offsetX - 46) / (cssW - 54)));
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
    const spp = visible / (cssW - 54);
    offset = Math.max(0, Math.min(totalN - visible, Math.round(drag.off - (e.clientX - drag.x) * spp)));
    draw();
  });
  window.addEventListener('mouseup', () => { drag = null; canvas.style.cursor = 'crosshair'; });

  /* ── Hover tooltip ───────────────────────────────── */
  canvas.addEventListener('mousemove', e => {
    if (drag || !samples) return;
    const px = e.offsetX - 46;
    if (px < 0) return;
    const si  = Math.min(totalN - 1, Math.round(offset + (px / (cssW - 54)) * visible));
    const tip = document.getElementById('wf-tooltip');
    if (tip) tip.textContent = `#${si.toLocaleString(I18N.t('locale'))} · t = ${(si / sampleRate).toFixed(5)} s · amp = ${samples[si].toFixed(5)} · PCM = ${pcm[si]}`;
  });
}

/* ── Radix-2 Cooley-Tukey FFT (in-place) ─────────────── */
function fftInPlace(re, im) {
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

/* ══════════════════════════════════════════════════════
   SPECTROGRAM SECTION — STFT canvas renderer with zoom
   ══════════════════════════════════════════════════════ */
function initSpectrogramSection() {
  const canvas = document.getElementById('spectrogram-exact');
  if (!canvas) return;

  const FFT_SIZE = 2048, HOP = 512;
  const N_BINS = FFT_SIZE >> 1;           // 1024 bins
  let SR = 44100;                         // taken from the WAV header on load
  let HZ_PER_BIN = SR / FFT_SIZE;         // ≈ 21.53 Hz/bin

  let spec = null, nFrames = 0;
  let visFrames = 0, frameOffset = 0;
  let visBins = Math.round(6000 / HZ_PER_BIN); // default: 0–6000 Hz
  let binOffset = 0;
  let dbMin = -80, dbMax = 0;
  let cssW = 800, cssH = 240, dpr = 1;

  const loadingEl = document.getElementById('spec-loading');

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
      fftInPlace(re, im);
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
  loadWav()
    .then(wav => {
      SR         = wav.sampleRate;
      HZ_PER_BIN = SR / FFT_SIZE;
      const samples = Float32Array.from(wav.channels[0], v => v / 32768);
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
      if (loadingEl) loadingEl.textContent = I18N.t('ui.httpOnly');
    });

  document.addEventListener('langchange', () => draw());

  /* ── Draw ──────────────────────────────────────── */
  function draw() {
    const W = cssW, H = cssH;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    // Render spectrogram pixels via ImageData, at device resolution
    // (putImageData ignores the context transform)
    const dw = Math.round(pw * dpr), dh = Math.round(ph * dpr);
    const imgData = ctx.createImageData(dw, dh);
    const data    = imgData.data;
    for (let py = 0; py < dh; py++) {
      const b = binOffset + Math.floor((dh - 1 - py) / dh * avisB);
      for (let px = 0; px < dw; px++) {
        const f  = frameOffset + Math.floor(px / dw * avisF);
        const db = (f < nFrames && b < N_BINS) ? spec[f][b] : dbMin;
        const t  = Math.max(0, Math.min(1, (db - dbMin) / (dbMax - dbMin)));
        const [r, g, bv] = heatColor(t);
        const idx = (py * dw + px) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = bv; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, Math.round(PL * dpr), Math.round(PT * dpr));

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
      `${tMin.toFixed(3)}s–${tMax.toFixed(3)}s · ${Math.round(fMin)}–${Math.round(fMax)} Hz · ${avisF} ${I18N.t('spec.frames')}`;
  }

  /* ── Resize ──────────────────────────────────────── */
  function resize() {
    dpr  = window.devicePixelRatio || 1;
    cssW = canvas.parentElement.clientWidth || 800;
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + 'px';
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
    const pivot = Math.max(0, Math.min(1, (e.offsetX - 50) / (cssW - 58)));
    setTimeZoom(visFrames * (e.deltaY > 0 ? 3 : 1 / 3), pivot);
  }, { passive: false });

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
    const fpp = visFrames / (cssW - 58);
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
    const pw = cssW - 58;
    const ph = cssH - 30;
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
   AUDIO CODECS — sizes, FLAC bit-exact check, MP3 spectrum
   ══════════════════════════════════════════════════════ */

// An OfflineAudioContext at the files' own rate decodes without resampling
function decodeAt44k(buf) {
  return new OfflineAudioContext(2, 1, 44100).decodeAudioData(buf.slice(0));
}

const fmtNum = (v, digits = 0) =>
  v.toLocaleString(I18N.t('locale'), { minimumFractionDigits: digits, maximumFractionDigits: digits });

async function initCodecSizes() {
  const boxes = document.querySelectorAll('.codec-sizes');
  if (!boxes.length) return;
  const FILES = [['WAV', 'audio.wav'], ['FLAC', 'audio.flac'], ['MP3', 'audio.mp3']];
  let sizes;
  try {
    sizes = await Promise.all(FILES.map(([, f]) => loadBytes(f).then(b => b.byteLength)));
  } catch { return; }

  const render = () => boxes.forEach(box => {
    box.innerHTML = FILES.map(([label], i) => {
      const pct = sizes[i] / sizes[0] * 100;
      const cur = label.toLowerCase() === box.dataset.highlight ? ' is-current' : '';
      const rel = i ? ` · ${fmtNum(pct, 1)} % ${I18N.t('codec.size.of')}` : '';
      return `<div class="codec-size-row${cur}">
        <span class="codec-size-label">${label}</span>
        <span class="codec-size-track"><span class="codec-size-bar" style="width:${pct}%"></span></span>
        <span class="codec-size-val">${fmtNum(sizes[i])} B${rel}</span>
      </div>`;
    }).join('');
  });
  render();
  document.addEventListener('langchange', render);
}

async function initFlacSection() {
  const el = document.getElementById('flac-check');
  if (!el) return;
  let result;
  try {
    const [wav, buf] = await Promise.all([loadWav(), loadBytes('audio.flac')]);
    const ab = await decodeAt44k(buf);
    let same = 0, max = 0;
    const total = wav.frames * wav.channels.length;
    wav.channels.forEach((ref, c) => {
      const dec = ab.getChannelData(Math.min(c, ab.numberOfChannels - 1));
      const n = Math.min(ref.length, dec.length);
      for (let i = 0; i < n; i++) {
        const d = Math.abs(Math.round(dec[i] * 32768) - ref[i]);
        if (d === 0) same++;
        if (d > max) max = d;
      }
    });
    result = { same, total, max };
  } catch (e) {
    console.error('FLAC check error:', e);
    result = null;
  }
  const render = () => {
    if (!result) { el.textContent = I18N.t('codec.check.fail'); return; }
    const ok = result.same === result.total;
    el.textContent = I18N.t(ok ? 'codec.flac.ok' : 'codec.flac.diff',
      { same: fmtNum(result.same), total: fmtNum(result.total), max: fmtNum(result.max) });
    el.classList.toggle('is-ok', ok);
  };
  render();
  document.addEventListener('langchange', render);
}

async function initMp3Section() {
  const canvas = document.getElementById('mp3-spectrum');
  const info   = document.getElementById('mp3-info');
  const tip    = document.getElementById('mp3-tooltip');
  if (!canvas) return;

  const N = 4096, HOP = 2048, SR = 44100;
  let specWav = null, specMp3 = null, stats = null;
  let cssW = 800, dpr = 1;
  const cssH = 220, PL = 46, PR = 10, PT = 10, PB = 24;
  const DB_MIN = -110, F_MAX = SR / 2;

  function avgSpectrum(x) {
    const hann = new Float64Array(N).map((_, i) => 0.5 * (1 - Math.cos(2 * Math.PI * i / (N - 1))));
    const acc = new Float64Array(N / 2 + 1);
    const re = new Float64Array(N), im = new Float64Array(N);
    let frames = 0;
    for (let start = 0; start + N <= x.length; start += HOP, frames++) {
      for (let i = 0; i < N; i++) { re[i] = x[start + i] * hann[i]; im[i] = 0; }
      fftInPlace(re, im);
      for (let b = 0; b <= N / 2; b++) acc[b] += re[b] * re[b] + im[b] * im[b];
    }
    return Array.from(acc, v => 10 * Math.log10(v / Math.max(1, frames) + 1e-12));
  }

  try {
    const [wav, buf] = await Promise.all([loadWav(), loadBytes('audio.mp3')]);
    const ab   = await decodeAt44k(buf);
    const ref  = wav.channels[0];
    const dec  = ab.getChannelData(0);
    const refF = Float32Array.from(ref, v => v / 32768);

    // Align: decoders may keep the encoder delay; find the lag that best matches
    const W = 16384, from = 4096;
    let lag = 0, best = -Infinity;
    for (let k = 0; k <= 3000 && from + k + W <= dec.length; k++) {
      let dot = 0;
      for (let i = 0; i < W; i++) dot += refF[from + i] * dec[from + k + i];
      if (dot > best) { best = dot; lag = k; }
    }
    const n = Math.min(ref.length, dec.length - lag);
    let same = 0, max = 0;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(Math.round(dec[i + lag] * 32768) - ref[i]);
      if (d === 0) same++;
      if (d > max) max = d;
    }

    specWav = avgSpectrum(refF.subarray(0, n));
    specMp3 = avgSpectrum(dec.subarray(lag, lag + n));
    const top = Math.max(...specWav);
    specWav = specWav.map(v => v - top);
    specMp3 = specMp3.map(v => v - top);

    // Cutoff: lowest frequency above which the MP3 stays ≥ 10 dB under the WAV
    const smooth = a => a.map((_, i) => {
      let sum = 0, c = 0;
      for (let j = Math.max(0, i - 4); j <= Math.min(a.length - 1, i + 4); j++) { sum += a[j]; c++; }
      return sum / c;
    });
    const sw = smooth(specWav), sm = smooth(specMp3);
    const hz = b => b * SR / N;
    let cut = null;
    for (let b = Math.round(5000 / (SR / N)); b < sw.length; b++) {
      let ok = true;
      for (let k = b; k < sw.length && hz(k) <= 20000; k++) if (sm[k] > sw[k] - 10) { ok = false; break; }
      if (ok) { cut = hz(b); break; }
    }
    stats = { same: same / n * 100, max, cut };
  } catch (e) {
    console.error('MP3 section error:', e);
    if (info) info.textContent = I18N.t('codec.check.fail');
    return;
  }

  const xOf = f => PL + f / F_MAX * (cssW - PL - PR);
  const yOf = db => PT + (Math.max(DB_MIN, Math.min(0, db)) / DB_MIN) * (cssH - PT - PB);

  function draw() {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.font = '10px "JetBrains Mono", monospace';

    for (let db = 0; db >= DB_MIN; db -= 20) {
      const y = yOf(db);
      ctx.strokeStyle = '#191b2e'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(cssW - PR, y); ctx.stroke();
      ctx.fillStyle = '#6870a0'; ctx.textAlign = 'right';
      ctx.fillText(`${db}`, PL - 6, y + 3.5);
    }
    ctx.textAlign = 'center';
    for (let f = 0; f <= 22000; f += 2000) {
      ctx.fillStyle = '#6870a0';
      ctx.fillText(f ? `${f / 1000}k` : '0', xOf(f), cssH - 8);
    }

    if (stats.cut) {
      const x = xOf(stats.cut);
      ctx.fillStyle = 'rgba(249,115,22,0.08)';
      ctx.fillRect(x, PT, cssW - PR - x, cssH - PT - PB);
      ctx.strokeStyle = 'rgba(249,115,22,0.6)'; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(x, PT); ctx.lineTo(x, cssH - PB); ctx.stroke();
      ctx.setLineDash([]);
    }

    const line = (spec, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
      ctx.beginPath();
      spec.forEach((db, b) => { const x = xOf(b * SR / N), y = yOf(db); b ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    };
    line(specWav, '#60a5fa');
    line(specMp3, '#f97316');

    ctx.textAlign = 'left';
    [['WAV', '#60a5fa'], ['MP3', '#f97316']].forEach(([label, color], i) => {
      const x = cssW - PR - 110 + i * 56, y = PT + 12;
      ctx.fillStyle = color; ctx.fillRect(x, y - 4, 14, 3);
      ctx.fillStyle = '#c8cbe0'; ctx.fillText(label, x + 19, y);
    });
    ctx.fillStyle = '#6870a0';
    ctx.fillText('dB', 6, PT + 8);

    if (info) info.textContent = I18N.t('codec.mp3.info', {
      cut: stats.cut ? fmtNum(stats.cut / 1000, 1) : '—',
      same: fmtNum(stats.same, 1),
      max: fmtNum(stats.max),
    });
  }

  function resize() {
    dpr  = window.devicePixelRatio || 1;
    cssW = canvas.parentElement.clientWidth || 800;
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + 'px';
    draw();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  document.addEventListener('langchange', draw);

  canvas.addEventListener('mousemove', e => {
    const f = (e.offsetX - PL) / (cssW - PL - PR) * F_MAX;
    if (f < 0 || f > F_MAX || !tip) return;
    const b = Math.round(f / (SR / N));
    tip.textContent = I18N.t('codec.mp3.tip', {
      f: fmtNum(b * SR / N), a: fmtNum(specWav[b], 1), b: fmtNum(specMp3[b], 1),
    });
  });
}

/* ══════════════════════════════════════════════════════
   PLAYER-PIANO ROLL — the interpreted MIDI punched into a
   standard 88-note roll, moving over the tracker bar
   ══════════════════════════════════════════════════════ */

function parseMidiNotes(bytes) {
  let pos = 0, tempo = 500000;
  const u16 = p => (bytes[p] << 8) | bytes[p + 1];
  const u32 = p => ((bytes[p] << 24) | (bytes[p + 1] << 16) | (bytes[p + 2] << 8) | bytes[p + 3]) >>> 0;
  const vlq = () => { let v = 0, b; do { b = bytes[pos++]; v = (v << 7) | (b & 0x7F); } while (b & 0x80); return v; };
  const nTracks = u16(10), tpq = u16(12);
  const raw = [];
  pos = 14;
  for (let t = 0; t < nTracks; t++) {
    const end = pos + 8 + u32(pos + 4);
    pos += 8;
    let tick = 0, status = 0;
    const open = {};
    while (pos < end) {
      tick += vlq();
      if (bytes[pos] === 0xFF) {
        const type = bytes[pos + 1]; pos += 2;
        const len = vlq();
        if (type === 0x51) tempo = (bytes[pos] << 16) | (bytes[pos + 1] << 8) | bytes[pos + 2];
        pos += len;
        continue;
      }
      if (bytes[pos] === 0xF0 || bytes[pos] === 0xF7) { pos++; pos += vlq(); continue; }
      if (bytes[pos] & 0x80) status = bytes[pos++];
      const kind = status >> 4;
      const a = bytes[pos++], b = (kind === 0xC || kind === 0xD) ? 0 : bytes[pos++];
      if (kind === 0x9 && b > 0) open[a] = { tick, vel: b };
      else if ((kind === 0x8 || kind === 0x9) && open[a]) {
        raw.push({ note: a, vel: open[a].vel, startTick: open[a].tick, endTick: tick });
        delete open[a];
      }
    }
    pos = end;
  }
  const sec = tempo / 1e6 / tpq;   // single tempo: enough for these files
  return raw.map(n => ({ ...n, start: n.startTick * sec, end: n.endTick * sec }));
}

async function initRollSection() {
  const canvas = document.getElementById('roll-canvas');
  const info   = document.getElementById('roll-info');
  const tip    = document.getElementById('roll-tooltip');
  const btn    = document.getElementById('roll-scale');
  const player = document.getElementById('midi-player-roll');
  if (!canvas) return;

  let notes;
  try {
    notes = parseMidiNotes(new Uint8Array(await loadBytes('midi-interpreted.mid')));
  } catch (e) {
    if (info) info.textContent = I18N.t('ui.noHTTPMIDI');
    return;
  }

  const INCH = 25.4, PITCH_MM = INCH / 9, SPEED_MM = 7 * 12 * INCH / 60;   // tempo 70
  const REST_T = -0.35;
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const nameOf = n => NAMES[n % 12] + (Math.floor(n / 12) - 1);
  const used = [...new Set(notes.map(n => n.note))];

  let cssW = 800, dpr = 1, zoom = 8, t = REST_T, raf = 0;
  const cssH = 400, PL = 40, PR = 8, PT = 8, PB = 8;

  const geom = () => {
    const ph = cssH - PT - PB, row = ph / 88;
    const pxPerMm = row / PITCH_MM;
    const barX = PL + (cssW - PL - PR) * 0.3;
    return { ph, row, pxPerMm, pps: SPEED_MM * pxPerMm * zoom, barX };
  };
  const rowY = (note, g) => PT + (108 - note + 0.5) * g.row;   // C8 at the top, A0 at the bottom
  const holeRect = (n, g) => ({
    x: g.barX + (n.start - t) * g.pps,
    w: Math.max(1, (n.end - n.start) * g.pps),
    y: rowY(n.note, g) - g.row * 0.35,
    h: g.row * 0.7,
  });

  function draw() {
    const g = geom();
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#e4e2dc';
    ctx.fillRect(0, 0, cssW, cssH);

    // Paper
    const paperX = PL, paperW = cssW - PL - PR;
    ctx.fillStyle = '#efe6cf';
    ctx.fillRect(paperX, PT - 4, paperW, g.ph + 8);

    // Guides and labels: every C, plus the notes actually used
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    for (let n = 24; n <= 108; n += 12) {
      const y = rowY(n, g);
      ctx.strokeStyle = '#ddd2b4'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(paperX, y); ctx.lineTo(paperX + paperW, y); ctx.stroke();
      if (used.every(u => Math.abs(rowY(u, g) - y) > 10)) {
        ctx.fillStyle = '#999'; ctx.fillText(nameOf(n), PL - 5, y + 3);
      }
    }
    const active = new Set(notes.filter(n => t >= n.start && t < n.end).map(n => n.note));
    used.forEach(u => {
      ctx.fillStyle = active.has(u) ? '#CC2200' : '#1a8a3e';
      ctx.fillText(nameOf(u), PL - 5, rowY(u, g) + 3);
    });

    // Perforations
    ctx.save();
    ctx.beginPath(); ctx.rect(paperX, PT - 4, paperW, g.ph + 8); ctx.clip();
    ctx.fillStyle = '#2a2418';
    notes.forEach(n => {
      const r = holeRect(n, g);
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(r.x, r.y, r.w, r.h, r.h / 2) : ctx.rect(r.x, r.y, r.w, r.h);
      ctx.fill();
    });
    ctx.restore();

    // Tracker bar with its 88 holes; lit where a perforation lets the air in
    ctx.fillStyle = 'rgba(176,141,62,0.92)';
    ctx.fillRect(g.barX - 5, PT - 6, 10, g.ph + 12);
    for (let n = 21; n <= 108; n++) {
      const y = rowY(n, g), on = active.has(n);
      ctx.fillStyle = on ? '#CC2200' : '#3a2e14';
      const h = Math.max(1, g.row * (on ? 0.8 : 0.45));
      ctx.fillRect(g.barX - (on ? 3 : 1.5), y - h / 2, on ? 6 : 3, h);
    }

    // 1 cm of paper, as a scale reference
    const cm = 10 * g.pxPerMm * zoom, sx = paperX + paperW - cm - 12, sy = PT + g.ph - 6;
    ctx.strokeStyle = '#6b5a3a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + cm, sy);
    ctx.moveTo(sx, sy - 3); ctx.lineTo(sx, sy + 3); ctx.moveTo(sx + cm, sy - 3); ctx.lineTo(sx + cm, sy + 3);
    ctx.stroke();
    ctx.fillStyle = '#6b5a3a'; ctx.textAlign = 'center';
    ctx.fillText('1 cm', sx + cm / 2, sy - 5);

    if (info) info.textContent = I18N.t('roll.info', { scale: I18N.t(zoom === 1 ? 'roll.info.real' : 'roll.info.zoom') });
  }

  function resize() {
    dpr  = window.devicePixelRatio || 1;
    cssW = canvas.parentElement.clientWidth || 800;
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + 'px';
    draw();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  document.addEventListener('langchange', () => { updateBtn(); draw(); });

  // Follow the MIDI player. Its currentTime is only refreshed now and then,
  // so the paper runs on its own clock, re-synced at every note it plays.
  let clockStart = 0, clockOffset = 0;
  const syncClock = time => { clockOffset = time; clockStart = performance.now(); };
  function follow() {
    if (!player || !player.playing) { t = REST_T; draw(); raf = 0; return; }
    t = clockOffset + (performance.now() - clockStart) / 1000;
    draw();
    raf = requestAnimationFrame(follow);
  }
  player?.addEventListener('start', () => {
    syncClock(player.currentTime || 0);
    if (!raf) raf = requestAnimationFrame(follow);
  });
  player?.addEventListener('note', e => {
    const start = e.detail?.note?.startTime;
    if (typeof start === 'number') syncClock(start);
  });
  player?.addEventListener('stop', () => { if (!raf) { t = REST_T; draw(); } });

  function updateBtn() {
    if (!btn) return;
    btn.textContent = I18N.t(zoom === 8 ? 'roll.scale.real' : 'roll.scale.zoom');
    btn.setAttribute('aria-pressed', String(zoom === 1));
  }
  btn?.addEventListener('click', () => { zoom = zoom === 8 ? 1 : 8; updateBtn(); draw(); });
  updateBtn();

  canvas.addEventListener('mousemove', e => {
    if (!tip) return;
    const g = geom();
    const hit = notes.find(n => {
      const r = holeRect(n, g);
      return e.offsetX >= r.x - 2 && e.offsetX <= r.x + r.w + 2 && e.offsetY >= r.y - 2 && e.offsetY <= r.y + r.h + 2;
    });
    tip.textContent = hit ? I18N.t('roll.tip', {
      note: nameOf(hit.note), midi: hit.note, hole: hit.note - 20,
      start: fmtNum(hit.start * 1000), end: fmtNum(hit.end * 1000),
      mm: fmtNum((hit.end - hit.start) * SPEED_MM, 1), vel: hit.vel,
    }) : '';
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
    const dpr  = window.devicePixelRatio || 1;
    const containerWidth = canvas.parentElement.clientWidth || 800;
    const nativeVP = page.getViewport({ scale: 1 });
    const scale = Math.min((containerWidth - 32) / nativeVP.width, 2);
    const cssW  = Math.round(nativeVP.width * scale);
    const viewport = page.getViewport({ scale: scale * dpr });

    // Render PDF to offscreen canvas
    const off = document.createElement('canvas');
    off.width  = viewport.width;
    off.height = viewport.height;
    await page.render({ canvasContext: off.getContext('2d'), viewport }).promise;

    if (loading) loading.classList.add('done');

    const SOURCES    = [off, img1, img2];
    const HINT_KEYS  = ['scan.hint0', 'scan.hint1', 'scan.hint2'];
    const INFO_KEYS  = ['scan.info0', 'scan.info1', 'scan.info2'];

    let state = 0;

    function draw() {
      drawKeepingAspect(canvas, SOURCES[state], cssW, dpr, true);
      canvas.style.cursor = state === 2 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = I18N.t(HINT_KEYS[state]);
      if (info) info.textContent = I18N.t(INFO_KEYS[state]);
    }

    canvas.addEventListener('click', () => {
      state = (state + 1) % 3;
      draw();
    });
    document.addEventListener('langchange', draw);

    draw();

  } catch (e) {
    if (loading) loading.textContent = I18N.t('ui.errorPDF');
    console.error('Scan section error:', e);
  }
}

/* Draws an image or canvas at a fixed CSS width, sizing the canvas to the
   source's own aspect ratio so that zoom images are never stretched. */
function drawKeepingAspect(canvas, src, cssW, dpr, smooth) {
  const sw = src.naturalWidth  || src.width;
  const sh = src.naturalHeight || src.height;
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssW * dpr * sh / sw);
  canvas.style.width = cssW + 'px';
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = smooth;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
}

async function initVectorSection() {
  const canvas  = document.getElementById('canvas-vector');
  const loading = document.getElementById('load-vector');
  const hint    = document.getElementById('vector-hint');
  const info    = document.getElementById('vector-info');
  if (!canvas) return;

  // Regions of the page in PDF points (origin top-left):
  // full page · opening bar · mordent glyph. Every level is rendered
  // from the PDF itself, so the zoom is genuinely vector.
  const VIEWS = [
    null,
    { x: 70,  y: 58,   w: 120, h: 95   },
    { x: 114, y: 88.5, w: 21,  h: 14.7 },
  ];
  const HINT_KEYS = ['vec.hint0', 'vec.hint1', 'vec.hint2'];
  const INFO_KEYS = ['vec.info0', 'vec.info1', 'vec.info2'];

  try {
    const pdf  = await pdfjsLib.getDocument(ASSET('score-vector.pdf')).promise;
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const dpr  = window.devicePixelRatio || 1;
    const cssW = Math.min((canvas.parentElement.clientWidth || 800) - 32, base.width * 2);

    let state = 0, task = null;

    async function draw() {
      const v     = VIEWS[state] || { x: 0, y: 0, w: base.width, h: base.height };
      const scale = cssW / v.w * dpr;
      const viewport = page.getViewport({ scale, offsetX: -v.x * scale, offsetY: -v.y * scale });

      if (task) task.cancel();
      canvas.width  = Math.round(v.w * scale);
      canvas.height = Math.round(v.h * scale);
      canvas.style.width = cssW + 'px';
      canvas.style.cursor = state === 2 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = I18N.t(HINT_KEYS[state]);
      if (info) info.textContent = I18N.t(INFO_KEYS[state]);

      task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
      try {
        await task.promise;
      } catch (e) {
        if (e?.name !== 'RenderingCancelledException') throw e;
      }
    }

    canvas.addEventListener('click', () => {
      state = (state + 1) % 3;
      draw();
    });
    document.addEventListener('langchange', () => {
      if (hint) hint.textContent = I18N.t(HINT_KEYS[state]);
      if (info) info.textContent = I18N.t(INFO_KEYS[state]);
    });

    await draw();
    if (loading) loading.classList.add('done');

  } catch (e) {
    if (loading) loading.textContent = I18N.t('ui.errorPDF');
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
    const img0 = await loadImg(ASSET('score.png'));

    // Zoom: the real pixels of score.png around the opening mordent
    // (fermata, mordent, notehead), enlarged without smoothing.
    const CROP = { x: 148, y: 113, w: 63, h: 44 };
    const img1 = document.createElement('canvas');
    img1.width  = CROP.w;
    img1.height = CROP.h;
    img1.getContext('2d').drawImage(img0, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, CROP.w, CROP.h);

    const dpr  = window.devicePixelRatio || 1;
    const containerWidth = canvas.parentElement.clientWidth || 800;
    const cssW = Math.min(img0.naturalWidth, containerWidth - 32);

    if (loading) loading.classList.add('done');

    const SOURCES   = [img0, img1];
    const HINT_KEYS = ['png.hint0', 'png.hint1'];
    const INFO_KEYS = ['png.info0', 'png.info1'];

    let state = 0;

    function draw() {
      drawKeepingAspect(canvas, SOURCES[state], cssW, dpr, state === 0);
      canvas.style.cursor = state === 1 ? 'zoom-out' : 'zoom-in';
      if (hint) hint.textContent = I18N.t(HINT_KEYS[state]);
      if (info) info.textContent = I18N.t(INFO_KEYS[state]);
    }

    canvas.addEventListener('click', () => { state = (state + 1) % 2; draw(); });
    document.addEventListener('langchange', draw);
    draw();

  } catch (e) {
    if (loading) loading.textContent = I18N.t('ui.errorImg');
    console.error('PNG section error:', e);
  }
}

function initSVGLayerDemo() {
  const controls = document.getElementById('svg-layer-controls');
  const snip     = document.getElementById('svg-layer-snip');
  if (!controls || !snip) return;

  const LAYERS = [
    { id: 'demo-staff',    i18nKey: 'svg.layer1', code: '<line x1="20" y1="50" x2="200" y2="50"\n  stroke="currentColor" stroke-width="1.2"/>' },
    { id: 'demo-ledger',   i18nKey: 'svg.layer2', code: '<line x1="91" y1="42" x2="115" y2="42"\n  stroke="currentColor" stroke-width="1.2"/>' },
    { id: 'demo-notehead', i18nKey: 'svg.layer3', code: '<ellipse cx="103" cy="42" rx="6" ry="4.4"\n  fill="currentColor"\n  transform="rotate(-20,103,42)"/>' },
    { id: 'demo-stem',     i18nKey: 'svg.layer4', code: '<line x1="97.4" y1="43" x2="97.4" y2="70"\n  stroke="currentColor" stroke-width="1.3"/>\n<!-- corchete de corchea -->\n<path d="M97.4,70 C98.5,63 107,60 107,51"\n  stroke="currentColor" fill="none"/>' },
    { id: 'demo-ornament', i18nKey: 'svg.layer5', code: '<path d="M93,27 L97,21 L101,27 L105,21\n  L109,27 L113,21" stroke="currentColor"\n  fill="none" stroke-width="1.6"/>\n<line x1="103" y1="16" x2="103" y2="32"\n  stroke="currentColor" stroke-width="1.3"/>' },
  ];

  const visible = new Set(LAYERS.map(l => l.id));

  LAYERS.forEach(({ id, i18nKey, code }) => {
    const btn = document.createElement('button');
    btn.className = 'layer-btn on';
    btn.dataset.i18n = i18nKey;
    btn.textContent = I18N.t(i18nKey);

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
    if (loading) loading.textContent = I18N.t('ui.errorPDF');
    console.error('PDF error:', url, e);
  }
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
    const msg = I18N.t('ui.noHTTPMIDI');
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
              desc = `set_tempo: ${µs.toLocaleString(I18N.t('locale'))} µs/beat  →  ${Math.round(60e6/µs)} BPM`;
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
      out.push(`\n[${I18N.t('midi.parseError')}: ${parseErr.message}]`);
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
    const lang  = item.dataset.kind;
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
        noteEl.textContent = `${I18N.t('mscz.lines')} ${MAX_LINES} ${I18N.t('mscz.of')} ${lines.length} ${I18N.t('mscz.linesUnit')}`;
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
        if (noteRanges.length) {
          const pl = noteRanges.length > 1;
          noteEl.textContent += `  ·  ${noteRanges.length} ${I18N.t(pl ? 'mscz.notesHlPl' : 'mscz.notesHl')} ${I18N.t(pl ? 'mscz.notesHlSuffixPl' : 'mscz.notesHlSuffix')}`;
        }
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
    codeEl.textContent = I18N.t('ui.noHTTP');
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

  const updateStats = () => {
    const active = [...bar.querySelectorAll('.xml-hl-btn.active')];
    if (!statsEl) return;
    if (!active.length) {
      statsEl.textContent = I18N.t('xml.stats.base');
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

  updateStats();
  document.addEventListener('langchange', updateStats);
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
    codeEl.textContent = I18N.t('ui.noHTTP');
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
    codeEl.textContent = I18N.t('ui.noHTTP');
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
    codeEl.textContent = I18N.t('ui.noHTTP');
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
    codeEl.textContent = I18N.t('ui.noHTTP');
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
        el.textContent = I18N.t('ui.noHTTPPages');
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
