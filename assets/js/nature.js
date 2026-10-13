/* Pointer depth updates only the active surface, at most once per frame. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.getElementById('motion-toggle');
  const hero = document.querySelector('.hero-nature');
  const dialog = document.getElementById('media-dialog');
  let paused = false;
  let active = null;
  let frame = 0;
  try { paused = localStorage.getItem('chibolo-motion') === 'paused'; } catch {}

  const allowed = () => !paused && !reduced.matches && pointer.matches && !document.hidden && !dialog?.open;
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!active) return;
    active.surface.classList.remove('is-tilting');
    active.surface.style.removeProperty('--tilt-x');
    active.surface.style.removeProperty('--tilt-y');
    active = null;
  }
  function render() {
    frame = 0;
    if (!active || !allowed()) { reset(); return; }
    active.surface.style.setProperty('--tilt-x', active.x.toFixed(2) + 'deg');
    active.surface.style.setProperty('--tilt-y', active.y.toFixed(2) + 'deg');
  }
  function bind(host, surface, strength) {
    if (!host || !surface) return;
    surface.setAttribute('data-tilt', '');
    const state = { host, surface, box: null, x: 0, y: 0 };
    function move(event) {
      if (event.pointerType === 'touch' || !allowed()) return;
      if (active !== state) {
        reset();
        // The host is stationary: animated bounds never feed back into the tilt.
        state.box = host.getBoundingClientRect();
        if (!state.box.width || !state.box.height) return;
        active = state;
        surface.classList.add('is-tilting');
      }
      const clamp = value => Math.max(-0.5, Math.min(0.5, value));
      state.x = -clamp((event.clientY - state.box.top) / state.box.height - 0.5) * strength;
      state.y = clamp((event.clientX - state.box.left) / state.box.width - 0.5) * strength;
      if (!frame) frame = requestAnimationFrame(render);
    }
    host.addEventListener('pointerenter', move, { passive: true });
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', () => { if (active === state) reset(); });
    host.addEventListener('pointercancel', reset);
    host.addEventListener('click', reset);
    host.addEventListener('focusout', reset);
  }
  bind(document.querySelector('.flyer-tilt'), document.querySelector('.flyer-surface'), 10);
  document.querySelectorAll('.experience-card').forEach(card => bind(card, card.querySelector('.card-image'), 6));

  function syncMotion() {
    reset();
    root.classList.toggle('motion-paused', paused || reduced.matches || document.hidden || !!dialog?.open);
    toggle?.setAttribute('aria-pressed', String(paused));
    if (toggle) {
      toggle.querySelector('.motion-label').textContent = paused ? 'Activar animaciones' : 'Pausar animaciones';
      toggle.querySelector('[aria-hidden]').textContent = paused ? '▶' : 'Ⅱ';
    }
  }
  toggle?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('chibolo-motion', paused ? 'paused' : 'active'); } catch {}
    syncMotion();
  });
  // Invalidate cached geometry after a scroll or resize; no scroll animation loop.
  window.addEventListener('scroll', reset, { passive: true });
  window.addEventListener('resize', reset, { passive: true });
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', syncMotion);
  pointer.addEventListener('change', syncMotion);
  if (dialog) new MutationObserver(syncMotion).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      root.classList.toggle('hero-out-of-view', !entry.isIntersecting);
      if (!entry.isIntersecting) reset();
    }).observe(hero);
  }
  syncMotion();
})();
