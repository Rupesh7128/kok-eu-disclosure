export const CONTENT_TYPES = ["chat", "text", "image", "audio", "video"];
export const TYPES = ["banner", "jsonld", "checklist", "wordpress", "shopify", "pack"];
export const NOT_LEGAL = "Tooling for transparency obligations; not legal advice.";
export const FAQ_URL = "https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act";

const clean = (s, max) =>
  String(s ?? "")
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

/** Normalise and validate user input. Returns { ok, value } or { ok:false, error }. */
export function normalise(raw = {}) {
  const type = raw.type ?? "pack";
  if (!TYPES.includes(type)) return { ok: false, error: `type must be one of: ${TYPES.join(", ")}` };
  const siteName = clean(raw.siteName || "Example Studio", 80);
  if (!siteName) return { ok: false, error: "siteName is required" };
  const botName = clean(raw.botName ?? "", 60);
  let ct = raw.contentTypes ?? ["text"];
  if (typeof ct === "string") ct = ct.split(",");
  if (!Array.isArray(ct)) return { ok: false, error: "contentTypes must be an array" };
  ct = [...new Set(ct.map((c) => String(c).trim().toLowerCase()).filter(Boolean))];
  const bad = ct.filter((c) => !CONTENT_TYPES.includes(c));
  if (bad.length) return { ok: false, error: `Unknown contentTypes: ${bad.join(", ")}. Allowed: ${CONTENT_TYPES.join(", ")}` };
  if (botName && !ct.includes("chat")) ct.unshift("chat");
  if (!ct.length) ct = ["text"];
  const siteUrl = /^https?:\/\/[^\s<>"']{1,200}$/i.test(String(raw.siteUrl ?? "")) ? String(raw.siteUrl) : "";
  return { ok: true, value: { type, siteName, botName, contentTypes: ct, siteUrl } };
}

// Escapers for the four output languages.
export const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
/** JSON safe to embed inside <script>. */
export const jsonForScript = (v, indent = 2) => JSON.stringify(v, null, indent).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
export const escPhp = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
export const escLiquid = (s) => escHtml(String(s).replace(/\{\{|\}\}|\{%|%\}/g, ""));
