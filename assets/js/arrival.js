/* All directions remain readable; selection only connects a step to the illustration. */
(() => {
  const guide = document.getElementById('journey-guide');
  const buttons = [...guide.querySelectorAll('[data-route-step]')];
  const points = [...guide.querySelectorAll('[data-route-point]')];
  const progress = [0, 52.1, 100];
  function selectStep(index) {
    guide.style.setProperty('--route-progress', progress[index]);
    buttons.forEach((button, step) => {
      const selected = step === index;
      button.setAttribute('aria-pressed', String(selected));
      button.closest('li').classList.toggle('is-current', selected);
      points[step].classList.toggle('is-current', selected);
      points[step].classList.toggle('is-visited', step < index);
    });
  }
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener('click', () => selectStep(index));
  });
  guide.querySelector('.journey-hint').hidden = false;
  selectStep(0);

  const copy = document.getElementById('copy-office-address');
  const address = document.getElementById('office-address');
  const status = document.getElementById('copy-office-status');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const text = address.innerText.replace(/\s+/g, ' ').trim();
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Dirección copiada. Llévala contigo.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(address);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Dirección seleccionada. Cópiala con el menú de tu dispositivo.';
    }
  });
})();
