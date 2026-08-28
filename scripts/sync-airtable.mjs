/* =========================================================================
   Sync products from Airtable into the website.
   -------------------------------------------------------------------------
   Runs in GitHub Actions (and can be run locally). Reads the Airtable base
   using a token from the environment (never stored in the repo), downloads
   product photos, and writes products.json which the website reads.

   Env vars:
     AIRTABLE_TOKEN     (required) read-only personal access token
     AIRTABLE_BASE_ID   (required) e.g. app27MQgngwYt6BMU
     AIRTABLE_TABLE     (optional) defaults to "Products"
   ========================================================================= */

import fs from "node:fs";
import path from "node:path";
import { buildPages, normalizeStatus } from "./build-pages.mjs";

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE = process.env.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_TABLE || "Products";

if (!TOKEN || !BASE) {
  console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID.");
  process.exit(1);
}

const IMG_DIR = path.join("images", "products");
fs.mkdirSync(IMG_DIR, { recursive: true });

// Match Airtable fields loosely (case/space-insensitive).
function pick(fields, names) {
  for (const key of Object.keys(fields)) {
    const norm = key.toLowerCase().replace(/\s+/g, "");
    if (names.includes(norm)) return fields[key];
  }
  return undefined;
}

async function fetchAllRecords() {
  let records = [];
  let offset;
  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
      throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    records = records.concat(data.records || []);
    offset = data.offset;
  } while (offset);
  return records;
}

function extFor(contentType, url) {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  const m = (url || "").match(/\.(png|jpe?g|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function downloadImage(url, id) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extFor(res.headers.get("content-type"), url);
  const rel = path.join(IMG_DIR, `${id}.${ext}`);
  fs.writeFileSync(rel, buf);
  return rel.split(path.sep).join("/");
}

async function main() {
  const records = await fetchAllRecords();
  const keepImages = new Set();
  const products = [];

  for (const rec of records) {
    const f = rec.fields || {};
    const name = pick(f, ["name", "product", "title"]) || "";
    if (!name) continue;

    let image = "";
    const photo = pick(f, ["photo", "image", "photos", "images"]);
    if (Array.isArray(photo) && photo.length) {
      const url =
        (photo[0].thumbnails &&
          photo[0].thumbnails.large &&
          photo[0].thumbnails.large.url) ||
        photo[0].url;
      if (url) {
        try {
          image = await downloadImage(url, rec.id);
          keepImages.add(path.basename(image));
        } catch (e) {
          console.warn(`Could not download image for "${name}":`, e.message);
        }
      }
    }

    const visible = pick(f, ["visible", "show", "active", "publish", "published"]);
    const rawDate = pick(f, ["date", "collectiondate", "seasondate", "month"]);
    const date =
      typeof rawDate === "string"
        ? (rawDate.match(/^(\d{4}-\d{2}-\d{2})/) || ["", ""])[1]
        : "";
    const item = {
      name,
      category: pick(f, ["category", "type"]) || "",
      price: pick(f, ["price"]) || "",
      description: pick(f, ["description", "desc", "details"]) || "",
      image,
      soldOut: !!pick(f, ["soldout", "sold"]),
      featured: !!pick(f, ["featured", "new"]),
      visible: visible === undefined ? true : !!visible,
      status: "",
      collection: String(pick(f, ["collection", "season", "drop", "collectionname"]) || "").trim(),
      date,
    };
    item.status = normalizeStatus({
      status: pick(f, ["status", "placement", "stage"]),
      visible: item.visible,
    });
    products.push(item);
  }

  // Remove images that are no longer referenced.
  for (const file of fs.readdirSync(IMG_DIR)) {
    if (file === ".gitkeep") continue;
    if (!keepImages.has(file)) fs.rmSync(path.join(IMG_DIR, file));
  }

  // Only rewrite products.json when the products actually changed, so the
  // timestamp alone never creates a needless commit every run.
  let previous = null;
  try {
    previous = JSON.parse(fs.readFileSync("products.json", "utf8"));
  } catch (e) {
    previous = null;
  }

  const unchanged =
    previous &&
    JSON.stringify(previous.products) === JSON.stringify(products);

  const out = {
    updatedAt: unchanged ? previous.updatedAt : new Date().toISOString(),
    products: unchanged ? previous.products : products,
  };

  if (unchanged) {
    console.log(`No product changes (${products.length} products). Leaving products.json as is.`);
  } else {
    fs.writeFileSync("products.json", JSON.stringify({ updatedAt: out.updatedAt, products }, null, 2) + "\n");
    console.log(`Wrote products.json with ${products.length} products.`);
  }

  const pages = buildPages(out.products, { updatedAt: out.updatedAt });
  console.log(`Collection pages: ${pages.collections} season(s), ${pages.wrote} file(s) written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
