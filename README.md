# DJS NOVA — Astronomy & Space-Tech Festival Website

A static, multi-page landing site for a fictional two-day space/astronomy
festival, built for the "Design a Website" technical task.

## What's inside

```
index.html      Home — hero with an interactive 3D scene, mission section,
                 event highlights, live countdown
events.html      Filterable event grid + a full two-day schedule timeline
about.html       Origin story, festival stats, organizing team, what to expect
contact.html     Validated contact form, contact card, FAQ accordion
css/style.css    Shared design system (colors, type, layout, components)
js/starfield.js  Canvas-based twinkling star background (every page)
js/scene.js      Three.js interactive 3D scene: rotating wireframe planet,
                 orbiting satellite, particle field, mouse parallax (home only)
js/main.js       Nav toggle, scroll reveals, countdown timer, event filters,
                 FAQ accordion, contact form validation, back-to-top
```

No build step, no framework, no backend — just HTML, CSS and vanilla JS.
Three.js is loaded from a CDN only on the home page, for the 3D hero.

## Preview it locally

Just open `index.html` in a browser. Everything works from the file system;
an internet connection is only needed for the two CDN requests (Google Fonts
and Three.js).

If you'd rather serve it (avoids occasional browser file:// quirks):

```bash
cd djs-nova
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Hosting it online (brownie points)

Any static host works since there's no server code. Two of the fastest:

**Netlify (no account setup needed for a quick preview)**
1. Go to https://app.netlify.com/drop
2. Drag the whole `djs-nova` folder onto the page.
3. Netlify gives you a live URL immediately.

**GitHub Pages**
1. Push this folder to a new GitHub repository.
2. In the repo, go to Settings → Pages.
3. Set the source branch to `main` and the folder to `/root`, then save.
4. Your site publishes at `https://<username>.github.io/<repo>/`.

## Customizing

- Colors, fonts and spacing are all CSS custom properties at the top of
  `css/style.css` — change the palette there and it cascades everywhere.
- The festival date lives in one place: the `data-countdown` attribute on
  the countdown panel in `index.html`.
- Events, team members and FAQ content are plain HTML in `events.html`,
  `about.html` and `contact.html` — no data file or templating involved.
- `prefers-reduced-motion` is respected throughout: the 3D scene renders a
  single static frame and the starfield/scroll animations turn off for
  anyone with that OS setting enabled.
