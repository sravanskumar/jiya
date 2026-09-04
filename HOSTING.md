# Jiya — hosting, domain, and accounts

This is the technical record of how the shop stays online. Day-to-day product
edits: [HOW-TO-ADD-PRODUCTS.md](HOW-TO-ADD-PRODUCTS.md) (Airtable only).

**Public shop:** [https://jiyahandmade.com/](https://jiyahandmade.com/)  
**Past collections:** [https://jiyahandmade.com/collections/](https://jiyahandmade.com/collections/)

---

## Who does what

| Piece | Provider | What it is |
| --- | --- | --- |
| Source code | GitHub | Repo `sravanskumar/jiya`, branch `main` |
| Website hosting | GitHub Pages | Free static hosting from that repo |
| Domain name | Cloudflare Registrar | `jiyahandmade.com`, bought 3 Sep 2026 |
| DNS | Cloudflare | Points the domain at GitHub Pages |
| Product catalogue | Airtable | Base `Jiya Products`, table `Products` |
| Auto-publish | GitHub Actions | Syncs Airtable → the repo every ~10 minutes |
| Orders | WhatsApp | `919980687834` (shown on the site as 9980687834) |
| Brand owner | Jayalakshmi Bai Kadam | Legal registrant for the domain |
| Domain email | `jiyahandmadecreations@gmail.com` | Cloudflare + ICANN mail |
| Social | Instagram | [@jiya_handmade_creations](https://www.instagram.com/jiya_handmade_creations/) |

There is **no** Squarespace, WordPress, or paid web host. Cloudflare is only
the **registrar + DNS**. GitHub Pages serves the files.

---

## Domain

- **Primary URL:** `jiyahandmade.com` (and `www.jiyahandmade.com`, which redirects to the apex)
- **Bought from:** [Cloudflare Registrar](https://dash.cloudflare.com/) — at-cost pricing, no markup
- **Cloudflare account:** the `jiyahandmadecreations` account
- **Domain registrant (legal owner):** Jayalakshmi Bai Kadam
- **Registrant email:** `jiyahandmadecreations@gmail.com` (must stay working — ICANN sends a verification mail here)
- **Registration:** 1 year from 3 Sep 2026, **auto-renew on**. List price **$10.46 / year**; first charge on the Visa was **$12.34** (tax/fees on top).
- **WHOIS:** Cloudflare redacts the personal name from public lookup. Keep Cloudflare’s copy matching Jayalakshmi Bai Kadam + this Gmail.
- **Not bought yet:** `jiyahandmade.in` — still available as of setup. If bought later (Namecheap or similar; Cloudflare does not sell `.in`), forward it with a 301 to `https://jiyahandmade.com`.

The old address **https://sravanskumar.github.io/jiya/** still works. GitHub
Pages redirects it to the custom domain. Other repos under
`sravanskumar.github.io/...` are unrelated and are not affected.

---

## DNS (Cloudflare)

Dashboard: **jiyahandmade.com → DNS → Records**.

All records must stay **DNS only** (grey cloud). Do **not** turn on Cloudflare
proxy (orange cloud). GitHub cannot issue HTTPS if traffic is proxied.
Ignore Cloudflare’s “Proxying is required for security” banner.

TTL: **Auto**.

| Type | Name | Content |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `sravanskumar.github.io` |

The `www` CNAME target is `sravanskumar.github.io` **without** `/jiya`. GitHub
then serves this repo because Pages is bound to `jiyahandmade.com`.

Leave Cloudflare **SSL/TLS**, **Always Use HTTPS**, and **Workers** alone.
HTTPS is GitHub’s job (see below).

---

## GitHub Pages

- **Repo:** https://github.com/sravanskumar/jiya
- **Settings → Pages**
  - Source: branch **`main`**, folder `/`
  - Custom domain: **`jiyahandmade.com`**
  - **Enforce HTTPS:** on (certificate covers `jiyahandmade.com` and `www`)
- **CNAME file** in the repo root contains `jiyahandmade.com`. Do not delete it.
  GitHub also stores the same value in Pages settings.
- **Google Search Console:** property `https://jiyahandmade.com/` verified via
  `google229afd2276eb0b25.html` (do not delete). Sitemap submitted 3 Sep 2026 —
  status Success, 2 URLs (home + `/collections/`). Season pages are added to
  the sitemap when a product has Status Archive + a Collection name.
- Canonical URLs, Open Graph images, `robots.txt`, and `sitemap.xml` use
  `https://jiyahandmade.com`. The generator default is in
  `scripts/build-pages.mjs` (`SITE_BASE`).

A push to `main` republishes the site within about a minute.

---

## Airtable → website

- **Base:** `Jiya Products` (`app27MQgngwYt6BMU`)
- **Table:** `Products`
- **Secret:** GitHub repo secret `AIRTABLE_TOKEN` (read-only token, never in the site)
- **Job:** `.github/workflows/sync-airtable.yml` is scheduled every 10 minutes.
  GitHub often **skips or delays** that timer (hours is common). If Airtable
  changed and the shop has not, run it by hand:
  **https://github.com/sravanskumar/jiya/actions** → **Sync products from
  Airtable** → **Run workflow**. The job writes `products.json`,
  `images/products/`, `collections/*.html`, and `sitemap.xml`, then commits as
  `jiya-sync-bot`. GitHub Pages updates about a minute after that push.

If the token expires, create a new read-only token at
[airtable.com/create/tokens](https://airtable.com/create/tokens) (`data.records:read`
on this base) and replace the GitHub secret. Do not put the token in a file.

---

## Other files tied to the public URL

| File | Role |
| --- | --- |
| `CNAME` | Tells GitHub Pages the custom domain |
| `index.html` | Canonical / Open Graph / schema URLs |
| `robots.txt` | Sitemap URL |
| `thank-you-card.html` + `assets/qr-jiya-site.png` | Printable card QR → `https://jiyahandmade.com/` |
| `content.js` | Business name, Instagram, WhatsApp (not the domain) |

If the domain ever changes, update `SITE_BASE`, `CNAME`, `index.html`,
`robots.txt`, regenerate collection pages (`node scripts/build-pages.mjs`),
and regenerate the QR.

---

## Money spent

This is the only cash cost so far. GitHub Pages, the repo, and the Airtable
free plan are $0. Do not put card numbers in this file.

| Date | What | Paid with | Amount |
| --- | --- | --- | --- |
| 3 Sep 2026 | `jiyahandmade.com` — 1 year at Cloudflare (list $10.46 + tax/fees) | Visa | **$12.34** |

**Total so far: $12.34.** Auto-renew next year should be about $10.46 plus tax,
charged to the same Cloudflare billing method. Invoice: Cloudflare dashboard →
the domain → **View invoice**.

---

## If something is wrong

**Airtable change is not on the shop (most common).**  
GitHub’s 10-minute schedule is unreliable. Run **Actions → Sync products from
Airtable → Run workflow**. Wait about a minute, then hard-refresh
https://jiyahandmade.com/. Check Status / Visible / Photo on the row first
(see [HOW-TO-ADD-PRODUCTS.md](HOW-TO-ADD-PRODUCTS.md)).

**https://jiyahandmade.com/ does not load.**  
1. Try https://sravanskumar.github.io/jiya/ — if that works, DNS or the custom
   domain is the problem.  
2. Cloudflare → DNS: four **A** records and **www** CNAME, all **DNS only**
   (grey cloud).  
3. GitHub → **Settings → Pages**: custom domain `jiyahandmade.com`, **Enforce
   HTTPS** on.  
4. Do not turn Cloudflare proxy (orange cloud) on.

**Browser warns that HTTPS is unsafe.**  
GitHub has not issued (or has lost) the certificate. Confirm DNS is grey-cloud
to GitHub’s IPs, then Pages → turn **Enforce HTTPS** off and on. Leave
Cloudflare SSL/TLS alone.

**“Ownership verification failed” in Search Console.**  
The file `google229afd2276eb0b25.html` must still be at the repo root and at
https://jiyahandmade.com/google229afd2276eb0b25.html. Do not delete it.

**Products vanished after a sync.**  
A row was deleted in Airtable, or Status is Hidden, or Visible is off on a
Shop piece. Restore the row; do not recreate hosting.

**Domain is about to expire (around Sep 2027).**  
Cloudflare auto-renew is on. Confirm the Visa on the Cloudflare account still
works and `jiyahandmadecreations@gmail.com` still receives mail. Invoice:
Cloudflare → domain → **View invoice**. List price ~$10.46/year plus tax.

**Need a new Airtable token.**  
[airtable.com/create/tokens](https://airtable.com/create/tokens) —
`data.records:read` on this base only. Put it in the GitHub secret
`AIRTABLE_TOKEN`. Never commit it.

---

## What not to do

- Do not buy hosting, a site builder, or Cloudflare Workers for this shop.
- Do not orange-cloud (proxy) the GitHub A / CNAME records.
- Do not point other GitHub repos at `jiyahandmade.com`.
- Do not commit `AIRTABLE_TOKEN` or Cloudflare login details.
- Do not let `jiyahandmadecreations@gmail.com` lapse — domain and ICANN mail go there.

---

_Last checked 4 Sep 2026._
