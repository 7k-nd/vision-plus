/* =============================================
   animations.js — Vision Plus
   Page transitions + hero char reveal + counter
   ============================================= */

/* ---- Page transitions ---- */
(function () {
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return;

  // Reveal current page (leave animation)
  overlay.classList.add("is-leaving");
  overlay.addEventListener("animationend", () => {
    overlay.classList.remove("is-leaving");
  }, { once: true });

  // Intercept internal links
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    // Skip: external, hash-only, mailto, tel, download
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.hasAttribute("download") ||
      link.target === "_blank"
    ) return;

    e.preventDefault();

    overlay.classList.add("is-entering");
    overlay.addEventListener("animationend", () => {
      window.location.href = href;
    }, { once: true });
  });
})();

/* ---- Hero character reveal ---- */
(function () {
  const containers = document.querySelectorAll(".char-reveal");
  containers.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${0.35 + i * 0.045}s`;
      el.appendChild(span);
    });
  });
})();

/* ---- Counter animation for .facts dt ---- */
(function () {
  const dts = document.querySelectorAll(".facts dt");
  if (!dts.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw, 10);
      if (isNaN(num)) return; // skip non-numeric (e.g. "Paris")

      let start = 0;
      const duration = 900;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * num);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
          el.classList.add("counted");
        }
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  dts.forEach((dt) => counterObserver.observe(dt));
})();

/* ---- Stagger gallery items on filter change ---- */
(function () {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // Re-observe items revealed after filter
  const filterBtns = document.querySelectorAll(".filter");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        gallery.querySelectorAll(".work:not([hidden])").forEach((el, i) => {
          el.classList.remove("is-visible");
          el.style.setProperty("--delay", `${i * 0.06}s`);
          // force reflow
          void el.offsetWidth;
          el.classList.add("is-visible");
        });
      }, 30);
    });
  });
})();
