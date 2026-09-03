# How to add products to the Jiya website

**No coding. No computer commands. Just an app on your phone or laptop.**

> **Do this once in Airtable** (or the next automatic sync will drop the season
> page): add columns **Status**, **Collection**, and **Date** (see below). For
> Crochet Rakhi, set Collection to `Rakhi 2026`, Date to `1 Aug 2026`, and
> Status to `Shop` (or `Archive` if that season is over).

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
   | **SoldOut** | Tick if this batch is gone — the site still lets people **order on demand** | ☐ / ☑ |
   | **Featured** | Tick to show a "New" tag | ☐ / ☑ |
   | **Visible** | Untick only to hide the piece completely | ☑ |
   | **Status** | `Shop` (on the home page), `Archive` (past collections), or `Hidden` | `Shop` |
   | **Collection** | Season name — **same spelling** for every piece in that drop | `Rakhi 2026` |
   | **Date** | Any day in that drop (used for “August 2026” and sorting) | `2026-08-01` |

4. That's it. Shop pieces appear on the home page. Pieces with a Collection name
   also get a page under **Past collections** that Google can find.

**To edit** a product: change the row.
**To hide** a product: set **Status** to `Hidden`, or untick **Visible**.
**When a batch sells out:** tick **SoldOut** — it stays on the site with an
**Order on demand** button (we can still make one).
**When a festive season ends:** change **Status** from `Shop` to `Archive`
(select all those rows in Airtable and update together). Do **not** delete the
row. It leaves the home Shop and stays in that season's collection, still
orderable on demand.

> 💡 Collection tip: type `Rakhi 2026`, not `rakhi 2026` on one row and
> `Rakhi-2026` on another. The website groups by the exact name. Date can be
> the first of the month — you don't need the exact festival day.

> 💡 Photo tip: square photos in soft natural light look best. Upload straight
> from your phone's gallery — Airtable handles the rest.

> 💡 Category tip: the website's filter buttons are created automatically from
> the categories you use. For toy sizes, keep the category as `Toys` and put the
> size in the name or description (e.g. "Crochet Bunny (Large)"). You can add new
> category options in Airtable any time.

---

## One-time: add the archive columns in Airtable

The website already understands these fields. Add them once in the Products table
so the automatic sync can read them:

1. **Status** — Single select with options `Shop`, `Archive`, `Hidden`.
   Set current everyday pieces to `Shop`. Set a finished festive drop to `Archive`.
2. **Collection** — Single line text. Example: `Rakhi 2026`.
3. **Date** — Date. Pick any day in that season (e.g. 1 Aug 2026).

Until a row has **Status**, it behaves like **Shop** if **Visible** is ticked.

If you skip Collection and Date, the piece still shows in Shop, but it will not
get a named season page. Fill them for every festive drop.

---

## Setup — already done ✅

The website is already connected to Airtable. The base, the fields, and the
secure connection are set up, so **you don't need to do any of this** — it's
here only for reference.

- **Base:** `Jiya Products` → table `Products`
- **Fields:** Name, Category, Price, Description, Photo, SoldOut, Featured,
  Visible, Status, Collection, Date
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
Also make sure **Status** is `Shop` (or empty) and **Visible** is ticked.

**Where did last season's rakhis go?**
If **Status** is `Archive`, they are under
[Past collections](https://jiyahandmade.com/collections/) — still
orderable on demand. If you deleted the row, add it back.

**Made just for you. 💛**
