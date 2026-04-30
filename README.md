# Tier Zero

YC-pitch landing page for a multi-agent procurement platform for deep tech (semiconductors, aerospace, energy, robotics, biotech hardware, defense).

Static site — React 18 via UMD CDN + Babel-standalone in the browser. No build step.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static server (`npx serve`, `bun --bun serve`, nginx, caddy, etc.).

## Customize

The two knobs sit in `app.jsx`:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "steel",       // steel | ember | forest | iris | paper | fog | sage | midnight
  "scenario": "space",      // semiconductor | space | battery
  "companyName": "Tier Zero"
}/*EDITMODE-END*/;
```

Palettes are defined in the same file under `PALETTES`. Scenarios under `SCENARIOS`.

## Structure

| File              | Role                                                          |
|-------------------|---------------------------------------------------------------|
| `index.html`      | Entry — loads React 18 + Babel-standalone + JSX modules       |
| `app.jsx`         | Nav, hero, live-ops demo console, palettes, scenarios, CTA    |
| `sections.jsx`    | Pillars, Capabilities, Agents, Stories, Quotes, Resources     |
| `tweaks-panel.jsx`| Floating Tweaks panel + form-control helpers                  |
| `styles.css`      | Top-level layout, hero, nav, sections, footer                 |
| `demo-panes.css`  | Live-ops demo (signal feed, supplier graph, reasoning, metrics) |
| `sections.css`    | Pillars, capabilities, agents, quotes, resources              |

## Deploy

Any static host. Drop the directory.

- **Vercel** — connect this repo, framework preset = "Other", output directory = `.`
- **Netlify** — drag-drop the directory or connect repo, publish dir = `.`
- **Cloudflare Pages** — connect repo, build command = `(none)`, output dir = `/`
- **GitHub Pages** — push to `main`, enable Pages on `/` (root)
