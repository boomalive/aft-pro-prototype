const services = [
  { slug: "logistics", title: "Логистика", href: "service-logistics.html" },
  { slug: "engineering", title: "Инжиниринг", href: "service-engineering.html" },
  { slug: "robotics", title: "Роботизация", href: "service-robotics.html" },
  { slug: "consulting", title: "Консалтинг", href: "service-consulting.html" },
  { slug: "service", title: "Сервис", href: "service-service.html" },
];

const homeCases = [
  ["Криогаз-Высоцк СПГ, Высоцк", "Доставка компонентов для завода по производству сжиженного природного газа из США, ОАЭ, Китая, Индии, Южной Кореи и стран Европы. Подготовка их таможенного оформления.", ["1 грузовой самолет", "5 крановых судов", "50+ негабаритных грузов", "700+ автотранспортных средств"], "assets/cases/kriogaz-vysotsk.webp"],
  ["Новатэк, Усть-Луга", "Доставка реактора гидрокрекинга размерами 28,4 × 5,45 × 5,42 м и десяти дополнительных негабаритных единиц оборудования из Италии до терминала НОВАТЭКа. Обеспечение выгрузки в порту.", ["1 крановое судно", "11 негабаритных грузов", "620 т оборудования"], "assets/cases/novatek-ust-luga.webp"],
  ["Архбум Тиссью Групп, Калуга", "Доставка многочисленных компонентов оборудования из разных стран одновременно и в установленный контрактом срок.", ["12 крупногабаритных грузов", "12 мега-трейлеров", "158 полуприцепов"], "assets/cases/arkhbum-kaluga.webp"]
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function placeholderCases(serviceTitle) {
  return [1, 2, 3].map((number) => [
    `${serviceTitle} · Проект ${String(number).padStart(2, "0")}`,
    "Краткое описание задачи заказчика и выполненного решения. Текст кейса будет добавлен после получения материалов.",
    ["Состав решения — уточняется", "Объем проекта — уточняется", "Результат — уточняется"]
  ]);
}

// Главная и услуги используют одну карточку: изображение, название,
// короткое описание и список показателей. Детальные страницы кейсов не добавляем.
function renderCaseCarousel(items, { metricLabel = "Результат", note = "" } = {}) {
  return `<section class="section case-carousel" id="cases" data-case-carousel>
    <div class="container">
      <div class="case-carousel-head">
        <div><p class="eyebrow">Практика ${note ? `<button class="editor-note" type="button" data-note="${escapeHtml(note)}" aria-label="Комментарий редактора">i</button>` : ""}</p><h2>Кейсы: опыт, подтвержденный реальными задачами</h2></div>
        <div class="case-carousel-actions">
          <a class="button-secondary" href="contacts.html#request">Получить консультацию</a>
          <div class="case-controls" aria-label="Управление кейсами">
            <button class="case-control" type="button" data-carousel-prev aria-label="Предыдущий кейс">←</button>
            <button class="case-control" type="button" data-carousel-next aria-label="Следующий кейс">→</button>
          </div>
        </div>
      </div>
    </div>
    <div class="case-track" tabindex="0" aria-label="Кейсы">
      ${items.map(([title, description, metrics, image]) => `<article class="case-slide">
        ${image ? `<img class="case-image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : `<div class="case-image media-placeholder" role="img" aria-label="Место для изображения проекта ${escapeHtml(title)}"><span>Фото проекта</span></div>`}
        <div class="case-body">
          <p class="case-kicker">${escapeHtml(title)}</p>
          <p class="case-description">${escapeHtml(description)}</p>
          <div class="case-metrics"><strong>${escapeHtml(metricLabel)}:</strong><ul>${metrics.map((metric) => `<li>${escapeHtml(metric)}</li>`).join("")}</ul></div>
        </div>
      </article>`).join("")}
    </div>
  </section>`;
}

function renderHomeCases() {
  const target = document.querySelector("#home-cases");
  if (target) target.outerHTML = renderCaseCarousel(homeCases, { metricLabel: "Техника" });
}

function currentFile() {
  const name = window.location.pathname.split("/").pop();
  return name || "index.html";
}

function renderHeader() {
  const target = document.querySelector("#site-header");
  if (!target) return;

  const active = currentFile();
  const isServices = active === "services.html" || active.startsWith("service-");
  target.className = "site-header";
  target.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="AFT PRO — главная">AFT PRO</a>
      <nav class="site-nav" id="site-nav" aria-label="Основная навигация">
        <a class="nav-link" href="index.html#about">О компании</a>
        <div class="nav-dropdown">
          <a class="nav-link ${isServices ? "is-active" : ""}" href="services.html">Услуги <span aria-hidden="true">↓</span></a>
          <div class="nav-dropdown-menu">
            ${services.map((item) => `<a href="${item.href}">${item.title}</a>`).join("")}
          </div>
        </div>
        <a class="nav-link" href="index.html#cases">Кейсы</a>
        <a class="nav-link ${active === "contacts.html" ? "is-active" : ""}" href="contacts.html">Контакты</a>
        <a class="nav-phone" href="tel:+74992171503">+7 (499) 217-15-03</a>
        <a class="button nav-mobile-cta" href="contacts.html#request">Обсудить задачу</a>
      </nav>
      <a class="button header-cta" href="contacts.html#request">Обсудить задачу</a>
      <button class="menu-toggle" type="button" aria-label="Открыть меню" aria-controls="site-nav" aria-expanded="false"><span></span></button>
    </div>`;

  const toggle = target.querySelector(".menu-toggle");
  const nav = target.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
}

function renderFooter() {
  const target = document.querySelector("#site-footer");
  if (!target) return;
  target.className = "site-footer";
  target.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">AFT PRO</a>
          <p class="footer-intro">Комплексные решения для перевозки, проектирования, роботизации и эксплуатации логистической инфраструктуры.</p>
        </div>
        <nav class="footer-nav" aria-label="Услуги">
          <strong>Направления</strong>
          ${services.map((item) => `<a href="${item.href}">${item.title}</a>`).join("")}
        </nav>
        <nav class="footer-nav" aria-label="Контакты">
          <strong>Контакты</strong>
          <a href="mailto:logistics@aft.pro">logistics@aft.pro</a>
          <a href="tel:+74992171503">+7 (499) 217-15-03</a>
          <a href="contacts.html#offices">Москва · Усть-Луга · Нижний Новгород · Екатеринбург</a>
          <a href="https://aft.pro/privacy">Политика обработки данных</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© AFT PRO, <span data-year></span></span>
        <span class="footer-legal">ООО «ТАЛЬКЕ РАША» · ИНН 0000000000 <button class="editor-note" type="button" data-note="Наименование оператора подтверждено политикой aft.pro; ИНН — рыба-данные" aria-label="Комментарий редактора">i</button></span>
      </div>
    </div>`;
}

function renderServiceNav() {
  const target = document.querySelector("#service-nav");
  if (!target) return;
  const active = document.body.dataset.service;
  target.innerHTML = services
    .map((item) => `<a class="${item.slug === active ? "is-active" : ""}" href="${item.href}">${item.title}</a>`)
    .join("");
}

function initPrototypeForms() {
  document.querySelectorAll("[data-prototype-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = "Запрос принят";
    });
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elements.forEach((element) => observer.observe(element));
}

function initCaseCarousels() {
  document.querySelectorAll("[data-case-carousel], [data-solutions-carousel]").forEach((carousel) => {
    if (carousel.dataset.carouselReady) return;
    const track = carousel.querySelector(".case-track, .solution-track");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!track || !prev || !next) return;
    carousel.dataset.carouselReady = "true";
    const move = (direction) => {
      const card = track.querySelector(".case-slide, .solution-card");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      track.scrollBy({ left: distance * direction, behavior: "smooth" });
    };
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    const updateControls = () => {
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    };
    track.addEventListener("scroll", updateControls, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(updateControls).observe(track);
    updateControls();
  });
}

function initClientMarquee() {
  document.querySelectorAll("[data-client-marquee]").forEach((cloud) => {
    const group = document.createElement("div");
    group.className = "logo-group";
    group.append(...cloud.children);
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute("aria-hidden", "true");
    const track = document.createElement("div");
    track.className = "logo-track";
    track.append(group, duplicate);
    cloud.append(track);
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCases();
  renderHeader();
  renderFooter();
  renderServiceNav();
  initPrototypeForms();
  initReveal();
  initCaseCarousels();
  initClientMarquee();
  setYear();
});
