# How to add products to the Jiya website

**No coding. No computer commands. Just an app on your phone or laptop.**

You add and edit products in **Airtable** (a free, simple app that works like a
smart spreadsheet). The website reads from it automatically. When you add a
product in Airtable, it appears on the website by itself — usually within a
minute (just refresh the page).

---

## Everyday use — adding a product (30 seconds)

1. Open the **Airtable** app (phone) or [airtable.com](https://airtable.com) (laptop).
2. Open the **Jiya Products** base, then the **Products** table.
3. Tap **+** to add a new row and fill in:

   | Column | What to type | Example |
   | --- | --- | --- |
   | **Name** | The product name | `Woollen Mobile Pouch` |
   | **Category** | Pick one | `Pouches` |
   | **Price** | Any text | `From ₹200` |
   | **Description** | One short line | `Snug hand-knitted phone pouch` |
   | **Photo** | Tap and **upload a photo** from your phone | 📷 |
   | **SoldOut** | Tick if it's sold out | ☐ / ☑ |
   | **Featured** | Tick to show a "New" tag | ☐ / ☑ |
   | **Visible** | Tick to show it on the website | ☑ |

4. That's it. Refresh the website to see it live.

**To edit** a product: change the row.
**To hide** a product: untick **Visible** (or delete the row).
**To mark sold out:** tick **SoldOut** — it stays on the site with a "Sold out" tag.

> 💡 Photo tip: square photos in soft natural light look best. Upload straight
> from your phone's gallery — Airtable handles the rest.

---

## One-time setup (done once, by you or a helper)

This connects the website to your Airtable. **You only do this once.**

### Step 1 — Create the Airtable base
1. Sign up free at [airtable.com](https://airtable.com).
2. Create a new **base** named `Jiya Products` with a table named `Products`.
3. Add these columns (called "fields") with these exact names and types:

   | Field name | Field type |
   | --- | --- |
   | Name | Single line text |
   | Category | Single select (options: `Crochet`, `Pouches`, `Charms`, `Caps`) |
   | Price | Single line text |
   | Description | Long text |
   | Photo | Attachment |
   | SoldOut | Checkbox |
   | Featured | Checkbox |
   | Visible | Checkbox |

### Step 2 — Get your connection details
1. **Base ID:** open your base, click **Help → API documentation**. Near the top
   it shows a line like `The ID of this base is appXXXXXXXXXXXXXX`. Copy the
   `appXXXX...` part.
2. **Token:** go to
   [airtable.com/create/tokens](https://airtable.com/create/tokens) → **Create token**.
   - Name: `Jiya website`
   - Scopes: add **`data.records:read`** (read-only — safe to use on a website)
   - Access: add your **Jiya Products** base
   - Click **Create** and copy the token (starts with `pat...`).

### Step 3 — Put them in the website
1. Open the file **`config.js`**.
2. Paste your token and base ID between the quotes:
   ```js
   token: "patXXXXXXXXXXXXXX",
   baseId: "appXXXXXXXXXXXXXX",
   tableName: "Products",
   ```
3. Save. Done — the website now shows your real products.

> This is the **only** time anyone edits a file. After this, you only ever use
> the Airtable app to manage products.

---

## Common questions

**Do I need to "commit" or use any code?**
No. Adding products is done entirely in the Airtable app. Nothing to commit.

**Is the token safe to put in the website?**
Yes. It's **read-only** — it can only *show* your products, never change or
delete anything.

**Nothing shows up / it shows old sample products.**
That means `config.js` isn't filled in yet (Step 3), or a field name doesn't
match. Double-check the field names in Step 1.

**Made just for you. 💛**
