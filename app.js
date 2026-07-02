/* ============================================================
   Bilateral — shared behavior
   - EN default in the HTML; IT strings provided per page as
     window.I18N_IT (keyed by data-i18n attribute).
   - Language choice persists across pages via localStorage.
   ============================================================ */
(function () {
  "use strict";

  // current year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var IT = window.I18N_IT || {};

  // cache original English text/placeholder before any switch
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.setAttribute("data-en", el.textContent);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.setAttribute("data-en-ph", el.getAttribute("placeholder") || "");
  });

  function applyLang(lang) {
    var isIt = lang === "it";
    document.documentElement.lang = lang;

    var enBtn = document.getElementById("lang-en");
    var itBtn = document.getElementById("lang-it");
    if (enBtn) enBtn.classList.toggle("active", !isIt);
    if (itBtn) itBtn.classList.toggle("active", isIt);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (isIt && IT[key] !== undefined) {
        el.textContent = IT[key];
      } else {
        el.textContent = el.getAttribute("data-en");
      }
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (isIt && IT[key] !== undefined) el.setAttribute("placeholder", IT[key]);
      else el.setAttribute("placeholder", el.getAttribute("data-en-ph"));
    });

    try { localStorage.setItem("bilateral-lang", lang); } catch (e) {}
  }

  window.setLang = applyLang;

  var saved = null;
  try { saved = localStorage.getItem("bilateral-lang"); } catch (e) {}
  if (saved === "it") applyLang("it");

  // mobile menu toggle
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }

  // reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }
})();
