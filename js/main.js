/* =============================================
   main.js — Vision Plus (multipage)
   ============================================= */

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const BANDS = [
  [
    "photo-1534528741775-53994a69daeb",
    "photo-1524504388940-b1c1722653e1",
    "photo-1488426862026-3ee34a7d66df",
    "photo-1469334031218-e382a71b716b",
    "photo-1515886657613-9f3515e0c046",
    "photo-1529626455594-4ff0802cfb7e",
    "photo-1496747611176-843222e1e57c",
    "photo-1509631179647-0177331693ae",
  ],
  [
    "photo-1519741497674-611481863552",
    "photo-1516589178581-6cd7833ae3b4",
    "photo-1522673607200-164d1b6ce486",
    "photo-1583939003579-730e3918a45a",
    "photo-1606800052614-b3c7890e3c1a",
    "photo-1511285560929-80b456fea0bc",
    "photo-1465495976277-4387d4b0b4c6",
    "photo-1529636798458-92182e662485",
  ],
  [
    "photo-1492691527719-9d1e07e534b4",
    "photo-1542038784456-1ea8e935640e",
    "photo-1471341971476-ae15ff5dd4ea",
    "photo-1531746020798-e6953c6e8e04",
    "photo-1554048612-b6a482bc67e5",
    "photo-1494790108377-be9c29b29330",
    "photo-1539571696357-5a69c17a67c6",
    "photo-1483985988355-763728e1935b",
  ],
];

const WORKS = [
  { id: "photo-1524504388940-b1c1722653e1", title: "Rouge studio",  category: "mode",      label: "Mode" },
  { id: "photo-1496747611176-843222e1e57c", title: "Jaune soleil",  category: "mode",      label: "Mode" },
  { id: "photo-1534528741775-53994a69daeb", title: "Clair-obscur",  category: "portrait",  label: "Portrait" },
  { id: "photo-1519741497674-611481863552", title: "Promesse",      category: "mariage",   label: "Mariage" },
  { id: "photo-1492691527719-9d1e07e534b4", title: "Horizon",       category: "editorial", label: "Éditorial" },
  { id: "photo-1529626455594-4ff0802cfb7e", title: "Nude tones",    category: "portrait",  label: "Portrait" },
  { id: "photo-1583939003579-730e3918a45a", title: "Cérémonie",     category: "mariage",   label: "Mariage" },
  { id: "photo-1469334031218-e382a71b716b", title: "Rue haute",     category: "mode",      label: "Mode" },
  { id: "photo-1471341971476-ae15ff5dd4ea", title: "Chambre noire", category: "editorial", label: "Éditorial" },
  { id: "photo-1515886657613-9f3515e0c046", title: "Silhouette",    category: "portrait",  label: "Portrait" },
  { id: "photo-1606800052614-b3c7890e3c1a", title: "Noces d'or",    category: "mariage",   label: "Mariage" },
  { id: "photo-1542038784456-1ea8e935640e", title: "Still life",    category: "editorial", label: "Éditorial" },
];

/* ---- DOM refs ---- */
const bandsRoot   = document.getElementById("hero-bands");
const gallery     = document.getElementById("gallery");
const header      = document.getElementById("site-header");
const menuToggle  = document.querySelector(".menu-toggle");
const mobileMenu  = document.getElementById("mobile-menu");
const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-image");
const lightboxCap = document.getElementById("lightbox-caption");

let visibleWorks  = [...WORKS];
let lightboxIndex = 0;

/* ---- Bands (hero only) ---- */

function groupMarkup(ids) {
  return `<div class="marquee__group">${ids
    .map((id) => `<img src="${IMG(id)}" alt="" width="420" height="280" decoding="async" />`)
    .join("")}</div>`;
}

function renderBands() {
  if (!bandsRoot) return;
  bandsRoot.innerHTML = BANDS.map((ids, index) => {
    const reverse = index === 1 ? " marquee--reverse" : "";
    return `<div class="marquee${reverse}"><div class="marquee__track">${groupMarkup(ids)}${groupMarkup(ids)}</div></div>`;
  }).join("");
}

/* ---- Gallery ---- */

function renderGallery() {
  if (!gallery) return;
  gallery.innerHTML = WORKS.map(
    (work, index) => `
      <article class="work" data-category="${work.category}">
        <button type="button" data-index="${index}" aria-label="Ouvrir ${work.title}">
          <figure>
            <img src="${IMG(work.id, 1100)}" alt="${work.title}" width="640" height="800" loading="lazy" />
            <figcaption>
              <h3>${work.title}</h3>
              <p>${work.label}</p>
            </figcaption>
          </figure>
        </button>
      </article>
    `
  ).join("");

  // Stagger reveal for gallery items
  gallery.querySelectorAll(".work").forEach((el, i) => {
    el.style.setProperty("--delay", `${i * 0.07}s`);
    setTimeout(() => revealObserver.observe(el), 0);
  });
}

/* ---- Filter ---- */

function setFilter(value) {
  document.querySelectorAll(".filter").forEach((btn) => {
    const active = btn.dataset.filter === value;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  gallery.querySelectorAll(".work").forEach((item) => {
    const show = value === "all" || item.dataset.category === value;
    item.hidden = !show;
  });

  visibleWorks = WORKS.filter((w) => value === "all" || w.category === value);

  // Update URL without reload
  const url = new URL(window.location);
  if (value === "all") {
    url.searchParams.delete("filter");
  } else {
    url.searchParams.set("filter", value);
  }
  history.replaceState(null, "", url);
}

/* ---- Read filter from URL (portfolio page) ---- */
function applyURLFilter() {
  const params = new URLSearchParams(window.location.search);
  const f = params.get("filter");
  if (f) setFilter(f);
}

/* ---- Lightbox ---- */

function openLightbox(idx) {
  if (!visibleWorks.length || !lightbox) return;
  lightboxIndex = idx;
  const work = visibleWorks[lightboxIndex];
  lightboxImg.src = IMG(work.id, 1600);
  lightboxImg.alt = work.title;
  lightboxCap.textContent = `${work.title} — ${work.label}`;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImg.src = "";
}

function stepLightbox(step) {
  if (!visibleWorks.length) return;
  lightboxIndex = (lightboxIndex + step + visibleWorks.length) % visibleWorks.length;
  const work = visibleWorks[lightboxIndex];
  lightboxImg.src = IMG(work.id, 1600);
  lightboxImg.alt = work.title;
  lightboxCap.textContent = `${work.title} — ${work.label}`;
}

/* ---- Mobile menu ---- */

function setMenu(open) {
  if (!mobileMenu) return;
  mobileMenu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Fermer" : "Menu";
  document.body.classList.toggle("menu-open", open);
}

/* ---- Header scroll ---- */

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

/* ---- Scroll reveal observer ---- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
);

document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-fade").forEach((el) => {
  revealObserver.observe(el);
});

/* ---- Init ---- */

renderBands();
renderGallery();
applyURLFilter();

/* ---- Events ---- */

if (menuToggle) {
  menuToggle.addEventListener("click", () => setMenu(mobileMenu.hidden));
}
if (mobileMenu) {
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

if (gallery) {
  gallery.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-index]");
    if (!trigger) return;
    const work = WORKS[Number(trigger.dataset.index)];
    const idx = visibleWorks.findIndex((w) => w.id === work.id);
    openLightbox(Math.max(idx, 0));
  });
}

if (lightbox) {
  lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox__prev").addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector(".lightbox__next").addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeLightbox(); setMenu(false); }
  if (lightbox && !lightbox.hidden) {
    if (e.key === "ArrowLeft")  stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  }
});
