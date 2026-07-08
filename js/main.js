/* ============================================================================
   DOWNLOAD CONFIG — the only thing you edit when you ship a new version.
   1. Create a Release in your public downloads repo, tagged vX.Y.Z, with the
      StitchifySetup-X.Y.Z.exe attached.
   2. Update LATEST below + add an entry to the top of RELEASES.
   Asset URL pattern:
   https://github.com/<user>/<repo>/releases/download/vX.Y.Z/StitchifySetup-X.Y.Z.exe
   ============================================================================ */
const RELEASE_REPO = "https://github.com/SuertoMark24/stitchify-site";
const CONTACT_EMAIL = "suertomarkanthony@gmail.com";

// Buttons point at the GitHub "latest release" — whatever release you mark Latest auto-serves,
// so you NEVER edit this file when you patch. Just publish a new release with these two assets
// (StitchifySetup.exe + StitchifyUpdate.zip). Only bump `version` here to update the label text.
const LATEST = {
  version: "3.1.0",
  url: RELEASE_REPO + "/releases/latest/download/StitchifySetup.exe",     // full installer (Home)
  updateUrl: RELEASE_REPO + "/releases/latest/download/StitchifyUpdate.zip", // small patch (Patch page)
};

const RELEASES = [
  {
    version: "3.1.0",
    date: "Jul 8, 2026",
    latest: true,
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

/* ---- Wire up download buttons + version labels ---- */
document.querySelectorAll("[data-download]").forEach((a) => { a.href = LATEST.url; });
document.querySelectorAll("[data-patch]").forEach((a) => { a.href = LATEST.updateUrl; });
document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = "v" + LATEST.version; });
document.querySelectorAll("[data-contact]").forEach((a) => {
  a.href = "mailto:" + CONTACT_EMAIL + "?subject=Stitchify%20license";
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
