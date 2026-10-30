// Writes a real sample pack for a fictional site to docs/sample-pack/ (unzipped, plus the zip).
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalise } from "../lib/input.js";
import { build, zipFiles } from "../lib/pack.js";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "sample-pack");
rmSync(out, { recursive: true, force: true });
const n = normalise({ type: "pack", siteName: "Harbour & Pine Studio", botName: "Pine", contentTypes: ["chat", "text", "image"], siteUrl: "https://example.com" });
const { files } = await build(n.value);
for (const [p, body] of Object.entries(files)) {
  const f = join(out, p);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
}
writeFileSync(join(out, "..", "sample-pack.zip"), await zipFiles(files));
console.log("wrote", Object.keys(files).length, "files to", out);
