/* Apply the saved appearance without changing the visitor's motion preference. */
(() => {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const label = button.querySelector('.theme-label');
  const meta = document.getElementById('theme-color');
  const system = matchMedia('(prefers-color-scheme: dark)');
  let explicit = false;
  try { explicit = ['light', 'dark'].includes(localStorage.getItem('chibolo-theme')); } catch {}

  function apply(theme, persist = false) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
    button.title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
    label.textContent = dark ? 'Modo claro' : 'Modo oscuro';
    meta.content = dark ? '#0b1d17' : '#f5f7ee';
    if (persist) {
      explicit = true;
      try { localStorage.setItem('chibolo-theme', dark ? 'dark' : 'light'); } catch {}
    }
  }
  apply(root.dataset.theme || (system.matches ? 'dark' : 'light'));
  button.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  system.addEventListener('change', event => {
    if (!explicit) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'chibolo-theme') return;
    explicit = ['dark', 'light'].includes(event.newValue);
    apply(explicit ? event.newValue : (system.matches ? 'dark' : 'light'));
  });

  const header = document.querySelector('.header');
  let frame = 0;
  function updateScroll() {
    frame = 0;
    const available = Math.max(0, root.scrollHeight - innerHeight);
    header.classList.toggle('is-scrolled', scrollY > 32);
    header.style.setProperty('--scroll-progress', available ? Math.min(1, Math.max(0, scrollY / available)) : 0);
  }
  function scheduleScroll() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll);
  updateScroll();
})();
