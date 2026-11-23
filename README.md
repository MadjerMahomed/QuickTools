# QuickTools — Free Online Tools Website

A fast, mobile-friendly static website with 12 genuinely useful browser-based tools,
plus all the policy pages Google AdSense requires before it will approve a site.

**File upload included:** the Word Counter accepts drag & drop files (.txt, .md, .csv,
.json, .html and even PDFs via pdf.js). Files are parsed locally in the browser —
nothing is ever uploaded to a server.

## What's included

| File | Purpose |
|---|---|
| `index.html` | Homepage with tool grid |
| `word-counter.html` | Words, characters, sentences, reading time + file upload |
| `percentage-calculator.html` | 3 common percentage calculations |
| `unit-converter.html` | Length, weight, temperature, volume |
| `age-calculator.html` | Exact age + days to next birthday |
| `password-generator.html` | Secure random passwords (crypto API) |
| `bmi-calculator.html` | Metric + imperial BMI |
| `tip-calculator.html` | Tip + bill split |
| `compound-interest.html` | Savings and investment growth projection |
| `loan-calculator.html` | Fixed-rate loan payment and interest |
| `date-difference.html` | Exact duration between two dates |
| `discount-calculator.html` | Sale price, savings and final price |
| `text-case-converter.html` | Uppercase, lowercase, title and sentence case |
| `about.html`, `contact.html`, `privacy.html`, `terms.html` | AdSense-required pages |
| `assets/css/style.css` | Shared responsive design |
| `assets/js/main.js` | Shared site behavior |
| `assets/media/logo.svg` | Header logo image; replace it with your own logo |

No build step, no dependencies, no backend. Everything runs in the visitor's browser.

Shared assets are grouped under `assets/` by type. To use your own logo, replace
`assets/media/logo.svg` with your artwork and keep the same filename, or update the
logo image path in each page's header.

## Languages

The site is written in English and marks its pages as translatable. Visitors can use
their browser's built-in page-translation feature to read it in a supported language.
Translations are machine-generated, not reviewed, and some tool results may remain in
English or require the browser to translate the page again.

## Before you publish — 2 things to change

1. **Copyright/name** — optionally change "QuickTools" branding to your own.
2. **AdSense code** — each page has a comment marker where the AdSense `<script>` goes (add it *after* approval).

## How to publish for free (pick one)

### Option A: GitHub Pages (recommended)
1. Create a free account at github.com, then a new **public** repository (e.g. `quicktools`).
2. Upload all files from this folder.
3. Repo → Settings → Pages → Source: `main` branch, `/root` → Save.
4. Your site goes live at `https://yourusername.github.io/quicktools/` in a few minutes.
5. In **Settings → Pages**, enable **Enforce HTTPS** when it is available.

### GitHub Pages security

- Treat everything published by Pages as public, even if the repository itself is private. Never publish credentials, API keys, or private user data.
- Protect your GitHub account with two-factor authentication and use a unique password. Review repository collaborators and deployment permissions.
- GitHub Pages supports HTTPS, but does not let you configure arbitrary HTTP response headers. If you need a custom Content Security Policy or other response headers, use a hosting service or proxy that supports them; a meta tag cannot replace every security header.
- If you use a custom domain, verify ownership in GitHub and avoid wildcard DNS records to reduce domain-takeover risk. See GitHub's [HTTPS guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) and [custom-domain verification guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
- The Word Counter currently disables PDF.js evaluation as a workaround for [CVE-2024-4367](https://github.com/mozilla/pdf.js/security/advisories/GHSA-wgrm-67xf-hhpq). Keep PDF.js updated to a maintained release as well.

### Option B: Netlify Drop (fastest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `quicktools` folder onto the page. Done — you get a live URL immediately.

### Custom domain (optional, ~$10/year)
Buy a domain (Namecheap, Cloudflare) and connect it in GitHub Pages settings or Netlify.
A custom domain looks more trustworthy and can help AdSense approval.

## Getting AdSense approval (realistic path)

Google approves sites with **original content, working navigation, and required policy pages**.
This site already has the structure. To maximize approval odds:

1. **Add original articles** — e.g. 10–20 short blog posts related to each tool
   ("How to calculate a 15% tip in your head", "Is a 12-character password enough?").
   Tools alone are thin content; articles show Google real content.
2. **Get a custom domain** if you can — approval is more reliable.
3. **Publish and wait** a couple of weeks, get some traffic, then apply at adsense.google.com.
4. Add the AdSense script to every page where marked, plus your `ads.txt` file when Google gives you one.

## Traffic tips (what actually drives visits)

- The pages target real search queries ("word counter", "percentage calculator", "tip calculator") — search engines can find and rank them over time.
- Share tool links where people need them (student forums, Reddit, Discord communities).
- Speed + mobile friendliness are already built in, which helps ranking.
- Traffic grows slowly for new sites — usually weeks to months. Keep adding helpful content.

## Run it locally

Just open `index.html` in any browser, or run a local server:

```
python -m http.server 8000
```

then visit http://localhost:8000
