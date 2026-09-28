/* ═══════════════════════════════════════════════════════════════
   BARBERÍA — lógica del sitio
   Vanilla JS, sin dependencias.

   PLANTILLA GENÉRICA: este archivo no inventa datos.
   Editá CONFIG y el sitio se completa con la info real del local.
   ═══════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────
   CONFIG — única parte que hay que editar
   ─────────────────────────────────────────────────────────────── */
const CONFIG = {

  /* Identidad */
  nombre: 'Barbería',
  ciudad: 'Campana, Buenos Aires',
  provincia: 'Buenos Aires',
  cp: '2804',
  direccion: '',                    // 'Cargá la dirección acá'
  heroEyebrow: 'Barbería · Turnos por WhatsApp',

  /* WhatsApp: solo el número, con código de país. Sin + ni espacios. */
  whatsapp: '5491170590898',
  whatsappLegible: '+54 11 7059-0898',
  waMessage: '¡Hola! Quisiera reservar un turno.%0A%0ANombre:%0AServicio:%0ADía y hora preferida:',

  /* Mapa. Vacío = placeholder. Sin API key:
     https://www.google.com/maps?q=TU+DIRECCION&output=embed */
  googleMapsEmbed: '',
  googleMapsLink: '',

  /* Horarios — se usa en "Visitanos" y en el hero */
  horarios: [
    ['Lunes',        'Cerrado'],
    ['Martes',       '10:00 — 20:30'],
    ['Miércoles',    '10:00 — 20:30'],
    ['Jueves',       '10:00 — 20:30'],
    ['Viernes',      '10:00 — 20:30'],
    ['Sábado',       '09:00 — 20:00'],
    ['Domingo',      'Cerrado']
  ],
  horariosHero: 'Mar a Sáb · 10:00 — 20:30',

  /* Números de la sección "Nosotros". valor: null = muestra "—".
     Formato: 'k' (miles), suffix: '+', decimals: 1 */
  stats: [
    { valor: null, label: 'Años en el oficio' },
    { valor: null, format: 'k', suffix: '+', label: 'Clientes atendidos' },
    { valor: null, label: 'Barberos en la silla' },
    { valor: null, decimals: 1, label: 'Calificación Google' }
  ],

  /* Reseñas de Google — pegá acá las reales que Copies del perfil.
     Si lo completás, la sección del HTML se reemplaza sola.
     Con la API key de abajo tiene prioridad la data de Google. */
  resenas: [
    // { autor: 'Nombre del cliente', texto: 'Texto de la reseña.', fecha: 'Hace 2 meses', estrellas: 5 }
  ],

  /* Google Places API (opcional). Trae las reseñas solas.
     Place ID: abrí tu local en Google Maps → Compartí → Copiar enlace.
     Empieza con "ChIJ". Sin esto, usá CONFIG.resenas. */
  googlePlaceId: '',
  googleApiKey: '',

  /* Link a tu perfil de reseñas. Vacío = se arma solo. */
  reviewsUrl: ''
};
/* ───────────────────────────────────────────────────────────────
   FIN CONFIG
   ─────────────────────────────────────────────────────────────── */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ═══ 1. Bindings simples ═══ */
const dirFull = [CONFIG.direccion, CONFIG.ciudad, CONFIG.cp && `CP ${CONFIG.cp}`]
  .filter(Boolean).join(', ');

const bind = (slot, html) => $$(`[data-slot="${slot}"]`).forEach(el => (el.innerHTML = html));
const bindText = (key, txt) => $$(`[data-bind="${key}"]`).forEach(el => (el.textContent = txt));

bindText('nombre', CONFIG.nombre);
bindText('heroEyebrow', CONFIG.heroEyebrow);
bindText('horariosHero', CONFIG.horariosHero);

bind('direccion', esc(CONFIG.direccion) || '<em>Cargá la dirección en app.js</em>');
bind('direccionFoot', esc(dirFull) || 'Dirección sin cargar');
bind('whatsapp', esc(CONFIG.whatsappLegible));
bind('ciudad', esc(CONFIG.ciudad));
$('#year').textContent = new Date().getFullYear();

/* Horarios */
$('#horarios').innerHTML = CONFIG.horarios
  .map(([d, h]) => `<tr><th>${esc(d)}</th><td>${esc(h)}</td></tr>`).join('');

/* ═══ 2. WhatsApp — todos los botones van acá, sin excepción ═══ */
const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${CONFIG.waMessage}`;
$$('[data-wa]').forEach(a => {
  a.href = waLink;
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ═══ 3. Mapa ═══ */
const mapLink =
  CONFIG.googleMapsLink ||
  (dirFull
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dirFull)}`
    : 'https://www.google.com/maps');

$('#dirLink').href = mapLink;

const map = $('#map');
if (CONFIG.googleMapsEmbed) {
  map.innerHTML =
    `<iframe src="${CONFIG.googleMapsEmbed}" loading="lazy" ` +
    `referrerpolicy="no-referrer-when-downgrade" allowfullscreen ` +
    `title="Mapa de ubicación"></iframe>`;
} else {
  map.innerHTML =
    `<div class="map__ph">Cargá el mapa en <code>CONFIG.googleMapsEmbed</code></div>`;
}

/* ═══ 4. Links a reseñas ═══ */
const revUrl =
  CONFIG.reviewsUrl ||
  (CONFIG.googlePlaceId
    ? `https://search.google.com/local/reviews?placeid=${CONFIG.googlePlaceId}`
    : mapLink);

[$('#revLink'), $('#revLinkFoot')].forEach(a => { a.href = revUrl; });

/* ═══ 5. Stats de la sección Nosotros ═══ */
$('#stats').innerHTML = CONFIG.stats.map(s => {
  const num = s.valor == null
    ? '<span class="stat__num stat__num--off">—</span>'
    : `<dt class="stat__num" data-count="${s.valor}"
         ${s.decimals ? `data-decimals="${s.decimals}"` : ''}
         ${s.format ? `data-format="${s.format}"` : ''}
         ${s.suffix ? `data-suffix="${s.suffix}"` : ''}>0</dt>`;
  return `<div class="stat">${num}<dd class="stat__label">${esc(s.label)}</dd></div>`;
}).join('');

/* ═══ 6. Stats SEO (JSON-LD) generado desde CONFIG ═══ */
if (CONFIG.direccion) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: CONFIG.nombre,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.direccion,
      addressLocality: CONFIG.ciudad.split(',')[0].trim(),
      addressRegion: CONFIG.provincia,
      postalCode: CONFIG.cp,
      addressCountry: 'AR'
    },
    telephone: CONFIG.whatsappLegible,
    sameAs: CONFIG.reviewsUrl ? [CONFIG.reviewsUrl] : undefined
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);
}

/* ═══ 7. Nav ═══ */
const nav = $('#nav');
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
const progress = $('#scrollProgress');

const onScroll = () => {
  nav.classList.toggle('is-stuck', scrollY > 40);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const closeMenu = () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
  document.body.style.overflow = '';
};

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 900px)').addEventListener('change', closeMenu);

/* ═══ 8. Scroll reveal ═══ */
if (reduceMotion) {
  $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
}

/* ═══ 9. Contadores animados ═══ */
const fmt = (n, dec) => dec ? n.toFixed(dec) : Math.round(n).toLocaleString('es-AR');

const animateCount = el => {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const k = el.dataset.format === 'k';
  const show = v => (el.textContent = (k ? fmt(v / 1000, dec) + 'k' : fmt(v, dec)) + suffix);

  if (reduceMotion) return show(target);

  const dur = 1500;
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    show(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const counters = $$('[data-count]');
if (counters.length) {
  const cio = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animateCount(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cio.observe(el));
}

/* ═══ 10. Línea del timeline que se dibuja al hacer scroll ═══ */
const tl = $('#tl');
if (tl && !reduceMotion) {
  new IntersectionObserver((entries, obs) => {
    if (entries.some(e => e.isIntersecting)) {
      tl.style.setProperty('--tl', '1');
      obs.disconnect();
    }
  }, { threshold: 0.25 }).observe(tl);
}

/* ═══ 11. Brillo que sigue al mouse en las cards ═══ */
if (!reduceMotion && matchMedia('(hover: hover)').matches) {
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ═══ 12. Reseñas de Google ═══ */
const track = $('#revTrack');
const revEmpty = $('#revEmpty');
const prev = $('#revPrev');
const next = $('#revNext');

const initials = n =>
  String(n).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

const hueFor = s => {
  let h = 0;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

function renderReviews(list) {
  if (!list.length) return;                 // queda el estado vacío

  track.innerHTML = list.map(r => `
    <article class="rev__card">
      <div class="rev__stars">${'★'.repeat(Math.min(5, Math.max(1, r.estrellas || 5)))}</div>
      <p class="rev__text">${esc(r.texto)}</p>
      <footer class="rev__by">
        <span class="rev__av" style="--h:${hueFor(r.autor || 'GC')}">${esc(initials(r.autor || 'GC'))}</span>
        <span><strong>${esc(r.autor || 'Cliente de Google')}</strong><em>${esc(r.fecha || 'Reseña de Google')}</em></span>
      </footer>
    </article>
  `).join('');

  revEmpty.hidden = true;
  prev.hidden = next.hidden = track.children.length < 2;
  syncNav();
}

function showRating(rating, count) {
  const n = Number(rating);
  if (!Number.isFinite(n) || n <= 0) return;
  const line = `${n.toFixed(1)} en Google · ${count ? '+' + count + ' reseñas' : 'Reseñas'}`;

  const hero = $('[data-slot="ratingLine"]');
  if (hero) { hero.hidden = false; hero.textContent = line; }

  const num = $('[data-slot="gscoreNum"]');
  if (num) { num.hidden = false; num.textContent = n.toFixed(1); }

  const cnt = $('[data-slot="gscoreCount"]');
  if (cnt && count) { cnt.hidden = false; cnt.textContent = `${count} reseñas verificadas`; }
}

/* Carrusel */
const step = () => (track.firstElementChild?.offsetWidth || 340) + 16;
const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
function syncNav() {
  if (track.children.length < 2) return;
  const x = track.scrollLeft;
  prev.disabled = x <= 2;
  next.disabled = x >= maxScroll() - 2;
}

prev.addEventListener('click', () =>
  track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' })
);
next.addEventListener('click', () =>
  track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' })
);
track.addEventListener('scroll', () => requestAnimationFrame(syncNav), { passive: true });
addEventListener('resize', syncNav);

/* Autoplay suave; se pausa al interactuar y sigue al salir. */
if (!reduceMotion) {
  const DELAY = 5200;
  let timer = null;

  const tick = () => {
    const atEnd = track.scrollLeft >= maxScroll() - 2;
    track.scrollBy({ left: atEnd ? -maxScroll() : step() * 0.6, behavior: 'smooth' });
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => {
    stop();
    if (!document.hidden && track.children.length > 1) timer = setInterval(tick, DELAY);
  };

  track.addEventListener('pointerenter', stop);
  track.addEventListener('pointerleave', start);
  track.addEventListener('focusin', stop);
  track.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  start();
}

/* 1) Reseñas escritas a mano en CONFIG */
renderReviews(CONFIG.resenas);

/* 2) Reseñas reales vía Google Places API (tiene prioridad) */
async function loadGoogleReviews() {
  if (!CONFIG.googlePlaceId || !CONFIG.googleApiKey) return;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${CONFIG.googlePlaceId}?key=${CONFIG.googleApiKey}`,
      { headers: {
          'X-Goog-Api-Key': CONFIG.googleApiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews'
      } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    showRating(data.rating, data.userRatingCount);

    const list = (data.reviews || []).map(r => ({
      autor: r.authorAttribution?.displayName || 'Cliente de Google',
      texto: r.text?.text || '',
      fecha: r.publishTime || 'Reseña de Google',
      estrellas: r.rating || 5
    })).filter(r => r.texto);

    if (list.length) renderReviews(list);
  } catch (err) {
    console.warn('[barbería] no se pudieron cargar las reseñas de Google:', err.message);
  }
}
loadGoogleReviews();
