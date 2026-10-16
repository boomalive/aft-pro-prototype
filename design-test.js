/* The prototype's shared case renderer, carousel and demo form stay in common.js. */
function initConceptHero() {
  const hero = document.querySelector('.concept-hero');
  const canvas = hero?.querySelector('[data-hero-canvas]');
  const scene = hero?.querySelector('[data-coordinate-scene]');
  if (!hero || !canvas || !scene) return;

  const mobile = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = {
    degreeX: scene.querySelector('[data-coordinate-degree-x]'),
    degreeY: scene.querySelector('[data-coordinate-degree-y]'),
    valueX: scene.querySelector('[data-coordinate-value-x]'),
    valueY: scene.querySelector('[data-coordinate-value-y]')
  };
  let dimensions = { width: 1200, height: 640, scale: 1 };
  let position = { x: 787, y: 430 };
  let journey = null;
  let startedAt = null;
  let lastNumberUpdate = 0;
  let frame = null;
  let onScreen = true;

  function paint() {
    scene.style.setProperty('--target-x', `${position.x.toFixed(2)}px`);
    scene.style.setProperty('--target-y', `${position.y.toFixed(2)}px`);
  }

  function sizeHero() {
    const scale = mobile.matches ? 1 : hero.clientWidth / 1200;
    canvas.style.setProperty('--hero-scale', String(scale));
    dimensions = {
      width: mobile.matches ? hero.clientWidth : 1200,
      height: mobile.matches ? hero.clientHeight : 640,
      scale
    };
    scene.style.setProperty('--coordinate-line-scale', String(dimensions.height / 640));
    position = mobile.matches
      ? { x: Math.min(dimensions.width * .74, dimensions.width - 40), y: dimensions.height * .55 }
      : { x: 787, y: 430 };
    journey = null;
    startedAt = null;
    paint();
  }

  function choosePoint() {
    const origin = hero.getBoundingClientRect();
    const avoid = [...hero.querySelectorAll('.concept-header, .hero-title-group, .hero-intro')].map(element => {
      const box = element.getBoundingClientRect();
      return {
        left: (box.left - origin.left) / dimensions.scale - 35,
        right: (box.right - origin.left) / dimensions.scale + 35,
        top: (box.top - origin.top) / dimensions.scale - 35,
        bottom: (box.bottom - origin.top) / dimensions.scale + 35
      };
    });
    const marginX = Math.min(90, dimensions.width * .18);
    for (let attempt = 0; attempt < 30; attempt++) {
      const point = {
        x: marginX + Math.random() * (dimensions.width - marginX * 2),
        y: 125 + Math.random() * Math.max(1, dimensions.height - 225)
      };
      if (!avoid.some(box => point.x > box.left && point.x < box.right && point.y > box.top && point.y < box.bottom)) return point;
    }
    return { x: dimensions.width * .78, y: dimensions.height * .54 };
  }

  function animate(timestamp) {
    frame = null;
    if (!onScreen || document.hidden || reducedMotion.matches) return;
    if (startedAt === null) startedAt = timestamp;

    // A short initial pause preserves the exact Figma composition on arrival.
    if (timestamp - startedAt > 1700) {
      if (!journey) journey = {
        from: { ...position }, to: choosePoint(), start: timestamp,
        duration: 4800 + Math.random() * 3600
      };
      const progress = Math.min(1, (timestamp - journey.start) / journey.duration);
      const eased = progress * progress * (3 - 2 * progress);
      position = {
        x: journey.from.x + (journey.to.x - journey.from.x) * eased,
        y: journey.from.y + (journey.to.y - journey.from.y) * eased
      };
      paint();
      if (progress === 1) journey = null;
      if (timestamp - lastNumberUpdate > 170) {
        labels.degreeX.textContent = `${26 + Math.floor(Math.random() * 4)}°`;
        labels.degreeY.textContent = `${52 + Math.floor(Math.random() * 4)}°`;
        labels.valueX.textContent = String(1000 + Math.floor(Math.random() * 9000));
        labels.valueY.textContent = String(1000 + Math.floor(Math.random() * 9000));
        lastNumberUpdate = timestamp;
      }
    }
    frame = requestAnimationFrame(animate);
  }

  function refreshMotion() {
    if (onScreen && !document.hidden && !reducedMotion.matches) {
      if (frame === null) frame = requestAnimationFrame(animate);
    } else {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      journey = null;
      startedAt = null;
    }
  }

  sizeHero();
  new ResizeObserver(sizeHero).observe(hero);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    refreshMotion();
  }).observe(hero);
  document.addEventListener('visibilitychange', refreshMotion);
  reducedMotion.addEventListener('change', refreshMotion);
  refreshMotion();
}

function initConceptMenu() {
  const toggle = document.querySelector('.hero-menu-toggle');
  const nav = document.querySelector('#concept-nav');
  if (!toggle || !nav) return;
  function close() {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', close);
}

function initBenefits() {
  const slides = [...document.querySelectorAll('[data-benefit-slide]')];
  const pages = [...document.querySelectorAll('[data-benefit-page]')];
  const prev = document.querySelector('[data-benefit-prev]');
  const next = document.querySelector('[data-benefit-next]');
  if (!slides.length || !prev || !next) return;
  let current = 0;
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    pages.forEach((page, i) => {
      if (i === current) page.setAttribute('aria-current', 'true');
      else page.removeAttribute('aria-current');
    });
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }
  pages.forEach(page => page.addEventListener('click', () => show(Number(page.dataset.benefitPage))));
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  show(0);
}

document.addEventListener('DOMContentLoaded', () => {
  initConceptHero();
  initConceptMenu();
  initBenefits();
});
