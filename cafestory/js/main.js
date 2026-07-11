/* ==========================================================================
   CafeStory — main.js
   Shared behaviour across all pages: navigation, scroll progress, custom
   cursor, GSAP reveals, and page-specific widgets (menu tabs, gallery
   lightbox, testimonials, contact form).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSiteLoader();
  initHeader();
  initMobileMenu();
  initRoastProgress();
  initCursor();
  initReveals();
  initParallax();
  initTestimonials();
  initMenuTabs();
  initGalleryLightbox();
  initGalleryFilters();
  initContactForm();
  initReservationSystem();
  initCounters();
  initFooterYear();
  initHeroAtmosphere();
  initMagneticButtons();
  initLiveTables();
  initHomeAvailability();
  initCart();
});

/* ---------------------------------------------------------------------- */
/* Site loader: coffee-cup + falling-beans splash shown while the page      */
/* opens. Guarantees a minimum visible time so the animation always reads,  */
/* then fades out once the page (images, fonts) has actually finished       */
/* loading.                                                                  */
/* ---------------------------------------------------------------------- */
function initSiteLoader() {
  const loader = document.querySelector('.site-loader');
  if (!loader) return;
  const MIN_VISIBLE_MS = 900;
  const started = Date.now();

  const hide = () => {
    const elapsed = Date.now() - started;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 700);
    }, wait);
  };

  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);

  // Safety net: never let the loader block the site for more than 4s
  // (e.g. a slow external image), even if the load event is delayed.
  setTimeout(hide, 4000);
}

/* ---------------------------------------------------------------------- */
/* Sticky header: adds solid background after scrolling past the hero     */
/* ---------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  // Mark the active nav link based on current page
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((a) => {
    if (a.getAttribute('href') === current) a.classList.add('is-active');
  });
}

/* ---------------------------------------------------------------------- */
/* Mobile hamburger menu                                                  */
/* ---------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  const close = () => { btn.classList.remove('is-open'); menu.classList.remove('is-open'); document.body.style.overflow = ''; };
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('is-open');
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

/* ---------------------------------------------------------------------- */
/* "Roast" scroll progress bar — the site's signature motion element      */
/* ---------------------------------------------------------------------- */
function initRoastProgress() {
  const bar = document.querySelector('.roast-progress__bar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = `${max > 0 ? (scrolled / max) * 100 : 0}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------------------------------------------------------------------- */
/* Custom bean-shaped cursor with hover state on interactive elements     */
/* ---------------------------------------------------------------------- */
function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const cursor = document.createElement('div');
  cursor.className = 'bean-cursor';
  document.body.appendChild(cursor);

  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    cursor.classList.add('is-active');
  });
  const loop = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    requestAnimationFrame(loop);
  };
  loop();

  const hoverables = 'a, button, .feature-card, .gallery-item, .testi-card, .menu-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
  });
}

/* ---------------------------------------------------------------------- */
/* GSAP scroll reveals + hero text-split animation                        */
/* ---------------------------------------------------------------------- */
function initReveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero title: split each line into spans and animate them up on load
  document.querySelectorAll('.hero__title .line').forEach((line, i) => {
    const text = line.textContent;
    line.innerHTML = `<span>${text}</span>`;
    gsap.fromTo(
      line.querySelector('span'),
      { yPercent: 120, rotate: 4 },
      { yPercent: 0, rotate: 0, duration: 1.1, ease: 'power4.out', delay: 0.15 + i * 0.12 }
    );
  });
  gsap.from('.hero__kicker', { opacity: 0, y: 16, duration: 0.9, delay: 0.1, ease: 'power2.out' });
  gsap.from('.hero__sub, .hero__ctas', { opacity: 0, y: 24, duration: 1, delay: 0.75, ease: 'power2.out', stagger: 0.1 });
  gsap.from('.hero__scroll', { opacity: 0, duration: 1, delay: 1.1 });

  // Generic reveal-on-scroll for any [data-reveal] element
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Stagger children of [data-reveal-group]
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    gsap.set(items, { opacity: 0, y: 30 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Subtle parallax on hero media + about images (premium depth feel)      */
/* ---------------------------------------------------------------------- */
function initParallax() {
  if (typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero__media img');
  if (hero) {
    gsap.to(hero, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Animated stat counters (About page + Home split)                       */
/* ---------------------------------------------------------------------- */
function initCounters() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseInt(el.dataset.count, 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.round(obj.val).toLocaleString()),
        });
      },
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Testimonials horizontal slider controls                                */
/* ---------------------------------------------------------------------- */
function initTestimonials() {
  const track = document.querySelector('.testi-track');
  const prev = document.querySelector('.testi-controls .prev');
  const next = document.querySelector('.testi-controls .next');
  if (!track || !prev || !next) return;
  const step = () => track.querySelector('.testi-card').offsetWidth + 26;
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}

/* ---------------------------------------------------------------------- */
/* Menu page: category tab filtering                                      */
/* ---------------------------------------------------------------------- */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const categories = document.querySelectorAll('.menu-category');
  if (!tabs.length || !categories.length) return;

  const hasGsap = typeof gsap !== 'undefined';

  // NOTE on the fix: categories/items start life driven by the page's generic
  // [data-reveal-group] scroll-reveal (opacity:0 until scrolled into view).
  // The old filter only toggled `display`, so a category the user hadn't yet
  // scrolled past stayed invisible (opacity:0) even once shown — it looked
  // like filtering "did nothing". We now explicitly animate items to a
  // visible state whenever their category is shown, independent of scroll.
  function showCategory(target) {
    categories.forEach((cat) => {
      const isMatch = target === 'all' || cat.dataset.category === target;
      const items = cat.querySelectorAll('[data-reveal-item]');

      if (isMatch) {
        cat.style.display = '';
        cat.setAttribute('aria-hidden', 'false');
        if (hasGsap) {
          gsap.killTweensOf([cat, ...items]);
          gsap.fromTo(
            cat,
            { opacity: 0, scale: 0.985 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }
          );
          gsap.fromTo(
            items,
            { opacity: 0, y: 22, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06, overwrite: 'auto' }
          );
        } else {
          cat.style.opacity = 1;
          items.forEach((it) => { it.style.opacity = 1; it.style.transform = 'none'; });
        }
      } else {
        cat.setAttribute('aria-hidden', 'true');
        if (hasGsap) {
          gsap.killTweensOf(cat);
          gsap.to(cat, {
            opacity: 0,
            scale: 0.985,
            duration: 0.25,
            ease: 'power2.in',
            overwrite: 'auto',
            onComplete: () => { cat.style.display = 'none'; },
          });
        } else {
          cat.style.display = 'none';
        }
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      showCategory(tab.dataset.target);
      // scroll to menu list smoothly after filtering
      document.querySelector('.menu-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Gallery page: category filters                                         */
/* ---------------------------------------------------------------------- */
function initGalleryFilters() {
  const filters = document.querySelectorAll('.gallery-filters .tab-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filters.length || !items.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = btn.dataset.target;
      items.forEach((item) => {
        const show = target === 'all' || item.dataset.category === target;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Gallery page: lightbox                                                  */
/* ---------------------------------------------------------------------- */
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const img = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav.next');
  let index = 0;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const src = items[index].querySelector('img').src;
    const caption = items[index].dataset.caption || '';
    img.src = src;
    img.alt = caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

/* ---------------------------------------------------------------------- */
/* Homepage "This week, at a glance" widget                               */
/* A lighter, view+link version of the reservation system: pick a day and */
/* a time, and it hands off to the Contact page's reservation form with   */
/* that date/time already selected (booking itself only happens there).   */
/* ---------------------------------------------------------------------- */
function initHomeAvailability() {
  const wrap = document.querySelector('.home-availability');
  if (!wrap) return;

  const weekStrip = wrap.querySelector('[data-week-strip]');
  const slotWrap = wrap.querySelector('[data-time-slots]');
  const hasGsap = typeof gsap !== 'undefined';
  const today = new Date().toISOString().slice(0, 10);
  let selectedDate = today;

  function renderWeek() {
    weekStrip.innerHTML = buildWeekStripMarkup(selectedDate, today);
    weekStrip.querySelectorAll('.day-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedDate = card.dataset.date;
        renderWeek();
        renderSlots();
        if (hasGsap) gsap.fromTo(card, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' });
      });
    });
    if (hasGsap) {
      gsap.fromTo(weekStrip.children, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' });
    }
  }

  function renderSlots() {
    slotWrap.innerHTML = buildSlotGridMarkup(selectedDate, '');
    slotWrap.querySelectorAll('.slot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const params = new URLSearchParams({ date: selectedDate, time: btn.dataset.value });
        window.location.href = `contact.html?${params.toString()}#reserve`;
      });
    });
    if (hasGsap) {
      gsap.fromTo(slotWrap.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.02, ease: 'power2.out' });
    }
  }

  renderWeek();
  renderSlots();

  // Keep it fresh, same cadence as the reservation form and live table widget.
  setInterval(() => {
    renderWeek();
    renderSlots();
  }, 6000);
}

/* ---------------------------------------------------------------------- */
/* Table Reservation System                                               */
/* Simulates live availability using localStorage: each of the café's 12  */
/* tables can be booked once per date+time slot. Booking a slot that's    */
/* already full is prevented client-side and the grid updates instantly.  */
/* Swap the storage layer for a real backend/API when ready.              */
/* ---------------------------------------------------------------------- */
const RESERVATION_KEY = 'cafestory_reservations';
const RESERVATION_TOTAL_TABLES = 12;
const RESERVATION_SLOTS = [
  ['08:00', '8:00 AM'], ['09:00', '9:00 AM'], ['10:00', '10:00 AM'], ['11:00', '11:00 AM'],
  ['12:00', '12:00 PM'], ['13:00', '1:00 PM'], ['14:00', '2:00 PM'], ['15:00', '3:00 PM'],
  ['16:00', '4:00 PM'], ['17:00', '5:00 PM'], ['18:00', '6:00 PM'], ['19:00', '7:00 PM'],
  ['20:00', '8:00 PM'], ['21:00', '9:00 PM'], ['22:00', '10:00 PM'],
];

function getReservations() {
  try {
    return JSON.parse(localStorage.getItem(RESERVATION_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReservations(list) {
  try {
    localStorage.setItem(RESERVATION_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — reservation still confirms for this session */
  }
}

function reservationsForSlot(date, time) {
  return getReservations().filter((r) => r.date === date && r.time === time).length;
}

function reservationDayStats(date) {
  const total = RESERVATION_SLOTS.length;
  let openSlots = 0;
  let tablesFreeSum = 0;
  RESERVATION_SLOTS.forEach(([value]) => {
    const free = RESERVATION_TOTAL_TABLES - reservationsForSlot(date, value);
    if (free > 0) openSlots += 1;
    tablesFreeSum += Math.max(free, 0);
  });
  const ratio = openSlots / total;
  let level = 'open';
  if (ratio <= 0) level = 'full';
  else if (ratio < 0.34) level = 'low';
  else if (ratio < 0.7) level = 'medium';
  return { openSlots, total, tablesFreeSum, level };
}

function isSlotAvailable(date, time) {
  if (!time) return false;
  return reservationsForSlot(date, time) < RESERVATION_TOTAL_TABLES;
}

function reservationWeekDates() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

// Shared markup builders — used by both the contact-page reservation form
// and the homepage "at a glance" preview widget, so the two never drift.
function buildWeekStripMarkup(selectedDate, todayStr) {
  const levelLabel = { open: 'Mostly open', medium: 'Filling up', low: 'Almost full', full: 'Fully booked' };
  return reservationWeekDates().map((date) => {
    const d = new Date(`${date}T00:00:00`);
    const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    const stats = reservationDayStats(date);
    const isActive = date === selectedDate;
    const isToday = date === todayStr;
    return `
      <button type="button" class="day-card${isActive ? ' is-active' : ''}" data-date="${date}" data-level="${stats.level}" aria-pressed="${isActive}">
        <span class="day-card__weekday">${isToday ? 'Today' : weekday}</span>
        <span class="day-card__date">${dayNum} ${month}</span>
        <span class="day-card__dot" data-level="${stats.level}"></span>
        <span class="day-card__note">${levelLabel[stats.level]}</span>
        <span class="day-card__slots">${stats.openSlots}/${stats.total} slots open</span>
      </button>`;
  }).join('');
}

function buildSlotGridMarkup(date, selectedTime) {
  return RESERVATION_SLOTS.map(([value, label]) => {
    const booked = reservationsForSlot(date, value);
    const left = RESERVATION_TOTAL_TABLES - booked;
    const isFull = left <= 0;
    const isActive = value === selectedTime;
    return `
      <button type="button" class="slot-btn${isActive ? ' is-active' : ''}${isFull ? ' is-full' : ''}"
        data-value="${value}" ${isFull ? 'disabled' : ''} aria-pressed="${isActive}">
        <span class="slot-time">${label}</span>
        <span class="slot-avail">${isFull ? 'Fully booked' : `${left} of ${RESERVATION_TOTAL_TABLES} tables free`}</span>
      </button>`;
  }).join('');
}

function initReservationSystem() {
  const form = document.querySelector('.reservation-form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const dateInput = form.elements.date;
  const timeHidden = form.elements.time;
  const slotWrap = form.querySelector('[data-time-slots]');
  const slotField = form.querySelector('.slot-field');
  const weekStrip = form.querySelector('[data-week-strip]');
  const dateFallback = form.querySelector('.date-fallback');
  const prefillNote = form.closest('.form-card')?.querySelector('.prefill-note');
  const hasGsap = typeof gsap !== 'undefined';

  // Never allow picking a date in the past.
  const today = new Date().toISOString().slice(0, 10);
  dateInput.min = today;

  // Arriving from the homepage's "This week, at a glance" widget? Pick up
  // the date/time it linked to and pre-fill the form with it.
  const params = new URLSearchParams(window.location.search);
  const qDate = params.get('date');
  const qTime = params.get('time');
  const validQDate = qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate) && qDate >= today;

  let selectedDate = validQDate ? qDate : today;

  function syncDateFallback() {
    const withinWeek = reservationWeekDates().includes(selectedDate);
    if (!withinWeek) dateFallback.open = true;
  }

  function renderWeekStrip() {
    weekStrip.innerHTML = buildWeekStripMarkup(selectedDate, today);
    weekStrip.querySelectorAll('.day-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedDate = card.dataset.date;
        dateInput.value = selectedDate;
        timeHidden.value = '';
        renderWeekStrip();
        renderSlots();
        if (hasGsap) gsap.fromTo(card, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' });
      });
    });
    if (hasGsap) {
      gsap.fromTo(weekStrip.children, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' });
    }
  }

  // The native date input is a fallback for dates beyond the visible week —
  // keep it in sync in both directions.
  dateInput.addEventListener('change', () => {
    selectedDate = dateInput.value || today;
    timeHidden.value = '';
    renderWeekStrip();
    renderSlots();
  });

  function renderSlots() {
    if (timeHidden.value && !isSlotAvailable(selectedDate, timeHidden.value)) timeHidden.value = '';
    slotWrap.innerHTML = buildSlotGridMarkup(selectedDate, timeHidden.value);

    slotWrap.querySelectorAll('.slot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        timeHidden.value = btn.dataset.value;
        slotField.classList.remove('has-error');
        slotWrap.querySelectorAll('.slot-btn').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        if (hasGsap) {
          gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.35, ease: 'back.out(2.4)' });
        }
      });
    });

    if (hasGsap) {
      gsap.fromTo(slotWrap.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.02, ease: 'power2.out' });
    }
  }

  dateInput.value = selectedDate;
  syncDateFallback();
  renderWeekStrip();
  if (validQDate && qTime && isSlotAvailable(selectedDate, qTime)) {
    timeHidden.value = qTime;
  }
  renderSlots();

  if (validQDate && qTime && timeHidden.value === qTime) {
    const label = RESERVATION_SLOTS.find(([v]) => v === qTime)?.[1] || qTime;
    const pretty = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    if (prefillNote) {
      prefillNote.textContent = `Picked up your selection: ${pretty} at ${label}. Just add your details below.`;
      prefillNote.classList.add('show');
    }
  }

  // Keep both widgets fresh — mirrors the live table widget's "always current" feel.
  setInterval(() => {
    renderWeekStrip();
    renderSlots();
  }, 6000);

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    phone: (v) => /^[0-9+\-\s()]{7,15}$/.test(v) || 'Enter a valid phone number.',
    email: (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    date: (v) => (v && v >= today) || 'Please choose a valid date.',
    message: (v) => v === '' || v.trim().length >= 10 || 'Tell us a little more (10+ characters).',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      const field = input.closest('.field');
      const result = validators[name](input.value);
      if (result !== true) {
        field.classList.add('has-error');
        field.querySelector('.err').textContent = result;
        valid = false;
      } else {
        field.classList.remove('has-error');
      }
    });

    // Time slot is validated separately since it lives in a hidden input.
    if (!timeHidden.value) {
      slotField.classList.add('has-error');
      valid = false;
    } else {
      slotField.classList.remove('has-error');
    }

    if (!valid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = 'var(--ember)';
      status.classList.add('show');
      return;
    }

    // Re-check availability at submit time in case the slot filled up
    // between rendering and clicking "Confirm" (e.g. another tab/session).
    const date = dateInput.value;
    const time = timeHidden.value;
    if (reservationsForSlot(date, time) >= RESERVATION_TOTAL_TABLES) {
      renderSlots();
      slotField.classList.add('has-error');
      status.textContent = 'That slot just filled up — please choose another time.';
      status.style.color = 'var(--ember)';
      status.classList.add('show');
      return;
    }

    const reservations = getReservations();
    reservations.push({
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      guests: form.elements.guests.value,
      date,
      time,
      message: form.elements.message.value.trim(),
      createdAt: new Date().toISOString(),
    });
    saveReservations(reservations);

    const timeLabel = RESERVATION_SLOTS.find(([v]) => v === time)?.[1] || time;
    const prettyDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    status.textContent = `You're booked, ${form.elements.name.value.trim().split(' ')[0]}! Table for ${form.elements.guests.value} on ${prettyDate} at ${timeLabel}. We'll text a confirmation to ${form.elements.phone.value.trim()}.`;
    status.style.color = '#3f7d4f';
    status.classList.add('show');
    if (hasGsap) {
      gsap.fromTo(status, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }

    form.reset();
    dateInput.value = date;
    timeHidden.value = '';
    renderWeekStrip();
    renderSlots();
  });
}

/* ---------------------------------------------------------------------- */
/* Contact page: client-side validated form (UI-level, no backend)        */
/* Used on pages where a plain (non-reservation) .contact-form exists.    */
/* ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form:not(.reservation-form)');
  if (!form) return;
  const status = form.querySelector('.form-status');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    phone: (v) => v === '' || /^[0-9+\-\s()]{7,15}$/.test(v) || 'Enter a valid phone number.',
    message: (v) => v.trim().length >= 10 || 'Tell us a little more (10+ characters).',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      const field = input.closest('.field');
      const result = validators[name](input.value);
      if (result !== true) {
        field.classList.add('has-error');
        field.querySelector('.err').textContent = result;
        valid = false;
      } else {
        field.classList.remove('has-error');
      }
    });

    if (!valid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = 'var(--ember)';
      status.classList.add('show');
      return;
    }

    // Simulate a successful submission (no backend wired up).
    status.textContent = `Thank you, ${form.elements.name.value.split(' ')[0]}! Your message has been received — we'll reply within 24 hours.`;
    status.style.color = '#3f7d4f';
    status.classList.add('show');
    form.reset();
  });
}

/* ---------------------------------------------------------------------- */
/* Footer year                                                            */
/* ---------------------------------------------------------------------- */
function initFooterYear() {
  document.querySelectorAll('.js-year').forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------------------------------------------------------------------- */
/* Hero atmosphere: floating coffee-bean particles rising through the hero */
/* ---------------------------------------------------------------------- */
function initHeroAtmosphere() {
  const field = document.querySelector('.hero__particles');
  if (!field) return;
  const count = window.innerWidth < 640 ? 9 : 18;
  for (let i = 0; i < count; i++) {
    const bean = document.createElement('span');
    bean.className = 'bean';
    const size = 8 + Math.random() * 8;
    bean.style.left = `${Math.random() * 100}%`;
    bean.style.bottom = `${-10 - Math.random() * 10}%`;
    bean.style.width = `${size}px`;
    bean.style.height = `${size * 1.35}px`;
    bean.style.animationDuration = `${10 + Math.random() * 12}s`;
    bean.style.animationDelay = `${Math.random() * 14}s`;
    bean.style.setProperty('--drift', `${Math.random() * 100 - 50}px`);
    field.appendChild(bean);
  }
}

/* ---------------------------------------------------------------------- */
/* Magnetic buttons: nudge toward the cursor for a tactile, premium feel  */
/* ---------------------------------------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------------------------------------------------------------------- */
/* Live table availability                                                */
/* NOTE: this is a client-side simulation for demo purposes — it gives    */
/* every visitor a believable, moving snapshot of the floor. To make it   */
/* genuinely live, connect `tables` to your POS/reservation system's API  */
/* and replace the setInterval below with real-time updates (e.g. via a   */
/* WebSocket or periodic fetch).                                          */
/* ---------------------------------------------------------------------- */
function initLiveTables() {
  const fullGrid = document.querySelector('.tables-grid');
  const miniGrid = document.querySelector('.tables-mini');
  if (!fullGrid && !miniGrid) return;

  const TOTAL = 12;
  const seedPool = ['available', 'available', 'available', 'occupied', 'occupied', 'reserved'];
  const tables = Array.from({ length: TOTAL }, (_, i) => ({
    id: i + 1,
    status: seedPool[Math.floor(Math.random() * seedPool.length)],
  }));

  const countEls = {
    available: document.querySelector('[data-count-available]'),
    occupied: document.querySelector('[data-count-occupied]'),
    reserved: document.querySelector('[data-count-reserved]'),
  };

  function render(changedId) {
    if (fullGrid) {
      fullGrid.innerHTML = tables
        .map(
          (t) => `
        <div class="table-card${t.id === changedId ? ' just-changed' : ''}" data-status="${t.status}">
          <div class="dot"></div>
          <div class="label">T${t.id}</div>
          <span class="status">${t.status}</span>
        </div>`
        )
        .join('');
    }
    if (miniGrid) {
      miniGrid.innerHTML = tables
        .map((t) => `<span class="chip" data-status="${t.status}" title="Table ${t.id} — ${t.status}">${t.id}</span>`)
        .join('');
    }
    const counts = tables.reduce((acc, t) => ((acc[t.status] = (acc[t.status] || 0) + 1), acc), {});
    if (countEls.available) countEls.available.textContent = counts.available || 0;
    if (countEls.occupied) countEls.occupied.textContent = counts.occupied || 0;
    if (countEls.reserved) countEls.reserved.textContent = counts.reserved || 0;
  }

  render();

  // Every few seconds, one table's status shifts — keeps the widget feeling alive.
  setInterval(() => {
    const idx = Math.floor(Math.random() * TOTAL);
    const pool = ['available', 'available', 'occupied', 'reserved'];
    tables[idx] = { ...tables[idx], status: pool[Math.floor(Math.random() * pool.length)] };
    render(tables[idx].id);
  }, 5000);
}

/* ---------------------------------------------------------------------- */
/* Order Online — cart stored in localStorage so it persists across pages */
/* Checkout is fulfilled via a pre-filled WhatsApp message (no payment    */
/* gateway wired up — swap `cart-checkout` for a real checkout flow when  */
/* you're ready to take online payments).                                */
/* ---------------------------------------------------------------------- */
const CART_KEY = 'cafestory_cart';
const CART_WHATSAPP_NUMBER = '919876543210';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  toggleCart(true);
}

function updateCartQty(id, delta) {
  const cart = getCart()
    .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
    .filter((c) => c.qty > 0);
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter((c) => c.id !== id));
}

function toggleCart(open) {
  document.querySelector('.cart-drawer')?.classList.toggle('is-open', open);
  document.querySelector('.cart-overlay')?.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function renderCart() {
  const cart = getCart();
  const list = document.querySelector('.cart-items');
  const badge = document.querySelector('.cart-fab .badge');
  const totalEl = document.querySelector('.cart-total');
  const checkoutBtn = document.querySelector('.cart-checkout');
  if (!list) return;

  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  if (badge) {
    badge.textContent = count;
    badge.dataset.count = count;
  }

  if (!cart.length) {
    list.innerHTML = '<p class="cart-empty">Your order is empty — add something delicious from the menu.</p>';
  } else {
    list.innerHTML = cart
      .map(
        (c) => `
      <div class="cart-line" data-id="${c.id}">
        <div class="cart-line__info">
          <h4>${c.name}</h4>
          <span class="unit">₹${c.price} each</span>
          <div class="cart-qty">
            <button class="qty-minus" type="button" aria-label="Decrease quantity">−</button>
            <span>${c.qty}</span>
            <button class="qty-plus" type="button" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-remove" role="button" tabindex="0">Remove</div>
        </div>
        <div class="cart-line__price">₹${c.price * c.qty}</div>
      </div>`
      )
      .join('');

    list.querySelectorAll('.cart-line').forEach((line) => {
      const id = line.dataset.id;
      line.querySelector('.qty-plus').addEventListener('click', () => updateCartQty(id, 1));
      line.querySelector('.qty-minus').addEventListener('click', () => updateCartQty(id, -1));
      line.querySelector('.cart-remove').addEventListener('click', () => removeFromCart(id));
    });
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  if (totalEl) totalEl.textContent = `₹${subtotal}`;

  if (checkoutBtn) {
    const lines = cart.map((c) => `${c.qty} x ${c.name} - Rs.${c.price * c.qty}`).join('%0A');
    const message = cart.length
      ? `Hi CafeStory, I'd like to order:%0A${lines}%0A%0ASubtotal: Rs.${subtotal}`
      : `Hi CafeStory, I'd like to place an order.`;
    checkoutBtn.href = `https://wa.me/${CART_WHATSAPP_NUMBER}?text=${message}`;
  }
}

function initCart() {
  // Build the cart button + drawer once, shared across every page.
  if (!document.querySelector('.cart-fab')) {
    const fab = document.createElement('button');
    fab.className = 'cart-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'View your order');
    fab.innerHTML =
      '<span class="badge" data-count="0"></span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="#d8b783" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>';

    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';

    const drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer__head">
        <h3>Your Order</h3>
        <button class="cart-close" type="button" aria-label="Close cart">✕</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-drawer__foot">
        <div class="cart-subtotal"><span>Subtotal</span><span class="cart-total">₹0</span></div>
        <a class="btn btn-solid cart-checkout" href="#" target="_blank" rel="noopener"><span>Checkout via WhatsApp</span></a>
        <p class="cart-hint">We'll confirm your order and pickup or table details on WhatsApp.</p>
      </div>`;

    document.body.append(fab, overlay, drawer);

    fab.addEventListener('click', () => toggleCart(true));
    overlay.addEventListener('click', () => toggleCart(false));
    drawer.querySelector('.cart-close').addEventListener('click', () => toggleCart(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleCart(false); });
  }

  renderCart();

  // Wire up any "Add to Order" buttons present on this page.
  document.querySelectorAll('.add-to-order').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-id]');
      if (!card) return;
      addToCart({
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
      });
      btn.classList.add('is-added');
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.classList.remove('is-added');
        btn.textContent = original;
      }, 1400);
    });
  });
}
