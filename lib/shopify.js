import { escLiquid, NOT_LEGAL } from "./input.js";
import { bannerCss, bannerText } from "./banner.js";

export function generateShopify(cfg) {
  const lines = bannerText(cfg);
  const css = bannerCss().replace(/\s*\/\*[^*]*\*\/\s*/g, "");
  const ld = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": {{ product.title | json }},
      "url": {{ shop.url | append: product.url | json }},
      "additionalProperty": [
        { "@type": "PropertyValue", "name": "aiGenerated", "value": true },
        { "@type": "PropertyValue", "name": "digitalSourceType", "value": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" }
      ]
    }
  </script>`;
  const liquid = `{%- comment -%}
  ai-disclosure.liquid — AI disclosure banner and per-product label for ${escLiquid(cfg.siteName)}.
  ${NOT_LEGAL}
  Per-product flag: create a product metafield custom.ai_generated (type: True or false) and tick it on AI-generated products.
{%- endcomment -%}
<style>${css}</style>
{%- if template.name == 'product' and product.metafields.custom.ai_generated == true -%}
  <meta name="ai-generated" content="true">
  ${ld}
{%- endif -%}
<div id="kok-aid-banner" class="kok-aid-banner" role="region" aria-label="AI disclosure">
  <div class="kok-aid-banner__inner">
    <span class="kok-aid-banner__tag">AI</span>
    <div>
${lines.map((l) => `      <p>${escLiquid(l)}</p>`).join("\n")}
    </div>
  </div>
</div>
{%- if template.name == 'product' and product.metafields.custom.ai_generated == true -%}
  <p class="kok-aid-badge" style="margin:8px 16px">AI-generated</p>
{%- endif -%}
`;
  const install = `# Install on Shopify (Online Store 2.0 / Dawn-style themes)

${NOT_LEGAL}

1. Online Store > Themes > ... > Edit code.
2. Snippets > Add a new snippet named \`ai-disclosure\`. Paste the contents of \`ai-disclosure.liquid\`.
3. In \`layout/theme.liquid\`, directly after the opening \`<body ...>\` tag, add:
   \`{% render 'ai-disclosure' %}\`
4. Settings > Custom data > Products > Add definition: namespace and key \`custom.ai_generated\`, type "True or false".
5. Tick the metafield on products whose copy or images are AI-generated or AI-manipulated.
6. Preview a flagged and an unflagged product. Check the banner on mobile and with a keyboard.

Notes
- The banner appears sitewide. The "AI-generated" badge and JSON-LD appear only on flagged product pages.
- The Product JSON-LD here is minimal and is meant to sit beside your theme's own product markup. If your theme or an app already outputs Product JSON-LD, merge the \`additionalProperty\` entries into it instead of publishing two Product blocks.
- Shopify's Liquid is not tested against your theme here. Preview before publishing.
`;
  return { files: { "shopify/ai-disclosure.liquid": liquid, "shopify/INSTALL.md": install } };
}
