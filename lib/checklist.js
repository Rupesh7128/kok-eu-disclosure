import { FAQ_URL, NOT_LEGAL } from "./input.js";

/**
 * Audit checklist items. Each item cites the paragraph of Article 50 of Regulation (EU) 2024/1689
 * it paraphrases. Paraphrase only: read the Regulation and the Commission FAQ for the binding wording.
 * `when` lists content types that make the item relevant ("*" = always).
 */
export const ITEMS = [
  { id: "A1", section: "Scope", ref: "Art. 50 (all)", when: ["*"], text: "List every AI system you provide or deploy that EU users see or interact with (chatbots, generators, editing tools, plugins)." },
  { id: "A2", section: "Scope", ref: "Art. 50 (all)", when: ["*"], text: "Record your role for each system: provider, deployer, or both. The obligations differ by role. If the role is unclear, ask a qualified lawyer." },
  { id: "A3", section: "Scope", ref: "Art. 113", when: ["*"], text: "Note the dates that apply to each system. Art. 50 applies from 2 August 2026; check the Commission FAQ for any transitional period that covers systems already on the market." },

  { id: "B1", section: "AI interaction (Art. 50(1))", ref: "Art. 50(1)", when: ["chat"], text: "Each chatbot or voice agent tells the person they are talking to an AI system, unless that is obvious to a reasonably well-informed, observant and circumspect person in context." },
  { id: "B2", section: "AI interaction (Art. 50(1))", ref: "Art. 50(1)", when: ["chat"], text: "If you rely on the 'obvious' exception, write down why, with the date and a screenshot. Do not assume it." },
  { id: "B3", section: "AI interaction (Art. 50(1))", ref: "Art. 50(5)", when: ["chat"], text: "The notice appears at the latest at the person's first interaction, not buried in terms or a footer." },
  { id: "B4", section: "AI interaction (Art. 50(1))", ref: "Art. 50(5)", when: ["chat"], text: "The notice meets applicable accessibility requirements: readable contrast, text zoom, exposed to screen readers, available in the page language." },

  { id: "C1", section: "Marking synthetic output (Art. 50(2))", ref: "Art. 50(2)", when: ["text", "image", "audio", "video"], text: "If you PROVIDE a system that generates synthetic audio, image, video or text, its outputs are marked in a machine-readable format and detectable as artificially generated or manipulated." },
  { id: "C2", section: "Marking synthetic output (Art. 50(2))", ref: "Art. 50(2)", when: ["text", "image", "audio", "video"], text: "Name the technique per content type (for example watermark, embedded metadata, provenance manifest) and record why it is effective, interoperable, robust and reliable as far as technically feasible." },
  { id: "C3", section: "Marking synthetic output (Art. 50(2))", ref: "Art. 50(2)", when: ["text", "image", "audio", "video"], text: "Check whether an exception applies (assistive function for standard editing; no substantial alteration of input data). Record the reasoning." },
  { id: "C4", section: "Marking synthetic output (Art. 50(2))", ref: "Commission FAQ", when: ["text", "image", "audio", "video"], text: "Read the Commission's current position on codes of practice and guidelines for marking and labelling, and note which you follow." },
  { id: "C5", section: "Marking synthetic output (Art. 50(2))", ref: "Tooling note", when: ["text", "image", "audio", "video"], text: "The JSON-LD label from this pack is page-level metadata that helps crawlers and tools read your disclosure. It does not watermark files and is not by itself the Art. 50(2) marking." },

  { id: "D1", section: "Deployer disclosure (Art. 50(4))", ref: "Art. 50(4)", when: ["image", "audio", "video"], text: "If you DEPLOY a system that generates or manipulates image, audio or video content that is a deepfake, you disclose that the content is artificially generated or manipulated." },
  { id: "D2", section: "Deployer disclosure (Art. 50(4))", ref: "Art. 50(4)", when: ["image", "audio", "video"], text: "For evidently artistic, creative, satirical or fictional work, the disclosure is limited to the existence of the generated content, in a way that does not hamper enjoyment. Record where you use this." },
  { id: "D3", section: "Deployer disclosure (Art. 50(4))", ref: "Art. 50(4)", when: ["text"], text: "If you publish AI-generated or AI-manipulated text to inform the public on matters of public interest, you disclose that it is artificially generated, unless it has undergone human review or editorial control and a person holds editorial responsibility." },
  { id: "D4", section: "Deployer disclosure (Art. 50(4))", ref: "Art. 50(4)", when: ["text"], text: "If you rely on the editorial-control exception, document who reviews, who is responsible, and keep dated evidence." },

  { id: "E1", section: "Emotion recognition and biometric categorisation", ref: "Art. 50(3)", when: ["*"], text: "If you deploy emotion recognition or biometric categorisation anywhere on your site or product, inform the people exposed and handle personal data under applicable law. This pack does not generate that notice." },

  { id: "F1", section: "Implementation on your site", ref: "Art. 50(5)", when: ["*"], text: "Disclosure banner or badge installed on every template that shows AI output. Check mobile and keyboard navigation." },
  { id: "F2", section: "Implementation on your site", ref: "Art. 50(5)", when: ["*"], text: "Per-page or per-item flag set for AI-generated items (data-ai-generated attribute, WordPress checkbox, Shopify metafield)." },
  { id: "F3", section: "Implementation on your site", ref: "Tooling note", when: ["*"], text: "JSON-LD validates with a structured-data validator and appears in the rendered HTML, not only in a staging build." },
  { id: "F4", section: "Evidence", ref: "Good practice", when: ["*"], text: "Keep dated screenshots, a copy of the shipped snippet version, and the sign-off of a named person." },
  { id: "F5", section: "Evidence", ref: "Good practice", when: ["*"], text: "Set a review date. Re-read the Commission FAQ, codes of practice and guidelines when they change." },
  { id: "F6", section: "Evidence", ref: "Good practice", when: ["*"], text: "Have a qualified lawyer confirm roles, exceptions and wording for your situation before you rely on this checklist." },
];

export function itemsFor(contentTypes) {
  return ITEMS.filter((i) => i.when.includes("*") || i.when.some((w) => contentTypes.includes(w)));
}

export const CHECKLIST_HEADER = {
  title: "EU AI Act Article 50 transparency audit checklist",
  disclaimer: `${NOT_LEGAL} The items paraphrase Article 50 of Regulation (EU) 2024/1689 for planning. The binding text is the Regulation and the Commission's guidance. Official FAQ: ${FAQ_URL}`,
};
