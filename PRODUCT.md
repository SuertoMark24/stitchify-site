# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo TikTok Shop affiliates, mostly in the Philippines, each running a handful of accounts (2–6, sometimes more with add-ons) by themselves. Their job: get product content out to every account, every day, without losing evenings to logging in and uploading by hand. They are sellers and creators, not software buyers. They come from TikTok and Discord, and they decide by talking to the founder.

## Product Purpose

This site sells and supports **Stitchify Pro**, a Windows 10/11 desktop app. It is the public face for:

- **Selling:** move a visitor to join Discord and ask for a quote.
- **Onboarding:** Docs / Getting Started.
- **Updates:** the Patch view points customers to Discord for the latest patch.
- **Risk disclosure:** About & Risks, plus the footer disclaimer.

Success means a qualified affiliate joins Discord to get access, knowing what the app does and what the risks are.

## Positioning

Lead with **hands-off posting**. Stitchify Pro queues content and posts it directly to every TikTok account on a schedule set once, from the user's own PC and connection. There's no cloud and no datacenter IPs. Video generation (product photo → AI script → AI video → voiceover → stitched clip) is the upsell on higher editions and the AI Automation add-on, not the headline. Supporting angle: it was built by a working TikTok Shop affiliate for his own accounts, not by a software company.

## Operating Context

- The app is self-hosted on the customer's Windows PC. It drives a real browser to log in to and post from the customer's TikTok accounts. It calls third-party AI providers (Gemini, ElevenLabs, Higgsfield, MuAPI, Google Flow, ChatGPT) using API keys the customer supplies and pays for.
- Buying happens through Discord (`discord.gg/hhvxmvm9N`). There's no self-serve checkout: the customer asks for a quote, pays, and gets a license key and installer.
- Setup flow: get key → install (no admin rights, runtime/FFmpeg/browser bundled) → activate → add API keys (Basic skips this) → log in TikTok accounts → queue and schedule.
- Paid 1-on-1 setup sessions are offered for customers who get stuck.
- Patches are handed out in Discord and applied by copying files over the install folder.

## Capabilities and Constraints

- **Site stack:** plain static HTML/CSS/JS, no build step, deployed to Netlify from GitHub. Hash-tab views in `index.html` (`#home`, `#docs`, `#patch`, `#about`). Release/version config lives at the top of `js/main.js`.
- **Editions:**
  - Basic: 2 accounts. Auto-posting, CAPTCHA monitor, rewards dashboard, account management.
  - Standard: 4 accounts. Adds video stitcher, AI voiceover, prompt library.
  - Premium: 6 accounts. Adds Product Import from TikTok Shop and Affiliates / Batch Stitch.
- **Add-ons:** AI Automation, One-click, Scene Maker, Downloader, extra accounts and PCs.
- **Licensing:** a **monthly or yearly subscription** (yearly = 2 months free), activated online and locked to one PC. The "one-time license" wording on About & Risks is outdated and needs correcting.
- **Pricing:** quote-based on the public site. Real prices (PHP) live only on the passphrase-encrypted `internal/pricing.html` (noindex). Public pages must not show prices.
- **Installer:** unsigned, so Windows SmartScreen warns on first install.
- Not affiliated with TikTok.

## Brand Commitments

- **Name:** "Stitchify Pro". Logo: `assets/logo.svg`.
- **Voice:** plain-spoken, first-person from the founder (Mark), honest about limits. Risk copy is "plain language, no fine print games" and must never be softened or buried.
- **Discord** is the single conversion channel.

## Evidence on Hand

- Founder's note and avatar: `assets/reviews/me-avatar.jpg`.
- Demo videos: `assets/demo/loop.mp4` (queue posting to TikTok) and `assets/demo/stich_demo-1080.mp4` (photo → finished video), with posters.
- **Customer reviews do not exist yet.** The three carousel cards are placeholders. Never fabricate reviewer names, quotes, handles, earnings, follower counts or results; leave placeholders until real ones are supplied.
- No press, customer counts or performance benchmarks are on hand. Don't invent them.

## Product Principles

1. **Honesty over hype.** The ban risk, ToS risk and "estimates, not income" caveats are part of the product. Persuasion never contradicts or hides them.
2. **Posting first.** Every surface leads with hands-off, multi-account posting. AI generation is the step up.
3. **Your PC, your accounts, your keys.** Local, self-hosted control is a selling point and a responsibility. Say both.
4. **One path to a human.** Every route ends in Discord with the founder. Don't introduce competing funnels.
5. **Built for a solo operator.** Write for one affiliate doing everything alone, not for a team buyer.
