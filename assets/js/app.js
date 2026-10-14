const experiences = [
 {name:'Resbaladera arcoíris',group:'aventura',tag:'180 METROS DE COLOR',price:'S/ 10',detail:'180 metros de color. Tarifa por viaje.',image:'photo-3.jpg',alt:'Resbaladera arcoíris de El Chibolo',video:'fWGEQU8PMWI'},
 {name:'Tobogán con agua',group:'agua',tag:'UN POCO DE ADRENALINA',price:'S/ 10',detail:'Diversión con agua. Por viaje y persona.',image:'water.jpg',alt:'Imagen del video del tobogán con agua',video:'f5gjBPH3CsE'},
 {name:'Bolos chocones',group:'aventura',tag:'MEJOR EN EQUIPO',price:'Consultar',detail:'Juega sobre grass sintético. Consulta tarifa y duración.',image:'photo-2.jpg',alt:'Bolos chocones en el campo de El Chibolo',video:'HPrN9IrXinE'},
 {name:'Catarata El Chibolo',group:'naturaleza',tag:'CONEXIÓN NATURAL',price:'S/ 0',detail:'Una pausa junto al agua y las rocas.',image:'catarata-facebook.webp',alt:'Visitantes entre las paredes de roca de la catarata El Chibolo',video:'FjOWOOP3YTw'},
 {name:'Rodillo sobre el agua',group:'agua',tag:'RISAS PARA DOS',price:'S/ 5',detail:'Dos personas, ida y vuelta. Precio por persona.',image:'rodillo-facebook.webp',alt:'Rodillo inflable rojo flotando en el agua de El Chibolo',link:'https://www.facebook.com/reel/959278053268171'},
 {name:'Columpio panorámico',group:'naturaleza',tag:'UN RESPIRO EN LAS ALTURAS',price:'S/ 0',detail:'Un momento al aire libre para disfrutar del paisaje.',image:'swing.jpg',alt:'Imagen del video del columpio panorámico',video:'YGTojydd5tA'},
 {name:'Piscina',group:'agua',tag:'TIEMPO PARA REFRESCARSE',price:'S/ 0',detail:'Para compartir y refrescarte. Ingreso sin zapatos.',image:'piscina-facebook.webp',alt:'Piscina al aire libre de El Chibolo con visitantes y flotadores',link:'https://www.facebook.com/reel/1304588978321349'},
 {name:'Cañones y piedras',group:'naturaleza',tag:'SAL A EXPLORAR',price:'Desde S/ 0',detail:'Cañones S/ 0. Bosque de piedras S/ 2 por persona.',image:'canones-facebook.webp',alt:'Escalones entre formaciones de roca en El Chibolo',link:'https://www.facebook.com/reel/1039326785647033',natureVideo:'tbERcNHm2ac'}
];
const grid = document.getElementById('experience-grid');
experiences.forEach(e => {
  const card = document.createElement('article');
  card.className = 'experience-card reveal';
  card.dataset.group = e.group;
  const video = e.video ? `<button class="card-play" type="button" data-video="${e.video}" data-title="${e.name}" aria-label="Ver video de ${e.name}"${e.video === 'fWGEQU8PMWI' ? ' data-portrait="true"' : ''}>▶ Ver video</button>` : `<a class="card-play" href="${e.link}" target="_blank" rel="noopener noreferrer" aria-label="Ver video de ${e.name}">▶ Ver video ↗</a>`;
  card.innerHTML = `<div class="card-image"><img src="assets/images/${e.image}" alt="${e.alt}" loading="lazy" decoding="async" width="900" height="1200"></div><div class="card-heading"><h3>${e.name}</h3><span class="card-price">${e.price}</span></div><p>${e.detail}</p><div class="card-actions">${video}${e.natureVideo ? `<button class="text-button secondary-video" type="button" data-video="${e.natureVideo}" data-portrait="true" data-title="Bosque de piedras">Ver el bosque de piedras ↗</button>` : ''}</div>`;
  grid.append(card);
});

const status = document.createElement('p');
status.className = 'visually-hidden';
status.setAttribute('role', 'status');
grid.before(status);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
  let visible = 0;
  document.querySelectorAll('.experience-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter;
    if (!card.hidden) {
      visible++;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('motion-paused')) {
        card.classList.add('is-visible');
        card.getAnimations().forEach(animation => animation.cancel());
        card.animate([{ opacity: .35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], {
          duration: 220, easing: 'cubic-bezier(.16, 1, .3, 1)'
        });
      }
    }
  });
  status.textContent = `${visible} experiencias en ${button.textContent.trim()}.`;
}));

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  nav.querySelectorAll('a').forEach(item => item.classList.toggle('active', item === link));
}));
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
matchMedia('(min-width: 1001px)').addEventListener('change', closeMenu);

const dialog = document.getElementById('media-dialog');
const content = document.getElementById('dialog-content');
let mediaTrigger = null;
function openDialog(node, trigger) {
  mediaTrigger = trigger;
  content.replaceChildren(node);
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
function clearDialog() {
  content.replaceChildren();
  document.body.style.overflow = '';
  mediaTrigger?.focus({ preventScroll: true });
  mediaTrigger = null;
}
function closeDialog() {
  dialog.close();
  clearDialog();
}
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('close', () => {
  // A queued close event must not clear a video opened immediately afterwards.
  if (!dialog.open) clearDialog();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.video;
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper' + (button.dataset.portrait ? ' portrait' : '');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  iframe.title = button.dataset.title || 'Video de El Chibolo';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.allowFullscreen = true;
  const note = document.createElement('p');
  note.className = 'form-note';
  note.append('Si el video no carga, ');
  const fallback = document.createElement('a');
  fallback.href = `https://www.youtube.com/watch?v=${id}`;
  fallback.target = '_blank';
  fallback.rel = 'noopener noreferrer';
  fallback.textContent = 'ábrelo en YouTube ↗';
  note.append(fallback);
  wrapper.append(iframe, note);
  openDialog(wrapper, button);
}));
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  const wrapper = document.createElement('div');
  const photo = document.createElement('img');
  photo.className = 'dialog-photo';
  photo.src = button.dataset.photo;
  photo.alt = button.dataset.caption;
  const caption = document.createElement('p');
  caption.className = 'dialog-caption';
  caption.textContent = button.dataset.caption;
  wrapper.append(photo, caption);
  openDialog(wrapper, button);
}));
document.getElementById('credits-button').addEventListener('click', event => {
  const credits = document.createElement('div');
  credits.className = 'credits';
  credits.innerHTML = `<h3>Fuentes y créditos</h3><p>Textos de restaurante, oficina en Huamanga, actividades incluidas y combo para delegaciones: información proporcionada por El Chibolo el 13 de octubre de 2026. Otras actividades, tarifas y ruta: <a href="https://ranamizekazora.sitew.org/EL-CHIBOLO.a.htm" target="_blank" rel="noopener noreferrer">página original del fundo</a>.</p><p>Fotografías del destino: <a href="https://car-wari.com/destinations/32" target="_blank" rel="noopener noreferrer">galería de Car Wari</a>. Catarata y cañones: fotografías de <a href="https://www.facebook.com/TicllasAyacucho" target="_blank" rel="noopener noreferrer">Ecoturismo El Chíbolo en Facebook</a>. Rodillo y piscina: fotogramas de sus videos públicos. Otras miniaturas: videos de El Chibolo en YouTube. Las imágenes mantienen los derechos de sus respectivos autores.</p><p>Logo y flyer proporcionados por El Chibolo. Los videos de testimonios y bosque de piedras fueron indicados por el fundo.</p>`;
  openDialog(credits, event.currentTarget);
});

const form = document.getElementById('plan-form');
const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
form.elements.date.min = localDate;
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  form.elements.name.setCustomValidity(name ? '' : 'Escribe tu nombre.');
  if (!form.reportValidity()) return;
  const day = new Date(form.elements.date.value + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  const interest = form.elements.interest.value;
  const questions = {
    Delegaciones: 'Quisiera coordinar el combo especial para delegaciones. ¿Podrían confirmarme los atractivos habilitados y las condiciones de reserva?',
    Restaurante: 'Quisiera coordinar los platos y confirmar mi visita con anticipación. ¿Podrían indicarme disponibilidad y precios?',
    Movilidad: 'Necesito orientación sobre movilidad para llegar al fundo. ¿Podrían indicarme las opciones y condiciones?'
  };
  const notes = form.elements.notes.value.trim();
  const message = `Hola, soy ${name}. Me gustaría visitar El Chibolo el ${day} con ${form.elements.people.value} personas. Me interesa: ${interest}. ${questions[interest] || '¿Podrían confirmarme disponibilidad, tarifas y condiciones?'}${notes ? '\n\nDetalles: ' + notes : ''}`;
  const url = 'https://wa.me/51942468851?text=' + encodeURIComponent(message);
  const fallback = document.getElementById('message-fallback');
  fallback.href = url;
  fallback.hidden = false;
  window.open(url, '_blank', 'noopener,noreferrer');
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
document.querySelectorAll('[data-inquiry]').forEach(button => button.addEventListener('click', () => {
  form.elements.interest.value = button.dataset.inquiry;
  document.getElementById('consulta').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  form.elements.name.focus({ preventScroll: true });
}));

// Content stays visible before JavaScript, after a pause, and with reduced motion.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
