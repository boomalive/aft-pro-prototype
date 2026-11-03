/* Original service PNGs and trust icons come from the supplied AFT HTML. */
(() => {
  const assets = {
  "services": [
    "https://static.tildacdn.com/tild6532-6530-4462-b662-303638643638/ChatGPT_Image_4__202.png",
    "https://static.tildacdn.com/tild3737-6533-4263-b265-613732663035/ChatGPT_Image_4__202.png",
    "https://static.tildacdn.com/tild3538-3165-4066-b864-313437303334/ChatGPT_Image_5__202.png",
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
    "https://static.tildacdn.com/tild6631-3262-4565-b764-626631636231/icon1_accent.svg",
    "https://static.tildacdn.com/tild6264-6366-4861-a330-313638386338/icon2_accent.svg",
    "https://static.tildacdn.com/tild3436-6637-4539-b039-646566663933/icon3_accent.svg",
    "https://static.tildacdn.com/tild3931-3663-4634-b965-613066333630/icon4_accent.svg",
    "https://static.tildacdn.com/tild6135-3062-4966-b634-396436393334/icon5_accent.svg",
    "https://static.tildacdn.com/tild3034-3366-4162-b265-613161643930/icon6_accent.svg"
  ]
};
  const data = window.AFT_SERVICE_DATA.logistics;
  const html = escapeHtml;
  const number = index => String(index + 1).padStart(2, '0');
  document.querySelector('#hero-title').textContent = data.heroTitle;
  document.querySelector('#logistics-leads').innerHTML = [data.lead, ...data.heroMeta]
    .map((lead, index) => `<p class="logistics-lead${index === 0 ? ' is-active' : ''}" data-logistics-lead aria-hidden="${index !== 0}">${html(lead)}</p>`).join('');
  document.querySelector('#solutions-title').textContent = data.solutionsTitle;
  document.querySelector('#solutions-intro').textContent = data.solutionsIntro;
  document.querySelector('#logistics-services').innerHTML = data.solutions.map(([title, description], index) => `
    <li class="logistics-service-card"><a href="#request" data-select-service="${index}">
      <div class="logistics-service-stage"><span class="logistics-service-number" aria-hidden="true">${number(index)}</span><img src="${html(assets.services[index])}" alt="" loading="lazy" decoding="async" width="480" height="320"><span class="logistics-service-link" aria-hidden="true"><img src="assets/concept/button-arrow-ink.svg" alt="" width="9" height="9"></span></div>
      <div class="logistics-service-copy"><h3>${html(title)}</h3><p>${html(description)}</p></div>
    </a></li>`).join('');
  document.querySelector('#tasks-title').textContent = data.tasksTitle;
  document.querySelector('#logistics-tasks').innerHTML = data.tasks.map(([title, description], index) => `
    <article class="logistics-task"><span class="logistics-task-number" aria-hidden="true">${number(index)}</span><div><h3>${html(title)}</h3><p>${html(description)}</p></div></article>`).join('');
  document.querySelector('#logistics-process').innerHTML = data.process.map(([title, description], index) => `
    <li><span class="logistics-process-node" aria-hidden="true">${number(index)}</span><h3>${html(title)}</h3><p>${html(description)}</p></li>`).join('');
  document.querySelector('#values-title').textContent = data.valuesTitle;
  document.querySelector('#logistics-values').innerHTML = data.values.map(([title, description], index) => `
    <article class="logistics-value"><img src="${html(assets.icons[index])}" alt="" loading="lazy" decoding="async" width="64" height="64"><h3>${html(title)}</h3><p>${html(description)}</p></article>`).join('');
  document.querySelector('#logistics-stats').innerHTML = data.stats.map(([value, label]) => {
    const [, digits, suffix] = value.match(/^([\d ]+)(.*)$/);
    return `<div class="stat"><strong aria-label="${html(value)}"><span class="stat-value" data-count-to="${Number(digits.replaceAll(' ', ''))}" data-count-group>${html(digits)}</span><span class="stat-plus" aria-hidden="true">${html(suffix)}</span></strong><p>${html(label)}</p></div>`;
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
    const pages = [...hero.querySelectorAll('[data-logistics-page]')];
    const pause = hero.querySelector('[data-logistics-pause]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let timer;
    let paused = false;
    let hovered = false;
    let focused = false;
    let visible = true;

    function schedule() {
      clearTimeout(timer);
      if (paused || hovered || focused || !visible || document.hidden || reduced.matches) return;
      timer = setTimeout(() => show(current + 1), 13000);
    }
    function syncPause() {
      const stopped = paused || reduced.matches;
      pause.setAttribute('aria-pressed', String(stopped));
      pause.setAttribute('aria-label', reduced.matches ? 'Автосмена отключена: уменьшение движения' : paused ? 'Возобновить смену слайдов' : 'Приостановить смену слайдов');
      pause.disabled = reduced.matches;
      pause.classList.toggle('is-paused', stopped);
      document.querySelector('#logistics-leads').setAttribute('aria-live', stopped || focused ? 'polite' : 'off');
      schedule();
    }
    function show(index, manual = false) {
      current = (index + leads.length) % leads.length;
      if (manual) { paused = true; syncPause(); }
      photos.forEach((photo, index) => photo.classList.toggle('is-active', index === current));
      leads.forEach((lead, index) => {
        lead.classList.toggle('is-active', index === current);
        lead.setAttribute('aria-hidden', String(index !== current));
      });
      pages.forEach((page, index) => {
        if (index === current) page.setAttribute('aria-current', 'true');
        else page.removeAttribute('aria-current');
      });
      schedule();
    }
    pages.forEach((page, index) => page.addEventListener('click', () => show(index, true)));
    hero.querySelector('[data-logistics-prev]').addEventListener('click', () => show(current - 1, true));
    hero.querySelector('[data-logistics-next]').addEventListener('click', () => show(current + 1, true));
    pause.addEventListener('click', () => { paused = !paused; syncPause(); });
    hero.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    hero.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    hero.addEventListener('focusin', () => { focused = true; syncPause(); });
    hero.addEventListener('focusout', event => {
      if (!hero.contains(event.relatedTarget)) { focused = false; syncPause(); }
    });
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', syncPause);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(hero);
    syncPause();
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
