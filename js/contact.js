/* =============================================
   contact.js — Vision Plus
   Simple client-side form validation & feedback
   ============================================= */
(function () {
  const form   = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = "Veuillez remplir tous les champs obligatoires.";
      status.style.color = "#c0392b";
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      status.textContent = "Adresse email invalide.";
      status.style.color = "#c0392b";
      return;
    }

    // Simulate send
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    status.textContent = "";
    status.style.color = "var(--gold)";

    setTimeout(() => {
      status.textContent = "Message envoyé — nous vous répondrons dans les 48 h.";
      btn.textContent = "Message envoyé ✓";
      form.reset();
    }, 1200);
  });
})();
