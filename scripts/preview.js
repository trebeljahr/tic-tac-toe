import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { randomInt } from "node:crypto";
import { extname, join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { root } from "./build-options.js";

const { values } = parseArgs({ options: {
  port: { type: "string" },
  host: { type: "string", default: "127.0.0.1" },
  strictPort: { type: "boolean", default: false },
} });
const requestedPort = values.port ?? process.env.PORT;
if (requestedPort && (!/^\d+$/.test(requestedPort) || Number(requestedPort) < 1 || Number(requestedPort) > 65535)) {
  throw new Error("PORT must be an integer between 1 and 65535");
}
const output = resolve(root, "dist");
await stat(join(output, "index.html")).catch(() => {
  throw new Error("Run npm run build before starting the preview");
});
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml" };
const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://preview.local").pathname);
    const file = resolve(output, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
    if (!file.startsWith(output + sep)) {
      response.writeHead(404).end("Not found");
      return;
    }
    const bytes = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch {
    response.writeHead(404).end("Not found");
  }
});
for (let attempt = 0; attempt < 3; attempt++) {
  const port = requestedPort ? Number(requestedPort) : randomInt(49152, 65536);
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, values.host, () => {
        server.off("error", reject);
        resolve();
      });
    });
    console.log(`Preview: http://${values.host}:${port}`);
    break;
  } catch (error) {
    if (error.code !== "EADDRINUSE" || requestedPort || values.strictPort || attempt === 2) throw error;
  }
}
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
