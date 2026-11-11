// Berries Inn — gemeinsames Skript

// ---------- Menü (Handy) und Kopfleiste ----------
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
});

// ---------- Startseite: Hintergrund-Slideshow ----------
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
});

// ---------- Ambiente: große Bühne mit Bilderleiste ----------
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.stage');
  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll('.stage-slide'));
  const thumbs = Array.from(document.querySelectorAll('.film-thumb'));
  const titleEl = document.querySelector('.stage-title');
  const countEl = document.querySelector('.stage-count');
  let current = 0;

  // Große Bilder werden erst geladen, wenn sie gebraucht werden
  function load(i) {
    const img = slides[(i + slides.length) % slides.length].querySelector('img');
    if (img && !img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
  }

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('active', j === current));
    thumbs.forEach((t, j) => {
      t.classList.toggle('active', j === current);
      t.setAttribute('aria-current', j === current ? 'true' : 'false');
    });
    load(current); load(current + 1); load(current - 1);
    titleEl.textContent = slides[current].dataset.title || '';
    countEl.textContent = (current + 1) + ' / ' + slides.length;

    // Leiste (auf dem Handy scrollbar) so verschieben, dass das aktive Bild sichtbar ist
    const t = thumbs[current];
    const strip = t.parentElement;
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.clientWidth) / 2, behavior: 'smooth' });
    }
  }

  stage.querySelector('.stage-arrow.prev').addEventListener('click', () => show(current - 1));
  stage.querySelector('.stage-arrow.next').addEventListener('click', () => show(current + 1));
  thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Wischen auf dem Handy
  let startX = null;
  stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) show(diff > 0 ? current - 1 : current + 1);
    startX = null;
  }, { passive: true });

  show(0);
});
