/* GeneralKaos666.github.io — progressive enhancement.
   All content ships in the HTML; this layer adds motion and live GitHub data.
   If anything here fails, the page still works. */
(function () {
  "use strict";

  var USER = "GeneralKaos666";
  var API = "https://api.github.com";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------- utilities -------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------ typing --------------------------------- */
  var ROLES = [
    "Android & mobile app developer",
    "KDE Plasma desktop themer",
    "Terminal & shell enthusiast",
    "Git & open source builder"
  ];
  function typeRoles() {
    var el = $("#typing");
    if (!el) return;
    if (reduce) { el.textContent = ROLES[0]; return; }
    var ri = 0, ci = 0, deleting = false;
    (function tick() {
      var role = ROLES[ri];
      el.textContent = role.slice(0, ci);
      if (!deleting) {
        if (ci < role.length) { ci++; setTimeout(tick, 55); return; }
        deleting = true;
        setTimeout(tick, 1400);
      } else {
        if (ci > 0) { ci--; setTimeout(tick, 28); return; }
        deleting = false;
        ri = (ri + 1) % ROLES.length;
        setTimeout(tick, 320);
      }
    })();
  }

  /* ------------------------------ reveal --------------------------------- */
  function reveal() {
    var items = $$("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* --------------------------- nav highlight ----------------------------- */
  function navHighlight() {
    var links = $$(".site-header nav a");
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") map[id.slice(1)] = a;
    });
    var sections = $$("main section[id]");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var a = map[e.target.id];
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------- data ---------------------------------- */
  var NOTES = {
    "termux-aerotheme-plasma": "Windows 7 Aero recreated for KDE Plasma 6 on Android",
    "electron-for-termux": "Electron runtime for Termux",
    "pdx-bus-tracker": "TriMet arrivals, rebuilt on Compose",
    "font-changer-termux": "Font tools for Termux",
    "ghost-rain": "Matrix rain wallpaper with a system HUD",
    "flutter-for-termux-beta": "Flutter on Termux, channel main"
  };

  function hydrateStars(repos) {
    var byName = {};
    repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
    $$("[data-stars]").forEach(function (el) {
      var r = byName[String(el.getAttribute("data-stars")).toLowerCase()];
      if (r) el.textContent = "★ " + r.stargazers_count;
    });
  }

  function renderStats(user, repos) {
    var stars = repos.reduce(function (n, r) { return n + (r.stargazers_count || 0); }, 0);
    setCount("#stat-repos", user.public_repos);
    setCount("#stat-stars", stars);
    setCount("#stat-followers", user.followers);
    var up = $("#uptime-repos");
    if (up) up.textContent = user.public_repos;
  }

  function setCount(sel, value) {
    var el = $(sel);
    if (!el || typeof value !== "number") return;
    if (reduce || !window.requestAnimationFrame) { el.textContent = value; return; }
    var dur = 800, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(value * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderWorking(repos) {
    var list = $("#working-list");
    if (!list) return;
    var own = repos.filter(function (r) {
      return !r.fork && !r.archived && r.name !== USER && r.name !== USER + ".github.io";
    }).slice(0, 5);
    if (own.length < 3) return; // keep the curated static list
    list.innerHTML = own.map(function (r) {
      var desc = NOTES[r.name] || r.description || (r.language ? r.language + " project" : "Recently updated");
      return '<li><a href="' + esc(r.html_url) + '" target="_blank" rel="noopener">' +
        '<span class="dot" aria-hidden="true"></span>' +
        '<span class="name">' + esc(r.name) + '</span>' +
        '<span class="desc">' + esc(desc) + '</span></a></li>';
    }).join("");
  }

  async function loadData() {
    try {
      var responses = await Promise.all([
        fetch(API + "/users/" + USER, { headers: { Accept: "application/vnd.github+json" } }),
        fetch(API + "/users/" + USER + "/repos?sort=pushed&direction=desc&per_page=100", { headers: { Accept: "application/vnd.github+json" } })
      ]);
      if (!responses[0].ok || !responses[1].ok) return;
      var user = await responses[0].json();
      var repos = await responses[1].json();
      if (!Array.isArray(repos)) return;
      hydrateStars(repos);
      renderStats(user, repos);
      renderWorking(repos);
    } catch (e) {
      /* offline or rate limited: static content stands */
    }
  }

  /* ------------------------------- init ---------------------------------- */
  function init() {
    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
    typeRoles();
    reveal();
    navHighlight();
    loadData();
    document.documentElement.classList.add("js");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
