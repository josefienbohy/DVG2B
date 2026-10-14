document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Hero: één template, veel varianten ---------- */
const palette = ['#3046F0', '#FF4F7B', '#3CCB9A', '#FFC43D', '#F1F2F6', '#14152B'];
const grid = document.querySelector('.variant-grid');
const TILE_COUNT = 16;

function randomPair() {
  const bg = palette[Math.floor(Math.random() * palette.length)];
  let fg;
  do { fg = palette[Math.floor(Math.random() * palette.length)]; } while (fg === bg);
  return { bg, fg };
}

for (let i = 0; i < TILE_COUNT; i++) {
  const tile = document.createElement('div');
  tile.className = 'tile' + (i === 0 ? ' master' : '');
  const { bg, fg } = i === 0 ? { bg: '#F1F2F6', fg: '#3046F0' } : randomPair();
  tile.style.setProperty('--bg', bg);
  tile.style.setProperty('--fg', fg);
  tile.style.setProperty('--i', i);
  grid.appendChild(tile);
}

const status = document.getElementById('shuffle-status');
document.querySelector('.shuffle').addEventListener('click', () => {
  grid.querySelectorAll('.tile:not(.master)').forEach((tile) => {
    const { bg, fg } = randomPair();
    tile.classList.remove('swap');
    void tile.offsetWidth; // herstart de animatie
    tile.style.setProperty('--bg', bg);
    tile.style.setProperty('--fg', fg);
    tile.classList.add('swap');
  });
  status.textContent = `${TILE_COUNT - 1} nieuwe varianten gegenereerd.`;
});

/* ---------- Mobiel menu ---------- */
const toggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  navList.classList.toggle('open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
navList.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

/* ---------- Actieve sectie in de navigatie ---------- */
const links = [...navList.querySelectorAll('a')];
const chapters = document.querySelectorAll('.chapter');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => {
      if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
chapters.forEach((c) => activeObserver.observe(c));

/* ---------- Scroll-reveal ---------- */
const revealTargets = document.querySelectorAll('.chapter-figure, .chapter-body');
revealTargets.forEach((el) => el.classList.add('reveal'));

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
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
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
updateProgress();
