# Copilot Instructions for cigem.github.io

## Project Overview
This is a static website project for CIGEM, organized with HTML, CSS, and JavaScript. The structure is simple, with content separated into logical folders for cards, content assets, and other pages.

## Key Directories & Files
- `index.html`: Main landing page.
- `card/`: Contains various card layout HTML files (e.g., `cardfinal.html`, `CardMovil.html`).
- `Content/css/styles.css`: Central stylesheet for the site.
- `Content/js/app.js`: Main JavaScript logic (if present).
- `Content/img/`: Image assets.
- `otherpages/`: Additional HTML pages (e.g., `banner.html`, `QRLector.html`).

## Patterns & Conventions
- **HTML Organization**: Each major UI component or page has its own HTML file. Card variations are in the `card/` folder.
- **CSS**: All styling is centralized in `Content/css/styles.css`. Inline styles are discouraged.
- **JavaScript**: Place all scripts in `Content/js/app.js` unless a page requires a unique script.
- **Assets**: Store all images in `Content/img/`.
- **Naming**: Use PascalCase or descriptive names for HTML files representing components (e.g., `CardMovil.html`).

## Developer Workflows
- No build step: Edit HTML/CSS/JS directly and refresh the browser to see changes.
- No automated tests or bundling tools are present.
- Debug by opening HTML files in a browser and using browser dev tools.

## Integration Points
- No external frameworks or build tools are used by default. If adding dependencies, document them in this file.

## Examples
- To add a new card type: Copy an existing file in `card/`, update the markup, and link to `styles.css`.
- To update site-wide styles: Edit `Content/css/styles.css`.

## Additional Notes
- Keep the structure flat and simple; avoid unnecessary nesting or complexity.
- If adding new workflows (e.g., build scripts, tests), update this file with instructions.

---
For questions or major changes, consult the project owner.
