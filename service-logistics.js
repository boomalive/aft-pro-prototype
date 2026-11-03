/* Original service PNGs and trust icons come from the supplied AFT HTML. */
(() => {
  const assets = {
  "services": [
    "assets/concept/logistics/services/road.webp",
    "assets/concept/logistics/services/rail.webp",
    "assets/concept/logistics/services/sea.webp",
    "https://static.tildacdn.com/tild3161-3830-4264-b764-356437336466/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild6334-3663-4534-a231-633331326166/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3436-3238-4431-a332-346236396239/ChatGPT_Image_9__202.png",
    "https://static.tildacdn.com/tild3736-6333-4730-b166-363163643865/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild6630-3339-4666-b638-336631373838/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3335-6431-4039-a636-666638393763/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3763-3231-4635-b235-366531356234/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3639-6263-4530-b565-343165623932/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild6463-3638-4535-a261-353733366364/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3938-6665-4439-b435-313264396235/ChatGPT_Image_5__202.png",
    "https://static.tildacdn.com/tild3337-6636-4663-a136-366434313932/ChatGPT_Image_5__202.png"
  ],
  "icons": [
    "assets/concept/logistics/icons/icon1_accent.svg",
    "assets/concept/logistics/icons/icon2_accent.svg",
    "assets/concept/logistics/icons/icon3_accent.svg",
    "assets/concept/logistics/icons/icon4_accent.svg",
    "assets/concept/logistics/icons/icon5_accent.svg",
    "assets/concept/logistics/icons/icon6_accent.svg"
  ]
};
  const data = window.AFT_SERVICE_DATA.logistics;
  const html = escapeHtml;
  const number = index => String(index + 1).padStart(2, '0');
  document.querySelector('#hero-title').textContent = data.heroTitle;
  document.querySelector('#logistics-leads').innerHTML = [data.lead, ...data.heroMeta]
    .map((lead, index) => `<p class="logistics-lead ui-hero-lead${index === 0 ? ' is-active' : ''}" data-logistics-lead aria-hidden="${index !== 0}">${html(lead)}</p>`).join('');
  document.querySelector('#solutions-title').textContent = data.solutionsTitle;
  document.querySelector('#solutions-intro').textContent = data.solutionsIntro;
  document.querySelector('#logistics-services').innerHTML = data.solutions.map(([title, description], index) => `
    <li class="logistics-service-card"><a href="#request" data-select-service="${index}">
      <div class="logistics-service-stage"><span class="logistics-service-number" aria-hidden="true">${index + 1}</span><img src="${html(assets.services[index])}" alt="" loading="lazy" decoding="async" width="600" height="600"></div>
      <div class="logistics-service-copy"><h3>${html(title)}</h3><p>${html(description)}</p></div>
    </a></li>`).join('');
  document.querySelector('#tasks-title').textContent = data.tasksTitle;
  document.querySelector('#logistics-tasks').innerHTML = data.tasks.map(([title, description], index) => `
    <details class="direction logistics-task-item" name="logistics-tasks">
      <summary><span class="direction-index" aria-hidden="true">${number(index)}</span><h3>${html(title)}</h3><span class="direction-toggle" aria-hidden="true">+</span></summary>
      <div class="direction-body"><p>${html(description)}</p><a class="concept-button concept-button-red" href="#request">Обсудить задачу <img src="assets/concept/button-arrow.svg" alt="" width="9" height="9"></a></div>
    </details>`).join('');
  document.querySelector('#logistics-process').innerHTML = data.process.map(([title, description], index) => `
    <li><span class="logistics-process-node" aria-hidden="true">${number(index)}</span><h3>${html(title)}</h3><p>${html(description)}</p></li>`).join('');
  document.querySelector('#values-title').textContent = data.valuesTitle;
  document.querySelector('#logistics-values').innerHTML = data.values.map(([title, description], index) => `
    <article class="logistics-value"><img src="${html(assets.icons[index])}" alt="" loading="lazy" decoding="async" width="64" height="64"><h3>${html(title)}</h3><p>${html(description)}</p></article>`).join('');
  document.querySelector('#logistics-stats').innerHTML = data.stats.map(([value, label]) => {
    const [, digits, suffix] = value.match(/^([\d ]+)(.*)$/);
    const [, plus, unit] = suffix.match(/^(\+?)(.*)$/);
    return `<div class="stat"><strong aria-label="${html(value)}"><span class="stat-value" data-count-to="${Number(digits.replaceAll(' ', ''))}" data-count-group>${html(digits)}</span><span class="stat-plus" aria-hidden="true">${html(plus)}</span>${unit.trim() ? `<span class="stat-unit" aria-hidden="true">${html(unit.trim())}</span>` : ''}</strong><p>${html(label)}</p></div>`;
  }).join('');
  const serviceField = document.querySelector('#logistics-direction');
  data.solutions.forEach(([title]) => serviceField.add(new Option(title, title)));
  document.querySelector('#logistics-services').addEventListener('click', event => {
    const link = event.target.closest('[data-select-service]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    // Use a dedicated field so selecting a service never replaces the user's task.
    serviceField.value = data.solutions[Number(link.dataset.selectService)][0];
    serviceField.dispatchEvent(new Event('change', { bubbles: true }));
  });

  function initHeroSlider() {
    const hero = document.querySelector('.logistics-hero');
    const photos = [...hero.querySelectorAll('[data-logistics-photo]')];
    const leads = [...hero.querySelectorAll('[data-logistics-lead]')];
    document.querySelector('#logistics-leads').setAttribute('aria-live', 'polite');
    let current = 0;
    function show(index) {
      current = (index + leads.length) % leads.length;
      photos.forEach((photo, i) => photo.classList.toggle('is-active', i === current));
      leads.forEach((lead, i) => {
        lead.classList.toggle('is-active', i === current);
        lead.setAttribute('aria-hidden', String(i !== current));
      });
    }
    hero.querySelector('[data-logistics-prev]').addEventListener('click', () => show(current - 1));
    hero.querySelector('[data-logistics-next]').addEventListener('click', () => show(current + 1));
  }

  function initServiceCarousel() {
    const track = document.querySelector('#logistics-services');
    const prev = document.querySelector('[data-service-prev]');
    const next = document.querySelector('[data-service-next]');
    const position = document.querySelector('[data-service-position]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const step = () => track.firstElementChild.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
    const end = () => track.scrollWidth - track.clientWidth;
    function move(left) { track.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' }); }
    function update() {
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= end() - 1;
      position.textContent = number(Math.min(data.solutions.length - 1, Math.round(track.scrollLeft / step())));
    }
    prev.addEventListener('click', () => move(track.scrollLeft - step()));
    next.addEventListener('click', () => move(track.scrollLeft + step()));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const destinations = { ArrowLeft: track.scrollLeft - step(), ArrowRight: track.scrollLeft + step(), Home: 0, End: end() };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      move(destinations[event.key]);
    });
    new ResizeObserver(update).observe(track);
    update();
  }
  document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initServiceCarousel();
  });
})();
