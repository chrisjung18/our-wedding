# Wedding website

An animated wedding website built with **Quasar 2** (Quasar CLI with webpack, not Vite), **Vue 3** (Composition API, `<script setup>`) and **Pinia**.

It includes an animated hero, a countdown, the couple's story, the schedule and venues, a photo gallery with a full-screen viewer, and an RSVP form.

## Run it

```bash
npm install
npm run dev      # http://localhost:9000
npm run build    # production files in dist/spa
```

Requires Node 20 or newer.

## Make it yours

### 1. Names, date, venues, story, schedule

Edit **`src/stores/wedding.js`**. Everything on the page comes from this one file:

- `partnerA`, `partnerB`: the names in the hero
- `dateISO`, `timeZone`: date and time of the ceremony (the countdown follows it)
- `heroPlace`, `hashtag`, `rsvpDeadline`, `maxGuests`
- `story`, `schedule`, `facts`, `venues`, `gallery`

### 2. Photos

The images in **`public/images/`** are placeholders. To replace them, either:

- save your photos with the same file names, or
- change the paths in `src/stores/wedding.js` (for example `/images/hero.jpg`).

Suggested sizes:

| Image | Shape | Size |
| --- | --- | --- |
| `hero` (the rising sun) | square, shown as a circle | 1200 x 1200 |
| `story-1` to `story-3` | portrait 4:5, shown in an arch | 1000 x 1250 |
| `gallery-*` | any; set `ratio` in the store to match | about 1400 px on the long side |

Set `arch: true` on portrait gallery photos to give them the arched top.

### 3. The RSVP form

Out of the box the form works in **demo mode**: replies are saved in the visitor's own browser only. To receive real replies, set `rsvpEndpoint` in `src/stores/wedding.js`. The form sends a JSON `POST` like this:

```json
{
  "name": "Anna Rossi",
  "email": "anna@example.com",
  "attending": "yes",
  "guests": 2,
  "menu": "fish",
  "note": "No nuts, please"
}
```

Services that accept this without a server of your own include Formspree, Getform, a Google Apps Script web app writing to a Google Sheet, or your own API.

The form logic is in `src/components/RsvpSection.vue` and `src/stores/rsvp.js`.

### 4. Colours and fonts

- Colours and fonts: the variables at the top of `src/css/app.scss`
- Quasar component colours: `src/css/quasar.variables.scss`
- Fonts are loaded from Google Fonts in `index.html`

## Animations

- **Hero**: the couple's photo rises like a sun, the names reveal letter by letter, and the scene moves with a light parallax as you scroll.
- **Scroll reveals**: the `v-reveal` directive (`src/boot/reveal.js`) with `rise`, `wipe` and `scale` variants.
- **Countdown**: digits roll when they change.
- **Story**: a line fills as you read down the timeline.
- **Gallery**: images unveil one by one; the viewer supports arrow keys, swipe and Escape.
- **RSVP**: a drawn check mark and a burst of sparks on success.

All motion is switched off for visitors who have "reduce motion" enabled.

## Project structure

```
src/
  boot/reveal.js          scroll-reveal directive
  components/             one component per section
  composables/            useCountdown, useScroll
  css/                    design tokens and Quasar variables
  layouts/MainLayout.vue
  pages/IndexPage.vue     assembles the sections
  router/
  stores/                 wedding.js (content), rsvp.js (form submit)
public/
  images/                 placeholder photos
  _redirects              Netlify single-page-app fallback
index.html                HTML template (fonts, page title)
quasar.config.js
```

## Deploying

`npm run build` creates a static site in `dist/spa`. Upload that folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, your own server).

The site uses clean URLs (`vueRouterMode: 'history'`), so the host must serve `index.html` for unknown paths. The included `public/_redirects` file does that on Netlify. If your host cannot do this, set `vueRouterMode: 'hash'` in `quasar.config.js`.
