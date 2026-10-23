import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const buildOptions = {
  absWorkingDir: root,
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  loader: { ".js": "jsx" },
  outdir: "dist",
  entryNames: "assets/game-[hash]",
  minify: true,
  metafile: true,
  legalComments: "linked",
  define: { "process.env.NODE_ENV": '"production"' },
};
