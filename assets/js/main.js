/* ==========================================================================
   MASPRAM — main.js
   Vanilla JS · no dependencies
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var cfg = window.MASPRAM_CONFIG || {};
  var LINKS = cfg.links || {};
  var EMAIL = cfg.email || "halo@maspram.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  /* ------------------------------------------------------------------
     Toast
  ------------------------------------------------------------------ */
  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-show");
    }, 3200);
  }

  /* ------------------------------------------------------------------
     Placeholder image generator (dipakai kalau foto gagal dimuat)
  ------------------------------------------------------------------ */
  function escapeXml(str) {
    return String(str || "").replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c];
    });
  }
  function placeholder(label) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">' +
      '<defs>' +
      '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1b1d22"/><stop offset=".55" stop-color="#0c0e11"/><stop offset="1" stop-color="#241a0e"/>' +
      '</linearGradient>' +
      '<radialGradient id="r" cx=".32" cy=".24" r=".85">' +
      '<stop offset="0" stop-color="#e8a33d" stop-opacity=".32"/><stop offset="1" stop-color="#e8a33d" stop-opacity="0"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<rect width="800" height="1000" fill="url(#g)"/><rect width="800" height="1000" fill="url(#r)"/>' +
      '<g fill="none" stroke="#f3f0e9" stroke-opacity=".16">' +
      '<circle cx="400" cy="420" r="132"/><circle cx="400" cy="420" r="96"/>' +
      '<path d="M268 420h264M400 288v264"/></g>' +
      '<text x="400" y="612" text-anchor="middle" fill="#f3f0e9" fill-opacity=".82" ' +
      'font-family="Georgia,serif" font-size="44" font-style="italic">' + escapeXml(label) + '</text>' +
      '<text x="400" y="658" text-anchor="middle" fill="#e8a33d" ' +
      'font-family="Helvetica,Arial,sans-serif" font-size="12" letter-spacing="6">MASPRAM ARCHIVE</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function guardImage(img) {
    if (!img || img.dataset.guarded === "1") return;
    img.dataset.guarded = "1";
    var fail = function () {
      if (img.dataset.failed === "1") return;
      img.dataset.failed = "1";
      img.src = placeholder(img.dataset.fallback || "Maspram");
    };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }
  $$("img[data-fallback]").forEach(guardImage);

  /* ------------------------------------------------------------------
     Config links
  ------------------------------------------------------------------ */
  var LINK_LABELS = {
    instagram: "Instagram",
    github: "GitHub",
    tiktok: "TikTok",
    podStore: "Toko POD",
    appPaku: "Unduhan PAKU",
    appPakuRepo: "GitHub PAKU"
  };

  $$("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    var url = LINKS[key];
    if (url && String(url).trim() !== "" && String(url).trim() !== "#") {
      el.setAttribute("href", url);
      if (key === "appPaku") el.setAttribute("download", "");
    } else {
      el.setAttribute("href", "#");
      el.setAttribute("data-placeholder", key);
      el.addEventListener("click", function (event) {
        event.preventDefault();
        toast((LINK_LABELS[key] || "Link ini") + " segera hadir — nanti bisa dicek lagi di sini.");
      });
    }
  });

  $$("[data-email-text]").forEach(function (el) { el.textContent = EMAIL; });
  var copyBtn = $("#emailCopy");
  if (copyBtn) copyBtn.setAttribute("data-copy", EMAIL);

  /* ------------------------------------------------------------------
     Status toko POD — otomatis "segera hadir" atau "kunjungi"
     Cukup isi links.podStore di config.js; tidak perlu ubah HTML.
  ------------------------------------------------------------------ */
  var podUrl = LINKS.podStore && String(LINKS.podStore).trim();
  var podReady = Boolean(podUrl && podUrl !== "#");
  root.setAttribute("data-pod-state", podReady ? "ready" : "soon");

  var podLabel = $("[data-pod-label]");
  if (podLabel) podLabel.textContent = podReady ? "Kunjungi Toko POD" : "Toko POD Segera Hadir";

  var podMicro = $("[data-pod-micro]");
  if (podMicro) {
    podMicro.innerHTML = podReady
      ? 'Koleksi baru: <em>“Golden Hour”</em> — edisi terbatas.'
      : "Preview koleksi — toko POD sedang disiapkan.";
  }

  var storeCta = $(".store__cta");
  if (storeCta) storeCta.classList.toggle("is-soon", !podReady);

  /* ------------------------------------------------------------------
     Theme
  ------------------------------------------------------------------ */
  var themeBtn = $("#themeToggle");
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f3efe6" : "#08090b");
  }
  var storedTheme = null;
  try { storedTheme = localStorage.getItem("mp-theme"); } catch (e) { /* private mode */ }
  if (storedTheme === "light" || storedTheme === "dark") applyTheme(storedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("mp-theme", next); } catch (e) { /* ignore */ }
      toast(next === "light" ? "Mode terang aktif" : "Mode gelap aktif");
    });
  }

  /* ------------------------------------------------------------------
     Preloader
  ------------------------------------------------------------------ */
  var preloader = $("#preloader");
  var started = performance.now();
  var preloaderHidden = false;
  function hidePreloader() {
    if (!preloader || preloaderHidden) return;
    var wait = Math.max(0, 700 - (performance.now() - started));
    window.setTimeout(function () {
      preloaderHidden = true;
      preloader.classList.add("is-done");
      window.setTimeout(function () { preloader.style.display = "none"; }, 800);
    }, wait);
  }
  if (document.readyState === "complete") hidePreloader();
  else window.addEventListener("load", hidePreloader);
  window.setTimeout(hidePreloader, 3500);

  /* ------------------------------------------------------------------
     Basic chrome: year, nav state, scroll progress, active link
  ------------------------------------------------------------------ */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var nav = $("#nav");
  var progress = $("#scrollProgress");
  var sections = $$("main section[id]");
  var navLinks = $$(".nav__link");
  var scrollQueued = false;

  function onScrollFrame() {
    scrollQueued = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle("is-scrolled", y > 24);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";

    if (sections.length && navLinks.length) {
      var probe = y + window.innerHeight * 0.34;
      var current = sections[0];
      sections.forEach(function (section) {
        if (section.offsetTop <= probe) current = section;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + current.id);
      });
    }
  }
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(onScrollFrame);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScrollFrame();

  var toTop = $("#toTop");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------------ */
  var hamburger = $("#hamburger");
  var mmenu = $("#mobileMenu");
  var menuOpen = false;

  if (mmenu) {
    $$(".mmenu__nav a", mmenu).forEach(function (a, i) {
      a.style.setProperty("--i", i);
    });
  }

  function setMenu(open) {
    if (!mmenu || !hamburger) return;
    menuOpen = open;
    mmenu.classList.toggle("is-open", open);
    mmenu.setAttribute("aria-hidden", open ? "false" : "true");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    hamburger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    document.body.classList.toggle("is-locked", open);
    if (open) {
      var first = $(".mmenu__nav a", mmenu);
      if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 260);
    }
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () { setMenu(!menuOpen); });
  }
  if (mmenu) {
    $$("a", mmenu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuOpen) setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960 && menuOpen) setMenu(false);
  });

  /* ------------------------------------------------------------------
     Reveal on scroll + stagger + counters
  ------------------------------------------------------------------ */
  $$(".apps__grid > *").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.07).toFixed(2) + "s"); });
  $$(".store__products > *").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.07).toFixed(2) + "s"); });
  $$(".services > *").forEach(function (el, i) { el.style.setProperty("--d", (i * 0.07).toFixed(2) + "s"); });
  $$(".gallery__grid > *").forEach(function (el, i) { el.style.setProperty("--d", (i % 4) * 0.05 + "s"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    $$("[data-reveal]").forEach(function (el) { revealObserver.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  var counters = $$("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var duration = 1500;
    var start = null;
    if (reduceMotion) { el.textContent = String(target); return; }
    function step(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ------------------------------------------------------------------
     Role rotator
  ------------------------------------------------------------------ */
  var roleEl = $("#role");
  if (roleEl) {
    var roles = (roleEl.getAttribute("data-roles") || "Fotografer").split(",");
    var roleIndex = 0;
    window.setInterval(function () {
      if (document.hidden) return;
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.classList.add("is-out");
      window.setTimeout(function () {
        roleEl.textContent = roles[roleIndex];
        roleEl.classList.remove("is-out");
      }, 230);
    }, 2600);
  }

  /* ------------------------------------------------------------------
     App screenshot switcher (PAKU)
  ------------------------------------------------------------------ */
  var appScreen = $("#appScreen");
  var appThumbs = $$(".app-thumb");
  if (appScreen && appThumbs.length) {
    var selectShot = function (btn) {
      if (!btn || btn.classList.contains("is-active")) return;
      var nextSrc = btn.getAttribute("data-shot");
      if (!nextSrc) return;

      appThumbs.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
        b.tabIndex = active ? 0 : -1;
      });

      appScreen.classList.add("is-switching");
      var preload = new Image();
      var swap = function () {
        appScreen.src = nextSrc;
        appScreen.alt = btn.getAttribute("data-alt") || "Tangkapan layar PAKU";
        window.requestAnimationFrame(function () {
          appScreen.classList.remove("is-switching");
        });
      };
      preload.onload = swap;
      preload.onerror = swap;
      preload.src = nextSrc;
      window.setTimeout(function () {
        if (appScreen.classList.contains("is-switching")) swap();
      }, 800);
    };

    appThumbs.forEach(function (btn, index) {
      btn.tabIndex = index === 0 ? 0 : -1;
      btn.addEventListener("click", function () { selectShot(btn); });
    });

    var appTablist = $(".app-thumbs");
    if (appTablist) {
      appTablist.addEventListener("keydown", function (event) {
        var current = appThumbs.indexOf(document.activeElement);
        if (current < 0) return;
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % appThumbs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + appThumbs.length) % appThumbs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = appThumbs.length - 1;
        if (next === null) return;
        event.preventDefault();
        appThumbs[next].focus();
        selectShot(appThumbs[next]);
      });
    }
  }

  /* ------------------------------------------------------------------
     3D tilt (scene + cards)
  ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    var scene = $("#scene");
    var hero = $("#hero") || $(".hero");
    if (scene && hero) {
      var sceneFrame = null;
      hero.addEventListener("pointermove", function (event) {
        if (sceneFrame) return;
        sceneFrame = window.requestAnimationFrame(function () {
          sceneFrame = null;
          var rect = hero.getBoundingClientRect();
          var nx = (event.clientX - rect.left) / rect.width - 0.5;
          var ny = (event.clientY - rect.top) / rect.height - 0.5;
          scene.style.setProperty("--ry", (nx * 16).toFixed(2) + "deg");
          scene.style.setProperty("--rx", (-ny * 12).toFixed(2) + "deg");
        });
      });
      hero.addEventListener("pointerleave", function () {
        scene.style.setProperty("--ry", "0deg");
        scene.style.setProperty("--rx", "0deg");
      });
    }

    $$("[data-tilt]").forEach(function (el) {
      var frame = null;
      el.addEventListener("pointermove", function (event) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = null;
          var rect = el.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width;
          var py = (event.clientY - rect.top) / rect.height;
          el.style.setProperty("--ty", ((px - 0.5) * 9).toFixed(2) + "deg");
          el.style.setProperty("--tx", ((0.5 - py) * 9).toFixed(2) + "deg");
          el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        });
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--ty", "0deg");
        el.style.setProperty("--tx", "0deg");
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "0%");
      });
    });
  }

  /* ------------------------------------------------------------------
     Magnetic buttons
  ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.14;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.2;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     Custom cursor
  ------------------------------------------------------------------ */
  var cursor = $("#cursor");
  if (cursor && finePointer && !reduceMotion) {
    var cursorRing = $(".cursor__ring", cursor);
    var cursorDot = $(".cursor__dot", cursor);
    var cTargetX = window.innerWidth / 2;
    var cTargetY = window.innerHeight / 2;
    var cX = cTargetX;
    var cY = cTargetY;
    var cursorVisible = false;

    window.addEventListener("pointermove", function (event) {
      cTargetX = event.clientX;
      cTargetY = event.clientY;
      if (!cursorVisible) {
        cursorVisible = true;
        cursor.classList.add("is-visible");
      }
      var interactive = event.target.closest("a, button, input, select, textarea, .g-media, [data-tilt]");
      cursor.classList.toggle("is-link", Boolean(interactive));
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      cursorVisible = false;
      cursor.classList.remove("is-visible");
    });

    (function cursorLoop() {
      cX += (cTargetX - cX) * 0.18;
      cY += (cTargetY - cY) * 0.18;
      if (cursorRing) cursorRing.style.transform = "translate(" + cX + "px," + cY + "px)";
      if (cursorDot) cursorDot.style.transform = "translate(" + cTargetX + "px," + cTargetY + "px)";
      window.requestAnimationFrame(cursorLoop);
    })();
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ------------------------------------------------------------------
     Bokeh canvas (hero)
  ------------------------------------------------------------------ */
  var canvas = $("#bokeh");
  if (canvas && canvas.getContext) {
    (function bokeh() {
      var ctx = canvas.getContext("2d");
      var host = canvas.parentElement;
      var circles = [];
      var width = 0;
      var height = 0;
      var mouseX = 0;
      var mouseY = 0;
      var visible = true;
      var running = false;
      var dpr = 1;

      function accentRgb() {
        var value = getComputedStyle(root).getPropertyValue("--accent-rgb").trim();
        return value || "232, 163, 61";
      }

      function spawn() {
        var count = Math.max(12, Math.min(30, Math.round(width / 42)));
        circles = [];
        for (var i = 0; i < count; i++) {
          circles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 10 + Math.random() * Math.min(52, width * 0.09),
            a: 0.02 + Math.random() * 0.1,
            vx: (Math.random() - 0.5) * 0.16,
            vy: -(0.06 + Math.random() * 0.2),
            warm: Math.random() > 0.55,
            depth: 0.4 + Math.random() * 1.2
          });
        }
      }

      function resize() {
        var rect = host.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        spawn();
        if (reduceMotion) draw();
      }

      function draw() {
        if (!width || !height) return;
        ctx.clearRect(0, 0, width, height);
        var rgb = accentRgb();
        var isLight = root.getAttribute("data-theme") === "light";
        for (var i = 0; i < circles.length; i++) {
          var c = circles[i];
          var px = c.x + mouseX * 24 * c.depth;
          var py = c.y + mouseY * 18 * c.depth;
          var grad = ctx.createRadialGradient(px, py, 0, px, py, c.r);
          var alpha = c.a * (isLight ? 0.7 : 1);
          var color = c.warm ? rgb : "235, 238, 245";
          grad.addColorStop(0, "rgba(" + color + "," + alpha.toFixed(3) + ")");
          grad.addColorStop(0.55, "rgba(" + color + "," + (alpha * 0.45).toFixed(3) + ")");
          grad.addColorStop(1, "rgba(" + color + ",0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, c.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function frame() {
        if (!running) return;
        for (var i = 0; i < circles.length; i++) {
          var c = circles[i];
          c.x += c.vx;
          c.y += c.vy;
          if (c.y + c.r < -20) {
            c.y = height + c.r;
            c.x = Math.random() * width;
          }
          if (c.x < -c.r - 40) c.x = width + c.r;
          if (c.x > width + c.r + 40) c.x = -c.r;
        }
        draw();
        window.requestAnimationFrame(frame);
      }

      function start() {
        if (reduceMotion || running) return;
        running = true;
        window.requestAnimationFrame(frame);
      }
      function stop() {
        running = false;
      }

      window.addEventListener("pointermove", function (event) {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      if ("ResizeObserver" in window) {
        new ResizeObserver(resize).observe(host);
      } else {
        window.addEventListener("resize", resize);
      }
      resize();

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        }, { threshold: 0.02 }).observe(host);
      } else {
        start();
      }

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else if (visible) start();
      });

      // Theme change re-renders colours
      var themeObserver = new MutationObserver(function () { draw(); });
      themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    })();
  }

  /* ------------------------------------------------------------------
     Gallery: filter + count + lightbox
  ------------------------------------------------------------------ */
  var galleryGrid = $("#galleryGrid");
  var galleryCount = $("#galleryCount");
  var filterButtons = $$(".filter");
  var cards = $$(".g-card", galleryGrid || document);

  function applyFilter(filter) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-cat") === filter;
      if (match) {
        shown++;
        card.hidden = false;
        window.requestAnimationFrame(function () { card.classList.remove("is-out"); });
      } else {
        card.classList.add("is-out");
        window.setTimeout(function () {
          if (card.classList.contains("is-out")) card.hidden = true;
        }, 260);
      }
    });
    if (galleryCount) galleryCount.textContent = String(shown);
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-active")) return;
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      applyFilter(btn.getAttribute("data-filter") || "all");
    });
  });

  var lightbox = $("#lightbox");
  var lbImage = $("#lbImage");
  var lbTitle = $("#lbTitle");
  var lbMeta = $("#lbMeta");
  var lbCounter = $("#lbCounter");
  var lbClose = $(".lb-btn--close");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lbIndex = 0;
  var lastFocus = null;
  var touchStartX = null;

  function visibleCards() {
    return cards.filter(function (card) { return !card.hidden; });
  }

  function paintLightbox(card) {
    if (!card || !lbImage) return;
    var img = $("img", card);
    var src = card.getAttribute("data-src") || (img ? img.src : "");
    lbImage.src = src;
    lbImage.alt = img ? img.alt : "";
    if (lbTitle) lbTitle.textContent = card.getAttribute("data-title") || "";
    if (lbMeta) lbMeta.textContent = card.getAttribute("data-meta") || "";
    var list = visibleCards();
    var pos = list.indexOf(card);
    if (lbCounter) {
      lbCounter.textContent = String(pos + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0");
    }
  }

  function openLightbox(card) {
    if (!lightbox || !card) return;
    var list = visibleCards();
    lbIndex = Math.max(0, list.indexOf(card));
    lastFocus = document.activeElement;
    paintLightbox(card);
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    window.requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
    if (lbClose) window.setTimeout(function () { lbClose.focus({ preventScroll: true }); }, 120);
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    window.setTimeout(function () {
      lightbox.hidden = true;
      if (lbImage) lbImage.removeAttribute("src");
    }, 320);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  }

  function stepLightbox(dir) {
    var list = visibleCards();
    if (!list.length) return;
    lbIndex = (lbIndex + dir + list.length) % list.length;
    paintLightbox(list[lbIndex]);
  }

  cards.forEach(function (card) {
    var trigger = $(".g-media", card);
    if (!trigger) return;
    trigger.addEventListener("click", function () { openLightbox(card); });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  $$("[data-lb-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });
  if (lbPrev) lbPrev.addEventListener("click", function () { stepLightbox(-1); });
  if (lbNext) lbNext.addEventListener("click", function () { stepLightbox(1); });

  window.addEventListener("keydown", function (event) {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });

  if (lightbox) {
    lightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (touchStartX === null) return;
      var delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) stepLightbox(delta > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Copy email
  ------------------------------------------------------------------ */
  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () { legacyCopy(text, onDone); });
    } else {
      legacyCopy(text, onDone);
    }
  }
  function legacyCopy(text, onDone) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(area);
    onDone();
  }
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      copyText(EMAIL, function () { toast("Email disalin: " + EMAIL); });
    });
  }

  /* ------------------------------------------------------------------
     Contact form → mailto
  ------------------------------------------------------------------ */
  var form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = $("#name", form);
      var email = $("#email", form);
      var topic = $("#topic", form);
      var message = $("#message", form);
      var valid = true;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email.value || "").trim());

      [name, email, message].forEach(function (field) {
        field.classList.remove("is-invalid");
      });

      if (!name.value.trim()) { name.classList.add("is-invalid"); valid = false; }
      if (!emailOk) { email.classList.add("is-invalid"); valid = false; }
      if (!message.value.trim()) { message.classList.add("is-invalid"); valid = false; }

      if (!valid) {
        toast("Lengkapi nama, email yang valid, dan pesan ya.");
        var first = $(".is-invalid", form);
        if (first) first.focus({ preventScroll: false });
        return;
      }

      var subject = "[Portofolio] " + (topic ? topic.value : "Halo") + " — " + name.value.trim();
      var body =
        "Halo Maspram,\n\n" +
        "Nama: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n" +
        "Kebutuhan: " + (topic ? topic.value : "-") + "\n\n" +
        message.value.trim() + "\n";

      window.location.href =
        "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      toast("Membuka aplikasi email kamu…");
    });

    $$("input, textarea", form).forEach(function (field) {
      field.addEventListener("input", function () { field.classList.remove("is-invalid"); });
    });
  }

  /* ------------------------------------------------------------------
     Lazy-load fallback for dynamically broken images (safety net)
  ------------------------------------------------------------------ */
  window.setTimeout(function () {
    $$("img[data-fallback]").forEach(guardImage);
  }, 2500);
})();
