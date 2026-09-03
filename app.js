/* =========================================================================
   Jiya Handmade Creations — site logic
   -------------------------------------------------------------------------
   Products are read from products.json, which is kept up to date
   automatically from Airtable by a GitHub Action. No secrets live here.
   If products.json can't be loaded (e.g. opening the file directly on a
   computer), the sample products in content.js are shown instead.
   You should not need to edit this file.
   ========================================================================= */

(function () {
  "use strict";

  var data = window.JIYA || {};
  var biz = data.business || {};

  var products = [];
  var currentFilter = "All";

  function $(id) { return document.getElementById(id); }

  /* ---------------- Scroll reveal ---------------- */
  var revealObserver = null;
  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  }
  function observeReveals(nodes) {
    if (!revealObserver) {
      (nodes || document.querySelectorAll(".reveal")).forEach(function (n) {
        n.classList.add("in");
      });
      return;
    }
    (nodes || document.querySelectorAll(".reveal")).forEach(function (n) {
      revealObserver.observe(n);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function absoluteUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    try {
      var dir = window.location.pathname;
      if (/\.[a-z0-9]+$/i.test(dir)) dir = dir.replace(/\/[^/]+$/, "/");
      else if (!/\/$/.test(dir)) dir += "/";
      return new URL(path, window.location.origin + dir).href;
    } catch (e) {
      return path;
    }
  }

  function statusOf(p) {
    var s = String((p && p.status) || "").trim().toLowerCase();
    if (s === "archive" || s === "archived" || s === "past") return "archive";
    if (s === "hidden" || s === "hide") return "hidden";
    if (p && p.visible === false) return "hidden";
    return "shop";
  }

  function waMessage(p) {
    if (!p || !p.name) {
      var general = "Hi Jiya! I'd like to order from your creations.";
      return "https://wa.me/" + biz.whatsapp + "?text=" + encodeURIComponent(general);
    }
    var onDemand = !!(p.soldOut || statusOf(p) === "archive");
    var base = onDemand
      ? "Hi Jiya! I'd like to order on demand"
      : "Hi Jiya! I'd like to order";
    var msg = p.collection
      ? base + " from " + p.collection + ": " + p.name
      : base + ": " + p.name;
    var photo = absoluteUrl(p.image);
    if (photo) msg += "\n" + photo;
    return "https://wa.me/" + biz.whatsapp + "?text=" + encodeURIComponent(msg);
  }

  function prettyPhone(num) {
    return num ? String(num).replace(/^91/, "") : "";
  }

  /* ---------------- Static text ---------------- */
  function fillText() {
    var hero = data.hero || {};
    $("hero-heading").textContent = hero.heading || biz.name || "";
    $("hero-subheading").textContent = hero.subheading || "";
    $("hero-button").textContent = hero.buttonText || "Shop now";

    var about = data.about || {};
    $("about-heading").textContent = about.heading || "Our Story";
    $("about-text").textContent = about.text || "";

    $("contact-whatsapp").href = waMessage(null);
    $("contact-instagram").href = biz.instagramUrl || "#";
    $("contact-location").textContent = biz.location ? "📍 " + biz.location : "";

    $("footer-contact").innerHTML =
      "@" + esc(biz.instagram || "") + " &nbsp;·&nbsp; WhatsApp " + esc(prettyPhone(biz.whatsapp));
    $("year").textContent = new Date().getFullYear();
  }

  /* ---------------- Data loading ---------------- */
  function normalize(list) {
    return (list || []).map(function (p) {
      var item = {
        name: p.name || "", category: p.category || "", price: p.price || "",
        description: p.description || "", image: p.image || "",
        soldOut: !!p.soldOut, featured: !!p.featured,
        visible: p.visible === undefined ? true : !!p.visible,
        status: p.status || "",
        collection: p.collection || "",
        date: p.date || "",
      };
      item.status = statusOf(item);
      return item;
    }).filter(function (p) {
      return p.name && statusOf(p) === "shop";
    });
  }

  function loadProducts() {
    setGridMessage("Loading our creations…");
    fetch("products.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("products.json " + res.status);
        return res.json();
      })
      .then(function (json) {
        products = normalize(json.products || json);
        render();
      })
      .catch(function (err) {
        console.warn("Using sample products (products.json not available).", err);
        products = normalize(data.sampleProducts || []);
        render();
      });
  }

  /* ---------------- Rendering ---------------- */
  function categories() {
    var set = ["All"];
    products.forEach(function (p) {
      if (p.category && set.indexOf(p.category) === -1) set.push(p.category);
    });
    return set;
  }

  function renderFilters() {
    var wrap = $("filters");
    wrap.innerHTML = "";
    categories().forEach(function (cat) {
      var btn = document.createElement("button");
      btn.className = "filter-btn" + (cat === currentFilter ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        currentFilter = cat;
        render();
      });
      wrap.appendChild(btn);
    });
  }

  function setGridMessage(msg) {
    $("product-grid").innerHTML = '<p class="grid-message">' + esc(msg) + "</p>";
    $("empty-note").hidden = true;
  }

  function render() {
    renderFilters();
    var grid = $("product-grid");
    grid.innerHTML = "";

    var list = products.filter(function (p) {
      return currentFilter === "All" || p.category === currentFilter;
    });

    $("empty-note").hidden = list.length !== 0;
    list.forEach(function (p) { grid.appendChild(card(p)); });
    observeReveals(grid.querySelectorAll(".card.reveal"));
  }

  function card(p) {
    var el = document.createElement("article");
    el.className = "card reveal";

    if (p.soldOut) el.appendChild(ribbon("Sold out", "soldout"));
    else if (p.featured) el.appendChild(ribbon("New", ""));

    var media = document.createElement("div");
    media.className = "card-media";
    if (p.image) {
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name || "Jiya handmade product";
      img.loading = "lazy";
      img.onerror = function () { media.innerHTML = '<span class="card-placeholder">jiya</span>'; };
      media.appendChild(img);
    } else {
      media.innerHTML = '<span class="card-placeholder">jiya</span>';
    }
    el.appendChild(media);

    var body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      (p.category ? '<span class="card-cat">' + esc(p.category) + "</span>" : "") +
      '<h3 class="card-name">' + esc(p.name) + "</h3>" +
      '<p class="card-desc">' + esc(p.description) + "</p>";

    var foot = document.createElement("div");
    foot.className = "card-foot";
    foot.innerHTML = p.price ? '<span class="card-price">' + esc(p.price) + "</span>" : "<span></span>";

    var order = document.createElement("a");
    var onDemand = !!p.soldOut;
    order.className = "card-order";
    order.href = waMessage(p);
    order.target = "_blank";
    order.rel = "noopener";
    order.textContent = onDemand ? "Order on demand" : "Order";
    order.setAttribute("aria-label", onDemand ? "Order " + p.name + " on demand" : "Order " + p.name);
    foot.appendChild(order);
    body.appendChild(foot);
    el.appendChild(body);
    return el;
  }

  function ribbon(text, extra) {
    var r = document.createElement("span");
    r.className = "ribbon" + (extra ? " " + extra : "");
    r.textContent = text;
    return r;
  }

  /* ---------------- Go ---------------- */
  fillText();
  observeReveals();
  loadProducts();
})();
