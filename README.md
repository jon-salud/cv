# Personal CV

A single-page CV that renders profile data from structured JSON using vanilla HTML, CSS, and JavaScript.

## Getting Started

```bash
# install dependencies (none required)

# start a local web server so the browser can load JSON via fetch
python3 -m http.server

# then open
http://localhost:8000/
```

## Project Structure

```bash
assets/
  css/      # stylesheets
  js/       # front-end scripts
  data/     # structured CV content (cv-data.json)
  images/   # favicons and other static images
index.html  # entry point
README.md   # this file
```

## Updating the CV

1. Edit `assets/data/cv-data.json` to update contact details, skills, experience, etc.
2. Refresh the browser to see changes reflected immediately.

### In-browser editor

- Scroll to the bottom of the page and click `Edit CV`.
- Sign in with username `admin` and password `changeme`.
- Adjust the JSON in the editor, then press **Save changes**.
- Changes are stored in your browser’s `localStorage`; use **Reset to defaults** to discard them.

No frameworks or build tooling are required; everything runs in the browser.

## Tests

Basic validation checks ensure the JSON data stays well-formed:

```bash
npm test        # structural JSON validation
npm run test:ui # static UI smoke checks
npm run test:all
```

The JSON validation ensures the CV data stays complete, while the UI smoke check confirms the "Professional Experiences" section renders the expand/collapse control.
