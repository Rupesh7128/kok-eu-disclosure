# Install on Shopify (Online Store 2.0 / Dawn-style themes)

Tooling for transparency obligations; not legal advice.

1. Online Store > Themes > ... > Edit code.
2. Snippets > Add a new snippet named `ai-disclosure`. Paste the contents of `ai-disclosure.liquid`.
3. In `layout/theme.liquid`, directly after the opening `<body ...>` tag, add:
   `{% render 'ai-disclosure' %}`
4. Settings > Custom data > Products > Add definition: namespace and key `custom.ai_generated`, type "True or false".
5. Tick the metafield on products whose copy or images are AI-generated or AI-manipulated.
6. Preview a flagged and an unflagged product. Check the banner on mobile and with a keyboard.

Notes
- The banner appears sitewide. The "AI-generated" badge and JSON-LD appear only on flagged product pages.
- The Product JSON-LD here is minimal and is meant to sit beside your theme's own product markup. If your theme or an app already outputs Product JSON-LD, merge the `additionalProperty` entries into it instead of publishing two Product blocks.
- Shopify's Liquid is not tested against your theme here. Preview before publishing.
