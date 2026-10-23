import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { build } from "esbuild";
import { buildOptions, root } from "./build-options.js";

const output = join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["favicon.ico", "manifest.json", "404.html", "_headers"]) {
  await cp(join(root, "public", file), join(output, file));
}
const result = await build(buildOptions);
const [script, info] = Object.entries(result.metafile.outputs)
  .find(([, entry]) => entry.entryPoint === "src/index.js");
const assetUrl = (file) => `/${relative(output, join(root, file)).split("\\").join("/")}`;
const html = (await readFile(join(root, "public/index.html"), "utf8"))
  .replace("__SCRIPT__", assetUrl(script))
  .replace("__STYLE__", assetUrl(info.cssBundle));
await writeFile(join(output, "index.html"), html);
const sha = process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root, encoding: "utf8",
}).trim();
await writeFile(join(output, "version.json"), JSON.stringify({ sha }) + "\n");
console.log("Built static site in dist/");
