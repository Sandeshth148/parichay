# SEO (Search Engine Optimisation) — Interview Reference Guide

This document explains every SEO technique applied to **Parichay**, with the reasoning behind each one. Use it as a study resource when preparing for front-end, full-stack, or product-focused interviews.

---

## 1. How Search Engines Work (The Basics)

A search engine has three steps:

| Step | What happens |
|------|-------------|
| **Crawl** | A bot (Googlebot) visits your URL and reads the HTML |
| **Index** | It stores what it found in a giant database |
| **Rank** | When a user searches, it picks the best-matching pages and orders them |

Your job as a developer is to make each step as easy as possible.

---

## 2. Meta Tags — The Foundation

Meta tags live in `<head>` and are invisible to users but critical for crawlers and social platforms.

### 2.1 `<title>`

```html
<title>Parichay — Conversations Before Commitment</title>
```

- **What it does:** Shows as the blue clickable headline in Google results and as the browser tab name.
- **Rules:** 50–60 characters. Include the primary keyword near the front.
- **Interview point:** The `<title>` tag is the single highest-weight on-page SEO signal.

### 2.2 `<meta name="description">`

```html
<meta name="description" content="Parichay is a guided conversation card game for arranged marriage introductions..." />
```

- **What it does:** The grey snippet text that appears under the title in Google results.
- **Rules:** 150–160 characters. Compelling, includes a call-to-action, contains the main keyword naturally.
- **Important:** Google does NOT guarantee it will use your description — it may pick a relevant excerpt from your page body instead. But providing it gives strong hints.

### 2.3 `<meta name="keywords">`

```html
<meta name="keywords" content="arranged marriage app, conversation starter, parichay..." />
```

- **Interview point:** Google has officially **ignored** the keywords meta tag since ~2009. It is still useful for Bing and for your own documentation. Never spam it — it can hurt you on some smaller engines.

### 2.4 `<meta name="author">`
Minimal signal, but good practice. Some search engines display the author for article-type content.

### 2.5 `<link rel="canonical">`

```html
<link rel="canonical" href="https://parichay-six.vercel.app/" />
```

- **What it does:** Tells Google "this is the one true URL for this page" — prevents duplicate content penalties when the same page is accessible via multiple URLs (http vs https, www vs non-www, trailing slashes, etc.).
- **Interview point:** Very important for e-commerce sites where the same product is accessible at multiple URLs with different query parameters.

---

## 3. Open Graph Protocol (OG Tags)

Open Graph was invented by **Facebook** (2010) and is now the universal standard for controlling how a URL appears when shared on:

- WhatsApp
- Facebook
- LinkedIn
- Slack
- Discord
- Telegram
- iMessage (link previews)

```html
<meta property="og:type"        content="website" />
<meta property="og:url"         content="https://parichay-six.vercel.app/" />
<meta property="og:title"       content="Parichay — Conversations Before Commitment" />
<meta property="og:description" content="A guided card game for arranged marriage introductions..." />
<meta property="og:image"       content="https://parichay-six.vercel.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale"      content="en_IN" />
<meta property="og:site_name"   content="Parichay" />
```

### OG Image Specs
| Property | Required value |
|----------|---------------|
| Dimensions | 1200 × 630 px (1.91:1 ratio) |
| File type | PNG or JPG (not SVG — WhatsApp doesn't render SVG) |
| Max file size | ~8 MB (keep under 1 MB for fast loading) |
| Text on image | Keep important text away from edges (some platforms crop) |

**How the OG image was generated programmatically:**
1. Designed in SVG (`public/og-image.svg`) — vector, scalable, editable as text
2. Converted to PNG using **sharp** (`scripts/generate-og.mjs`) — a high-performance Node.js image processing library
3. Output saved to `public/og-image.png` so Vite copies it to the build output

```js
// scripts/generate-og.mjs
import sharp from "sharp";
const svg = readFileSync("public/og-image.svg");
await sharp(svg).resize(1200, 630).png().toFile("public/og-image.png");
```

**Interview point:** Sharp uses native C++ bindings (libvips) and is ~10x faster than ImageMagick for web image processing.

---

## 4. Twitter / X Cards

```html
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Parichay — Conversations Before Commitment" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image"       content="https://parichay-six.vercel.app/og-image.png" />
```

- Uses the same image as OG. `summary_large_image` shows the full-width image card (vs `summary` which shows a smaller thumbnail).
- If OG tags are already present, Twitter will fall back to them; these tags let you fine-tune the Twitter-specific display.

---

## 5. JSON-LD Structured Data

JSON-LD (JSON for Linked Data) is a machine-readable format that Google reads to understand **what your page is about**, not just what keywords it contains.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Parichay",
  "url": "https://parichay-six.vercel.app/",
  "description": "...",
  "applicationCategory": "LifestyleApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
</script>
```

- **Schema.org** is a vocabulary maintained by Google, Microsoft, Yahoo and Yandex jointly.
- Common types: `WebApplication`, `Article`, `Product`, `FAQPage`, `LocalBusiness`, `Person`, `Recipe`
- **Interview point:** JSON-LD can unlock **rich results** in Google (star ratings, prices, breadcrumbs shown directly in the search result). Test at: https://search.google.com/test/rich-results

### Difference between JSON-LD and Microdata
| | JSON-LD | Microdata |
|---|---|---|
| Format | Separate `<script>` tag | Inline HTML attributes (`itemscope`, `itemprop`) |
| Maintainability | Easy — decoupled from HTML | Hard — mixed into HTML |
| Google preference | **Recommended** | Supported but not preferred |

---

## 6. robots.txt

```
# public/robots.txt
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /room/
Disallow: /summary
Sitemap: https://parichay-six.vercel.app/sitemap.xml
```

- **What it does:** Tells crawlers which pages they are allowed or not allowed to visit.
- **Important:** `robots.txt` is a **suggestion**, not a security control — bad bots ignore it. Never put sensitive content behind just a `robots.txt` rule.
- `User-agent: *` = applies to all crawlers. You can target specific bots: `User-agent: Googlebot`
- The `Sitemap:` directive at the bottom is a bonus — it tells any crawler that reads `robots.txt` where to find your sitemap.

---

## 7. sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://parichay-six.vercel.app/</loc>
    <lastmod>2026-03-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- **What it does:** A map of all publicly indexable URLs on your site. For SPAs (Single Page Applications), only public routes should be listed.
- **changefreq:** Hint to the crawler how often content changes (`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`).
- **priority:** 0.0 to 1.0 — relative importance **within your own site** (not compared to other sites).
- For large sites: sitemaps can be split into multiple files with a sitemap index.

---

## 8. Web App Manifest (`site.webmanifest`)

```json
{
  "name": "Parichay — Conversations Before Commitment",
  "short_name": "Parichay",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fffbeb",
  "theme_color": "#92400e",
  "icons": [...]
}
```

- **Primary purpose:** Enables **"Add to Home Screen"** (A2HS) on Android, making the app feel native.
- **SEO benefit:** The `theme_color` controls the browser chrome colour on mobile. Google uses manifest data to classify apps in search results. `display: "standalone"` signals it's a PWA (Progressive Web App).
- Referenced in `index.html` via: `<link rel="manifest" href="/site.webmanifest" />`

---

## 9. Favicon

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- **SVG favicon** — modern browsers support SVG favicons, which are resolution-independent. They can even respond to dark mode: `@media (prefers-color-scheme: dark)`.
- **apple-touch-icon** — required for iOS "Add to Home Screen". Must be 180×180 PNG.
- **Why it matters for SEO:** Not a ranking signal, but trust and recognition increases click-through rate (CTR) from search results, which indirectly improves ranking.

---

## 10. Dynamic Page Titles (`usePageTitle` hook)

For SPAs (React, Angular, Vue), the `<title>` in `index.html` is static. Every route shows the same title in browser tabs and browser history unless you change it client-side.

```ts
// src/hooks/usePageTitle.ts
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — Parichay`
      : "Parichay — Conversations Before Commitment";
    return () => {
      document.title = "Parichay — Conversations Before Commitment";
    };
  }, [title]);
}
```

Used in each page component:
```tsx
export function DashboardPage() {
  usePageTitle("Dashboard"); // → "Dashboard — Parichay"
```

- **SEO impact:** For a client-rendered SPA, Googlebot may or may not execute JavaScript. The `<title>` in `index.html` is what Googlebot sees on the first crawl. The JS-updated title helps for indexing subsequent navigations.
- **Better solution for SEO-critical apps:** Use **SSR (Server-Side Rendering)** — Next.js, Astro, or SvelteKit — so each route delivers a fully rendered HTML page with the correct `<title>` without needing JavaScript.

---

## 11. Google Search Console (GSC)

This is how you tell Google your site exists and track how it ranks.

### Steps to register your site:

1. Go to https://search.google.com/search-console/
2. Click **Add Property** → choose **URL prefix** → enter `https://parichay-six.vercel.app/`
3. **Verify ownership** — Google offers several methods:

| Method | How |
|--------|-----|
| HTML file | Download a file like `googleXXXXX.html` and deploy it in `public/` |
| HTML meta tag | Add `<meta name="google-site-verification" content="xxxxx" />` to `index.html` |
| DNS TXT record | Add a TXT record to your domain's DNS (best for custom domains) |
| Google Analytics | If GA is already installed, click "Verify with GA" |

4. Once verified, click **Sitemaps** → paste `sitemap.xml` path → submit
5. Click **Request Indexing** on your homepage URL to speed up first crawl

### What Google Search Console shows you:
- **Performance** — clicks, impressions, average position, CTR per query
- **Coverage** — which pages Google has indexed, which failed
- **Core Web Vitals** — LCP, FID, CLS scores from real users
- **Mobile Usability** — pages with mobile issues

### What you likely did for FitLog on Netlify:
You added the GSC HTML verification file or meta tag, submitted the sitemap, and Google indexed the site. When Google indexes a site, it starts appearing in search results for relevant queries — especially exact name searches like "fitlog netlify".

---

## 12. Core Web Vitals (Performance SEO)

Google uses page performance as a ranking signal since 2021. The three metrics:

| Metric | Full name | Measures | Good threshold |
|--------|-----------|----------|----------------|
| **LCP** | Largest Contentful Paint | Loading performance — time until largest image/text is visible | < 2.5 s |
| **FID** | First Input Delay | Interactivity — delay between user click and browser response | < 100 ms |
| **CLS** | Cumulative Layout Shift | Visual stability — how much content jumps around while loading | < 0.1 |

> FID is being replaced by **INP (Interaction to Next Paint)** from 2024 onward.

**Tools to measure:**
- Chrome DevTools → Lighthouse tab
- https://pagespeed.web.dev/
- Google Search Console → Core Web Vitals report

---

## 13. What Does NOT Affect Google Ranking (Common Misconceptions)

| Myth | Reality |
|------|---------|
| `<meta name="keywords">` | Ignored by Google since 2009 |
| Submitting to directories | Largely irrelevant today |
| Keyword stuffing | **Penalised** by Google since Panda (2011) |
| Social media likes/shares | Not a direct ranking signal |
| robots.txt blocks = better performance | Google ignores blocked pages — they may still appear in results without content |

---

## 14. SEO Checklist for Any New Web App

- [ ] Set a meaningful `<title>` per page (50–60 chars)
- [ ] Write a `<meta name="description">` (150–160 chars)
- [ ] Add `<link rel="canonical">`
- [ ] Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- [ ] Create a 1200×630 OG image
- [ ] Add Twitter Card tags
- [ ] Add JSON-LD structured data for the page type
- [ ] Create `robots.txt`
- [ ] Create `sitemap.xml` and submit to Google Search Console
- [ ] Add `site.webmanifest` + `theme-color` meta
- [ ] Set up Google Search Console property and verify
- [ ] Measure Core Web Vitals with Lighthouse
- [ ] Use HTTPS (mandatory — Google penalises HTTP sites)
- [ ] Ensure mobile-friendliness (Google uses mobile-first indexing)

---

## 15. Tools Reference

| Tool | URL | Use |
|------|-----|-----|
| Google Search Console | https://search.google.com/search-console/ | Track indexing, submit sitemap |
| PageSpeed Insights | https://pagespeed.web.dev/ | Core Web Vitals measurement |
| Rich Results Test | https://search.google.com/test/rich-results | Validate JSON-LD structured data |
| Open Graph Debugger | https://developers.facebook.com/tools/debug/ | Preview and refresh FB/WA OG card |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Preview Twitter Card |
| LinkedIn Post Inspector | https://www.linkedin.com/post-inspector/ | Preview LinkedIn share |
| Schema.org | https://schema.org/ | Browse all structured data types |
| Ahrefs Webmaster Tools | https://ahrefs.com/webmaster-tools | Free backlink + keyword tracking |
