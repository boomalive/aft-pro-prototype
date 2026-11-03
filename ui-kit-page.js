/* Read live samples so the guide always reports the styles it actually displays. */
(() => {
  function updateSampleSizes() {
    document.querySelectorAll('[data-token-size]').forEach(output => {
      const sample = document.getElementById(output.dataset.sample);
      output.textContent = `${parseFloat(getComputedStyle(sample).fontSize).toLocaleString('ru-RU')} px`;
    });
  }
  document.addEventListener('DOMContentLoaded', updateSampleSizes);
  window.addEventListener('aft-layout-change', updateSampleSizes);
  document.fonts.ready.then(updateSampleSizes);
})();
