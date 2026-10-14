# Lim Ziwei — Portfolio

A responsive, cinematic portfolio with four pages, smooth transitions, filterable projects, accessible project dialogs, mobile navigation, and reduced-motion support.

The additive interaction layer includes pointer-reactive project image tilt and highlights, magnetic buttons, click ripples, portrait parallax, and hover accents. Touch input keeps the existing tap interactions; reduced-motion preferences disable movement. Run `npm test` for interaction lifecycle checks.

Spacious chapters use scroll-entry reveals and directional page transitions with a browser fallback. A small trailing ring expands into contextual action badges over projects and photos, while preserving the native cursor. Portrait lettering has a pointer-following warm highlight, and photo hover reveals camera-style corner marks. Motion respects accessibility preferences, and the fixed navigation remains available during long sections. These additions live in `dist/experience.css` and `dist/experience.js`.

## Run locally

The latest polish layer (`dist/polish.js` and `dist/polish.css`) adds short heading-line staggers, a rotating Data / Code / Photography seal, subtle hero depth, a sliding navigation underline, and a gold reading-progress line. The photography filmstrip has larger frames, a frame counter, arrow-key controls, and an expanding photo viewer with previous/next controls. All decorative motion respects reduced-motion preferences.

For project-card video previews, fill in `caseStudies[projectId].previewVideoUrl` in `dist/collections-content.js` with a short MP4/WebM clip. Clips load only on interaction, play muted on desktop hover, and have a separate Play/Pause button for touch and keyboard visitors. They pause offscreen, on navigation, and when the tab loses focus. Reduced-motion and data-saving visitors receive manual playback. Empty fields leave the existing project images intact. The longer walkthrough still belongs in `videoUrl`.

Requires Node.js 18 or newer. No dependencies or build step.

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm run check` to check JavaScript syntax.

## Update your details

The expanded home page includes featured projects, a photography carousel, a short biography, clickable skills, and a contact section. The Photography page has category filters; real photos open in an accessible dialog when supplied.

### Spaces ready for your content

Edit `dist/collections-content.js`:

- `photography`: add image paths, descriptive alt text, captions, and locations. Empty slots remain clearly labelled placeholders. Add more entries with unique IDs as needed.
- `caseStudies`: each project has `videoUrl` (direct MP4/WebM video file), `videoPoster`, `demoUrl` (hosted experience or video page), `screenshots`, `role`, `approach`, `results`, and `lessons`. Videos use native playback controls and pause when the dialog closes.
- `skills`: maintain the related project IDs and descriptions behind each clickable skill.
- `instagram`: add your profile URL when ready.

The contact form has a reserved section only; no visitor information is collected or sent until message delivery and spam protection are implemented. Résumé, email, and LinkedIn slots remain in `dist/content.js`. No photo count or project results are fabricated.

For Cloudflare Pages, connect this repository’s `main` branch, choose no framework, use `exit 0` as the build command, and set the output directory to `dist`.

- Edit `dist/content.js` for email, LinkedIn, GitHub, résumé URL, and project content. Blank contact and résumé fields display honest “coming soon” dialogs.
- Edit `dist/index.html` for the biography, education, and homepage text.
- Replace `dist/assets/portrait.png` with your actual portrait when ready. The current image is AI-generated editorial imagery inspired by the supplied reference, not a verified photograph of Lim Ziwei.
- Project descriptions are drafts based on the supplied reference. Review them and add your project repository URLs in `dist/content.js` before sharing publicly.
- The static website lives entirely in `dist/`. Deploy this folder to any static host. Hash navigation works without server rewrites, including on GitHub Pages under `/me_myself/`.

## Assets

Hero portrait: generated for this portfolio from the supplied visual reference.

Project photographs: Unsplash images, saved locally to avoid runtime image dependencies. Source image IDs are recorded in `dist/assets/credits.txt`.

Fonts: DM Sans and Manrope via Google Fonts, with system-font fallbacks.

