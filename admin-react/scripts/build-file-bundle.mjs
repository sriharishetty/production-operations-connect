import { build } from "esbuild";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(here, "../../admin-react-dist");

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "assets"), { recursive: true });

await build({
  entryPoints: [resolve(here, "../src/main.jsx")],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  platform: "browser",
  target: ["es2020"],
  outfile: resolve(output, "assets/admin.js"),
  loader: { ".png": "file" },
  assetNames: "[name]"
});

await writeFile(resolve(output, "index.html"), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Production Operations | Admin</title>
    <link rel="icon" type="image/png" href="../public/favicon.png" />
    <link rel="stylesheet" href="./assets/admin.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="../js/data/master-data.js"></script>
    <script src="./assets/admin.js"></script>
  </body>
</html>
`);
