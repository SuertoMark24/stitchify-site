/* ============================================================================
   RELEASE CONFIG — the only thing you edit when you ship a new version.
   Distribution is manual now (Discord community -> accept terms -> installer by
   email), so there's no direct download button to wire up. Just bump `version`
   below + add an entry to the top of RELEASES for the changelog / version label.
   ============================================================================ */
const RELEASE_REPO = "https://github.com/SuertoMark24/stitchify-site";
const CONTACT_EMAIL = "suertomarkanthony@gmail.com";

const LATEST = {
  version: "3.3.5",
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

/* ---- Tab switching (Home / Patch) via hash ---- */
function showView() {
  const isPatch = location.hash === "#patch";
  document.getElementById("home").classList.toggle("active", !isPatch);
  document.getElementById("patch").classList.toggle("active", isPatch);
  document.querySelectorAll(".nav-links a[data-tab]").forEach((a) => {
    a.classList.toggle("active", (a.getAttribute("href") === "#patch") === isPatch);
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showView);
showView();

/* ---- Footer year ---- */
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

/* ---- Maximize a demo video to fullscreen ---- */
function maximizeVideo(btn) {
  const v = btn.parentElement.querySelector("video");
  if (!v) return;
  const req = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen || v.msRequestFullscreen;
  if (req) { try { req.call(v); } catch (e) { /* ignore */ } }
  v.muted = false; // give sound when they choose to enlarge it
}
