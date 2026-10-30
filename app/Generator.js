"use client";
import { useMemo, useState } from "react";

const TYPES = [
  ["chat", "A chatbot or voice assistant talks to visitors"],
  ["text", "AI writes or rewrites text we publish"],
  ["image", "AI generates or edits images"],
  ["audio", "AI generates or edits audio / voice"],
  ["video", "AI generates or edits video"],
];
const TABS = [["banner", "Banner"], ["jsonld", "JSON-LD"], ["wordpress", "WordPress"], ["shopify", "Shopify"], ["checklist", "Checklist"]];

function qs(v) {
  return new URLSearchParams({ siteName: v.siteName, botName: v.botName, contentTypes: v.contentTypes.join(",") }).toString();
}

export default function Generator() {
  const [siteName, setSiteName] = useState("Harbour & Pine Studio");
  const [botName, setBotName] = useState("Pine");
  const [contentTypes, setContentTypes] = useState(["chat", "text", "image"]);
  const [out, setOut] = useState(null);
  const [tab, setTab] = useState("banner");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const v = { siteName, botName, contentTypes };
  const toggle = (t) => setContentTypes((c) => (c.includes(t) ? c.filter((x) => x !== t) : [...c, t]));

  async function run(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "pack", ...v }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Request failed");
      setOut(j);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  const files = out?.files || {};
  const shown = useMemo(() => Object.entries(files).filter(([p]) => p.startsWith(tab + "/")), [files, tab]);
  const previewDoc = files["banner/disclosure-banner.snippet.html"]
    ? `<!doctype html><body style="margin:0;background:#eeebe3;font-family:sans-serif"><p data-ai-generated style="padding:12px 20px;margin:0">Sample AI-generated paragraph.</p><div data-ai-chat style="padding:12px 20px">Chat widget area</div>${files["banner/disclosure-banner.snippet.html"]}</body>`
    : "";

  async function copy(path, text) {
    try { await navigator.clipboard.writeText(text); setCopied(path); setTimeout(() => setCopied(""), 1500); } catch { setCopied(""); }
  }
  const dl = (kind) => `/api/download?kind=${kind}&${qs(v)}`;

  return (
    <div className="grid" id="demo">
      <form className="rail" onSubmit={run}>
        <h1>Say it is <em>AI</em>, plainly.</h1>
        <p className="lede">Free demo. Enter a site, pick what AI does there, get a working disclosure pack. No account.</p>
        <label htmlFor="siteName">Site name</label>
        <input id="siteName" value={siteName} maxLength={80} onChange={(e) => setSiteName(e.target.value)} required />
        <label htmlFor="botName">Assistant name (optional)</label>
        <input id="botName" value={botName} maxLength={60} onChange={(e) => setBotName(e.target.value)} placeholder="e.g. Pine" />
        <fieldset>
          <legend>What does AI do here?</legend>
          {TYPES.map(([k, label]) => (
            <label key={k} className="chk"><input type="checkbox" checked={contentTypes.includes(k)} onChange={() => toggle(k)} />{label}</label>
          ))}
        </fieldset>
        <button className="run" disabled={busy || !siteName.trim() || !contentTypes.length}>{busy ? "Generating…" : "Generate free pack"}</button>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="notice"><b>Tooling, not legal advice.</b>These files help you show people when content or an assistant is AI. They do not tell you whether Article 50 applies to you or whether the wording is enough.</div>
      </form>

      <div className="main">
        {!out ? (
          <div className="empty">
            <p><b>Nothing generated yet.</b></p>
            <p>You get a banner (HTML/CSS/JS), schema.org JSON-LD, a WordPress plugin, a Shopify snippet and an audit checklist as PDF and printable HTML.</p>
            <p>Everything is built in your request. No payment, no tracking, no AI call.</p>
          </div>
        ) : (
          <>
            <div className="bar">
              <a className="btn solid" href={dl("pack")}>Download full pack (.zip)</a>
              <a className="btn" href={dl("wordpress")}>WordPress plugin (.zip)</a>
              <a className="btn" href={dl("checklist-pdf")}>Checklist (.pdf)</a>
              <a className="btn" href={dl("checklist-html")}>Checklist (print HTML)</a>
            </div>
            <div className="tabs" role="tablist">
              {TABS.map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} type="button">{l}</button>
              ))}
            </div>
            {tab === "banner" && previewDoc && (
              <div className="preview"><iframe title="Banner preview" sandbox="allow-scripts" srcDoc={previewDoc} /></div>
            )}
            {tab === "checklist" && files["checklist/audit-checklist.html"] && (
              <div className="preview"><iframe title="Checklist preview" style={{ height: 420 }} srcDoc={files["checklist/audit-checklist.html"]} /></div>
            )}
            {(tab === "checklist" ? [] : shown).map(([p, body]) => (
              <div key={p}>
                <p className="fname">{p}</p>
                <div className="bar"><button type="button" className="btn" onClick={() => copy(p, body)}>{copied === p ? "Copied" : "Copy"}</button></div>
                <pre tabIndex={0}>{body}</pre>
              </div>
            ))}
            <p className="fine">{out.notice} Official FAQ: <a href={out.faq}>{out.faq}</a></p>
          </>
        )}
      </div>
    </div>
  );
}
