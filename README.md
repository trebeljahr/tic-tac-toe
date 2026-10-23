# Tic-Tac-Toe

Play against the computer or a second player in the same browser.

Deployment target: https://tic-tac-toe.trebeljahr.com

## Run locally

Use the Node version in `.node-version`.

```sh
npm ci
npm run build
npm run check
npm run preview
```

The preview binds to `127.0.0.1` on a free port. Pass `-- --port 59343 --strictPort` to select a checked free port.

The build produces `dist/` with local JavaScript, CSS, icons, security headers and a version file. The game needs no backend, database, CDN script or service worker.

## Deployment

Hatchkit recognizes `.hatchkit.json` as a static project with a repo-owned Cloudflare release. Pushes to the existing GitHub `master` branch build and test the game, upload a Worker version, activate it, verify the preview and record the deployment. Local `main` tracks `origin/master`.

The GitHub repository holds only its per-Worker deployment token and account ID. Hatchkit's operator credential stays local. Provision the custom domain separately through Hatchkit; keep routes out of the CI Wrangler config.

Rollback uses a previously uploaded version: `wrangler versions list`, followed by `wrangler versions deploy <version-id>@100% --yes`. This preserves the domain binding.

The migration preserves the original layout and AI strategy. Turn updates are atomic, and the AI can only choose empty squares.
