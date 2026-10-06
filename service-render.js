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

function renderServicePage() {
  const slug = document.body.dataset.service;
  const data = window.AFT_SERVICE_DATA?.[slug];
  const target = document.querySelector("#service-content");
  if (!data || !target) return;

  document.title = `${data.title} — AFT PRO`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = data.lead;

  const stats = data.stats?.length
    ? `<section class="section section-white">
        <div class="container">
          <p class="eyebrow">Показатели</p>
          <h2>Опыт и ориентиры направления</h2>
          <div class="stats">
            ${data.stats.map(([number, text]) => `<div class="stat"><strong>${number}</strong><span>${text}</span></div>`).join("")}
          </div>
        </div>
      </section>`
    : "";

  const cases = data.cases?.length
    ? `<section class="section case-carousel" id="cases" data-case-carousel>
        <div class="container">
          <div class="case-carousel-head">
            <div><p class="eyebrow">Практика ${data.caseNote ? `<button class="editor-note" type="button" data-note="${data.caseNote}" aria-label="Комментарий редактора">i</button>` : ""}</p><h2>Кейсы: опыт, подтвержденный реальными задачами</h2></div>
            <div class="case-carousel-actions">
              <a class="button-secondary" href="contacts.html#request">Получить консультацию</a>
              <div class="case-controls" aria-label="Управление кейсами">
                <button class="case-control" type="button" data-carousel-prev aria-label="Предыдущий кейс">←</button>
                <button class="case-control" type="button" data-carousel-next aria-label="Следующий кейс">→</button>
              </div>
            </div>
          </div>
        </div>
        <div class="case-track">
          ${data.cases
            .map(
              ([title, text, metrics, image]) => `<article class="case-slide">
                ${image ? `<img class="case-image" src="${image}" alt="${title}" loading="lazy">` : '<div class="case-image" role="img" aria-label="Изображение проекта"></div>'}
                <div class="case-body">
                  <p class="case-kicker">${title}</p>
                  <p class="case-description">${text}</p>
                  <div class="case-metrics"><strong>${data.caseMetricLabel || "Результат"}:</strong><ul>${metrics.map((metric) => `<li>${metric}</li>`).join("")}</ul></div>
                </div>
              </article>`
            )
            .join("")}
        </div>
      </section>`
    : "";

  target.innerHTML = `
    <section class="hero">
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
          <div class="visual-placeholder" role="img" aria-label="Место для изображения по направлению ${data.title}"></div>
        </div>
      </div>
    </section>

    <section class="section section-white" id="solutions">
      <div class="container">
        <div class="section-head">
          <div><p class="eyebrow">Что мы делаем</p><h2>${data.solutionsTitle}</h2></div>
          <p class="muted">${data.solutionsIntro}</p>
        </div>
        ${renderCards(data.solutions)}
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <p class="eyebrow">Задачи и объекты</p>
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
        <p class="eyebrow">Единая логика проекта</p>
        <h2>Как строится работа</h2>
        <div class="timeline">
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
