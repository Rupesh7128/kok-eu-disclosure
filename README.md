# EU AI Act Art. 50 Disclosure Pack

By [Kingdom of Kumar](https://www.kingdomofkumar.com) · Mayank Raj · MIT

**Tooling for transparency obligations; not legal advice.** This pack helps you show people when content or an assistant is AI. It does not decide whether Article 50 of Regulation (EU) 2024/1689 applies to you, which exceptions you can use, or whether the wording is enough. Ask a qualified lawyer. Official Commission FAQ: <https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act>

## What it generates

| Output | What you get |
|---|---|
| Banner | Self-contained HTML + CSS + JS. Sitewide notice, `data-ai-generated` badges, `data-ai-chat` notice for a chat widget. |
| JSON-LD | schema.org `Article` / `ImageObject` / `AudioObject` / `VideoObject` with an `aiGenerated` flag, per content type, plus ready `<script>` tags. |
| WordPress | Plugin folder and upload-ready zip. Meta box per post/page, banner, badge, JSON-LD and `<meta name="ai-generated">` on flagged posts. |
| Shopify | `ai-disclosure.liquid` snippet, per-product `custom.ai_generated` metafield flag, install steps. |
| Checklist | Audit checklist tailored to the content types, as PDF (pdfkit) and printable HTML. |
| Pack | All of the above in one zip. |

## What it does not do

- It does **not** watermark images, audio, video or text. The JSON-LD is page-level metadata. A provider's machine-readable marking duty (Art. 50(2)) is a technical measure in the generating system.
- schema.org has no official "AI-generated" property. The label uses a `PropertyValue` named `aiGenerated` (our convention) and the IPTC digital source type `trainedAlgorithmicMedia`. Regulators have not endorsed this exact markup.
- It does not decide your role (provider/deployer), exceptions, or whether you are in scope.
- The banner says that AI content "is labelled". That is only true if you actually mark your AI content. The checklist asks you to verify it.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npm test               # generator self-test
npm run sample         # regenerates docs/sample-pack/
```

Node 22+. No keys, no external calls. See `.env.example`.

## API

`POST /api/generate` with `{ "type": "pack|banner|jsonld|checklist|wordpress|shopify", "siteName": "...", "botName": "...", "contentTypes": ["chat","text","image","audio","video"], "siteUrl": "https://..." }` returns `{ files: { path: text }, binary: [paths] }`.

`GET /api/download?kind=pack|wordpress|checklist-pdf|checklist-html&siteName=...&botName=...&contentTypes=chat,text` returns the file.

Input is length-limited, stripped of control characters and `<>`, and escaped per output language (HTML, JS-in-script, PHP, Liquid).

## MCP

Four tools: `generate_disclosure_banner`, `generate_jsonld_label`, `generate_audit_checklist`, `package_wp_snippet`.

Stdio:

```json
{ "mcpServers": { "kok-eu-disclosure": { "command": "node", "args": ["/absolute/path/to/eu-disclosure/mcp/server.js"] } } }
```

Hosted: `POST /api/mcp` (stateless JSON-RPC 2.0, tools only). It has an in-memory courtesy limit (`FREE_GENERATIONS_PER_DAY`, default 30/IP/day) that resets on serverless cold starts.

## Tested / not tested

Tested here: `npm run build`, `npm test` (valid JSON-LD, only the three brand colours in generated code, banner JS syntax, PDF and zip headers), REST routes, hosted and stdio MCP calls.
Not tested here: PHP lint (no `php` binary on the build machine), the WordPress plugin inside a real WordPress, the Liquid in a real Shopify theme, screen-reader behaviour of the banner, rendering in a browser. Preview all of them before publishing.

## Sample

`docs/sample-pack/` and `docs/sample-pack.zip` are real output for a fictional site, "Harbour & Pine Studio".

See `REPORT.md` for claims and sources.
