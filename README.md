# Jiya Handmade Creations — Website

A simple website for Jiya Handmade Creations, designed so that **a non-technical
person can add and edit products with no coding and no commits.**

The **home page** is the current Shop. Finished festive drops live in
**[Past collections](https://sravanskumar.github.io/jiya/collections/)**, grouped
by season (for example Rakhi 2026). Those pages are real HTML so search engines
can find them. Sold-out pieces stay orderable **on demand** via WhatsApp.

## How products work

Products are managed in **Airtable** — a free, friendly app (like a smart
spreadsheet with photo uploads). A scheduled **GitHub Action** reads Airtable
every ~10 minutes, downloads the photos, and writes `products.json`, which the
website displays. So adding a product is just: open the app, fill a form, upload
a photo. It appears on the site automatically within a few minutes.

**The Airtable token is never in the site** — it's stored as a private GitHub
secret (`AIRTABLE_TOKEN`) and only used by the sync job.

👉 **Full instructions:** [HOW-TO-ADD-PRODUCTS.md](HOW-TO-ADD-PRODUCTS.md)

There is **nothing to commit** and **no code to edit** for day-to-day updates.

---

## Preview the website

Double-click **`index.html`** to open it in a browser. Until Airtable is
connected, it shows sample products so you can see the design.

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
| `HOW-TO-ADD-PRODUCTS.md` | Step-by-step product guide | 📖 The owner's guide |
| `index.html`, `styles.css`, `app.js` | The website itself | 🚫 Don't edit |

---

## Live website

🌐 **https://sravanskumar.github.io/jiya/** — hosted free on GitHub Pages.

Past collections: **https://sravanskumar.github.io/jiya/collections/**

Repo: https://github.com/sravanskumar/jiya

Because products live in Airtable, the owner never touches this repo for
day-to-day updates. The site only needs a re-deploy if the design or the
one-time settings (`config.js` / `content.js`) change, done with:

```bash
git add . && git commit -m "Update settings" && git push
```

GitHub Pages rebuilds automatically within a minute.

---

Made just for you. 💛
