# How to add products to the Jiya website

**No coding. No computer commands. Just an app on your phone or laptop.**

You add and edit products in **Airtable** (a free, simple app that works like a
smart spreadsheet). The website updates itself automatically from Airtable — when
you add or change a product, it appears on the website on its own, usually
**within about 10 minutes**. Nothing to publish, no buttons to press.

---

## Everyday use — adding a product (30 seconds)

1. Open the **Airtable** app (phone) or [airtable.com](https://airtable.com) (laptop).
2. Open the **Jiya Products** base, then the **Products** table.
3. Tap **+** to add a new row and fill in:

   | Column | What to type | Example |
   | --- | --- | --- |
   | **Name** | The product name | `Woollen Mobile Pouch` |
   | **Category** | Pick one (Pouches, Charms & Keychains, Hair Accessories, Caps & Beanies, Winterwear, Toys, Baby, Festive) | `Pouches` |
   | **Price** | Any text | `From ₹200` |
   | **Description** | One short line | `Snug hand-knitted phone pouch` |
   | **Photo** | Tap and **upload a photo** from your phone | 📷 |
   | **SoldOut** | Tick if it's sold out | ☐ / ☑ |
   | **Featured** | Tick to show a "New" tag | ☐ / ☑ |
   | **Visible** | Tick to show it on the website | ☑ |

4. That's it. It appears on the website automatically within about 10 minutes.

**To edit** a product: change the row.
**To hide** a product: untick **Visible** (or delete the row).
**To mark sold out:** tick **SoldOut** — it stays on the site with a "Sold out" tag.

> 💡 Photo tip: square photos in soft natural light look best. Upload straight
> from your phone's gallery — Airtable handles the rest.

> 💡 Category tip: the website's filter buttons are created automatically from
> the categories you use. For toy sizes, keep the category as `Toys` and put the
> size in the name or description (e.g. "Crochet Bunny (Large)"). You can add new
> category options in Airtable any time.

---

## Setup — already done ✅

The website is already connected to Airtable. The base, the fields, and the
secure connection are set up, so **you don't need to do any of this** — it's
here only for reference.

- **Base:** `Jiya Products` → table `Products`
- **Fields:** Name, Category, Price, Description, Photo, SoldOut, Featured, Visible
- **Connection:** a **read-only** Airtable token is stored as a private
  **GitHub secret** (not in the website's code). An automatic job reads Airtable
  every ~10 minutes and updates the site. Photos are copied into the site too, so
  everything stays fast and reliable.

If you ever need to reconnect (e.g. the token was reset), a helper can create a
new read-only token at
[airtable.com/create/tokens](https://airtable.com/create/tokens) (scope
`data.records:read`, access to the Jiya base) and update the GitHub secret named
`AIRTABLE_TOKEN`.

---

## Common questions

**Do I need to "commit" or use any code?**
No. Adding products is done entirely in the Airtable app. Nothing to commit.

**Is my token exposed on the website?**
No. The token is **read-only** and stored as a private GitHub secret — it is
never part of the website's code or visible to visitors.

**I added a product but don't see it yet.**
The site refreshes from Airtable about every 10 minutes — give it a few minutes.
Also make sure the product's **Visible** box is ticked.

**Made just for you. 💛**
