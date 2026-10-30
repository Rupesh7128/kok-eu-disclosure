import { NextResponse } from "next/server";
import { normalise, NOT_LEGAL, FAQ_URL } from "../../../lib/input.js";
import { build } from "../../../lib/pack.js";

export const runtime = "nodejs";

/** POST /api/generate { type, siteName, botName, contentTypes[] } -> { files: { path: text }, binary: [paths] } */
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Body must be JSON" }, { status: 400 }); }
  const n = normalise(body);
  if (!n.ok) return NextResponse.json({ error: n.error }, { status: 400 });
  const { files } = await build(n.value);
  const text = {};
  const binary = [];
  for (const [p, b] of Object.entries(files)) (typeof b === "string" ? (text[p] = b) : binary.push(p));
  return NextResponse.json({ input: n.value, files: text, binary, notice: NOT_LEGAL, faq: FAQ_URL });
}
