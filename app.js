/* =========================================================================
   Jiya Handmade Creations — site logic
   Reads everything from content.js (window.JIYA) and renders the page.
   You should not need to edit this file — edit content.js instead.
   ========================================================================= */

(function () {
  "use strict";

  var data = window.JIYA;
  if (!data) {
    console.error("content.js did not load. Check the file for a typo.");
    return;
  }

  var biz = data.business || {};

  /* ---- Helpers ---- */
  function $(id) { return document.getElementById(id); }

  function waMessage(productName) {
    var base = "Hi Jiya! I'd like to order";
    var msg = productName ? base + ": " + productName : base + " from your creations.";
    return "https://wa.me/" + biz.whatsapp + "?text=" + encodeURIComponent(msg);
  }

  /* ---- Fill in business text ---- */
  function fillText() {
    var hero = data.hero || {};
    $("hero-heading").textContent = hero.heading || biz.name || "";
    $("hero-subheading").textContent = hero.subheading || "";
    var heroBtn = $("hero-button");
    heroBtn.textContent = hero.buttonText || "Shop now";

    var about = data.about || {};
    $("about-heading").textContent = about.heading || "Our Story";
    $("about-text").textContent = about.text || "";

    $("contact-whatsapp").href = waMessage("");
    $("contact-instagram").href = biz.instagramUrl || "#";
    $("contact-location").textContent = biz.location
      ? "📍 " + biz.location
      : "";

    $("footer-contact").innerHTML =
      "@" + (biz.instagram || "") + " &nbsp;·&nbsp; WhatsApp " + prettyPhone(biz.whatsapp);
    $("year").textContent = new Date().getFullYear();
  }

  function prettyPhone(num) {
    if (!num) return "";
    // strip country code 91 for display if present
    var n = String(num).replace(/^91/, "");
    return n;
  }

  /* ---- Build category filters ---- */
  var currentFilter = "All";

  function categories() {
    var set = ["All"];
    (data.products || []).forEach(function (p) {
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
        renderFilters();
        renderProducts();
      });
      wrap.appendChild(btn);
    });
  }

  /* ---- Build product cards ---- */
  function renderProducts() {
    var grid = $("product-grid");
    grid.innerHTML = "";

    var list = (data.products || []).filter(function (p) {
      return currentFilter === "All" || p.category === currentFilter;
    });

    $("empty-note").hidden = list.length !== 0;

    list.forEach(function (p) {
      grid.appendChild(card(p));
    });
  }

  function card(p) {
    var el = document.createElement("article");
    el.className = "card";

    // ribbon
    if (p.soldOut) {
      el.appendChild(ribbon("Sold out", "soldout"));
    } else if (p.featured) {
      el.appendChild(ribbon("New", ""));
    }

    // media
    var media = document.createElement("div");
    media.className = "card-media";
    if (p.image) {
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name || "Jiya handmade product";
      img.loading = "lazy";
      img.onerror = function () {
        media.innerHTML = '<span class="card-placeholder">jiya</span>';
      };
      media.appendChild(img);
    } else {
      media.innerHTML = '<span class="card-placeholder">jiya</span>';
    }
    el.appendChild(media);

    // body
    var body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      (p.category ? '<span class="card-cat">' + esc(p.category) + "</span>" : "") +
      '<h3 class="card-name">' + esc(p.name || "") + "</h3>" +
      '<p class="card-desc">' + esc(p.description || "") + "</p>";

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

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---- Go ---- */
  fillText();
  renderFilters();
  renderProducts();
})();
