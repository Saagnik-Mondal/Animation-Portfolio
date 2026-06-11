/* =========================================================================
   AURORA — interactions: rendering, lightbox, scroll reveals, cursor
   (Reads content from js/data.js — you should not need to edit this file.)
   ========================================================================= */

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // escape user-editable strings before they go into markup
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // YouTube IDs are short [A-Za-z0-9_-] tokens; reject anything else so a bad
  // value can never break out of a URL or attribute
  const videoId = (p) => (/^[\w-]{6,16}$/.test(p.youtubeId) ? p.youtubeId : "");

  const thumbFor = (p) =>
    p.thumb || `https://img.youtube.com/vi/${videoId(p)}/maxresdefault.jpg`;
  const fallbackThumb = (p) =>
    `https://img.youtube.com/vi/${videoId(p)}/hqdefault.jpg`;

  /* ---------- inject site text ---------- */
  function applySiteText() {
    document.title = `${SITE.studioName} — ${SITE.tagline}`;
    $$("[data-studio]").forEach((el) => (el.textContent = SITE.studioName));
    $$("[data-tagline]").forEach((el) => (el.textContent = SITE.tagline));
    $$("[data-about]").forEach((el) => (el.textContent = SITE.about));
    $$("[data-email]").forEach((el) => {
      el.textContent = SITE.email;
      el.setAttribute("href", `mailto:${SITE.email}`);
    });
    $("#heroTitle").textContent = SITE.heroHeadline;
    $("#year").textContent = new Date().getFullYear();
    $("#statFilms").dataset.target = PROJECTS.length;

    // socials
    const socialWrap = $("#socials");
    const labels = { youtube: "YouTube", instagram: "Instagram", vimeo: "Vimeo" };
    Object.entries(SITE.socials).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = labels[key] || key;
      a.dataset.cursor = "hover";
      socialWrap.appendChild(a);
    });
  }

  /* ---------- hero featured film ---------- */
  let featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];

  function buildHero() {
    const media = $("#heroMedia");
    const playBtn = $("#heroPlay");

    // No films yet — show a cinematic "coming soon" hero instead of a video.
    if (!featured) {
      media.classList.add("hero__media--empty");
      const yt = SITE.socials && SITE.socials.youtube;
      if (yt) {
        $(".hero__play-text", playBtn).textContent = "Subscribe on YouTube";
        playBtn.addEventListener("click", () =>
          window.open(yt, "_blank", "noopener"));
      } else {
        playBtn.hidden = true;
      }
      return;
    }

    // muted autoplay loop as a cinematic background
    const id = videoId(featured);
    const iframe = document.createElement("iframe");
    iframe.src =
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
      `&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1`;
    iframe.allow = "autoplay; encrypted-media";
    iframe.title = featured.title;
    // graceful fallback: if iframe is blocked, show the thumbnail underneath
    const img = document.createElement("img");
    img.src = thumbFor(featured);
    img.alt = featured.title;
    img.onerror = () => (img.src = fallbackThumb(featured));
    media.appendChild(img);
    media.appendChild(iframe);

    $("#heroPlay").addEventListener("click", () => openLightbox(featured));
  }

  /* ---------- work grid ---------- */
  function buildGrid() {
    const grid = $("#grid");

    // No films yet — show a friendly placeholder instead of an empty grid.
    if (!PROJECTS.length) {
      const yt = (SITE.socials && SITE.socials.youtube) || "";
      const note = document.createElement("div");
      note.className = "grid__empty reveal";
      const link = yt
        ? ` Subscribe on <a href="${esc(yt)}" target="_blank" rel="noopener">YouTube</a> to be first to watch.`
        : "";
      note.innerHTML =
        '<p class="grid__empty-title">First films coming soon.</p>' +
        `<p class="grid__empty-sub">New animated stories are in the works.${link}</p>`;
      grid.appendChild(note);
      return;
    }

    PROJECTS.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.transitionDelay = `${(i % 2) * 0.08}s`;
      card.dataset.cursor = "hover";
      card.innerHTML = `
        <div class="card__media">
          <img src="${esc(thumbFor(p))}" alt="${esc(p.title)}" loading="lazy" />
          <div class="card__play"><span>▶</span></div>
        </div>
        <div class="card__bar">
          <h3 class="card__title">${esc(p.title)}</h3>
          <span class="card__meta">${esc(p.category)}<br/>${esc(p.year)}</span>
        </div>`;
      const img = $("img", card);
      img.addEventListener("error", () => (img.src = fallbackThumb(p)), { once: true });
      card.addEventListener("click", () => openLightbox(p));
      grid.appendChild(card);
    });
  }

  /* ---------- lightbox ---------- */
  const lightbox = $("#lightbox");
  const frame = $("#lightboxFrame");

  function openLightbox(p) {
    const iframe = document.createElement("iframe");
    iframe.src =
      `https://www.youtube-nocookie.com/embed/${videoId(p)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = p.title;
    iframe.allow = "autoplay; encrypted-media; fullscreen";
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    $("#lightboxTitle").textContent = `${p.title} — ${p.category}, ${p.year}`;
    $("#lightboxDesc").textContent = p.description || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => (frame.innerHTML = ""), 400); // stop the video
  }

  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.15 }
    );
    $$(".card, .reveal").forEach((el) => io.observe(el));
  }

  /* ---------- count up stat ---------- */
  function initCount() {
    const el = $("#statFilms");
    const target = parseInt(el.dataset.target || "0", 10);
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        let n = 0;
        const step = Math.max(1, Math.round(target / 30));
        const t = setInterval(() => {
          n += step;
          if (n >= target) { n = target; clearInterval(t); }
          el.textContent = n;
        }, 40);
        obs.disconnect();
      });
    }, { threshold: 0.5 });
    io.observe(el);
  }

  /* ---------- nav scroll state ---------- */
  function initNav() {
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    const nav = $("#nav");
    const btn = $("#navMenu");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");

    const setOpen = (open) => {
      nav.classList.toggle("is-menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    btn.addEventListener("click", () => setOpen(!nav.classList.contains("is-menu-open")));
    $$(".nav__link").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- contact modal (Web3Forms) ---------- */
  function initContact() {
    const modal = $("#contactModal");
    const form = $("#contactForm");
    if (!modal || !form) return;

    const openBtn = $("#contactOpen");
    const closeBtn = $("#contactClose");
    const submitBtn = $("#cfSubmit");
    const errorEl = $("#cfError");
    const successEl = $("#cfSuccess");

    // inject the Web3Forms access key from config
    $("#cfKey").value = SITE.formAccessKey || "";

    const open = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const first = $('input[name="name"]', form);
      if (first) setTimeout(() => first.focus(), 300);
    };
    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const reset = () => {
      // restore the form view after a successful send
      form.hidden = false;
      successEl.hidden = true;
      form.reset();
      $("#cfKey").value = SITE.formAccessKey || "";
      errorEl.hidden = true;
    };

    const showError = (msg) => {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    };

    openBtn && openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", () => { close(); reset(); });
    $("#cfDone").addEventListener("click", () => { close(); reset(); });
    modal.addEventListener("click", (e) => { if (e.target === modal) { close(); reset(); } });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) { close(); reset(); }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.hidden = true;

      // honeypot: silently ignore bot submissions
      const data = new FormData(form);
      if (data.get("botcheck")) return;

      // native validation (we set novalidate on the form to control messaging)
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (!SITE.formAccessKey || SITE.formAccessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        showError("The contact form isn't connected yet. Please email directly for now.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        const json = await res.json();
        if (json.success) {
          form.hidden = true;
          successEl.hidden = false;
        } else {
          showError(json.message || "Could not send. Please try again.");
        }
      } catch {
        showError("Network error — please try again in a moment.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.label || "Send message";
      }
    });
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    const cur = $("#cursor");
    if (matchMedia("(hover: none)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", (e) => {
      const hot = e.target.closest('[data-cursor="hover"], a, button');
      cur.classList.toggle("is-hover", !!hot);
    });
  }

  /* ---------- loader ---------- */
  function initLoader() {
    const loader = $("#loader");
    if (!loader) return;
    const countEl = $("#loaderCount");
    const fill = $("#loaderBarFill");

    const finish = () => {
      loader.classList.add("is-done");
      document.body.style.overflow = "";
    };

    // respect reduced-motion: skip the animated intro
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (countEl) countEl.textContent = "100";
      if (fill) fill.style.width = "100%";
      setTimeout(finish, 250);
      return;
    }

    // hold the page still while the intro plays
    document.body.style.overflow = "hidden";

    let loaded = false;
    window.addEventListener("load", () => (loaded = true), { once: true });

    const duration = 1700;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const pct = Math.round(easeOut(t) * 100);
      if (countEl) countEl.textContent = pct;
      if (fill) fill.style.width = `${pct}%`;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // count has reached 100 — wait for the page to actually be ready,
        // then lift the curtain (window "load" waits for the hero iframe)
        const reveal = () => setTimeout(finish, 350);
        loaded ? reveal() : window.addEventListener("load", reveal, { once: true });
      }
    };
    requestAnimationFrame(step);

    // safety net: never trap visitors behind the loader on a slow connection
    setTimeout(finish, 5000);
  }

  /* ---------- boot ---------- */
  applySiteText();
  buildHero();
  buildGrid();
  initReveal();
  initCount();
  initNav();
  initMenu();
  initContact();
  initCursor();
  initLoader();
})();
