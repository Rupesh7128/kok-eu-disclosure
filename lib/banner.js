import { brand } from "./brand.js";
import { escHtml, jsonForScript, NOT_LEGAL } from "./input.js";

const { orange, ink, paper } = brand.colors;

export function bannerText({ siteName, botName, contentTypes }) {
  const generates = contentTypes.some((c) => c !== "chat");
  const lines = [];
  if (contentTypes.includes("chat")) {
    lines.push(botName
      ? `You are talking to ${botName}, an AI system, not a person.`
      : "You are talking to an AI system, not a person.");
  }
  if (generates) {
    const kinds = contentTypes.filter((c) => c !== "chat");
    lines.push(`Some ${kinds.length > 1 ? kinds.slice(0, -1).join(", ") + " and " + kinds.at(-1) : kinds[0]} content on ${siteName} is generated or manipulated by AI. Where it appears it is labelled “AI-generated”.`);
  }
  return lines;
}

export function bannerCss() {
  return `/* AI disclosure banner. Colours: ${orange} / ${ink} / ${paper}. */
.kok-aid-banner{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;background:${ink};color:${paper};border-bottom:4px solid ${orange};padding:12px 20px}
.kok-aid-banner__inner{max-width:72rem;margin:0 auto;display:flex;gap:14px;align-items:flex-start}
.kok-aid-banner__tag{flex:none;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;background:${orange};color:${paper};padding:2px 8px;margin-top:2px}
.kok-aid-banner p{margin:0 0 4px}
.kok-aid-banner p:last-child{margin:0}
.kok-aid-banner a{color:${paper};text-decoration:underline;text-underline-offset:3px}
.kok-aid-banner a:focus-visible,.kok-aid-badge:focus-visible{outline:3px solid ${orange};outline-offset:2px}
.kok-aid-badge{display:inline-block;font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;border:2px solid ${orange};color:${ink};background:${paper};padding:1px 7px;margin:0 8px 8px 0;vertical-align:middle}
.kok-aid-chat{font:14px/1.45 system-ui,sans-serif;border-left:4px solid ${orange};background:${paper};color:${ink};padding:8px 12px;margin:0 0 10px}
@media (forced-colors:active){.kok-aid-banner,.kok-aid-badge,.kok-aid-chat{border:2px solid CanvasText}}`;
}

export function bannerJs(cfg) {
  const conf = {
    siteName: cfg.siteName,
    lines: bannerText(cfg),
    badge: "AI-generated",
    chatNotice: cfg.contentTypes.includes("chat")
      ? (cfg.botName ? `${cfg.botName} is an AI system, not a person.` : "This is an AI system, not a person.")
      : "",
    infoUrl: "",
  };
  return `/* AI disclosure helper. Config first, logic below. ${NOT_LEGAL} */
(function () {
  var CONFIG = ${jsonForScript(conf, 2).replace(/\n/g, "\n  ")};
  if (window.__kokAid) return;
  window.__kokAid = true;

  function ready(fn) {
    if (document.readyState !== "loading") fn(); else document.addEventListener("DOMContentLoaded", fn);
  }

  function banner() {
    if (!CONFIG.lines.length || document.getElementById("kok-aid-banner")) return;
    var el = document.createElement("div");
    el.id = "kok-aid-banner";
    el.className = "kok-aid-banner";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "AI disclosure");
    var inner = document.createElement("div");
    inner.className = "kok-aid-banner__inner";
    var tag = document.createElement("span");
    tag.className = "kok-aid-banner__tag";
    tag.textContent = "AI";
    var box = document.createElement("div");
    CONFIG.lines.forEach(function (t) {
      var p = document.createElement("p");
      p.textContent = t;
      box.appendChild(p);
    });
    if (CONFIG.infoUrl) {
      var p2 = document.createElement("p");
      var a = document.createElement("a");
      a.href = CONFIG.infoUrl;
      a.textContent = "More about how we use AI";
      p2.appendChild(a);
      box.appendChild(p2);
    }
    inner.appendChild(tag);
    inner.appendChild(box);
    el.appendChild(inner);
    document.body.insertBefore(el, document.body.firstChild);
  }

  /* Mark any element carrying data-ai-generated with a visible badge. */
  function badges() {
    var nodes = document.querySelectorAll("[data-ai-generated]:not([data-kok-aid-done])");
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.getAttribute("data-ai-generated") === "false") return;
      n.setAttribute("data-kok-aid-done", "1");
      var b = document.createElement("span");
      b.className = "kok-aid-badge";
      b.textContent = CONFIG.badge;
      n.insertBefore(b, n.firstChild);
    });
  }

  /* Put a notice at the top of any element carrying data-ai-chat (your chat widget container). */
  function chat() {
    if (!CONFIG.chatNotice) return;
    var nodes = document.querySelectorAll("[data-ai-chat]:not([data-kok-aid-done])");
    Array.prototype.forEach.call(nodes, function (n) {
      n.setAttribute("data-kok-aid-done", "1");
      var d = document.createElement("div");
      d.className = "kok-aid-chat";
      d.setAttribute("role", "note");
      d.textContent = CONFIG.chatNotice;
      n.insertBefore(d, n.firstChild);
    });
  }

  function run() { banner(); badges(); chat(); }
  ready(run);
  if (window.MutationObserver) {
    ready(function () { new MutationObserver(function () { badges(); chat(); }).observe(document.body, { childList: true, subtree: true }); });
  }
  window.kokAid = { refresh: run };
})();`;
}

export function generateBanner(cfg) {
  const css = bannerCss();
  const js = bannerJs(cfg);
  const html = `<!-- AI disclosure snippet for ${escHtml(cfg.siteName)}. ${NOT_LEGAL} -->
<style>
${css}
</style>
<script>
${js}
</script>
<!--
  Mark AI output:   <article data-ai-generated>…</article>
  Mark chat widget: <div id="chat" data-ai-chat></div>
-->`;
  return {
    files: {
      "banner/disclosure-banner.snippet.html": html,
      "banner/disclosure-banner.css": css + "\n",
      "banner/disclosure-banner.js": js + "\n",
    },
    text: bannerText(cfg),
  };
}
