# Lim Ziwei — Portfolio

Home is a focused introduction. About, Projects, Photography, and Contact each have their own page; the homepage no longer duplicates their sections. Navigation uses a short opaque curtain transition, with instant switching when reduced motion is enabled. The Photography page retains its filters and expanding image viewer.

A responsive, cinematic portfolio with five pages, smooth transitions, filterable projects, accessible project dialogs, mobile navigation, and reduced-motion support.

The chapter design layer (`dist/chapters.css` and `dist/chapters.js`) gives About an editorial portrait layout and an interactive skills network, Projects a larger lead card with expanding detail imagery, Photography a featured frame and selectable contact sheet, and Contact a split layout on desktop. The chapter dock and progress line track navigation. Skill connections use shared project IDs from the content file; they are not proficiency ratings. Touch and keyboard input are supported, and motion follows the existing preference control.

The additive interaction layer includes pointer-reactive project image tilt and highlights, magnetic buttons, click ripples, portrait parallax, and hover accents. Touch input keeps the existing tap interactions; reduced-motion preferences disable movement. Run `npm test` for interaction lifecycle checks.

Spacious chapters use scroll-entry reveals and directional page transitions with a browser fallback. A small trailing ring expands into contextual action badges over projects and photos, while preserving the native cursor. Portrait lettering has a pointer-following warm highlight, and photo hover reveals camera-style corner marks. Motion respects accessibility preferences, and the fixed navigation remains available during long sections. These additions live in `dist/experience.css` and `dist/experience.js`.

## Run locally

The polish layer (`dist/polish.js` and `dist/polish.css`) adds short heading-line staggers, a rotating Data / Code / Photography seal, subtle hero depth, a sliding navigation underline, and a gold reading-progress line. The photography contact sheet has a frame counter, arrow-key controls, and an expanding photo viewer with previous/next controls. The rotating Home badge opens a small interest explorer. All decorative motion respects reduced-motion preferences.

For project-card video previews, fill in `caseStudies[projectId].previewVideoUrl` in `dist/collections-content.js` with a short MP4/WebM clip. Clips load only on interaction, play muted on desktop hover, and have a separate Play/Pause button for touch and keyboard visitors. They pause offscreen, on navigation, and when the tab loses focus. Reduced-motion and data-saving visitors receive manual playback. Empty fields leave the existing project images intact. The longer walkthrough still belongs in `videoUrl`.

Requires Node.js 18 or newer. No dependencies or build step.

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm run check` to check JavaScript syntax.

## Update your details

The Home badge and Projects' 3D slot open a draggable robot guide (`dist/robot-guide.js` and `.css`). Select one of five destinations, use the arrow keys to rotate, reset the view, or trigger a short wave. This is a CSS 3D figure with no external engine or tracking. Reduced motion disables the wave and rotation easing; direct rotation remains under visitor control.

### Timeline, credentials, and collections

Edit `timeline`, `credentials`, and `photoCollections` in `dist/collections-content.js`. Timeline entries require a title and organization; credentials require a title and issuer. Empty sections are hidden. The education entry uses the existing TAR UMT details; no employment history or awards have been invented.

Photo collections become visible once a photo in a matching category has a `src`. Optionally set a photo's `album` to a collection ID to group it explicitly. Category filters and the photo viewer operate within the selected collection.

The Projects playground is a browser-only K-means demonstration with synthetic points. Visitors can adjust the group count, advance the algorithm, reset it, or generate another sample. It is separate from the portfolio's project results.

### Shareable project pages

Each project has its own address: `/projects/food/`, `/projects/interview/`, and `/projects/streaming/`. The project dialog links to it; the AI Interview project links to `https://ai-int.notait.com`. Add verified case-study text, video, screenshots, or repository links to the existing content fields. Empty detailed sections stay hidden on standalone pages.

Run `npm run build` (or `node scripts/build-project-pages.mjs`) after content edits to regenerate the static pages. The Cloudflare Wrangler build also runs this generator before deployment. Generated HTML is committed so direct static hosting works too.

Email opens a Gmail compose window; Contact also provides a visible address, email-app link, and Copy email button. JobStreet opens the supplied profile directly. The Motion control remembers the visitor's reduced-motion preference and also respects their system setting.

Résumé remains reserved until `resumeUrl` is filled in `dist/content.js`. Project case-study fields (`problem`, `role`, `approach`, `results`, `lessons`, videos and screenshots) remain empty in `dist/collections-content.js` for verified details later.

### Add your photographs in code

1. Put your image files in `dist/assets/`, for example `dist/assets/kl-sunset.jpg`.
2. Edit an entry in `window.PORTFOLIO.photography` in `dist/collections-content.js`:

```js
{id:'city', category:'City', title:'Evening in KL', location:'Kuala Lumpur',
 src:'assets/kl-sunset.jpg', alt:'Kuala Lumpur skyline at sunset',
 caption:'The last light over the city.'}
```

Add more entries with unique `id` values for more photographs. Empty `src` fields remain placeholders. Commit and push your changes to `main`, then let Cloudflare redeploy. The featured frame, contact sheet, gallery filters, and photo viewer use this same list.

The website has no upload editor or photography API. No R2 storage or editor key is required. Your Workers deployment uses the static `dist` assets via `wrangler.jsonc`; deploy with `npx wrangler deploy` from the repository root.

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


### Optional photograph details
In `dist/collections-content.js`, each photography entry can include `location`, `date`, and `story` strings. Filled fields appear under “Behind this photograph”; empty fields stay hidden. Keep `src` blank until a real photo is ready.

### Beyond the Screen, Playground, and Board Games
- Main routes: `/#beyond`, `/#playground`, and `/#board-games`.
- Sport labels and introductory copy live in `dist/new-pages.js`.
- The clustering experiment lives in `dist/additions.js`; the reaction game cancels on navigation and when the tab is hidden.
- Add verified game entries to `dist/board-games-content.js`. Each entry needs a title and HTTPS URL; description, player count, and a rules URL are optional. Entries without valid URLs remain unpublished. An empty collection shows a prepared shelf, not fictional games.
- Run `node scripts/test-ui.cjs` with Playwright available to check all eight routes at phone, tablet, and desktop sizes.
