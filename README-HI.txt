# TEAM PHANTOM — single-address HTML package

## What changed
- `index.html` is now the root SPA shell.
- The original landing/intro page is preserved as `intro.html`.
- Login, classroom, batch mode, subjects, lectures, and player remain separate HTML files.
- The pages load inside a same-origin full-screen iframe. Internal navigation and redirects happen inside that frame, so the browser address bar stays at the website root (`https://teampanthom.vercel.app/`).
- Existing page content, styles, Firebase code, and features have been preserved. The only page-routing adjustment is that old internal `index.html` fallback redirects now point to `intro.html`, avoiding a recursive load of the new root shell.

## Deploy
Upload the contents of this folder to the root of the same Vercel static project. Keep existing image/assets (for example `logo.jpeg`, `math-ima.jpeg`, `capf-forces.jpeg`, `afcat-afa.jpeg`, `ota-chennai.jpeg`) alongside these files at the project root, as they were referenced by the original pages.

The expected root files are:
- `index.html`
- `intro.html`
- `login.html`
- `classroom.html`
- `batch-mode.html`
- `subjects.html`
- `lectures.html`
- `player.html`

## Raw code note
`raw-code-reference.txt` is retained unchanged for reference, but is not auto-executed. It is a separate application script that expects a different set of DOM elements and `/api/auth/...` endpoints. Injecting that entire script into these Firebase pages would risk breaking login and page behavior. The supplied HTML pages' existing security/downloader checks remain in place.

## Important technical note
This keeps the visible browser URL at `/` while the individual HTML documents navigate inside the frame. It is an iframe-based single-address shell, not a conversion of every page into one shared DOM. It preserves the original separate-page code with much lower risk of breaking Firebase modules and player behavior.
