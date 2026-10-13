# Lim Ziwei — Portfolio

A responsive, cinematic portfolio with four pages, smooth transitions, filterable projects, accessible project dialogs, mobile navigation, and reduced-motion support.

## Run locally

Requires Node.js 18 or newer. No dependencies or build step.

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm run check` to check JavaScript syntax.

## Update your details

- Edit `dist/content.js` for email, LinkedIn, GitHub, résumé URL, and project content. Blank contact and résumé fields display honest “coming soon” dialogs.
- Edit `dist/index.html` for the biography, education, and homepage text.
- Replace `dist/assets/portrait.png` with your actual portrait when ready. The current image is AI-generated editorial imagery inspired by the supplied reference, not a verified photograph of Lim Ziwei.
- Project descriptions are drafts based on the supplied reference. Review them and add your project repository URLs in `dist/content.js` before sharing publicly.
- The static website lives entirely in `dist/`. Deploy this folder to any static host. Hash navigation works without server rewrites, including on GitHub Pages under `/me_myself/`.

## Assets

Hero portrait: generated for this portfolio from the supplied visual reference.

Project photographs: Unsplash images, saved locally to avoid runtime image dependencies. Source image IDs are recorded in `dist/assets/credits.txt`.

Fonts: DM Sans and Manrope via Google Fonts, with system-font fallbacks.
