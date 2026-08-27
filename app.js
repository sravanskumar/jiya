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

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function waMessage(productName) {
    var base = "Hi Jiya! I'd like to order";
    var msg = productName ? base + ": " + productName : base + " from your creations.";
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

    $("contact-whatsapp").href = waMessage("");
    $("contact-instagram").href = biz.instagramUrl || "#";
    $("contact-location").textContent = biz.location ? "📍 " + biz.location : "";

    $("footer-contact").innerHTML =
      "@" + esc(biz.instagram || "") + " &nbsp;·&nbsp; WhatsApp " + esc(prettyPhone(biz.whatsapp));
    $("year").textContent = new Date().getFullYear();
  }

  /* ---------------- Data loading ---------------- */
  function normalize(list) {
    return (list || []).map(function (p) {
      return {
        name: p.name || "", category: p.category || "", price: p.price || "",
        description: p.description || "", image: p.image || "",
        soldOut: !!p.soldOut, featured: !!p.featured,
        visible: p.visible === undefined ? true : !!p.visible,
      };
    }).filter(function (p) { return p.visible !== false && p.name; });
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
  }

  function card(p) {
    var el = document.createElement("article");
    el.className = "card";

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
    if (p.soldOut) {
      order.className = "card-order disabled";
      order.textContent = "Sold out";
    } else {
      order.className = "card-order";
      order.href = waMessage(p.name);
      order.target = "_blank";
      order.rel = "noopener";
      order.textContent = "Order";
    }
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
  loadProducts();
})();
