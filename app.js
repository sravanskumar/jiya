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
    if (!p || !(p.name || p.group)) {
      var general = "Hi Jiya! I'd like to order from your creations.";
      return "https://wa.me/" + biz.whatsapp + "?text=" + encodeURIComponent(general);
    }
    var onDemand = !!(p.soldOut || statusOf(p) === "archive");
    var base = onDemand
      ? "Hi Jiya! I'd like to order on demand"
      : "Hi Jiya! I'd like to order";
    var label = (window.JIYA_CARDS && JIYA_CARDS.orderName(p)) || p.name;
    var msg = p.collection
      ? base + " from " + p.collection + ": " + label
      : base + ": " + label;
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
        group: p.group || "",
        variant: p.variant || "",
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
  function families() {
    var Cards = window.JIYA_CARDS;
    if (!Cards) {
      return products.map(function (p) {
        return { title: p.name, variants: [p] };
      });
    }
    return Cards.groupProducts(products);
  }

  function categories() {
    var set = ["All"];
    families().forEach(function (fam) {
      var cat = fam.variants[0] && fam.variants[0].category;
      if (cat && set.indexOf(cat) === -1) set.push(cat);
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

    var list = families().filter(function (fam) {
      var cat = fam.variants[0] && fam.variants[0].category;
      return currentFilter === "All" || cat === currentFilter;
    });

    $("empty-note").hidden = list.length !== 0;
    list.forEach(function (fam) { grid.appendChild(card(fam)); });
    if (window.JIYA_CARDS) JIYA_CARDS.bindAll(grid);
    observeReveals(grid.querySelectorAll(".card.reveal"));
  }

  function card(fam) {
    var variants = fam.variants || [fam];
    var first = variants[0];
    var title = fam.title || (first && first.name) || "";
    var allSold = variants.every(function (v) { return v.soldOut; });
    var anyFeat = variants.some(function (v) { return v.featured; });
    var el = document.createElement("article");
    el.className = "card reveal";
    if (variants.length > 1) {
      el.setAttribute("data-card-variants", "1");
      el.setAttribute("data-all-soldout", allSold ? "true" : "false");
      el.setAttribute("data-any-featured", anyFeat ? "true" : "false");
    }

    var rib = ribbon("Sold out", "soldout");
    if (first.soldOut || allSold) {
      rib.textContent = "Sold out";
      rib.className = "ribbon soldout";
    } else if (first.featured || anyFeat) {
      rib.textContent = "New";
      rib.className = "ribbon";
    } else {
      rib.hidden = true;
    }
    el.appendChild(rib);

    var media = document.createElement("div");
    media.className = "card-media";
    var img = document.createElement("img");
    img.className = "card-media-main";
    img.alt = title;
    img.loading = "lazy";
    if (first.image) {
      img.src = first.image;
    } else {
      img.hidden = true;
    }
    img.onerror = function () {
      img.hidden = true;
      var miss = media.querySelector(".card-placeholder");
      if (miss) miss.hidden = false;
    };
    media.appendChild(img);
    var ph = document.createElement("span");
    ph.className = "card-placeholder";
    ph.textContent = "jiya";
    ph.hidden = !!first.image;
    media.appendChild(ph);
    el.appendChild(media);

    if (variants.length > 1) {
      var thumbs = document.createElement("div");
      thumbs.className = "card-thumbs";
      thumbs.setAttribute("role", "group");
      thumbs.setAttribute("aria-label", "Options for " + title);
      variants.forEach(function (v, i) {
        thumbs.appendChild(thumbButton(v, i === 0));
      });
      el.appendChild(thumbs);
    }

    var body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      (first.category ? '<span class="card-cat">' + esc(first.category) + "</span>" : "") +
      '<h3 class="card-name">' + esc(title) + "</h3>" +
      '<p class="card-desc">' + esc(first.description || "") + "</p>";

    var foot = document.createElement("div");
    foot.className = "card-foot";
    foot.innerHTML = first.price
      ? '<span class="card-price">' + esc(first.price) + "</span>"
      : '<span class="card-price"></span>';

    var order = document.createElement("a");
    var onDemand = !!(first.soldOut || statusOf(first) === "archive");
    var label = (window.JIYA_CARDS && JIYA_CARDS.orderName(first)) || first.name;
    order.className = "card-order";
    order.href = waMessage(first);
    order.target = "_blank";
    order.rel = "noopener";
    order.textContent = onDemand ? "Order on demand" : "Order";
    order.setAttribute("aria-label", onDemand ? "Order " + label + " on demand" : "Order " + label);
    foot.appendChild(order);
    body.appendChild(foot);
    el.appendChild(body);
    return el;
  }

  function thumbButton(v, selected) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-thumb";
    btn.setAttribute("aria-pressed", selected ? "true" : "false");
    var vLabel = (window.JIYA_CARDS && JIYA_CARDS.variantLabel(v)) || v.name;
    btn.setAttribute("aria-label", vLabel);
    btn.setAttribute("data-image", v.image || "");
    btn.setAttribute("data-alt", vLabel);
    btn.setAttribute("data-price", v.price || "");
    btn.setAttribute("data-soldout", v.soldOut ? "true" : "false");
    btn.setAttribute("data-featured", v.featured ? "true" : "false");
    var onDemand = !!(v.soldOut || statusOf(v) === "archive");
    var orderLabel = (window.JIYA_CARDS && JIYA_CARDS.orderName(v)) || v.name;
    btn.setAttribute("data-wa", waMessage(v));
    btn.setAttribute("data-label", onDemand ? "Order on demand" : "Order");
    btn.setAttribute("data-aria", onDemand ? "Order " + orderLabel + " on demand" : "Order " + orderLabel);
    if (v.image) {
      var timg = document.createElement("img");
      timg.src = v.image;
      timg.alt = "";
      timg.loading = "lazy";
      btn.appendChild(timg);
    }
    var cap = document.createElement("span");
    cap.className = "card-thumb-label";
    cap.textContent = vLabel;
    btn.appendChild(cap);
    return btn;
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
