function renderCards(items, className = "grid-2") {
  return `<div class="${className}">${items
    .map(
      ([title, text], index) => `
        <article class="card reveal">
          <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>`
    )
    .join("")}</div>`;
}

function renderSolutions(items) {
  return `<div class="solution-track" tabindex="0" aria-label="Решения: откройте карточку, чтобы узнать подробнее">
    ${items.map(([title, text, products], index) => `<details class="card solution-card">
      <summary>
        <span class="card-media media-placeholder" role="img" aria-label="Место для изображения ${escapeHtml(title)}"><span>Фото решения</span></span>
        <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(title)}</h3>
        <span class="solution-toggle">Подробнее <span aria-hidden="true">+</span></span>
      </summary>
      <div class="solution-detail"><p>${escapeHtml(text)}</p>${products?.length ? `<ul>${products.map((product) => `<li>${escapeHtml(product)}</li>`).join("")}</ul>` : ""}</div>
    </details>`).join("")}
  </div>`;
}

function renderServicePage() {
  const slug = document.body.dataset.service;
  const data = window.AFT_SERVICE_DATA?.[slug];
  const target = document.querySelector("#service-content");
  if (!data || !target) return;

  document.title = `${data.title} — AFT PRO`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = data.lead;

  const statItems = data.stats?.length ? data.stats : [
    ["—", "Показатель направления — уточняется"],
    ["—", "Объем выполненных работ — уточняется"],
    ["—", "Результаты проектов — уточняются"]
  ];
  const stats = `<section class="section section-white">
        <div class="container">
          <p class="eyebrow">Показатели</p>
          <h2>Опыт и ориентиры направления</h2>
          <div class="stats">
            ${statItems.map(([number, text]) => `<div class="stat reveal"><strong>${number}</strong><span>${text}</span></div>`).join("")}
          </div>
        </div>
      </section>`;

  const cases = renderCaseCarousel(data.cases?.length ? data.cases : placeholderCases(data.title), {
    metricLabel: data.caseMetricLabel || "Результат",
    note: data.caseNote || (data.cases?.length ? "" : "Карточки-заглушки: заменить после получения материалов по кейсам")
  });

  target.innerHTML = `
    <section class="hero service-hero">
      <div class="hero-background media-placeholder" role="img" aria-label="Место для фонового видео по направлению ${data.title}"><span>Фоновое видео</span></div>
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Главная</a><span>/</span><a href="services.html">Услуги</a><span>/</span><span>${data.title}</span></div>
        <div class="service-nav" id="service-nav"></div>
        <div class="hero-grid" style="margin-top: 58px">
          <div class="hero-copy">
            <p class="eyebrow">Направление АФТ ПРО</p>
            ${data.draft ? `<button class="editor-note" type="button" data-note="${data.draftNote || "Текст страницы подготовлен для демонстрации и требует согласования"}" aria-label="Комментарий редактора">i</button>` : ""}
            <h1>${data.heroTitle}</h1>
            <p class="lead">${data.lead}</p>
            <div class="hero-meta">${data.heroMeta.map((item) => `<p>${item}</p>`).join("")}</div>
            <div class="button-row">
              <a class="button" href="contacts.html#request">Обсудить задачу</a>
              <a class="button-secondary" href="#solutions">Что мы делаем</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white" id="solutions" data-solutions-carousel>
      <div class="container">
        <div class="section-head">
          <div><p class="eyebrow">Что мы делаем</p><h2>${data.solutionsTitle}</h2></div>
          <div class="solutions-head-actions">
            <p class="muted">${data.solutionsIntro}</p>
            <div class="case-controls" aria-label="Управление решениями">
              <button class="case-control" type="button" data-carousel-prev aria-label="Предыдущие решения">←</button>
              <button class="case-control" type="button" data-carousel-next aria-label="Следующие решения">→</button>
            </div>
          </div>
        </div>
        ${renderSolutions(data.solutions)}
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <p class="eyebrow">${data.tasksEyebrow || "Задачи и объекты"}</p>
          <h2>${data.tasksTitle}</h2>
        </div>
        <div class="plain-list">
          ${data.tasks
            .map(
              ([title, text], index) => `<article class="plain-list-item reveal"><span>${String(index + 1).padStart(2, "0")}</span><h3>${title}</h3><p>${text}</p></article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section section-white">
      <div class="container">
        <p class="eyebrow">${data.processEyebrow || "Единая логика проекта"}</p>
        <h2>${data.processTitle || "Как строится работа"}</h2>
        <div class="timeline" style="--step-count: ${data.process.length}">
          ${data.process.map(([title, text]) => `<article class="timeline-item"><h3>${title}</h3><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Ценность для заказчика</p>
        <h2>${data.valuesTitle}</h2>
        ${renderCards(data.values)}
      </div>
    </section>

    ${stats}
    ${cases}

    <section class="section section-dark">
      <div class="container contact-grid">
        <div>
          <p class="eyebrow">Следующий шаг</p>
          <h2>Обсудим вашу задачу</h2>
          <p class="lead">Опишите исходные данные — мы свяжемся с вами, чтобы обсудить возможные решения.</p>
        </div>
        <form class="prototype-form" data-prototype-form>
          <div class="field"><label for="service-name">Имя</label><input id="service-name" name="name" required></div>
          <div class="field"><label for="service-company">Компания</label><input id="service-company" name="company"></div>
          <div class="field"><label for="service-phone">Телефон</label><input id="service-phone" name="phone" type="tel" required></div>
          <div class="field"><label for="service-email">Электронная почта</label><input id="service-email" name="email" type="email" required></div>
          <div class="field field-full"><label for="service-task">Ваша задача</label><textarea id="service-task" name="task" placeholder="Укажите, что нужно сделать и какие исходные данные уже есть."></textarea></div>
          <div class="form-footer"><button class="editor-note" type="button" data-note="В демонстрационной версии форма показывает сценарий отправки без передачи данных" aria-label="Комментарий редактора">i</button><button class="button-secondary" type="submit">Отправить запрос</button></div>
          <p class="form-success" role="status">Спасибо! Ваш запрос отправлен</p>
        </form>
      </div>
    </section>`;

  renderServiceNav();
  initPrototypeForms();
  initReveal();
  initCaseCarousels();

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    provider: { "@type": "Organization", name: "АФТ ПРО", url: "https://aft.pro/" },
    description: data.lead,
    areaServed: "Россия и международные направления"
  });
  document.head.appendChild(schema);
}

document.addEventListener("DOMContentLoaded", renderServicePage);
