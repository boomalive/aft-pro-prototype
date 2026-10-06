const services = [
  { slug: "logistics", title: "Логистика", href: "service-logistics.html" },
  { slug: "engineering", title: "Инжиниринг", href: "service-engineering.html" },
  { slug: "robotics", title: "Роботизация", href: "service-robotics.html" },
  { slug: "consulting", title: "Консалтинг", href: "service-consulting.html" },
  { slug: "service", title: "Сервис", href: "service-service.html" },
];

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
  document.querySelectorAll("[data-case-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".case-track");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!track || !prev || !next) return;
    const move = (direction) => {
      const card = track.querySelector(".case-slide");
      const distance = card ? card.getBoundingClientRect().width + 22 : track.clientWidth * 0.8;
      track.scrollBy({ left: distance * direction, behavior: "smooth" });
    };
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderServiceNav();
  initPrototypeForms();
  initReveal();
  initCaseCarousels();
  setYear();
});
