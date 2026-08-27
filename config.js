/* =========================================================================
   JIYA — CONNECTION SETTINGS  (filled in ONCE during setup)
   =========================================================================

   This file connects the website to your Airtable, where you add products.
   You only touch this file one time, during setup. After that, you NEVER
   edit code again — you just add products in the Airtable app.

   HOW TO FILL THIS IN: see  HOW-TO-ADD-PRODUCTS.md  (step "One-time setup").

   Until these are filled in, the website shows sample products so you can
   preview the design.
   ========================================================================= */

window.JIYA_CONFIG = {
  airtable: {
    // Paste your read-only token (starts with "pat...")
    token: "",

    // Paste your Base ID (starts with "app...")
    baseId: "",

    // The table name in Airtable (leave as "Products" unless you renamed it)
    tableName: "Products",
  },
};
