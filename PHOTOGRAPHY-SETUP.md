# Enable your photography editor on Cloudflare Workers

The editor is at `/photography-editor.html`, also linked from the Photography page as **Manage photographs**. It uploads photographs to Cloudflare R2, so everyone sees the saved collection. No code edits or GitHub pushes are needed for each photograph.

## One-time setup

1. In your Cloudflare account, create a private R2 bucket named `ziwei-photography`. Leave public bucket access disabled; the website serves published images through its API. Review any Cloudflare billing prompt yourself before enabling R2.
2. Open **Workers & Pages → me-myself → Bindings**. Add an **R2 bucket** binding named exactly `PHOTOS`, selecting that bucket. In this repository's `wrangler.jsonc`, uncomment the `r2_buckets` line at the bottom after the bucket exists, and commit it. This preserves the binding on future Git deployments. Do not uncomment it before creating the bucket.
3. In **Settings → Variables and Secrets**, add an encrypted secret named `PHOTO_ADMIN_TOKEN`. Use a password manager to generate a random key of at least 32 characters (up to 256). Save it in your password manager, never in this repository. This is the key you enter in the editor.
4. In the Worker's Git build settings, use the repository root and deploy command `npx wrangler deploy`. No build step is needed (use `exit 0` if required). Redeploy `main`. The included `worker.mjs` serves the photo API and `wrangler.jsonc` serves the existing `dist` website. A static-assets-only deployment will not enable uploads.
5. Visit [your editor](https://me-myself.limziwei2004.workers.dev/photography-editor.html), enter the key, then choose **Add photograph**.

If you use preview deployments, configure a separate test bucket and secret for them. Do not attach the production bucket to untrusted preview branches.

## Daily use

- Choose a JPG, PNG, or WebP image up to 10 MB. Export large originals at around 2000 pixels wide for faster loading. Original image metadata is retained: export without location metadata if you do not want it shared.
- Fill in its title, category, image description, and optional location/caption. Click **Publish photograph**. Reload the public gallery to see it.
- Click **Edit photograph** to change its details. Uncheck **Visible on my portfolio** to hide it without deleting the original. Recheck it to restore it. An image already cached by a visitor can remain available for up to 60 seconds.
- Newest photographs appear first. Categories are generated from your photos.
- Click **Lock editor** when finished. The key is held only in tab memory; reloading requires unlocking again.
- To replace an image, upload the replacement and hide the old photograph. Uploaded content remains in R2 across Git redeploys.

Until R2 and the secret are connected, the editor displays a setup message and the portfolio keeps its existing gallery. The ordinary `node scripts/serve.mjs` server serves the design only; it does not emulate Cloudflare Functions.

If you later switch to Pages, the root `functions/` folder supplies the same API. Add the `PHOTOS` binding and secret to the Pages project, and use `dist` as its output directory.

References: [Workers static assets and bindings](https://developers.cloudflare.com/workers/static-assets/binding/), [R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
