import { NextResponse } from "next/server";
import { TOOLS } from "../../../lib/tools.js";
import { consume, clientIp } from "../../../lib/ratelimit.js";

export const runtime = "nodejs";

const ok = (id, result) => NextResponse.json({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

/** Minimal stateless JSON-RPC MCP (tools only). */
export async function POST(req) {
  let msg;
  try { msg = await req.json(); } catch { return fail(null, -32700, "Parse error"); }
  const { id, method, params } = msg || {};
  if (id === undefined && method?.startsWith("notifications/")) return new NextResponse(null, { status: 202 });
  switch (method) {
    case "initialize":
      return ok(id, { protocolVersion: params?.protocolVersion || "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "kok-eu-disclosure", version: "0.1.0" } });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${params?.name}`);
      const rl = consume(clientIp(req));
      if (!rl.ok) return ok(id, { content: [{ type: "text", text: `Free limit reached (${rl.limit}/day/IP). Run the stdio server locally.` }], isError: true });
      try {
        return ok(id, { content: [{ type: "text", text: await tool.run(params?.arguments || {}) }] });
      } catch (e) {
        return ok(id, { content: [{ type: "text", text: e.message }], isError: true });
      }
    }
    default:
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

export function GET() {
  return NextResponse.json({ name: "kok-eu-disclosure", transport: "POST JSON-RPC 2.0", tools: TOOLS.map((t) => t.name) });
}
