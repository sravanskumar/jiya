# Jiya Handmade Creations — Website

A simple website for Jiya Handmade Creations, designed so that **a non-technical
person can add and edit products with no coding and no commits.**

## How products work

Products are managed in **Airtable** — a free, friendly app (like a smart
spreadsheet with photo uploads). The website reads from Airtable automatically,
so adding a product is just: open the app, fill a form, upload a photo. Done.
It appears on the website within a minute.

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
| **Airtable app** | Where products live | 🧑 The owner (add/edit products here) |
| `config.js` | Connects the site to Airtable | ⚙️ Once, during setup |
| `content.js` | Business name, contact, intro text | ⚙️ Once, during setup |
| `BRAND_GUIDELINES.md` | Brand colours, fonts, voice | 📖 Reference |
| `HOW-TO-ADD-PRODUCTS.md` | Step-by-step product guide | 📖 The owner's guide |
| `index.html`, `styles.css`, `app.js` | The website itself | 🚫 Don't edit |

---

## Publishing the website online (one-time, technical)

To give the site a public link for the Instagram bio, host it for free on
**Netlify** or **GitHub Pages** (any static host works — it's plain HTML/CSS/JS,
no build step). After that, the owner never needs the code again — products
update live from Airtable.

---

Made just for you. 💛
