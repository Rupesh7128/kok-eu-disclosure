/* AI disclosure helper. Config first, logic below. Tooling for transparency obligations; not legal advice. */
(function () {
  var CONFIG = {
    "siteName": "Harbour & Pine Studio",
    "lines": [
      "You are talking to Pine, an AI system, not a person.",
      "Some text and image content on Harbour & Pine Studio is generated or manipulated by AI. Where it appears it is labelled “AI-generated”."
    ],
    "badge": "AI-generated",
    "chatNotice": "Pine is an AI system, not a person.",
    "infoUrl": ""
  };
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
})();
