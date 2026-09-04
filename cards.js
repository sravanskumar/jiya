/* =========================================================================
   Shared product-card helpers: group variants, bind thumbnail switching.
   Used on the shop (app.js) and on generated collection pages.
   ========================================================================= */

(function (root) {
  "use strict";

  function displayTitle(p) {
    var g = String((p && p.group) || "").trim();
    return g || (p && p.name) || "";
  }

  function orderName(p) {
    var g = String((p && p.group) || "").trim();
    var v = String((p && p.variant) || "").trim();
    if (g && v) return g + " (" + v + ")";
    return g || (p && p.name) || "";
  }

  function variantLabel(p) {
    var v = String((p && p.variant) || "").trim();
    return v || (p && p.name) || "Option";
  }

  function sortVariants(a, b) {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return variantLabel(a).localeCompare(variantLabel(b));
  }

  function groupProducts(list) {
    var order = [];
    var map = {};
    (list || []).forEach(function (p) {
      var g = String(p.group || "").trim();
      if (!g) {
        order.push({ title: p.name || "", variants: [p] });
        return;
      }
      var key = "g:" + g.toLowerCase();
      if (!map[key]) {
        map[key] = { title: g, variants: [] };
        order.push(map[key]);
      }
      map[key].variants.push(p);
    });
    order.forEach(function (fam) {
      fam.variants.sort(sortVariants);
    });
    return order;
  }

  function applyThumb(card, btn) {
    if (!card || !btn) return;
    var img = card.querySelector(".card-media-main");
    var ph = card.querySelector(".card-placeholder");
    var src = btn.getAttribute("data-image") || "";
    var alt = btn.getAttribute("data-alt") || "";
    if (img) {
      if (src) {
        img.src = src;
        img.alt = alt;
        img.hidden = false;
      } else {
        img.removeAttribute("src");
        img.hidden = true;
      }
    }
    if (ph) ph.hidden = !!src;

    var price = card.querySelector(".card-price");
    if (price) price.textContent = btn.getAttribute("data-price") || "";

    var soldOut = btn.getAttribute("data-soldout") === "true";
    var featured = btn.getAttribute("data-featured") === "true";
    var allSold = card.getAttribute("data-all-soldout") === "true";
    var ribbon = card.querySelector(".ribbon");
    if (ribbon) {
      if (soldOut || allSold) {
        ribbon.hidden = false;
        ribbon.textContent = "Sold out";
        ribbon.className = "ribbon soldout";
      } else if (featured || card.getAttribute("data-any-featured") === "true") {
        ribbon.hidden = false;
        ribbon.textContent = "New";
        ribbon.className = "ribbon";
      } else {
        ribbon.hidden = true;
      }
    }

    var order = card.querySelector(".card-order");
    if (order) {
      var href = btn.getAttribute("data-wa") || "#";
      order.href = href;
      order.textContent = btn.getAttribute("data-label") || "Order";
      order.setAttribute("aria-label", btn.getAttribute("data-aria") || order.textContent);
    }

    card.querySelectorAll(".card-thumb").forEach(function (t) {
      t.setAttribute("aria-pressed", t === btn ? "true" : "false");
    });
  }

  function bindCard(card) {
    if (!card || card.getAttribute("data-variants-bound") === "1") return;
    var thumbs = card.querySelectorAll(".card-thumb");
    if (!thumbs.length) return;
    card.setAttribute("data-variants-bound", "1");
    thumbs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyThumb(card, btn);
      });
    });
  }

  function bindAll(rootEl) {
    var root = rootEl || document;
    root.querySelectorAll("[data-card-variants]").forEach(bindCard);
  }

  if (root.document) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", function () {
        bindAll(root.document);
      });
    } else {
      bindAll(root.document);
    }
  }

  root.JIYA_CARDS = {
    displayTitle: displayTitle,
    orderName: orderName,
    variantLabel: variantLabel,
    groupProducts: groupProducts,
    bindCard: bindCard,
    bindAll: bindAll,
    applyThumb: applyThumb,
  };
})(typeof window !== "undefined" ? window : this);
