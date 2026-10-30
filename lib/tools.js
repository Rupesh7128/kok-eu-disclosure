import { normalise, CONTENT_TYPES, NOT_LEGAL, FAQ_URL } from "./input.js";
import { generateBanner } from "./banner.js";
import { generateJsonLd } from "./jsonld.js";
import { itemsFor } from "./checklist.js";
import { generateWordPress } from "./wordpress.js";

const props = {
  siteName: { type: "string", description: "Site or organisation name (max 80 chars).", maxLength: 80 },
  botName: { type: "string", description: "Name of your AI assistant, if you have one.", maxLength: 60 },
  contentTypes: { type: "array", items: { type: "string", enum: CONTENT_TYPES }, description: "What AI produces or does on the site." },
  siteUrl: { type: "string", description: "Optional https URL of the site, for JSON-LD." },
};
const inputSchema = { type: "object", properties: props, required: ["siteName"] };

const fence = (path, body) => {
  const lang = path.endsWith(".json") || path.endsWith(".jsonld.json") ? "json" : path.split(".").pop();
  return `### ${path}\n\`\`\`${lang}\n${body}\n\`\`\``;
};
const footer = `\n\n_${NOT_LEGAL} Official FAQ: ${FAQ_URL}_`;
const render = (files) => Object.entries(files).filter(([, b]) => typeof b === "string").map(([p, b]) => fence(p, b)).join("\n\n");

export const TOOLS = [
  {
    name: "generate_disclosure_banner",
    description: `Generate a disclosure banner as HTML+CSS+JS (chat notice and AI-generated badges). ${NOT_LEGAL}`,
    inputSchema,
    async run(args) { const n = normalise({ ...args, type: "banner" }); if (!n.ok) throw new Error(n.error); return render(generateBanner(n.value).files) + footer; },
  },
  {
    name: "generate_jsonld_label",
    description: `Generate schema.org JSON-LD with an aiGenerated flag per content type. Page-level metadata, not a watermark. ${NOT_LEGAL}`,
    inputSchema,
    async run(args) { const n = normalise({ ...args, type: "jsonld" }); if (!n.ok) throw new Error(n.error); return render(generateJsonLd(n.value).files) + footer; },
  },
  {
    name: "generate_audit_checklist",
    description: `Generate an Article 50 audit checklist tailored to the content types (markdown list; HTML and PDF via the web app). ${NOT_LEGAL}`,
    inputSchema,
    async run(args) {
      const n = normalise({ ...args, type: "checklist" }); if (!n.ok) throw new Error(n.error);
      const items = itemsFor(n.value.contentTypes);
      let section = "";
      const out = [`# Art. 50 audit checklist — ${n.value.siteName}`];
      for (const i of items) {
        if (i.section !== section) { section = i.section; out.push(`\n## ${section}`); }
        out.push(`- [ ] **${i.id}** (${i.ref}) ${i.text}`);
      }
      return out.join("\n") + footer;
    },
  },
  {
    name: "package_wp_snippet",
    description: `Generate a WordPress plugin (PHP + readme) that prints the banner, a per-post AI label and JSON-LD flag. Returns file contents. ${NOT_LEGAL}`,
    inputSchema,
    async run(args) { const n = normalise({ ...args, type: "wordpress" }); if (!n.ok) throw new Error(n.error); return render(generateWordPress(n.value).files) + footer; },
  },
];

export async function runTool(name, args) {
  const t = TOOLS.find((x) => x.name === name);
  if (!t) throw new Error(`Unknown tool: ${name}`);
  return t.run(args || {});
}

