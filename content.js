/* =========================================================================
   JIYA HANDMADE CREATIONS — EDIT THIS FILE TO UPDATE THE WEBSITE
   =========================================================================

   You do NOT need to be a developer to edit this file. Just follow the
   examples below carefully.

   TWO SIMPLE RULES:
   1. Only change the text between the "quotes". Keep the quotes.
   2. Keep every comma ( , ) and curly brace ( { } ) exactly where it is.

   TO ADD A PRODUCT PHOTO:
   - Put your image file inside the folder:  images/products/
   - Then use its file name below, e.g.  "images/products/blue-pouch.jpg"

   After editing, save the file and commit (see README.md, section
   "How to publish your changes").
   ========================================================================= */

window.JIYA = {

  /* ---- Basic business info (shown in header, footer, buttons) ---- */
  business: {
    name: "Jiya Handmade Creations",
    tagline: "Handmade with love, made just for you.",
    location: "Guntur, Andhra Pradesh",
    instagram: "jiya_handmade_creations",         // without the @
    instagramUrl: "https://www.instagram.com/jiya_handmade_creations/",
    whatsapp: "919980687834",                      // country code + number, no + or spaces
  },

  /* ---- The short intro shown on the home banner ---- */
  hero: {
    heading: "Hand-knitted with love",
    subheading:
      "Small-batch woollen crochet, pouches, charms and caps — each one made " +
      "by hand in Guntur, made just for you.",
    buttonText: "See our creations",
  },

  /* ---- The 'About' paragraph ---- */
  about: {
    heading: "Our Story",
    text:
      "Jiya Handmade Creations is a small, handmade woollen brand from Guntur. " +
      "Every piece — from festive crochet rakhis to cosy caps — is knitted and " +
      "crocheted by hand, in limited batches, with care in every stitch. " +
      "We made our debut this Rakhi season and sold out two days early. " +
      "Thank you for being part of the journey. 💛",
  },

  /* =========================================================================
     PRODUCTS
     -------------------------------------------------------------------------
     To ADD a product: copy one { ... } block, paste it above the closing ],
     and change the details. Don't forget the comma after each } block.

     Fields:
       name        -> product name
       category    -> one of: "Crochet", "Pouches", "Charms", "Caps"
       price       -> e.g. "₹150" or "From ₹150" (leave "" to hide price)
       description -> one short sentence
       image       -> "images/products/your-file.jpg" (leave "" for placeholder)
       soldOut     -> true or false
       featured    -> true or false (shows a "New" ribbon)
     ========================================================================= */
  products: [

    {
      name: "Crochet Rakhi",
      category: "Crochet",
      price: "From ₹80",
      description: "Handmade woollen rakhi in festive colours. A cosy alternative to store-bought.",
      image: "",
      soldOut: true,
      featured: false,
    },

    {
      name: "Woollen Mobile Pouch",
      category: "Pouches",
      price: "From ₹200",
      description: "Snug, hand-knitted pouch to keep your phone safe and stylish. Custom colours available.",
      image: "",
      soldOut: false,
      featured: true,
    },

    {
      name: "Bag & Mobile Charm",
      category: "Charms",
      price: "From ₹60",
      description: "Little crochet hangings to add a handmade touch to your bag or phone.",
      image: "",
      soldOut: false,
      featured: false,
    },

    {
      name: "Hand-Knitted Woollen Cap",
      category: "Caps",
      price: "From ₹250",
      description: "Warm, soft caps hand-knitted for babies, kids and adults. Perfect winter gift.",
      image: "",
      soldOut: false,
      featured: true,
    },

  ],

};
