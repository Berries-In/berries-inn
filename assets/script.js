// Berries Inn — shared site behavior

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
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
});

// ---------- Hero background slideshow ----------
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

// ---------- Impressionen: Lightbox ----------
document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.photo-item'));
  const box = document.querySelector('.lightbox');
  if (!items.length || !box) return;

  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    const thumb = items[current].querySelector('img');
    img.src = items[current].dataset.full || thumb.getAttribute('src');
    img.alt = thumb.getAttribute('alt') || '';
    count.textContent = (current + 1) + ' / ' + items.length;
  }
  function open(i) {
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  let startX = null;
  box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) show(diff > 0 ? current - 1 : current + 1);
    startX = null;
  }, { passive: true });
});

// ---------- Impressionen: gleichmäßig verteilte Spalten ----------
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.photo-grid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.photo-item'));
  const ratio = (el) => {
    const i = el.querySelector('img');
    return (Number(i.getAttribute('height')) / Number(i.getAttribute('width'))) || 1;
  };
  let cols = 0;
  function layout() {
    const w = window.innerWidth;
    const n = w <= 520 ? 1 : (w <= 900 ? 2 : 3);
    if (n === cols) return;
    cols = n;
    grid.classList.add('masonry-js');
    grid.innerHTML = '';
    const columns = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'photo-col';
      grid.appendChild(c);
      return c;
    });
    const heights = new Array(n).fill(0);
    items.forEach((el) => {
      const k = heights.indexOf(Math.min(...heights));
      columns[k].appendChild(el);
      heights[k] += ratio(el);
    });
  }
  layout();
  window.addEventListener('resize', layout);
});
