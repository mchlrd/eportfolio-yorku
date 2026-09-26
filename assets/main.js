/* ===========================================================================
   Mykhailo Rud — ePortfolio
   Terminal theme behaviour.

   Progressive enhancement: the site is fully readable without JavaScript.
   Reflections use native <details>, the tree is a list of real links, and
   nothing here is required to read the content. This script adds the
   editor chrome: line-number gutters, the falling-glyph field, the typed
   tagline, and keyboard shortcuts.
   =========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var LINE = 19; /* must match --lh in style.css */

  /* ================= sidebar drawer (mobile) ================= */
  var sidebar = document.querySelector(".sidebar");
  var toggle = document.querySelector(".menu-toggle");
  var scrim = document.querySelector(".scrim");

  function closeDrawer() {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "\u2630 menu";
    }
  }

  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("is-open");
      if (scrim) scrim.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "\u00d7 close" : "\u2630 menu";
    });
  }
  if (scrim) scrim.addEventListener("click", closeDrawer);

  /* ================= mark the current file in the tree ================= */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll('.tree-item[data-nav="' + page + '"]').forEach(function (item) {
      item.classList.add("is-current");
      item.setAttribute("aria-current", "page");
      var group = item.closest("details");
      if (group) group.setAttribute("open", "");
    });
  }

  /* ================= gutter line numbers ================= */
  var lnCol = document.querySelector(".ln-col:not(.ln-col--right)");
  var lnRight = document.querySelector(".ln-col--right");
  var doc = document.querySelector(".doc");

  function renderGutter() {
    if (!lnCol || !doc) return;

    var total = Math.max(1, Math.ceil(doc.getBoundingClientRect().height / LINE));
    total = Math.min(total, 4000); /* safety valve */

    var frag = document.createDocumentFragment();
    for (var i = 1; i <= total; i++) {
      var d = document.createElement("div");
      d.className = "ln";
      d.textContent = String(i);
      frag.appendChild(d);
    }
    lnCol.textContent = "";
    lnCol.appendChild(frag);

    if (lnRight) {
      var fits = Math.max(1, Math.floor(
        (window.innerHeight - 34 - 26) / LINE - 1
      ));
      var rf = document.createDocumentFragment();
      for (var j = 0; j < fits; j++) {
        var r = document.createElement("div");
        r.className = "ln tilde";
        r.textContent = "~";
        rf.appendChild(r);
      }
      lnRight.textContent = "";
      lnRight.appendChild(rf);
    }
  }

  var gutterQueued = false;
  function queueGutter() {
    if (gutterQueued) return;
    gutterQueued = true;
    window.requestAnimationFrame(function () {
      gutterQueued = false;
      renderGutter();
    });
  }

  if (doc) {
    queueGutter();
    if ("ResizeObserver" in window) {
      new ResizeObserver(queueGutter).observe(doc);
    }
    window.addEventListener("resize", queueGutter, { passive: true });
    /* reflections opening/closing changes the document height */
    document.querySelectorAll("details").forEach(function (d) {
      d.addEventListener("toggle", queueGutter);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(queueGutter).catch(function () {});
    }
    window.addEventListener("load", queueGutter);
  }

  /* ================= falling glyph field ================= */
  var field = document.querySelector(".particles");
  var rainToggle = document.querySelector('[data-action="rain"]');
  var GLYPHS = ["|", "/", "\\", "~", "-", ".", ":", "'", "_", "|", "/"];

  function buildRain() {
    if (!field || reduced) return;
    field.textContent = "";
    var frag = document.createDocumentFragment();
    var count = window.innerWidth < 820 ? 14 : 42;

    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      s.style.left = (Math.random() * 100).toFixed(2) + "vw";
      s.style.animationDuration = (9 + Math.random() * 16).toFixed(1) + "s";
      s.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
      s.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
      frag.appendChild(s);
    }
    field.appendChild(frag);
  }

  function setRain(on) {
    if (!field || !rainToggle) return;
    field.style.display = on ? "" : "none";
    rainToggle.setAttribute("aria-expanded", String(on));
    var label = rainToggle.querySelector(".glyph");
    if (label) label.textContent = on ? "[-]" : "[+]";
    if (on) buildRain();
  }

  if (field && rainToggle) {
    buildRain();
    if (!reduced) field.style.display = "";
    rainToggle.addEventListener("click", function () {
      setRain(field.style.display === "none");
    });
  }

  /* ================= typed tagline ================= */
  var typer = document.querySelector("[data-typing]");
  if (typer) {
    var full = typer.getAttribute("data-typing");
    if (reduced || !full) {
      typer.textContent = full || "";
    } else {
      typer.textContent = "";
      var idx = 0;
      (function step() {
        idx++;
        typer.textContent = full.slice(0, idx);
        if (idx < full.length) {
          window.setTimeout(step, 45 + Math.random() * 55);
        }
      })();
    }
  }

  /* ================= live clock + fps in the status bar ================= */
  var clock = document.querySelector("[data-clock]");
  if (clock) {
    var tick = function () {
      var d = new Date();
      var pad = function (n) { return String(n).padStart(2, "0"); };
      clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    };
    tick();
    window.setInterval(tick, 1000);
  }

  var fpsEl = document.querySelector("[data-fps]");
  if (fpsEl && !reduced) {
    var frames = 0, last = performance.now();
    (function loop(now) {
      frames++;
      if (now - last >= 1000) {
        fpsEl.textContent = Math.round((frames * 1000) / (now - last)) + " FPS";
        frames = 0;
        last = now;
      }
      window.requestAnimationFrame(loop);
    })(last);
  }

  /* ================= keyboard navigation ================= */
  var order = ["index", "about", "career", "goals", "reflections", "projects"];
  var files = {
    index: "index.html", about: "about.html", career: "career.html",
    goals: "goals.html", reflections: "reflections.html", projects: "projects.html"
  };

  document.addEventListener("keydown", function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var el = event.target;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;

    if (event.key === "Escape") {
      closeDrawer();
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    var here = order.indexOf(document.body.getAttribute("data-page"));
    if (here === -1) return;
    var next = event.key === "ArrowRight" ? here + 1 : here - 1;
    if (next < 0 || next >= order.length) return;
    window.location.href = files[order[next]];
  });
})();
