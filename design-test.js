/* Shared content and the demo form stay in common.js; this page has its own case layout. */
const getConceptLayoutWidth = () => Number(document.documentElement.dataset.layoutWidth) || 1440;
const getConceptPageScale = () => Number(document.documentElement.style.getPropertyValue('--page-scale')) || 1;

function initConceptHero() {
  const hero = document.querySelector('.concept-hero');
  const canvas = hero?.querySelector('[data-hero-canvas]');
  const scene = hero?.querySelector('[data-coordinate-scene]');
  if (!hero || !canvas || !scene) return;

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
    const mobile = getConceptLayoutWidth() < 1200;
    const scale = mobile ? 1 : hero.clientWidth / 1200;
    const screenScale = scale * getConceptPageScale();
    canvas.style.setProperty('--hero-scale', String(scale));
    const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-gutter'));
    canvas.style.setProperty('--hero-gutter', `${gutter / scale}px`);
    const contentAxis = document.querySelector('.purpose-section .section-heading > h2');
    if (contentAxis && !mobile) {
      canvas.style.setProperty('--hero-content-axis', `${(contentAxis.getBoundingClientRect().left - hero.getBoundingClientRect().left) / screenScale}px`);
    }
    dimensions = {
      width: mobile ? hero.clientWidth : 1200,
      height: mobile ? hero.clientHeight : 640,
      scale: screenScale
    };
    scene.style.setProperty('--coordinate-line-scale', String(dimensions.height / 640));
    position = mobile
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
  window.addEventListener('aft-layout-change', sizeHero);
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
    // Resolve scrollbar width before the browser follows an in-page link.
    window.dispatchEvent(new Event('aft-refresh-scale'));
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    window.dispatchEvent(new Event('aft-refresh-scale'));
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });
  let layoutWidth = getConceptLayoutWidth();
  window.addEventListener('aft-layout-change', () => {
    const nextWidth = getConceptLayoutWidth();
    if (nextWidth !== layoutWidth) {
      layoutWidth = nextWidth;
      close();
    }
  });
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

function initConceptCounters() {
  const values = [...document.querySelectorAll('[data-count-to]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  const format = (element, value) => element.hasAttribute('data-count-group')
    ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    : String(value);
  const finish = element => {
    if (animations.has(element)) cancelAnimationFrame(animations.get(element));
    animations.delete(element);
    element.textContent = format(element, Number(element.dataset.countTo));
  };
  values.forEach(element => {
    element.setAttribute('aria-hidden', 'true');
    element.textContent = reducedMotion.matches ? format(element, Number(element.dataset.countTo)) : '0';
  });
  if (!('IntersectionObserver' in window)) {
    values.forEach(finish);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target.querySelector('[data-count-to]');
      observer.unobserve(entry.target);
      if (reducedMotion.matches) return finish(element);
      let start = null;
      const target = Number(element.dataset.countTo);
      function tick(timestamp) {
        if (start === null) start = timestamp;
        const progress = Math.min(1, (timestamp - start) / 1600);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = format(element, Math.floor(target * eased));
        if (progress < 1) animations.set(element, requestAnimationFrame(tick));
        else finish(element);
      }
      animations.set(element, requestAnimationFrame(tick));
    });
  }, { threshold: .4 });
  values.forEach(element => observer.observe(element.closest('.stat, .project-equipment li')));
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    values.forEach(finish);
  });
}

function renderConceptCases() {
  const target = document.querySelector('#concept-cases');
  if (!target) return;
  const arrow = direction => `<img class="arrow-icon arrow-${direction}" src="assets/concept/button-arrow${direction === 'diagonal' ? '' : '-ink'}.svg" alt="" width="9" height="9">`;
  target.outerHTML = `<section class="section section-white project-section" id="cases" aria-labelledby="projects-title">
    <div class="container">
      <div class="section-heading"><p class="section-label">06 / Практика</p><div><h2 id="projects-title">Кейсы: опыт, подтвержденный реальными задачами</h2><div class="project-toolbar"><div class="project-controls"><button class="case-control" type="button" data-project-prev aria-controls="project-track" aria-label="Прокрутить кейсы влево">${arrow('prev')}</button><button class="case-control" type="button" data-project-next aria-controls="project-track" aria-label="Прокрутить кейсы вправо">${arrow('next')}</button></div><a class="concept-button concept-button-red" href="#request">Получить консультацию ${arrow('diagonal')}</a></div></div></div>
    </div>
    <ul class="project-track" id="project-track" tabindex="0" aria-label="Кейсы — горизонтальная лента">
        ${homeCases.map(([title, description, metrics, image], i) => `<li class="project-card"><article id="project-${i}" aria-labelledby="project-title-${i}">
          <div class="project-visual"><img class="project-image" src="${escapeHtml(image.replace('assets/cases/', 'assets/concept/cases/'))}" srcset="${escapeHtml(image.replace('assets/cases/', 'assets/concept/cases/').replace('.webp', '-480.webp'))} 480w, ${escapeHtml(image.replace('assets/cases/', 'assets/concept/cases/'))} 960w" sizes="(min-width: 1200px) 46vw, (min-width: 640px) 72vw, 87vw" alt="${escapeHtml(title)}" loading="lazy" decoding="async"></div>
          <div class="project-copy"><h3 id="project-title-${i}">${escapeHtml(title)}</h3><p class="project-description">${escapeHtml(description)}</p><div class="project-equipment"><p class="small-label">Техника</p><ul>${metrics.map(metric => {
            const [, value, suffix, label] = metric.match(/^(\d+)(\+?)\s+(.+)$/) || ['', '', '', metric];
            return `<li><strong aria-label="${escapeHtml(value + suffix)}"><span data-count-to="${escapeHtml(value)}">${escapeHtml(value)}</span><span aria-hidden="true">${escapeHtml(suffix)}</span></strong><span>${escapeHtml(label)}</span></li>`;
          }).join('')}</ul></div></div>
        </article></li>`).join('')}
    </ul>
  </section>`;

  const section = document.querySelector('#cases');
  const track = section.querySelector('.project-track');
  const prev = section.querySelector('[data-project-prev]');
  const next = section.querySelector('[data-project-next]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const end = () => track.scrollWidth - track.clientWidth;
  const step = () => track.querySelector('.project-card').offsetWidth + parseFloat(getComputedStyle(track).columnGap);
  function scrollTo(left) {
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  function updateControls() {
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= end() - 1;
  }
  prev.addEventListener('click', () => scrollTo(track.scrollLeft - step()));
  next.addEventListener('click', () => scrollTo(track.scrollLeft + step()));
  track.addEventListener('scroll', updateControls, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const destinations = { ArrowLeft: track.scrollLeft - step(), ArrowRight: track.scrollLeft + step(), Home: 0, End: end() };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    scrollTo(destinations[event.key]);
  });
  new ResizeObserver(updateControls).observe(track);
  updateControls();
}

function initFloatingFields() {
  document.querySelectorAll('.floating-field').forEach(field => {
    const control = field.querySelector('input,select,textarea');
    const sync = () => field.classList.toggle('has-value', control.value.trim() !== '');
    control.addEventListener('input', sync);
    control.addEventListener('change', sync);
    control.form?.addEventListener('reset', () => requestAnimationFrame(sync));
    sync();
  });
}

function initConceptClients() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-concept-marquee]').forEach(row => {
    const track = row.querySelector('.client-track');
    const group = track.querySelector('.client-group');
    const logos = [...group.children];
    let previousWidth = 0;
    function rebuild() {
      track.querySelectorAll('[aria-hidden="true"]').forEach(copy => copy.remove());
      if (reducedMotion.matches) return;
      // Short lists must span the viewport before the entire group is repeated.
      while (group.offsetWidth < row.clientWidth) {
        logos.forEach(logo => {
          const copy = logo.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          copy.querySelector('img').alt = '';
          group.append(copy);
        });
      }
      const duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.querySelectorAll('img').forEach(img => { img.alt = ''; });
      track.append(duplicate);
      row.style.setProperty('--marquee-duration', `${group.offsetWidth / 35}s`);
    }
    new ResizeObserver(() => {
      if (previousWidth === row.clientWidth) return;
      previousWidth = row.clientWidth;
      rebuild();
    }).observe(row);
    reducedMotion.addEventListener('change', rebuild);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderConceptCases();
  initConceptHero();
  initConceptMenu();
  initBenefits();
  initConceptCounters();
  initFloatingFields();
  initConceptClients();
});
