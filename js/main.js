/* ============================================================================
   RELEASE CONFIG — the only thing you edit when you ship a new version.
   Distribution is manual now (Discord community -> accept terms -> installer by
   email), so there's no direct download button to wire up. Just bump `version`
   below + add an entry to the top of RELEASES for the changelog / version label.
   ============================================================================ */
const RELEASE_REPO = "https://github.com/SuertoMark24/stitchify-site";
const CONTACT_EMAIL = "suertomarkanthony@gmail.com";

const LATEST = {
  version: "5.0.9",
};

const RELEASES = [
  {
    version: "3.3.5",
    date: "Aug 4, 2026",
    latest: true,
    notes: [
      "New UGC prompt sets: Bubble Handheld (playful bubble-caption cover + hand-reveal video) and Cinemagraph Shop-the-Look",
      "Fixed UGC review montage videos sometimes showing the reference storyboard grid itself instead of real footage",
      "TikTok Shop CAPTCHA window now pops to the front automatically so it's always clear which browser window to solve it in",
    ],
  },
  {
    version: "3.3.4",
    date: "Jul 28, 2026",
    notes: [
      "TikTok Shop CAPTCHA now shows a live countdown so you can solve it and the post continues automatically",
      "Added a Proceed button to skip the wait once you've solved it yourself",
    ],
  },
  {
    version: "3.3.3",
    date: "Jul 27, 2026",
    notes: [
      "TikTok account management (Add / Remove / Relogin) moved to a dedicated section in Settings",
      "Fixed product-linking sometimes failing to find your TikTok Shop products when posting",
    ],
  },
  {
    version: "3.3.2",
    date: "Jul 16, 2026",
    notes: [
      "New UGC ad sets for Shoes, Apparel (tops/dresses/shorts) & Gadgets — all built from one product photo",
      "Smarter review montages: adapts to each product type, closes on a scene + product showcase shot",
    ],
  },
  {
    version: "3.3.1",
    date: "Jul 13, 2026",
    notes: [
      "UGC ad prompts — review montage, cover poster & Flow video from one photo",
      "Dedicated Audio Generator page",
    ],
  },
  {
    version: "3.3.0",
    date: "Jul 9, 2026",
    notes: [
      "Two editions — Starter and Premium",
      "Dedicated Audio Generator page",
    ],
  },
  {
    version: "3.2.0",
    date: "Jul 9, 2026",
    notes: [
      "Editable prompts — edit any prompt or create your own",
      "Per-account voiceover voice",
      "Dynamic Product 360 image + video prompt",
      "Version shown at the bottom of every page",
    ],
  },
  {
    version: "3.1.2",
    date: "Jul 8, 2026",
    notes: ['Rebranded to "Stitchify Pro"'],
  },
  {
    version: "3.1.0",
    date: "Jul 8, 2026",
    notes: [
      '"Hey Stitch" voice command — schedule a whole batch by voice',
      "MuAPI provider — 200+ AI video models (Kling, Veo, Sora, Wan, Seedance…)",
      "App icon on the installer + shortcuts",
      "Friendlier local address (stitchify.localhost)",
    ],
    url: RELEASE_REPO + "/releases/download/v3.1.0/StitchifySetup-3.1.0.exe",
    updateUrl: RELEASE_REPO + "/releases/download/v3.1.0/StitchifyUpdate.zip",
  },
  {
    version: "3.0.0",
    date: "2026",
    notes: [
      "First sellable release: online license activation",
      "One-click installer (bundled runtime + FFmpeg + Chromium)",
      "Batch Stitch + customer-safe defaults",
    ],
    // no url -> no download button (v3.0.0 has no published release). Add a url here if you publish one.
  },
];

/* ---- Wire up version labels ---- */
document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = "v" + LATEST.version; });
document.querySelectorAll("[data-contact]").forEach((a) => {
  a.href = "mailto:" + CONTACT_EMAIL + "?subject=Stitchify%20Pro%20license";
});

/* ---- Render the Patch list ---- */
const relEl = document.getElementById("releases");
if (relEl) {
  relEl.innerHTML = RELEASES.map((r) => `
    <div class="release card">
      <div class="rmeta">
        <span class="rbadge">v${r.version}</span>${r.latest ? '<span class="rlatest">latest</span>' : ""}
        <span class="rdate">${r.date}</span>
      </div>
      <div class="rbody">
        <ul>${r.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
      </div>
    </div>`).join("");
}

/* ---- Tab switching (Home / Docs / Patch) via hash ---- */
const VIEW_IDS = ["home", "docs", "patch", "about"];
function showView() {
  const hash = location.hash.slice(1);
  const activeId = VIEW_IDS.includes(hash) ? hash : "home";
  VIEW_IDS.forEach((id) => document.getElementById(id)?.classList.toggle("active", id === activeId));
  document.querySelectorAll(".nav-links a[data-tab]").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + activeId);
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showView);
showView();

/* ---- Footer year ---- */
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

/* ============================================================================
   REVIEW CAROUSEL — 3D coverflow for the #reviews section.
   Cards are absolutely positioned; each one is placed in a "slot" by its signed
   distance from the active index (0 = front, ±1, ±2 = receding to either side),
   and the browser animates between slots via the CSS transition. It drifts on its
   own and pauses whenever the reader is likely to be looking at it (hover, focus,
   off-screen, background tab). Drag / swipe / arrows / dots all steer it.
   Markup is the source of truth: add or delete .rv-card blocks in index.html and
   this adapts — no count to keep in sync.
   ============================================================================ */
(function reviewCarousel() {
  const root = document.getElementById("reviewCarousel");
  if (!root) return;
  const stage = root.querySelector(".rv-stage");
  const cards = Array.from(root.querySelectorAll(".rv-card"));
  const dotsWrap = root.querySelector(".rv-dots");
  if (!stage || cards.length === 0) return;

  // Placement per slot. `x` is a % of the card's own width so it scales with the card.
  // Push the neighbours well clear of the front card — anything closer and their text
  // collides with it instead of reading as a card sitting behind.
  const SLOTS = [
    { x: 0, z: 0, ry: 0, s: 1, veil: 0, op: 1 },
    { x: 88, z: -250, ry: 38, s: 0.8, veil: 0.55, op: 0.85 },
    { x: 150, z: -500, ry: 44, s: 0.64, veil: 0.75, op: 0.45 },
  ];
  const LAST_SLOT = SLOTS.length - 1;
  const DELAY = 5200;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let index = 0;
  let timer = null;
  let hovered = false;
  let focused = false;
  let onScreen = true;
  let dragging = false;

  const single = cards.length === 1;
  if (single) root.classList.add("is-single");

  /* ---- Dots ---- */
  const dots = single
    ? []
    : cards.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "rv-dot";
        b.setAttribute("aria-label", `Review ${i + 1} of ${cards.length}`);
        b.addEventListener("click", () => go(i));
        dotsWrap?.appendChild(b);
        return b;
      });

  /* ---- Placement ---- */
  // Signed distance around the ring, so wrapping always takes the short way round.
  function offsetOf(i) {
    const n = cards.length;
    let d = (i - index) % n;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  }

  function layout() {
    cards.forEach((card, i) => {
      const d = offsetOf(i);
      const dist = Math.abs(d);
      const dir = Math.sign(d);
      const slot = SLOTS[Math.min(dist, LAST_SLOT)];
      const far = dist > LAST_SLOT;
      const active = d === 0;

      card.style.transform =
        `translateX(-50%) translateX(${slot.x * dir}%) ` +
        `translateZ(${slot.z}px) rotateY(${slot.ry * dir}deg) scale(${slot.s})`;
      card.style.zIndex = String(100 - dist);
      card.style.opacity = String(far ? 0 : slot.op);   // inline wins over .is-far, so set it here
      card.classList.toggle("is-far", far);
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-hidden", active ? "false" : "true");

      const inner = card.querySelector(".rv-inner");
      if (inner) {
        inner.style.setProperty("--veil", far ? 0.8 : slot.veil);
        inner.style.transform = "";   // drop any leftover pointer tilt
      }
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-on", i === index));
  }

  function go(i) {
    const n = cards.length;
    index = ((i % n) + n) % n;
    layout();
    restart();
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  /* ---- Equal-height stage ----
     The cards are absolutely positioned, so they can't size the stage themselves —
     measure the tallest and pin both to it so every card is the same height. */
  function measure() {
    cards.forEach((c) => (c.style.height = "auto"));
    if (!stage.offsetWidth) return;   // section is in a hidden tab; nothing to measure yet
    const h = cards.reduce((m, c) => Math.max(m, c.offsetHeight), 0);
    if (!h) return;
    stage.style.height = h + "px";
    cards.forEach((c) => (c.style.height = h + "px"));
  }

  /* ---- Autoplay ---- */
  function stop() { clearInterval(timer); timer = null; }
  function restart() {
    stop();
    if (single || reduce.matches) return;
    if (hovered || focused || !onScreen || dragging || document.hidden) return;
    timer = setInterval(next, DELAY);
  }

  root.addEventListener("pointerenter", () => { hovered = true; restart(); });
  root.addEventListener("pointerleave", () => { hovered = false; resetTilt(); restart(); });
  root.addEventListener("focusin", () => { focused = true; restart(); });
  root.addEventListener("focusout", () => { focused = false; restart(); });
  document.addEventListener("visibilitychange", restart);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([e]) => { onScreen = e.isIntersecting; restart(); },
      { threshold: 0.15 }
    ).observe(root);
  }

  /* ---- Pointer tilt: the front card leans toward the cursor ---- */
  function resetTilt() {
    const inner = cards[index]?.querySelector(".rv-inner");
    if (inner) inner.style.transform = "";
  }

  stage.addEventListener("pointermove", (e) => {
    if (dragging || reduce.matches || e.pointerType === "touch") return;
    const card = cards[index];
    const inner = card?.querySelector(".rv-inner");
    if (!inner) return;
    const r = card.getBoundingClientRect();
    const clamp = (v) => Math.max(-0.5, Math.min(0.5, v));
    const px = clamp((e.clientX - r.left) / r.width - 0.5);
    const py = clamp((e.clientY - r.top) / r.height - 0.5);
    inner.style.transform = `rotateY(${px * 13}deg) rotateX(${-py * 9}deg) translateZ(6px)`;
  });

  /* ---- Drag / swipe ---- */
  let startX = 0;
  let swiped = false;
  stage.addEventListener("pointerdown", (e) => {
    if (single || e.button !== 0) return;
    dragging = true;
    swiped = false;
    startX = e.clientX;
    resetTilt();
    root.classList.add("is-dragging");
    stop();
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    const dx = e.clientX - startX;
    swiped = Math.abs(dx) > 45;
    if (swiped) (dx < 0 ? next : prev)();
    else restart();
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("pointerleave", endDrag);
  // A swipe that ends on a card shouldn't also fire a click on whatever's underneath it.
  stage.addEventListener("click", (e) => {
    if (swiped) { swiped = false; e.preventDefault(); e.stopPropagation(); }
  }, true);

  /* ---- Buttons + keyboard ---- */
  root.querySelector(".rv-prev")?.addEventListener("click", prev);
  root.querySelector(".rv-next")?.addEventListener("click", next);
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
    if (e.key === "ArrowRight") { next(); e.preventDefault(); }
  });

  /* ---- (Re)measure whenever the layout could have changed ---- */
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measure(); layout(); }, 150);
  });
  // Images and webfonts land after first paint, and the section starts life inside a
  // hidden tab if the visitor deep-links to #docs — so re-measure on those too.
  window.addEventListener("load", () => { measure(); layout(); });
  window.addEventListener("hashchange", () => setTimeout(() => { measure(); layout(); }, 0));
  document.fonts?.ready.then(() => { measure(); layout(); });
  reduce.addEventListener?.("change", restart);

  measure();
  layout();
  restart();
})();

/* ---- Maximize a demo video to fullscreen ---- */
function maximizeVideo(btn) {
  const v = btn.parentElement.querySelector("video");
  if (!v) return;
  const req = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen || v.msRequestFullscreen;
  if (req) { try { req.call(v); } catch (e) { /* ignore */ } }
  v.muted = false; // give sound when they choose to enlarge it
}
