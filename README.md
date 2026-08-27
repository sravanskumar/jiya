# Jiya Handmade Creations — Website

A simple, no-build website for Jiya Handmade Creations. **You do not need to be a
developer to update it.** You only ever touch:

- **`content.js`** — all the words, prices and products
- **`images/products/`** — your product photos

Everything else (`index.html`, `styles.css`, `app.js`) can be left alone.

---

## Preview the website on your computer

Just **double-click `index.html`** — it opens in your browser. That's it.

> Tip: if product images don't show when opening the file directly, they will
> still work perfectly once the site is published online (see below).

---

## How to add or change a product

1. **Add the photo** (optional): drop your image into the `images/products/`
   folder. Use a simple name like `blue-pouch.jpg`.

2. **Open `content.js`** in any text editor.

3. Find the `products:` section. To **add** a product, copy one block that looks
   like this and paste it above the closing `]`:

   ```js
   {
     name: "Woollen Mobile Pouch",
     category: "Pouches",          // Crochet, Pouches, Charms, or Caps
     price: "From ₹200",           // or "" to hide the price
     description: "Snug, hand-knitted pouch for your phone.",
     image: "images/products/blue-pouch.jpg",   // "" shows a placeholder
     soldOut: false,               // true shows a "Sold out" tag
     featured: true,               // true shows a "New" tag
   },
   ```

4. **Only change the text inside the "quotes".** Keep every comma `,` and curly
   brace `{ }` exactly where it is.

5. Save the file. Refresh the website to see your change.

### To change contact info, tagline, or the About text
Edit the `business`, `hero`, or `about` sections at the top of `content.js`.

---

## How to publish your changes (commit)

This project uses **git** to save and publish changes. After editing, run these
three commands in the Terminal (from inside the `jiya` folder):

```bash
git add .
git commit -m "Update products"
git push
```

- `git add .` — gathers all your changes
- `git commit -m "..."` — saves them with a short note
- `git push` — publishes them online

> The first time only, someone will help connect this folder to an online home
> (for example GitHub Pages or Netlify — both free). After that, `git push` is
> all you need and the live website updates automatically.

---

## Project files (reference)

| File | What it is | Do you edit it? |
| --- | --- | --- |
| `content.js` | All products & text | ✅ Yes — this is your file |
| `images/products/` | Your product photos | ✅ Yes — add photos here |
| `index.html` | Page structure | ❌ No |
| `styles.css` | Colours & design | ❌ No |
| `app.js` | Makes the page work | ❌ No |
| `BRAND_GUIDELINES.md` | Brand colours, fonts, voice | 📖 Read/reference |

---

Made just for you. 💛
