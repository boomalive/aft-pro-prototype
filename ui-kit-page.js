/* Keep the typography guide's labels and samples tied to the shared styles. */
(() => {
  function updateSampleSizes() {
    document.querySelectorAll('[data-token-size]').forEach(output => {
      const sample = document.getElementById(output.dataset.sample);
      output.textContent = `${parseFloat(getComputedStyle(sample).fontSize).toLocaleString('ru-RU')} px`;
    });
  }

  function updateTypographyGuide() {
    const guide = document.getElementById('kit-type');
    const h1Label = guide.querySelector('#kit-type-0').previousElementSibling.querySelector('span');
    h1Label.textContent = 'H1';

    const table = guide.querySelector('.kit-table');
    table.tBodies[0].rows[0].cells[0].textContent = 'H1';
    const tagRow = table.tBodies[0].insertRow(table.tBodies[0].rows.length - 1);
    const tagHeading = document.createElement('th');
    tagHeading.scope = 'row';
    tagHeading.textContent = 'Tag text';
    tagRow.append(tagHeading);
    [12, 10, 10, 10].forEach(size => {
      tagRow.insertCell().textContent = size;
    });

    const caption = guide.querySelector('#kit-type-8').closest('.kit-type-row');
    const tagSample = caption.cloneNode(true);
    tagSample.querySelector('.kit-type-label span').textContent = 'Tag text';
    tagSample.querySelector('code').textContent = '--ui-tag-text-size';
    const output = tagSample.querySelector('output');
    output.dataset.tokenSize = '--ui-tag-text-size';
    output.dataset.sample = 'kit-type-tag';
    const sample = tagSample.querySelector('p');
    sample.id = 'kit-type-tag';
    sample.className = 'ui-tag-text';
    sample.textContent = 'Подробнее';
    caption.before(tagSample);

    guide.querySelector('.kit-table-scroll + .kit-note').textContent =
      'Manrope Medium (500) — заголовки и основной текст. Semibold (600) — Tag text и навигация.';
    updateSampleSizes();
  }

  document.addEventListener('DOMContentLoaded', updateTypographyGuide);
  window.addEventListener('aft-layout-change', updateSampleSizes);
  document.fonts.ready.then(updateSampleSizes);
})();
