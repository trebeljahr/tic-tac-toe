import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";
import { buildOptions, root } from "./build-options.js";

// Compile every browser import without writing or serving a build.
const result = await build({ ...buildOptions, write: false });
for (const output of Object.values(result.metafile.outputs)) {
  assert.equal(output.imports.filter((entry) => entry.external).length, 0,
    "The game must not need external runtime modules");
}
const html = await readFile(join(root, "public/index.html"), "utf8");
assert.doesNotMatch(html, /(?:src|href)=["'](?:https?:)?\/\//,
  "All page assets must be served locally");
assert.match(html, /__SCRIPT__/);
assert.match(html, /__STYLE__/);
console.log("Browser source and local asset references checked");
