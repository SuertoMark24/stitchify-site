# Stitchify — Marketing & Download Site

Static sales + download page for Stitchify. Plain HTML/CSS/JS, no build step. Deployed to
**Netlify** from this public GitHub repo. Installer downloads are served from **GitHub Releases**.

```
index.html        Home (sales) + Patch views (hash tabs: #home / #patch)
css/style.css     Stitchify glass branding
js/main.js        DOWNLOAD CONFIG (edit per release) + tab logic + patch rendering
assets/logo.svg   Logo
netlify.toml      Static config + security headers
```

## Deploy (once)
1. Push this folder to a **public** GitHub repo (e.g. `stitchify-site`).
2. Netlify → **Add new site → Import from GitHub** → pick the repo.
3. Build command: **(none)**, Publish directory: **`.`** → Deploy. Every push auto-deploys.
4. (Optional) add a custom domain in Netlify.

## Where the installer is hosted (GitHub Releases)
1. Create a **separate public repo** for binaries: `stitchify-site (releases hosted on this same repo)` (no source, just files).
2. For each version, create a **Release** tagged `vX.Y.Z` and attach `StitchifySetup-X.Y.Z.exe`.
3. The download URL is then:
   `https://github.com/SuertoMark24/stitchify-site (releases hosted on this same repo)/releases/download/vX.Y.Z/StitchifySetup-X.Y.Z.exe`

## Ship a new version (edit ONE file: `js/main.js`)
At the top of `js/main.js`:
```js
const LATEST = { version: "3.2.0", url: RELEASE_REPO + "/releases/download/v3.2.0/StitchifySetup-3.2.0.exe" };

const RELEASES = [
  { version: "3.2.0", date: "…", latest: true, notes: ["…","…"], url: RELEASE_REPO + "/releases/download/v3.2.0/StitchifySetup-3.2.0.exe" },
  // …older versions below…
];
```
Commit + push → Netlify redeploys. The Home download button and the Patch list both update.

## Config knobs (top of `js/main.js`)
- `RELEASE_REPO` — the downloads repo URL.
- `CONTACT_EMAIL` — where the "Contact to purchase" button points.
- `LATEST` / `RELEASES` — the download links.
