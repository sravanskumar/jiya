/* =========================================================================
   Build crawlable collection pages + sitemap from products.json.
   Called after an Airtable sync, and can be run locally:
     node scripts/build-pages.mjs
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_BASE = process.env.SITE_BASE || "https://jiyahandmade.com";
const WHATSAPP = "919980687834";
const INSTAGRAM = "https://www.instagram.com/jiya_handmade_creations/";
const COL_DIR = "collections";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function normalizeStatus(p) {
  const s = String(p && p.status ? p.status : "").trim().toLowerCase();
  if (s === "archive" || s === "archived" || s === "past") return "archive";
  if (s === "hidden" || s === "hide") return "hidden";
  if (p && p.visible === false) return "hidden";
  return "shop";
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isoDate(v) {
  if (!v) return "";
  const s = String(v);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : "";
}

function monthYear(iso) {
  const d = isoDate(iso);
  if (!d) return "";
  const month = Number(d.slice(5, 7));
  const year = d.slice(0, 4);
  if (!month || month < 1 || month > 12) return "";
  return MONTHS[month - 1] + " " + year;
}

function slugify(title) {
  const s = String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "collection";
}

function absUrl(rel) {
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  return SITE_BASE.replace(/\/$/, "") + "/" + String(rel).replace(/^\.?\//, "");
}

function variantLabel(p) {
  const v = String((p && p.variant) || "").trim();
  return v || (p && p.name) || "Option";
}

function orderName(p) {
  const g = String((p && p.group) || "").trim();
  const v = String((p && p.variant) || "").trim();
  if (g && v) return g + " (" + v + ")";
  return g || (p && p.name) || "";
}

function waHref(p) {
  const onDemand = !!(p.soldOut || normalizeStatus(p) === "archive");
  const base = onDemand
    ? "Hi Jiya! I'd like to order on demand"
    : "Hi Jiya! I'd like to order";
  const label = orderName(p);
  let msg = p.collection
    ? base + " from " + p.collection + ": " + label
    : base + ": " + label;
  const photo = absUrl(p.image);
  if (photo) msg += "\n" + photo;
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
}

function groupProductFamilies(list) {
  const order = [];
  const map = {};
  for (const p of list || []) {
    const g = String(p.group || "").trim();
    if (!g) {
      order.push({ title: p.name || "", variants: [p] });
      continue;
    }
    const key = "g:" + g.toLowerCase();
    if (!map[key]) {
      map[key] = { title: g, variants: [] };
      order.push(map[key]);
    }
    map[key].variants.push(p);
  }
  for (const fam of order) {
    fam.variants.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return variantLabel(a).localeCompare(variantLabel(b));
    });
  }
  return order;
}

function groupInfo(p) {
  const name = String(p.collection || "").trim();
  if (name) return { key: "n:" + name.toLowerCase(), title: name };
  if (normalizeStatus(p) !== "archive") return null;
  const my = monthYear(p.date);
  if (my) return { key: "d:" + isoDate(p.date).slice(0, 7), title: my };
  return { key: "past", title: "Past pieces" };
}

export function buildCollections(products) {
  const groups = new Map();
  for (const p of products || []) {
    if (!p || !p.name || normalizeStatus(p) === "hidden") continue;
    const info = groupInfo(p);
    if (!info) continue;
    if (!groups.has(info.key)) {
      groups.set(info.key, {
        key: info.key,
        title: info.title,
        products: [],
      });
    }
    groups.get(info.key).products.push(p);
  }

  const usedSlugs = new Set();
  const list = [...groups.values()].map((g) => {
    let latest = "";
    let cover = "";
    for (const p of g.products) {
      const d = isoDate(p.date);
      if (d && d > latest) latest = d;
      if (!cover && p.image) cover = p.image;
    }
    let slug = slugify(g.title);
    if (usedSlugs.has(slug)) slug = slug + "-" + slugify(g.key).slice(-8);
    usedSlugs.add(slug);
    const caption = monthYear(latest);
    const families = groupProductFamilies(g.products);
    return {
      slug,
      title: g.title,
      caption: caption && caption !== g.title ? caption : "",
      date: latest,
      cover,
      count: families.length,
      products: g.products,
      families,
    };
  });

  list.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });
  return list;
}

function writeIfChanged(file, content) {
  let prev = null;
  try {
    prev = fs.readFileSync(file, "utf8");
  } catch (e) {
    prev = null;
  }
  if (prev === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

function head(opts) {
  const title = esc(opts.title);
  const desc = esc(opts.description);
  const canonical = esc(opts.canonical);
  const image = esc(opts.image || absUrl("assets/og-image.jpg"));
  const jsonLd = opts.jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(opts.jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="../assets/favicon.png" />
  <link rel="apple-touch-icon" href="../assets/apple-touch.png" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${image}" />
  <link rel="preload" as="font" href="../fonts/dancing-script-600.woff2" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="../styles.css" />${jsonLd}
</head>`;
}

function chrome(active) {
  const colClass = active === "collections" ? " aria-current=\"page\"" : "";
  return `
  <header class="site-header" id="top">
    <nav class="nav container">
      <a class="brand" href="../">
        <span class="brand-script">jiya</span>
        <span class="brand-sub">Handmade Creations</span>
      </a>
      <div class="nav-links">
        <a href="../#products">Shop</a>
        <a href="index.html"${colClass}>Collections</a>
        <a href="../#about">Our Story</a>
        <a href="../#contact">Contact</a>
      </div>
    </nav>
  </header>
  <main>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
  </main>
  <footer class="site-footer">
    <div class="container footer-inner">
      <span class="brand-script footer-logo">jiya</span>
      <p class="footer-tagline">Thank you — made just for you.</p>
      <p class="footer-contact">@jiya_handmade_creations &nbsp;·&nbsp; WhatsApp 9980687834</p>
      <p class="footer-copy">&copy; ${year} Jiya Handmade Creations · Guntur</p>
    </div>
  </footer>`;
}

function thumbHtml(v, selected) {
  const onDemand = !!(v.soldOut || normalizeStatus(v) === "archive");
  const vLabel = variantLabel(v);
  const name = orderName(v);
  const imgPath = v.image ? "../" + v.image : "";
  const img = v.image
    ? `<img src="${esc(imgPath)}" alt="" loading="lazy" width="80" height="80" />`
    : "";
  const label = onDemand ? "Order on demand" : "Order";
  const aria = onDemand ? "Order " + name + " on demand" : "Order " + name;
  return `<button type="button" class="card-thumb" aria-pressed="${selected ? "true" : "false"}" aria-label="${esc(vLabel)}" data-image="${esc(imgPath)}" data-alt="${esc(vLabel)}" data-price="${esc(v.price || "")}" data-soldout="${v.soldOut ? "true" : "false"}" data-featured="${v.featured ? "true" : "false"}" data-wa="${esc(waHref(v))}" data-label="${label}" data-aria="${esc(aria)}">${img}<span class="card-thumb-label">${esc(vLabel)}</span></button>`;
}

function cardHtml(fam) {
  const variants = fam.variants || [fam];
  const first = variants[0];
  const title = fam.title || (first && first.name) || "";
  const allSold = variants.every((v) => v.soldOut);
  const anyFeat = variants.some((v) => v.featured);
  const onDemand = !!(first.soldOut || normalizeStatus(first) === "archive");
  let ribbon;
  if (first.soldOut || allSold) {
    ribbon = '<span class="ribbon soldout">Sold out</span>';
  } else if (first.featured || anyFeat) {
    ribbon = '<span class="ribbon">New</span>';
  } else {
    ribbon = '<span class="ribbon" hidden></span>';
  }
  const img = first.image
    ? `<img class="card-media-main" src="../${esc(first.image)}" alt="${esc(title)}" width="600" height="600" />`
    : '<img class="card-media-main" alt="" hidden /><span class="card-placeholder">jiya</span>';
  const placeholder = first.image
    ? '<span class="card-placeholder" hidden>jiya</span>'
    : "";
  const thumbs =
    variants.length > 1
      ? `<div class="card-thumbs" role="group" aria-label="${esc("Options for " + title)}">${variants
          .map((v, i) => thumbHtml(v, i === 0))
          .join("")}</div>`
      : "";
  const attrs =
    variants.length > 1
      ? ` data-card-variants="1" data-all-soldout="${allSold ? "true" : "false"}" data-any-featured="${anyFeat ? "true" : "false"}"`
      : "";
  const cat = first.category ? `<span class="card-cat">${esc(first.category)}</span>` : "";
  const price = first.price
    ? `<span class="card-price">${esc(first.price)}</span>`
    : '<span class="card-price"></span>';
  const label = onDemand ? "Order on demand" : "Order";
  const name = orderName(first);
  const aria = onDemand ? "Order " + name + " on demand" : "Order " + name;
  return `<article class="card"${attrs}>
          ${ribbon}
          <div class="card-media">${img}${placeholder}</div>${thumbs ? `
          ${thumbs}` : ""}
          <div class="card-body">
            ${cat}
            <h2 class="card-name">${esc(title)}</h2>
            <p class="card-desc">${esc(first.description || "")}</p>
            <div class="card-foot">
              ${price}
              <a class="card-order" href="${esc(waHref(first))}" target="_blank" rel="noopener" aria-label="${esc(aria)}">${label}</a>
            </div>
          </div>
        </article>`;
}

function indexPage(collections) {
  const desc =
    "Past seasonal collections from Jiya Handmade Creations — limited festive drops from Guntur, still available on demand.";
  const canonical = SITE_BASE.replace(/\/$/, "") + "/collections/";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Past collections — Jiya Handmade Creations",
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "Jiya Handmade Creations", url: SITE_BASE + "/" },
  };

  let grid;
  if (!collections.length) {
    grid = `<p class="empty-note">No past collections yet — the next festive drop will live here when the season ends, and you can still order those pieces on demand.</p>`;
  } else {
    grid =
      `<div class="collection-grid">` +
      collections
        .map((c) => {
          const img = c.cover
            ? `<img src="../${esc(c.cover)}" alt="${esc(c.title)}" width="600" height="600" />`
            : '<span class="card-placeholder">jiya</span>';
          const meta = [c.caption, c.count === 1 ? "1 piece" : c.count + " pieces"]
            .filter(Boolean)
            .join(" · ");
          return `<a class="card collection-card" href="${esc(c.slug)}.html">
          <div class="card-media">${img}</div>
          <div class="card-body">
            <span class="card-cat">Collection</span>
            <h2 class="card-name">${esc(c.title)}</h2>
            <p class="card-desc">${esc(meta)}</p>
            <p class="collection-cta">View drop</p>
          </div>
        </a>`;
        })
        .join("\n        ") +
      `</div>`;
  }

  return `${head({
    title: "Past collections — Jiya Handmade Creations",
    description: desc,
    canonical,
    jsonLd,
  })}
<body>
${chrome("collections")}
  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="section-eyebrow">The archive</p>
        <h1 class="section-title">Past collections</h1>
        <p class="section-note">Limited festive drops, kept here by season. Every piece can still be made for you on demand.</p>
      </div>
      ${grid}
    </div>
  </section>
${footer()}
</body>
</html>
`;
}

function collectionPage(col) {
  const desc = col.caption
    ? `${col.title} (${col.caption}) — handmade woollen pieces from Jiya Handmade Creations in Guntur. Order on demand on WhatsApp.`
    : `${col.title} — handmade woollen pieces from Jiya Handmade Creations in Guntur. Order on demand on WhatsApp.`;
  const canonical = SITE_BASE.replace(/\/$/, "") + "/collections/" + col.slug + ".html";
  const image = col.cover ? absUrl(col.cover) : absUrl("assets/og-image.jpg");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: col.title + " — Jiya Handmade Creations",
    description: desc,
    url: canonical,
    numberOfItems: col.products.length,
    itemListElement: col.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: orderName(p) || p.name,
        description: p.description || "",
        image: p.image ? absUrl(p.image) : image,
        brand: { "@type": "Brand", name: "Jiya Handmade Creations" },
      },
    })),
  };

  const families = col.families || groupProductFamilies(col.products);
  const cards = families.map(cardHtml).join("\n        ");
  const note = [col.caption, "Order on demand on WhatsApp"]
    .filter(Boolean)
    .join(" · ");

  return `${head({
    title: `${col.title} — Jiya Handmade Creations`,
    description: desc,
    canonical,
    image,
    jsonLd,
  })}
<body>
${chrome("collections")}
  <section class="section">
    <div class="container">
      <div class="section-head">
        <p class="section-eyebrow">Collection</p>
        <h1 class="section-title">${esc(col.title)}</h1>
        <p class="section-note">${esc(note)}</p>
      </div>
      <div class="product-grid">
        ${cards}
      </div>
    </div>
  </section>
${footer()}
  <script src="../cards.js" defer></script>
</body>
</html>
`;
}

function sitemapXml(collections, updatedAt) {
  const day = isoDate(updatedAt) || new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: SITE_BASE.replace(/\/$/, "") + "/", priority: "1.0" },
    { loc: SITE_BASE.replace(/\/$/, "") + "/collections/", priority: "0.8" },
    ...collections.map((c) => ({
      loc: SITE_BASE.replace(/\/$/, "") + "/collections/" + c.slug + ".html",
      priority: "0.7",
    })),
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${day}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function buildPages(products, opts) {
  const updatedAt = (opts && opts.updatedAt) || new Date().toISOString();
  const collections = buildCollections(products);
  fs.mkdirSync(COL_DIR, { recursive: true });

  let wrote = 0;
  if (writeIfChanged(path.join(COL_DIR, "index.html"), indexPage(collections))) wrote++;

  const keep = new Set(["index.html"]);
  for (const col of collections) {
    const file = col.slug + ".html";
    keep.add(file);
    if (writeIfChanged(path.join(COL_DIR, file), collectionPage(col))) wrote++;
  }

  for (const file of fs.readdirSync(COL_DIR)) {
    if (!file.endsWith(".html") || keep.has(file)) continue;
    fs.rmSync(path.join(COL_DIR, file));
    wrote++;
  }

  if (writeIfChanged("sitemap.xml", sitemapXml(collections, updatedAt))) wrote++;
  return { collections: collections.length, wrote };
}

const isDirect =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirect) {
  const json = JSON.parse(fs.readFileSync("products.json", "utf8"));
  const result = buildPages(json.products || json, { updatedAt: json.updatedAt });
  console.log(
    `Built ${result.collections} collection(s); ${result.wrote} file(s) written.`
  );
}
