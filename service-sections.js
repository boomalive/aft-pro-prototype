/* Shared by the service prototype and the standalone logistics layout. */
function serviceSectionHeading(id, label, title, intro) {
  return `<div class="service-section-heading">
    <p class="service-section-label ui-tag-text">${escapeHtml(label)}</p>
    <div class="service-section-titles"><h2 class="ui-h2" id="${id}">${escapeHtml(title)}</h2>
      ${intro ? `<p class="service-section-intro ui-caption">${escapeHtml(intro)}</p>` : ""}
    </div>
  </div>`;
}

function renderServiceTasks(data, label = data.tasksEyebrow || "Задачи и объекты") {
  if (!data.tasks?.length) return "";
  const symbols = [
    '<circle cx="12" cy="52" r="5"/><circle cx="58" cy="16" r="5"/><path d="M17 52h14a8 8 0 0 0 0-16h-7a8 8 0 0 1 0-16h28"/>',
    '<path d="m36 8 25 13v30L36 65 11 51V21Zm0 28L11 21m25 15 25-15M36 36v29M23 15l25 14v10"/>',
    '<circle cx="36" cy="36" r="7"/><circle cx="12" cy="14" r="5"/><circle cx="59" cy="14" r="5"/><circle cx="12" cy="58" r="5"/><circle cx="59" cy="58" r="5"/><path d="m16 18 15 14m10 0 14-14M16 54l15-14m10 0 14 14"/>',
    '<path d="M12 32a25 25 0 0 1 44-12l6 7m-1-14 1 14-14-1M60 40a25 25 0 0 1-44 12l-6-7m1 14-1-14 14 1"/>'
  ];
  return `<section class="section service-scenarios" id="tasks" aria-labelledby="tasks-title">
    <div class="container">
      ${serviceSectionHeading("tasks-title", label, data.tasksTitle, data.tasksIntro)}
      <div class="service-task-grid">${data.tasks.map(([title, description], index) => `
        <article class="service-task-card">
          <svg class="service-task-icon" viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${symbols[index % symbols.length]}</svg>
          <h3 class="ui-h5">${escapeHtml(title)}</h3><p class="ui-body">${escapeHtml(description)}</p>
        </article>`).join("")}</div>
    </div>
  </section>`;
}

function renderServiceProcess(data, label = data.processEyebrow || "Единая логика проекта") {
  if (!data.process?.length) return "";
  return `<section class="section service-process" id="process" aria-labelledby="process-title"><div class="container">
    ${serviceSectionHeading("process-title", label, data.processTitle || "Как строится работа")}
    <ol class="service-process-grid" style="--service-columns:${Math.min(4, data.process.length)}">
      ${data.process.map(([title, description], index) => `<li class="service-process-card">
        <span class="service-process-number ui-caption" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        <h3 class="ui-h5">${escapeHtml(title)}</h3><p class="ui-body">${escapeHtml(description)}</p>
      </li>`).join("")}
    </ol>
  </div></section>`;
}
