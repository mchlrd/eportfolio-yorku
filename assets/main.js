/* ===========================================================================
   Mykhailo Rud — LE/COOP 2100 ePortfolio
   Shared behaviour: mobile nav, scroll progress, reveal-on-scroll,
   pointer-tracked card spotlight, artifact reflection disclosure.
   =========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.textContent = "\u2630";
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.textContent = open ? "\u00d7" : "\u2630";
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- highlight the current page in the toolbar ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav a[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) link.setAttribute("aria-current", "page");
    });
  }

  /* ---------- scroll progress bar ---------- */
  var progress = document.querySelector(".progress");
  if (progress) {
    var ticking = false;
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.width = (ratio * 100).toFixed(2) + "%";
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateProgress);
        }
      },
      { passive: true }
    );
    updateProgress();
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      );
      revealables.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- pointer-tracked spotlight on cards ---------- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ---------- reflection disclosure on artifacts ---------- */
  document.querySelectorAll(".artifact").forEach(function (artifact) {
    var button = artifact.querySelector(".disclosure");
    var body = artifact.querySelector(".artifact-body");
    if (!button || !body) return;
    if (!body.id) body.id = "reflection-" + Math.random().toString(36).slice(2, 8);
    button.setAttribute("aria-controls", body.id);
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", function () {
      var open = artifact.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      var label = button.querySelector(".disclosure-label");
      if (label) label.textContent = open ? "Hide reflection" : "Read the reflection";
    });
  });
})();
