import archiver from "archiver";
import { brand } from "./brand.js";
import { NOT_LEGAL, FAQ_URL } from "./input.js";
import { generateBanner } from "./banner.js";
import { generateJsonLd } from "./jsonld.js";
import { checklistHtml, checklistPdf } from "./audit.js";
import { generateWordPress, WP_SLUG } from "./wordpress.js";
import { generateShopify } from "./shopify.js";

/** Build a zip Buffer from { path: string|Buffer }. */
export function zipFiles(files) {
  return new Promise((resolve, reject) => {
    const zip = archiver("zip", { zlib: { level: 9 } });
    const chunks = [];
    zip.on("data", (c) => chunks.push(c));
    zip.on("end", () => resolve(Buffer.concat(chunks)));
    zip.on("error", reject);
    const date = new Date("2026-01-01T00:00:00Z"); // stable bytes for identical input
    for (const [name, body] of Object.entries(files)) zip.append(body, { name, date });
    zip.finalize();
  });
}

export async function wordpressZip(cfg) {
  const wp = generateWordPress(cfg);
  const files = {};
  for (const [p, body] of Object.entries(wp.files)) files[p.replace(/^wordpress\//, "")] = body;
  return zipFiles(files);
}

function packReadme(cfg) {
  return `EU AI Act Article 50 Disclosure Pack
Site: ${cfg.siteName}${cfg.botName ? `   Assistant: ${cfg.botName}` : ""}
Content types: ${cfg.contentTypes.join(", ")}

${NOT_LEGAL}
This pack helps you show people when content or an assistant is AI. It does not decide whether
Article 50 of Regulation (EU) 2024/1689 applies to you, which exceptions you can use, or whether
this wording is enough. Ask a qualified lawyer. Official Commission FAQ:
${FAQ_URL}

Contents
  banner/      Plain HTML/CSS/JS snippet. Paste the .snippet.html before </body>, or host the .css and .js.
  jsonld/      schema.org JSON-LD labels (one per content type) and an embed.html with <script> tags.
  checklist/   Audit checklist as PDF and printable HTML.
  wordpress/   Plugin folder, plus ${WP_SLUG}.zip ready to upload.
  shopify/     Liquid snippet and install steps.

What the JSON-LD is and is not
  schema.org has no official "AI-generated" property. The label uses a PropertyValue named
  "aiGenerated" (our convention) and the IPTC digital source type "trainedAlgorithmicMedia".
  It is page-level metadata. It is not a watermark and it does not by itself satisfy a provider's
  machine-readable marking duty in Art. 50(2).

${brand.name} · ${brand.person} · ${brand.url}
`;
}

/** Collect every file for a given type. Returns { files: {path: string|Buffer}, notes: string[] } */
export async function build(cfg) {
  const files = {};
  const add = (o) => Object.assign(files, o.files);
  const want = (t) => cfg.type === "pack" || cfg.type === t;
  if (want("banner")) add(generateBanner(cfg));
  if (want("jsonld")) add(generateJsonLd(cfg));
  if (want("checklist")) {
    files["checklist/audit-checklist.html"] = checklistHtml(cfg);
    files["checklist/audit-checklist.pdf"] = await checklistPdf(cfg);
  }
  if (want("wordpress")) {
    add(generateWordPress(cfg));
    if (cfg.type === "pack") files[`wordpress/${WP_SLUG}.zip`] = await wordpressZip(cfg);
  }
  if (want("shopify")) add(generateShopify(cfg));
  if (cfg.type === "pack") files["README.txt"] = packReadme(cfg);
  return { files };
}

export async function buildZip(cfg) {
  const { files } = await build(cfg);
  return zipFiles(files);
}
