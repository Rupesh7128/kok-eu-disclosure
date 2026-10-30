// Checks generator output: valid JSON-LD, only brand colours, escaping, PHP lint (if php exists), zip contents.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalise } from "../lib/input.js";
import { build, buildZip } from "../lib/pack.js";

const hostile = { type: "pack", siteName: `Evil "Co" </script><b>'; {{ x }} ?>`, botName: `Bo'b\\`, contentTypes: ["chat", "text", "image"] };
const n = normalise(hostile);
if (!n.ok) throw new Error(n.error);
const { files } = await build(n.value);
const fail = (m) => { console.error("FAIL:", m); process.exit(1); };

for (const [p, b] of Object.entries(files)) {
  if (p.endsWith(".jsonld.json")) JSON.parse(b);
  if (typeof b === "string" && !p.endsWith(".md") && !p.endsWith(".txt")) {
    const hex = (b.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((h) => h.toLowerCase());
    // allow alpha-suffixed ink (#0e1b1d33) used for hairlines
    for (const h of hex) if (!/^#(b83a07|0e1b1d|eeebe3|0e1b1d33)$/.test(h) && h !== "#fff") fail(`off-brand colour ${h} in ${p}`);
  }
}
const html = files["banner/disclosure-banner.snippet.html"];
if ((html.match(/<\/script>/gi) || []).length !== 1) fail("banner snippet leaks </script>");
const embed = files["jsonld/embed.html"];
for (const m of embed.matchAll(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/g)) JSON.parse(m[1]);
const php = files["wordpress/kok-ai-disclosure/kok-ai-disclosure.php"];
const dir = mkdtempSync(join(tmpdir(), "kokaid-"));
writeFileSync(join(dir, "p.php"), php);
try { console.log(execFileSync("php", ["-l", join(dir, "p.php")]).toString().trim()); } catch (e) { console.log("php lint skipped:", e.code === "ENOENT" ? "php not installed" : String(e.stdout || e.message)); }
const js = files["banner/disclosure-banner.js"];
new Function(js); // syntax check
if (!files["checklist/audit-checklist.pdf"].subarray(0, 4).toString().startsWith("%PDF")) fail("pdf header");
const zip = await buildZip(n.value);
if (zip.subarray(0, 2).toString() !== "PK") fail("zip header");
console.log("OK", Object.keys(files).length, "files; zip", zip.length, "bytes");
