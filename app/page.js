import Generator from "./Generator.js";

const MAIL = "hello@work.kingdomofkumar.com";
const SITE = "https://www.kingdomofkumar.com";
const FAQ = "https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act";

export default function Page() {
  const L = {
    setup: process.env.NEXT_PUBLIC_CHECKOUT_URL_SETUP || "",
    monthly: process.env.NEXT_PUBLIC_CHECKOUT_URL_MONTHLY || "",
    agency: process.env.NEXT_PUBLIC_CHECKOUT_URL_AGENCY || "",
  };
  const mail = (s) => `mailto:${MAIL}?subject=${encodeURIComponent(s)}`;
  const cta = (url, subject) => (url ? [url, "Checkout"] : [mail(subject), "Email to start"]);
  const [u1, t1] = cta(L.setup, "Art. 50 Disclosure Pack — $497 setup");
  const [u2, t2] = cta(L.monthly, "Art. 50 Disclosure Pack — $49/mo");
  const [u3, t3] = cta(L.agency, "Art. 50 Disclosure Pack — Agency $1497");

  return (
    <div className="wrap">
      <div className="top">
        <span><b>Kingdom of Kumar</b> / EU AI Act Art. 50 Disclosure Pack</span>
        <span>Mayank Raj · <a href={SITE}>kingdomofkumar.com</a></span>
      </div>

      <Generator />

      <section className="band">
        <div className="l">
          <h2>What Article 50 asks for</h2>
          <p className="fine" style={{ marginTop: 0 }}>A plain-language paraphrase of Regulation (EU) 2024/1689, Art. 50, for planning. Not legal advice. Read the Regulation and the Commission’s FAQ for the binding text.</p>
        </div>
        <div className="r">
          <ul className="ev">
            <li><span className="big">50(1)</span><span>Systems meant to interact directly with people are designed so those people are told they are dealing with AI, unless that is obvious from context. Provider duty.</span></li>
            <li><span className="big">50(2)</span><span>Systems that generate synthetic audio, image, video or text mark their outputs in a machine-readable format so they can be detected as artificially generated or manipulated. Provider duty.</span></li>
            <li><span className="big">50(3)</span><span>Deployers of emotion recognition or biometric categorisation systems inform the people exposed to them.</span></li>
            <li><span className="big">50(4)</span><span>Deployers disclose deepfakes, and AI-generated text published to inform the public on matters of public interest (with an exception for human editorial review and responsibility).</span></li>
            <li><span className="big">50(5)</span><span>Information is given clearly and distinguishably, at the latest at first interaction or exposure, and meets accessibility requirements.</span></li>
          </ul>
          <p className="fine">Art. 50 applies from 2 August 2026. The Commission’s FAQ is the place to check any transitional period for systems already on the market, and the status of codes of practice and guidelines: <a href={FAQ}>{FAQ}</a></p>
        </div>
      </section>

      <section className="band">
        <div className="l">
          <h2>What this pack does and does not do</h2>
        </div>
        <div className="r">
          <ol className="steps">
            <li><b>Does:</b> give you a visible banner, per-item “AI-generated” badges, a chat notice, JSON-LD that says an item is AI-generated, a WordPress plugin, a Shopify snippet, and a checklist for your own review.</li>
            <li><b>Does not:</b> decide whether you are a provider or a deployer, whether an exception applies, or whether the wording meets the law.</li>
            <li><b>Does not:</b> watermark images, audio, video or text. The JSON-LD is page-level metadata. A provider’s machine-readable marking under Art. 50(2) is a technical measure in the generating system.</li>
            <li><b>Not an official standard:</b> schema.org has no “AI-generated” property. We use a PropertyValue named <code>aiGenerated</code> and the IPTC <code>trainedAlgorithmicMedia</code> digital source type. Regulators have not endorsed that exact markup.</li>
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="l">
          <h2>Price</h2>
          <p className="fine" style={{ marginTop: 0 }}>The generator above is free and stays free. Paid plans are for having us do the install and keep the pack current. Checkout lives on <a href={SITE}>kingdomofkumar.com</a>; until a button points there, email and we’ll send an invoice link.</p>
        </div>
        <div className="r">
          <div className="plans">
            <div className="plan">
              <div className="price">$497</div>
              <div><h3>Setup</h3><ul><li>We install the pack on your WordPress, Shopify or static site</li><li>We test banner, badges and JSON-LD on the live pages</li><li>You get a dated evidence sheet for your records</li></ul></div>
              <a className="btn solid" href={u1}>{t1}</a>
            </div>
            <div className="plan">
              <div className="price">$49<small>/mo</small></div>
              <div><h3>Keep current</h3><ul><li>Monthly re-read of the Commission FAQ and guidance page, with a note on what changed</li><li>Updated snippets when the wording or markup should change</li></ul></div>
              <a className="btn" href={u2}>{t2}</a>
            </div>
            <div className="plan">
              <div className="price">$1497</div>
              <div><h3>Agency</h3><ul><li>Use the pack across your client sites, under your own name</li><li>Licence terms agreed by email before you pay</li></ul></div>
              <a className="btn" href={u3}>{t3}</a>
            </div>
          </div>
          <p className="fine">We are not a law firm. None of these plans includes legal advice or a compliance guarantee.</p>
        </div>
      </section>

      <section className="band" id="mcp">
        <div className="l">
          <h2>Use it from Claude or Cursor</h2>
          <p className="fine" style={{ marginTop: 0 }}>Tools: <code>generate_disclosure_banner</code>, <code>generate_jsonld_label</code>, <code>generate_audit_checklist</code>, <code>package_wp_snippet</code>.</p>
        </div>
        <div className="r">
          <pre>{`{
  "mcpServers": {
    "kok-eu-disclosure": {
      "command": "node",
      "args": ["/absolute/path/to/eu-disclosure/mcp/server.js"]
    }
  }
}`}</pre>
          <p className="fine">Hosted: <code>POST /api/mcp</code> (JSON-RPC 2.0, same tools, courtesy rate limit). REST: <code>POST /api/generate</code> with <code>{`{ type, siteName, botName, contentTypes[] }`}</code>.</p>
        </div>
      </section>

      <footer>
        <span>© Kingdom of Kumar. MIT licensed. Tooling for transparency obligations; not legal advice.</span>
        <span><a href={`mailto:${MAIL}`}>{MAIL}</a></span>
      </footer>
    </div>
  );
}
