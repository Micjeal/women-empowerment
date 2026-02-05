# Hosting Guide

This website is static HTML/CSS/JS, so it can be hosted almost anywhere.

## Quick local hosting

From this folder:

```bash
npm run host
```

The site will be available at:

- `http://127.0.0.1:4173/index.html`

## Health check

```bash
npm run host:check
```

Expected response starts with:

- `HTTP/1.0 200 OK`

## If you see `ERR_CONNECTION_REFUSED`

That means no server is running on that port yet.

1. Start the server:

```bash
npm run host
```

2. Keep that terminal open while browsing.
3. In another terminal, verify:

```bash
npm run host:check
```

If port `4173` is already used, switch to another port:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then open:

- `http://127.0.0.1:8080/index.html`

## Free public hosting options

### Option 1: GitHub Pages

1. Push this folder to a GitHub repo.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch), folder `/ (root)`
4. Save and wait ~1–3 minutes.
5. Your site will be live at a URL like:
   - `https://<username>.github.io/<repo>/`

### Option 2: Netlify (drag-and-drop)

1. Go to Netlify and create a new site.
2. Drag this `women-s-empowerment-collective` folder into Netlify Drop.
3. Netlify gives you a public URL instantly.

### Option 3: Cloudflare Pages

1. Connect your GitHub repo to Cloudflare Pages.
2. Set:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
3. Deploy.

## Notes

- No build step is required.
- If you want a custom domain, all three options support it.
