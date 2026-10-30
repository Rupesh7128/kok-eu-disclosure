# REPORT — EU AI Act Art. 50 Disclosure Pack

Status: `npm install && npm run build` green; `npm test` OK; REST, hosted MCP and stdio MCP exercised with real calls. Everything is labelled "Tooling for transparency obligations; not legal advice."

## Claims and sources

| Claim in the product | Basis | Confidence |
|---|---|---|
| Art. 50(1): people must be told they interact with AI unless obvious | Regulation (EU) 2024/1689, Art. 50(1), paraphrased from my knowledge of the text | Paraphrase; not re-read against the Official Journal in this session |
| Art. 50(2): providers mark synthetic audio/image/video/text outputs machine-readably | Art. 50(2), same | Same |
| Art. 50(3): deployers of emotion recognition / biometric categorisation inform exposed people | Art. 50(3), same | Same |
| Art. 50(4): deployers disclose deepfakes and public-interest AI text; editorial-review exception | Art. 50(4), same | Same |
| Art. 50(5): clear, distinguishable, at latest at first interaction, accessible | Art. 50(5), same | Same |
| Art. 50 applies from 2 Aug 2026 | Brief; Art. 113 | The brief gave it as a hard date |
| Grace notes to 2 Dec 2026 for some systems | Brief only | **Not verified.** The product never states this date; it says "check the Commission FAQ for any transitional period" |
| Commission FAQ URL | Brief | The page could not be fetched in this session (fetch permission not granted), so no FAQ wording is quoted |
| No official schema.org AI-generated property | schema.org vocabulary as I know it | Check schema.org before relying on it |
| IPTC `trainedAlgorithmicMedia` digital source type URI | IPTC NewsCodes vocabulary `http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` | Believed correct; verify the URI |

No statistics, penalties, or "compliant" claims are made. No legal interpretation beyond paraphrase. Where the pack could be mistaken for a compliance guarantee, it says it is not.

## Open items for Mayank

1. Read Art. 50 and the FAQ against the paraphrases (landing page "What Article 50 asks for" and `lib/checklist.js`). Fix any wording drift. Confirm or drop the 2 Dec 2026 note.
2. The brief asks for Mayank Raj's face. No photo asset exists in `kok-products/`, so none is used. Drop one in `public/` and add it to the page header if wanted.
3. Paid plan descriptions ($497 setup / $49 monthly / $1497 agency) describe services I inferred (install + evidence sheet; monthly FAQ re-read; agency licence). Edit to what you will actually deliver. Checkout buttons fall back to `mailto:` until `NEXT_PUBLIC_CHECKOUT_URL_*` are set. Product ids are in `.env.example` for reference only.
4. Today (2026-10-30) is after 2 Aug 2026, so the page does not count down. It states the application date only.
5. Lint the PHP (`php -l`) and test the plugin and Liquid in real WordPress and Shopify installs.

## Checks run

- Brand: generated code and UI use only `#b83a07`, `#0e1b1d`, `#eeebe3` (plus alpha variants of ink and `#fff` for print). `npm test` greps generated files.
- Hostile input (`"`, `'`, `\`, `{{ }}`, `?>`, `</script>`) in site/bot names: output parses, JS compiles, JSON-LD parses, single `</script>` in the snippet.
- Humanizer pass: copy is short, concrete, no hype. Hedges are kept where the claim is genuinely unverified.
- No secrets in the repo. No deploys, pushes, or contact. No homepage edits.
