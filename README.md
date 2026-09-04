# Jiya Handmade Creations — Website

A simple website for Jiya Handmade Creations, designed so that **a non-technical
person can add and edit products with no coding and no commits.**

The **home page** is the current Shop. Finished festive drops live in
**[Past collections](https://jiyahandmade.com/collections/)**, grouped
by season (for example Rakhi 2026). Those pages are real HTML so search engines
can find them. Sold-out pieces stay orderable **on demand** via WhatsApp.

## How products work

Products are managed in **Airtable**. The owner’s day-to-day steps are in
**[HOW-TO-ADD-PRODUCTS.md](HOW-TO-ADD-PRODUCTS.md)** (add a row, upload a photo,
archive a season). A GitHub job copies that into the website. It is meant to
run often, but in practice you may need to run **Actions → Sync products from
Airtable** if a change has not appeared after 15–20 minutes.

---

## Preview the website

Double-click **`index.html`** to open it in a browser. Product photos load
best when the folder is served as a site (GitHub Pages or a local web server),
not always when opened as a file.

---

## Files (for reference)

| File | What it is | Who touches it |
| --- | --- | --- |
| **Airtable app** | Where products live (including Status / Collection / Date) | 🧑 The owner (add/edit products here) |
| `products.json` | Auto-generated product data | 🤖 Written by the sync job — don't edit |
| `images/products/` | Auto-downloaded product photos | 🤖 Written by the sync job |
| `collections/` | Past-season pages (HTML) | 🤖 Written by the sync job |
| `sitemap.xml` | Search-engine map of shop + collections | 🤖 Written by the sync job |
| `robots.txt` | Points crawlers at the sitemap | ⚙️ Once |
| `scripts/sync-airtable.mjs` | Fetches Airtable | ⚙️ Setup/maintenance |
| `scripts/build-pages.mjs` | Builds collection pages + sitemap | ⚙️ Setup/maintenance |
| `.github/workflows/sync-airtable.yml` | Runs the sync every ~10 min | ⚙️ Setup/maintenance |
| `content.js` | Business name, contact, intro text | ⚙️ Once, during setup |
| `BRAND_GUIDELINES.md` | Brand colours, fonts, voice | 📖 Reference |
| `HOW-TO-ADD-PRODUCTS.md` | Owner’s content guide (Airtable only) | 📖 The person who adds products |
| `HOSTING.md` | Domain, DNS, GitHub Pages, accounts | 📖 For renewals and future helpers |
| `CNAME` | Custom domain for GitHub Pages | ⚙️ Domain setup — don't delete |
| `index.html`, `styles.css`, `app.js` | The website itself | 🚫 Don't edit |

---

## Live website

**https://jiyahandmade.com/** — the public shop.

Past collections: **https://jiyahandmade.com/collections/**

| | |
| --- | --- |
| Code | [github.com/sravanskumar/jiya](https://github.com/sravanskumar/jiya) (`main`) |
| Hosting | GitHub Pages (free) |
| Domain | `jiyahandmade.com`, Cloudflare Registrar, 3 Sep 2026 — first charge **$12.34** Visa (then ~$10.46/yr + tax) |
| DNS | Cloudflare, **DNS only** (not proxied) → GitHub Pages |
| Products | Airtable `Jiya Products` / `Products`, synced every ~10 minutes |

The old URL `https://sravanskumar.github.io/jiya/` redirects to the custom domain.

Because products live in Airtable, the owner never touches this repo for
day-to-day updates. The site only needs a re-deploy if the design or the
one-time settings (`content.js`) change, done with:

```bash
git add . && git commit -m "Update settings" && git push
```

GitHub Pages rebuilds automatically within a minute.

Full hosting / DNS / renewal notes: **[HOSTING.md](HOSTING.md)**.

---

Made just for you. 💛
