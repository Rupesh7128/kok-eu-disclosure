import { escHtml, jsonForScript, NOT_LEGAL } from "./input.js";

/**
 * schema.org has no official "ai-generated" property. We use two things that exist:
 *  - additionalProperty (PropertyValue) with name "aiGenerated"  [our own convention, documented as such]
 *  - IPTC Digital Source Type "trainedAlgorithmicMedia" URI as a PropertyValue [real IPTC NewsCodes term]
 * Neither is a regulator-defined marking. See README.
 */
const IPTC = "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";
const SCHEMA_TYPE = { text: "Article", image: "ImageObject", audio: "AudioObject", video: "VideoObject" };

export function jsonLdFor({ siteName, botName, siteUrl }, kind) {
  const doc = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[kind] ?? "CreativeWork",
    name: `AI-generated ${kind} on ${siteName}`,
    isPartOf: siteUrl ? { "@type": "WebSite", name: siteName, url: siteUrl } : { "@type": "WebSite", name: siteName },
    creator: botName ? { "@type": "SoftwareApplication", name: botName, applicationCategory: "AI system" } : { "@type": "Organization", name: siteName },
    additionalProperty: [
      { "@type": "PropertyValue", name: "aiGenerated", value: true },
      { "@type": "PropertyValue", name: "digitalSourceType", value: IPTC },
    ],
    disclaimer: "This content was generated or manipulated by an AI system.",
  };
  return doc;
}

export function generateJsonLd(cfg) {
  const kinds = cfg.contentTypes.filter((c) => c !== "chat");
  const list = kinds.length ? kinds : ["text"];
  const docs = list.map((k) => jsonLdFor(cfg, k));
  const files = {};
  docs.forEach((d, i) => {
    files[`jsonld/label-${list[i]}.jsonld.json`] = JSON.stringify(d, null, 2) + "\n";
  });
  const tags = docs.map((d) => `<script type="application/ld+json">\n${jsonForScript(d)}\n</script>`).join("\n");
  files["jsonld/embed.html"] = `<!-- JSON-LD AI-generated labels for ${escHtml(cfg.siteName)}. ${NOT_LEGAL} Put one tag in <head> of each page that carries that kind of AI content, and edit "name" per page. -->\n${tags}\n`;
  return { files, documents: docs };
}
