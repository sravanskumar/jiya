# Jiya — how to update the shop

This is the **only** guide you need for products. No coding. No GitHub.
Open **Airtable** on your phone or laptop, change a row, wait for the site.

**Shop:** [jiyahandmade.com](https://jiyahandmade.com/)  
**Past collections:** [jiyahandmade.com/collections/](https://jiyahandmade.com/collections/)  
**Airtable:** base **Jiya Products** → table **Products**

Domain, DNS, and passwords live in [HOSTING.md](HOSTING.md). Skip that file
unless the website itself is down.

---

## The one rule

**Do not delete a product row.** Tick **SoldOut**, set **Status** to **Archive**,
or set **Status** to **Hidden**. Deleting a row removes it from the site and from
Past collections.

You never “create a collection” as a new table. **Collection** is a box on the
same product row. Type `Rakhi 2026` there. The website builds the season page.

---

## Add a product

1. Open Airtable → **Jiya Products** → **Products**.
2. Tap **+** for a new row.
3. Fill at least **Name**, **Category**, **Price**, **Description**, **Photo**,
   **Status = Shop**, **Visible** ticked.
4. Wait, then check [jiyahandmade.com](https://jiyahandmade.com/).

| Column | What to put | Example |
| --- | --- | --- |
| **Name** | What the customer sees | `Woollen Mobile Pouch` |
| **Category** | Shop filter button. Use the same word on every variant of one item | `Pouches` |
| **Price** | Always with the rupee mark | `From ₹200` |
| **Description** | One or two short lines | `Snug hand-knitted phone pouch` |
| **Photo** | Upload from your phone. Square, natural light. Empty photo = blank card. | 📷 |
| **SoldOut** | Tick when this batch is gone. The site still offers **Order on demand**. | ☐ / ☑ |
| **Featured** | Tick only for a true “New” piece — not every row | ☐ |
| **Visible** | Leave ticked. Untick only to hide a **Shop** piece quickly | ☑ |
| **Status** | `Shop` for the home page | `Shop` |
| **Collection** | Leave empty for everyday pieces | |
| **Date** | Leave empty for everyday pieces | |
| **Group** | Same words on every size/colour of one item. Leave empty for a single card | `Hand-Knitted Cap` |
| **Variant** | Short label on the thumbnail. Needed when Group is filled | `Adult` / `Baby` |

**Edit:** change the same row. **Rename a category** in Airtable and the filter
button on the site follows.

---

## Shop, Archive, Hidden, Visible

| You want | Do this |
| --- | --- |
| On the home Shop | **Status = Shop**, Visible ticked |
| Off the Shop, still in Past collections (festive drop ended) | **Status = Archive**, fill **Collection** + **Date**. Leave Visible ticked |
| Off the Shop for now (everyday piece) | Untick **Visible**, or **Status = Hidden** |
| Off Past collections too, without deleting | **Status = Hidden** |

**Visible** only hides **Shop** pieces. It does **not** hide an **Archive** row.
To take something off a season page, use **Hidden**.

---

## When a festive season ends (Rakhi, Diwali, …)

On **every piece in that drop** (select them together if there are several):

1. **Status** → `Archive`
2. **Collection** → the season name, **same spelling on every row**  
   Good: `Rakhi 2026`  
   Bad: `rakhi 2026` on one row and `Rakhi-2026` on another
3. **Date** → any day in that season (1 Aug 2026 is enough)
4. Tick **SoldOut** if that batch is gone

Example already on the site: **Crochet Rakhi** is Archive / `Rakhi 2026` /
1 Aug 2026. It is **not** on the home page. It is on
[Rakhi 2026](https://jiyahandmade.com/collections/rakhi-2026.html) with
**Order on demand**.

Everyday pieces (pouch, cap, charm, …) stay **Status = Shop**. Do not type
`Rakhi 2026` on those rows.

---

## Sizes, colours, and other variants

Use this when one item has more than one photo or price (Adult / Baby, cream /
maroon). **One Airtable row per option.** There is no second table.

1. Add two columns once, if they are not there yet: **Group** and **Variant**
   (both **Single line text**).
2. Duplicate the product row (or add a new row).
3. Type the **same Group** on every row that belongs together — same spelling,
   same spaces. `Hand-Knitted Cap` and `Hand knitted cap` become two cards.
4. Put a short **Variant** on each row (`Adult`, `Baby`, `Cream`).
5. Each row keeps its own **Photo**, **Price**, **SoldOut**, **Status**, **Visible**.
6. Use the **same Category** on every row in that Group. For a festive drop,
   copy **Collection**, **Date**, and **Status** onto every variant row too.

The shop shows **one card** titled with the Group. Thumbnails appear when there
are two or more rows. Tapping a thumbnail changes the big photo, the price, the
sold-out ribbon, and the WhatsApp Order message (`Hand-Knitted Cap (Adult)` plus
that row’s photo).

Leave **Group** empty for a normal single card. Separate cards (`Cap Adult`,
`Cap Baby`) still work that way.

Do not mix Shop and Archive inside one Group. Colour **and** size together is
one Variant label: `Adult / Cream`.

---

## When a batch sells out (but the season is still current)

Tick **SoldOut** only. Leave **Status = Shop**. It stays on the home page with
**Order on demand**.

---

## When will it show on the website?

The site copies Airtable automatically. It is *supposed* to be about every
10 minutes. In practice GitHub often waits **much longer**.

If it has not appeared after 15–20 minutes:

- Check **Status** (`Shop` or `Archive`, not `Hidden`)
- Check **Visible** is ticked for Shop pieces
- Check a **Photo** is uploaded
- Ask the person who looks after the website to **run a sync**  
  (GitHub → **Actions** → **Sync products from Airtable** → **Run workflow**)

Then wait about a minute and refresh [jiyahandmade.com](https://jiyahandmade.com/).

---

## Columns — already set up

These fields already exist. Do not add a second Products table.

Name, Category, Price, Description, Photo, SoldOut, Featured, Visible,
**Status** (`Shop` / `Archive` / `Hidden`), **Collection**, **Date**.
**Group** and **Variant** — add once as **Single line text** if they are not
on the table yet.

---

## Quick answers

**Do I commit or use GitHub?**  
No. Only Airtable, unless someone is running a sync for you.

**Can I put two photos?**  
One photo per row. For a second photo (another size or colour), duplicate the
row, set the same **Group**, a different **Variant**, and upload that row’s
photo.

**Toy sizes?**  
Same **Group** on each size, **Variant** `Large` / `Small`. Or leave Group empty
and put the size in the name (`Crochet Bunny (Large)`).

**Wallets / other new categories?**  
Allowed. A new Category name becomes a new filter button. Use it on purpose.

**Where did the rakhis go?**  
[Past collections](https://jiyahandmade.com/collections/) if Status is Archive.
If you deleted the row, add it back.

---

_Made just for you._
