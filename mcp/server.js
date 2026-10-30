#!/usr/bin/env node
/**
 * Kingdom of Kumar — EU AI Act Art. 50 Disclosure Pack, stdio MCP server.
 * Same tools as hosted /api/mcp. Tooling for transparency obligations; not legal advice.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TOOLS } from "../lib/tools.js";
import { CONTENT_TYPES } from "../lib/input.js";

const server = new McpServer({ name: "kok-eu-disclosure", version: "0.1.0" });

const shape = {
  siteName: z.string().min(1).max(80),
  botName: z.string().max(60).optional(),
  contentTypes: z.array(z.enum(CONTENT_TYPES)).default(["text"]),
  siteUrl: z.string().max(200).optional(),
};

for (const t of TOOLS) {
  server.tool(t.name, t.description, shape, async (args) => {
    try {
      return { content: [{ type: "text", text: await t.run(args) }] };
    } catch (e) {
      return { content: [{ type: "text", text: e.message }], isError: true };
    }
  });
}

await server.connect(new StdioServerTransport());
