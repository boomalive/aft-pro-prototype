/* Review options live on the test homepage; structural prototype pages are unchanged. */
(() => {
  const root = document.documentElement;
  const fonts = ['inter', 'manrope', 'onest'];
  const parameters = new URLSearchParams(location.search);
  let storedFont;
  try { storedFont = localStorage.getItem('aft-review-font'); } catch { /* Private mode can disable storage. */ }
  root.dataset.reviewFont = fonts.includes(parameters.get('font')) ? parameters.get('font') : fonts.includes(storedFont) ? storedFont : 'inter';

  function initStickyHeader() {
    const header = document.querySelector('[data-sticky-header]');
    if (!header) return;
    function refresh() {
      const base = getConceptLayoutWidth();
      const scale = base >= 1200 ? base / 1200 : 1;
      root.style.setProperty('--sticky-header-scale', String(scale));
      root.style.setProperty('--sticky-header-height', (base >= 1200 ? 64 * scale : 52) + 'px');
      header.classList.toggle('is-scrolled', window.scrollY > 12 * getConceptPageScale());
    }
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('aft-layout-change', refresh);
    refresh();
  }

  function initFlipCard(card) {
    const front = card.querySelector('.purpose-flip-front');
    const back = card.querySelector('.purpose-flip-back');
    const open = card.querySelector('[data-flip-open]');
    const close = card.querySelector('[data-flip-close]');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let locked = false;
    let updating = false;
    function setExpanded(expanded, moveFocus = false) {
      updating = true;
      card.classList.toggle('is-flipped', expanded);
      open.setAttribute('aria-expanded', String(expanded));
      front.inert = expanded;
      back.inert = !expanded;
      front.setAttribute('aria-hidden', String(expanded));
      back.setAttribute('aria-hidden', String(!expanded));
      updating = false;
      if (moveFocus) (expanded ? close : open).focus({ preventScroll: true });
    }
    open.addEventListener('click', () => { locked = true; setExpanded(true, true); });
    close.addEventListener('click', () => { locked = false; setExpanded(false, true); });
    card.addEventListener('mouseenter', () => { if (canHover.matches) setExpanded(true); });
    card.addEventListener('mouseleave', () => { if (canHover.matches && !locked && !card.contains(document.activeElement)) setExpanded(false); });
    card.addEventListener('focusout', event => { if (!updating && !locked && !card.contains(event.relatedTarget)) setExpanded(false); });
    card.addEventListener('keydown', event => { if (event.key === 'Escape') { locked = false; setExpanded(false, true); } });
    setExpanded(false);
  }


  function initFontReview() {
    const buttons = [...document.querySelectorAll('[data-review-font]')].filter(element => element.tagName === 'BUTTON');
    function show(font, persist = false) {
      if (!fonts.includes(font)) return;
      root.dataset.reviewFont = font;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.reviewFont === font)));
      if (persist) {
        try { localStorage.setItem('aft-review-font', font); } catch { /* The switch still works without storage. */ }
        const url = new URL(location.href);
        url.searchParams.set('font', font);
        history.replaceState(null, '', url);
      }
      document.fonts.load('500 16px ' + font[0].toUpperCase() + font.slice(1), 'АФТ ПРО').then(() => {
        // Existing hero alignment, map context and carousel observers follow the new font metrics.
        window.dispatchEvent(new Event('aft-layout-change'));
      });
    }
    buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.reviewFont, true)));
    show(root.dataset.reviewFont);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    document.querySelectorAll('.purpose-flip').forEach(initFlipCard);
    initFontReview();
  });
})();
