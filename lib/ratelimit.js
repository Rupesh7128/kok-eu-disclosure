/** Courtesy limit for the hosted MCP endpoint. In-memory; resets on cold start. Not a hard quota. */
const buckets = new Map();
export function limit() {
  const n = Number(process.env.FREE_GENERATIONS_PER_DAY);
  return Number.isFinite(n) && n > 0 ? n : 30;
}
export function consume(ip) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}|${ip}`;
  if (buckets.size > 5000) for (const k of buckets.keys()) if (!k.startsWith(day)) buckets.delete(k);
  const used = buckets.get(key) ?? 0;
  const max = limit();
  if (used >= max) return { ok: false, limit: max };
  buckets.set(key, used + 1);
  return { ok: true, limit: max };
}
export function clientIp(req) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf ? xf.split(",")[0].trim() : req.headers.get("x-real-ip")) || "unknown";
}
