document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

/* ---------- Titel: scramble-effect bij laden en hover ---------- */
const scrambleEl = document.querySelector('.scramble');
const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/0123456789';
function scramble(el) {
  if (reduceMotion) return;
  const final = el.dataset.text;
  let frame = 0;
  const total = 28;
  clearInterval(el._timer);
  el._timer = setInterval(() => {
    el.textContent = [...final].map((ch, i) => {
      if (ch === ' ') return ' ';
      return frame / total > i / final.length ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
    }).join('');
    if (++frame > total) { clearInterval(el._timer); el.textContent = final; }
  }, 32);
}
scramble(scrambleEl);
scrambleEl.addEventListener('mouseenter', () => scramble(scrambleEl));

/* ---------- Gloed + hero-kaarten volgen de muis ---------- */
const glow = document.querySelector('.glow');
const stack = document.querySelector('.hero-stack');
if (finePointer && !reduceMotion) {
  window.addEventListener('pointermove', (e) => {
    glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    stack.style.setProperty('--px', px.toFixed(3));
    stack.style.setProperty('--py', py.toFixed(3));
  }, { passive: true });
}

/* ---------- Magnetische knoppen ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      btn.firstElementChild.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
      btn.firstElementChild.style.transform = '';
    });
  });
}

/* ---------- Navigatie: mobiel menu, actieve sectie, glijdende pill ---------- */
const toggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
const pill = navList.querySelector('.nav-pill');
const links = [...navList.querySelectorAll('a')];

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  navList.classList.toggle('open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
navList.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});

function movePill(link) {
  if (!link) { pill.style.opacity = '0'; return; }
  pill.style.opacity = '1';
  pill.style.width = link.offsetWidth + 'px';
  pill.style.transform = `translateX(${link.offsetLeft}px)`;
}

const chapters = document.querySelectorAll('.chapter');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    let current = null;
    links.forEach((link) => {
      const on = link.getAttribute('href') === '#' + entry.target.id;
      if (on) { link.setAttribute('aria-current', 'true'); current = link; }
      else link.removeAttribute('aria-current');
    });
    movePill(current);
  });
}, { rootMargin: '-45% 0px -50% 0px' });
chapters.forEach((c) => activeObserver.observe(c));
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); movePill(null); }
}, { rootMargin: '-45% 0px -50% 0px' }).observe(document.querySelector('.hero'));

/* ---------- Scroll-reveal ---------- */
const revealTargets = document.querySelectorAll('.chapter-body, .demo');
revealTargets.forEach((el) => el.classList.add('reveal'));
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => revealObserver.observe(el));
}

/* ---------- Leesvoortgang ---------- */
const bar = document.querySelector('.progress-bar');
let ticking = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
updateProgress();

/* ---------- Demo 1: batch-verwerking ---------- */
(() => {
  const root = document.getElementById('batch-demo');
  const grid = root.querySelector('.batch-grid');
  const steps = root.querySelectorAll('.action-steps li');
  const count = root.querySelector('[data-batch="count"]');
  const runBtn = root.querySelector('[data-batch="run"]');
  const photos = ['intro', 'beeldbewerking', 'social', 'content-generatie', 'web', 'email'];
  const thumbs = [];
  for (let i = 0; i < 12; i++) {
    const t = document.createElement('div');
    t.className = 'thumb';
    const img = document.createElement('img');
    img.src = `images/${photos[i % photos.length]}.jpg`;
    img.alt = '';
    img.loading = 'lazy';
    img.style.objectPosition = `${(i * 37) % 100}% ${(i * 53) % 100}%`;
    t.appendChild(img);
    grid.appendChild(t);
    thumbs.push(t);
  }
  let running = false;
  function reset() {
    thumbs.forEach((t) => t.classList.remove('done', 'active'));
    steps.forEach((s) => s.classList.remove('on'));
    count.textContent = '0';
  }
  runBtn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    runBtn.disabled = true;
    reset();
    for (let i = 0; i < thumbs.length; i++) {
      thumbs[i].classList.add('active');
      for (const s of steps) { s.classList.add('on'); await wait(45); }
      thumbs[i].classList.replace('active', 'done');
      steps.forEach((s) => s.classList.remove('on'));
      count.textContent = String(i + 1);
    }
    runBtn.disabled = false;
    running = false;
  });
  root.querySelector('[data-batch="reset"]').addEventListener('click', () => { if (!running) reset(); });
})();

/* ---------- Demo 2: bulk create ---------- */
(() => {
  const root = document.getElementById('bulk-demo');
  const formats = root.querySelector('.formats');
  const fields = { title: '#f-title', tag: '#f-tag', cta: '#f-cta' };
  function render(pop) {
    Object.entries(fields).forEach(([key, sel]) => {
      const value = root.querySelector(sel).value || '…';
      formats.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => { el.textContent = value; });
    });
    if (pop) formats.querySelectorAll('.fmt-inner').forEach((el) => {
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    });
  }
  Object.values(fields).forEach((sel) => root.querySelector(sel).addEventListener('input', () => render(false)));
  const swatches = root.querySelectorAll('.themes button');
  swatches.forEach((sw) => sw.addEventListener('click', () => {
    swatches.forEach((s) => s.setAttribute('aria-checked', String(s === sw)));
    formats.dataset.theme = sw.dataset.theme;
    render(true);
  }));
  // Pijltjestoetsen binnen de radiogroep
  root.querySelector('.themes').addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const list = [...swatches];
    const i = list.findIndex((s) => s.getAttribute('aria-checked') === 'true');
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
    next.click(); next.focus();
  });
  render(false);
})();

/* ---------- Demo 3: prompt bouwen ---------- */
(() => {
  const root = document.getElementById('prompt-demo');
  const text = root.querySelector('[data-prompt="text"]');
  const img = root.querySelector('[data-prompt="img"]');
  const frame = root.querySelector('.gen-frame');
  const status = root.querySelector('[data-prompt="status"]');
  const goBtn = root.querySelector('[data-prompt="go"]');
  const base = 'een bloem tussen zwevende bellen';
  const filters = {
    neon: 'saturate(2.2) hue-rotate(40deg) contrast(1.1)',
    pastel: 'saturate(.55) brightness(1.25) contrast(.85)',
    'zwart-wit': 'grayscale(1) contrast(1.2)',
    warm: 'sepia(.45) saturate(1.4) hue-rotate(-12deg)',
    contrast: 'contrast(1.6) brightness(.9)',
  };
  const chips = [...root.querySelectorAll('.style-chips button')];
  function selected() { return chips.filter((c) => c.getAttribute('aria-pressed') === 'true'); }
  function updatePrompt() {
    const extra = selected().map((c) => c.textContent);
    text.innerHTML = '';
    text.append(base);
    if (extra.length) {
      const span = document.createElement('span');
      span.className = 'add';
      span.textContent = ', ' + extra.join(', ');
      text.append(span);
    }
  }
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
    updatePrompt();
    status.textContent = 'Klik op Genereer.';
  }));
  goBtn.addEventListener('click', async () => {
    goBtn.disabled = true;
    status.textContent = 'Bezig met genereren…';
    frame.classList.add('loading');
    await wait(1100);
    img.style.filter = selected().map((c) => filters[c.dataset.style]).join(' ') || 'none';
    frame.classList.remove('loading');
    const n = selected().length;
    status.textContent = n ? `Klaar: ${n} stijl${n > 1 ? 'en' : ''} toegepast.` : 'Klaar: zonder extra stijl.';
    goBtn.disabled = false;
  });
})();

/* ---------- Demo 4: website bouwen met een prompt ---------- */
(() => {
  const root = document.getElementById('code-demo');
  const out = root.querySelector('[data-code="out"]');
  const status = root.querySelector('[data-code="status"]');
  const goBtn = root.querySelector('[data-code="go"]');
  const parts = root.querySelectorAll('.mini-site [data-step]');
  const lines = [
    { step: 1, html: '<span class="t">&lt;nav&gt;</span>menu<span class="t">&lt;/nav&gt;</span>' },
    { step: 2, html: '<span class="t">&lt;header</span> <span class="a">class="hero"</span><span class="t">&gt;</span>' },
    { step: 2, html: '  <span class="t">&lt;h1&gt;</span>Nova<span class="t">&lt;/h1&gt;</span>' },
    { step: 3, html: '<span class="t">&lt;section</span> <span class="a">class="grid"</span><span class="t">&gt;</span>' },
    { step: 4, html: '<span class="t">&lt;a</span> <span class="a">class="btn"</span><span class="t">&gt;</span>Shop nu<span class="t">&lt;/a&gt;</span>' },
  ];
  goBtn.addEventListener('click', async () => {
    goBtn.disabled = true;
    out.innerHTML = '';
    parts.forEach((p) => p.classList.remove('shown'));
    status.textContent = 'Claude schrijft code…';
    for (const line of lines) {
      await wait(420);
      out.insertAdjacentHTML('beforeend', line.html + '\n');
      parts.forEach((p) => { if (Number(p.dataset.step) <= line.step) p.classList.add('shown'); });
    }
    out.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
    status.textContent = 'Klaar: je pagina staat er.';
    goBtn.disabled = false;
  });
})();

/* ---------- Demo 5: welkomstflow ---------- */
(() => {
  const root = document.getElementById('flow-demo');
  const steps = root.querySelectorAll('.flow-steps li');
  const countEl = root.querySelector('[data-flow="count"]');
  const mailsEl = root.querySelector('[data-flow="mails"]');
  const goBtn = root.querySelector('[data-flow="go"]');
  let subs = 0, mails = 0;
  goBtn.addEventListener('click', async () => {
    goBtn.disabled = true;
    countEl.textContent = String(++subs);
    steps.forEach((s) => s.classList.remove('sent'));
    for (const s of steps) {
      await wait(650);
      s.classList.add('sent');
      mailsEl.textContent = String(++mails);
    }
    goBtn.disabled = false;
  });
})();
