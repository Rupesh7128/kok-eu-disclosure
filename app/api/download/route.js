import { NextResponse } from "next/server";
import { normalise } from "../../../lib/input.js";
import { buildZip, wordpressZip } from "../../../lib/pack.js";
import { checklistPdf, checklistHtml } from "../../../lib/audit.js";

export const runtime = "nodejs";

/** GET /api/download?kind=pack|wordpress|checklist-pdf|checklist-html&siteName=&botName=&contentTypes=a,b */
export async function GET(req) {
  const q = Object.fromEntries(new URL(req.url).searchParams);
  const kind = q.kind || "pack";
  const n = normalise({ ...q, type: "pack" });
  if (!n.ok) return NextResponse.json({ error: n.error }, { status: 400 });
  const slug = n.value.siteName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "site";
  const send = (buf, type, name) => new NextResponse(buf, { headers: { "Content-Type": type, "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" } });
  if (kind === "pack") return send(await buildZip(n.value), "application/zip", `eu-ai-disclosure-pack-${slug}.zip`);
  if (kind === "wordpress") return send(await wordpressZip(n.value), "application/zip", "kok-ai-disclosure.zip");
  if (kind === "checklist-pdf") return send(await checklistPdf(n.value), "application/pdf", `art50-audit-checklist-${slug}.pdf`);
  if (kind === "checklist-html") return send(checklistHtml(n.value), "text/html; charset=utf-8", `art50-audit-checklist-${slug}.html`);
  return NextResponse.json({ error: "kind must be pack, wordpress, checklist-pdf or checklist-html" }, { status: 400 });
}
