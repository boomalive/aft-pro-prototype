/* Fixed Tilda-style artboards; run before the stylesheet to avoid a layout flash. */
(() => {
  const root = document.documentElement;
  const breakpoints = [1440, 1200, 640, 320];
  let previousWidth = 0;
  let previousScale = 0;

  function updateScale() {
    const layoutWidth = breakpoints.find(width => window.innerWidth >= width) || 320;
    const availableWidth = root.clientWidth || window.innerWidth;
    const scale = availableWidth / layoutWidth;
    if (layoutWidth === previousWidth && Math.abs(scale - previousScale) < .000001) return;
    previousWidth = layoutWidth;
    previousScale = scale;
    root.dataset.layoutWidth = String(layoutWidth);
    root.style.setProperty('--layout-width', `${layoutWidth}px`);
    root.style.setProperty('--page-gutter', `${layoutWidth === 1440 ? 40 : layoutWidth === 1200 ? 20 : 10}px`);
    root.style.setProperty('--page-scale', String(scale));
    window.dispatchEvent(new CustomEvent('aft-layout-change'));
  }

  updateScale();
  window.addEventListener('resize', updateScale);
  window.addEventListener('aft-refresh-scale', updateScale);
  document.addEventListener('DOMContentLoaded', () => {
    updateScale();
    // A classic scrollbar can change the available width after content is laid out.
    new ResizeObserver(updateScale).observe(root);
  });
})();
