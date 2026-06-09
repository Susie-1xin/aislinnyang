# aislinnyang.com - Claude Code Context

## Project Overview

Personal website for Yixin Yang (Aislinn) - growth & AI person, writer, co-founder, vibe coder.
Deployed on Cloudflare Pages. Domain: aislinnyang.com.
GitHub: https://github.com/Susie-1xin/personal-site

**Purpose (important):** This site is *not* an achievement showcase. It answers **"what is this
person like, in real life and at work?"** - how she thinks, what she is building, what she is
overthinking, and what kind of life she is trying to build. Achievements are woven into the story as
things she learned or survived, never listed as a résumé. Tone: warm, sharp, conversational,
self-aware, a bit self-deprecating, curious, international, ambitious-but-not-cringe. English only.

## Writing style (important)

**"Rednote", not "小红书" / "Xiaohongshu".** In English-facing copy, the platform 小红书 is always
written **Rednote** (its international name). Her handle `@苏西Aislinn` stays as-is.

**No em-dashes (—).** Aislinn dislikes them. In all copy, rephrase with commas, periods, colons, or
parentheses, and use `·` as a separator. (Hyphens in compounds like `digital-nomad` / `health-ish`
and arrows `↓ → ↺` are fine, they are not em-dashes.)

**Voice reference:** `/cooking.html` is the best local sample of her natural English voice: direct,
funny, slightly self-mocking, specific, casual without being sloppy. Prefer concrete lines like
"a heroic amount of admin paperwork" or "apparently I enjoy making my learning curve searchable"
over polished portfolio language like "I grow toward whatever makes me feel more alive." Keep the
site credible for hiring and collaboration, but let it sound like a real person wrote it while mildly
overthinking everything.

## Creative direction - "Heliotrope" 🌻

A sunflower's *heliotropism* (turning toward light all day) is still the quiet visual metaphor, but
the copy should not become too poetic or self-mythologizing. The narrative arc is now more grounded:
what I am doing now → how I got here → what I am still figuring out.

## Entry flow (two sides of her) - now two separate URLs

The onboarding and the main site are **separate pages** (split 2026-06-07 so returning from a
subpage no longer replays the intro):

- **`/` (index.html)** = the editorial main site (the *reflective* side). A tiny gate in `<head>`
  reads `localStorage.seen_intro`; if it's unset (a brand-new visitor) it `location.replace`s to
  `welcome.html` **before any paint**. Otherwise it shows the main site immediately. `script.js`
  runs `#main-site`→`.visible` + `initMainSite()` on load (no in-page onboarding any more).
- **`/welcome.html`** = the **treasure-dig onboarding** (the *playful/alive* side): 3 onboarding Qs
  → pixel walk/dig → raise the chest → open it. `showUnlock()` shows a brief "Found it 🌻" splash
  then auto-calls `enterMainSite()` after 1.5s; a "skip →" button finishes from any point.
  `enterMainSite()` (in `welcome.js`) sets `localStorage.seen_intro = '1'` and
  `location.replace('/')`. So the intro plays **once per browser**; visiting `/welcome.html`
  directly always replays it (re-take the tour).
- Subpages (`about.html`, `cooking.html`) link back to `index.html` = the main site, so **returning
  never replays the onboarding**.

JS is split to match: **`welcome.js`** = cursor + onboarding + pixel-dig canvas + transitions;
**`script.js`** = cursor (duplicated) + main-site only (heliotrope, daylight, easter eggs,
`initMainSite`). They must stay separate: the canvas boot (`cv.getContext`) and `renderQ()` run at
top level and would throw on a page without the onboarding DOM. `html.loading` (hides
`.spine`/`.sunflower`, locks scroll) is set only on the onboarding page.

Note: the gold-miner game + choice screen were fully removed earlier (code deleted, not just
disabled).

## File Structure

```
aislinnyang-site/
├── index.html        - the main site: editorial page (#main-site) + résumé/reader modals + first-visit gate
├── welcome.html      - the onboarding entrance (#loading-wrapper: questions + pixel dig)
├── about.html        - "my story" long-form page (own inline script, no script.js)
├── cooking.html      - polaroid board of food photos (own inline script, no script.js)
├── style.css         - all styles (shared by every page)
├── script.js         - main site only (cursor, sunflower, scroll stem, nav, garden, open cards, modals)
├── welcome.js        - onboarding only (cursor, questions, pixel dig, transitions → sets seen_intro, → /)
├── assets/
│   ├── laugh.jpg         - hero/life photo (real)
│   ├── pixel-laugh.png   - hero flip-card front (pixel self)
│   ├── resume-en.pdf     - English CV (opened from footer link)
│   └── …                 - older pixel art (pixel-sheet/stand) now unused
└── CLAUDE.md
```

## Page sections (in order)

`#hello` (hero) · `#think` (How I think) · `#journey` (How I got here - timeline, wins woven in) ·
`#exploring` (open questions **+ the curiosity garden**) · `#open` (out in the open: writing + built)
· `#life` (off the clock + "Currently" block) · `#now` (dated /now card) · `#becoming` (closing +
soft contact) · footer (links + quiet CV link). **Seven numbered sections (01-07), one editorial
voice.**

Nav (live label → anchor): Now → `#now` · Career → `#think` · Story → `#journey` · Exploring → `#exploring` · Projects → `#open` · Life → `#life`. (Labels were renamed; the section ids/anchors are unchanged.)

> **2026-06-01 cohesion pass.** The site had drifted into two voices (calm editorial vs. app-like
> cards). Fixed by collapsing to one voice: the standalone `#garden`, `#wall`, `#built` sections
> were merged away. Garden folded into `#exploring`; the post wall + the builds wall merged into one
> calm `#open` section. Labels renumbered 01-07, emoji prefixes dropped. (A short-lived `#experiments`
> / "Lab" section was also built and removed earlier.) **Garden is the one allowed illustration**
> (it earns it via the heliotrope metaphor); everything else is type + space.

### Garden (heliotrope), now the coda of `#exploring`

After the open questions, an italic lead-in (`.explore-grow`) bridges into a **living garden**: each
curiosity is an SVG sunflower grown to the depth actually reached, `seed` → `sprout` → `bud` →
`bloom`. On desktop the heads **turn toward the cursor** (per-frame lerp of `--lean`, clamped ±22°);
hovering updates a shared serif **readout**. Gated off for touch + `prefers-reduced-motion`. Content
lives in the **`GARDEN` array** (`{ label, stage, note }`); SVGs from `flowerSVG(stage)`, wired in
`initGarden()`. Greens (`--stem` / `--leaf` / `--bud` / `--stem-dark`) are scoped to `#garden` in CSS.

### `#open` - Out in the open (writing + building)

One calm card system for everything she's put into the world, the receipt for `#think`'s "I think by
doing, mostly in public." Two families: **`written`** (Rednote / podcast / Substack) and **`built`**
(sites / skills). An understated text filter (`All · Written · Built`, `.open-tab`) toggles
`.is-hidden`. Data-driven from the **`OPEN_ITEMS` array in `script.js`** (`{ kind, title, blurb,
meta?, url?, fulltext?, embedUrl?, self? }`); `KIND` maps each kind to label + icon + family;
rendered by `openCard()` in `initOpen()`.

Interaction by kind:
- **`rednote` / `substack`** - cannot be embedded (no widget; Rednote images are hotlink-protected),
  so the whole card opens the **on-site reader modal** ("Read here ↗", keyboard-focusable). The modal
  (`#post-modal`, `openPostModal` / `closePostModal`, Esc closes) shows `fulltext` if present, else
  the `blurb`, with a pinned folded **corner** (`.pm-corner`) linking out ("View on <source> ↗").
- **`podcast`** - if `embedUrl` is set, the card opens the modal with the **Apple Podcasts iframe**
  (`.pm-embed`); otherwise a muted "coming soon" note.
- **`site`** - `self: true` → "you're on it 🌻" (this page); else a "Visit ↗" external link.
- **`skill`** - a muted `note` (no public URL).

**Naming:** the platform 小红书 is always written **"Rednote"** in copy (see Writing style).

Covers: a `cover` image path renders `<img>`; otherwise a gradient placeholder with the source glyph
(`.wall-cover--xhs` / `--substack` / `--podcast`). `OPEN_ITEMS` holds the five real Rednote posts
(bilingual `fulltext` / `fulltextEn`, real `url`s) plus the site / skill build items. The five
written posts mirror the source drafts in `posts/`.

## Color & Font Reference

| Token      | Value     | Usage                                  |
|------------|-----------|----------------------------------------|
| --cream    | #FAF8F5   | background everywhere                   |
| --ink      | #111111   | headings, button fills                  |
| --charcoal | #1C1C1C   | body text                               |
| --yellow   | #F5C518   | sunflower fill, accents, underlines     |
| --muted    | #9B9B9B   | secondary text, labels                  |
| --line     | #E8E4DF   | borders, dividers                       |
| --warm     | amber 14% | hero/becoming radial light wash         |

Fonts (loaded via Google Fonts link in `index.html` head):
- **Bricolage Grotesque** (`--display`) - big display headings.
- **Fraunces** (`--serif`) - long-form reflective prose, ledes, quotes. The editorial/warm voice.
- **DM Sans** (`--sans`) - labels, nav, UI, captions, margin notes.

Yellow is fill/graphic/underline only - never body text on cream (contrast).

## Heliotrope mechanics (script.js)

- **Sunflower rides the stem** (`heliotropeFrame()`, a continuous rAF lerp): as you scroll, the
  warm `#spine-fill` grows DOWN the left stem and the `#sunflower` sits at its tip - its `top` tracks
  scroll progress (centre rides `72px → vh-72`) and it **spins** (`rotate = scrollY * 0.18`) like a
  wheel. A per-frame lerp (`*0.12`) keeps the motion floaty. Tunables: the `0.18` spin rate and the
  `72 / 144` offsets in `heliotropeFrame`.
- **Easter egg**: clicking the sunflower = `.bloom` (a 360° + scale flourish on `#sf-head`) plus
  spark emojis.
- Both stem + sunflower are decorative, hidden under 900px and during `html.loading`; the nav 🌻
  logo carries the brand on mobile.

## Playful / "alive" touches

The treasure-dig loading sequence · custom cursor (desktop only) · hero flip photo (pixel ↔ real =
"both sides of me") · italic margin notes in `.essay-notes`.

Micro-interactions (mostly wired in `initDelights()` in script.js, styles under "Little delights"
in style.css):
- **Sunflower blooms at the bottom** - scrolling to `#becoming` (p > 0.98) auto-fires
  `bloomSunflower()`; resets when you scroll back up. Same bloom also on click.
- **Click the contact email** → copies to clipboard + a `.mini-toast` "copied 🌻".
- **Tab-away title** → `🌻 still becoming…`, restored on return (`visibilitychange`).
- **Hero**: the warm light drifts toward the cursor and the flip photo tilts in 3D (`#hello`
  mousemove; reset on mouseleave).
- **Timeline nodes** pop in on scroll (`.t-item.seen::before`, IntersectionObserver).
- **"Now" list** items stagger in when the card reveals.
- **Curiosity garden** (`initGarden()`, now inside `#exploring`): SVG sunflowers at four growth
  stages whose heads lean toward the cursor (heliotropism, `--lean`, ±22°, touch/reduced-motion
  gated); hover updates the shared `#garden-readout`.
- **Out in the open** (`initOpen()`): one calm card grid + `All · Written · Built` text filter;
  readable cards open the on-site reader modal (`#post-modal`), sites link out, podcast embeds the
  Apple player in the modal. See the `#open` section above.

## Responsive & touch

- Single breakpoint pair: `@media (max-width: 900px)` (hides spine/sunflower, collapses essay margin
  notes) and `@media (max-width: 760px)` (mobile nav drawer, single-column hero/life/timeline, hero
  font scaled down + overflow guards).
- **Touch devices** (`@media (hover: none), (pointer: coarse)`): the custom `#cursor-ring` is hidden
  and the normal system cursor is restored - never ship the blend-mode ring to phones.
- Onboarding centers the whole group (dots + `#qtxt` + `#opts`) as one unit (`#ob`
  `justify-content: center` + a slight `padding-bottom` top bias). The question has **no** reserved
  height, so a 1-line question just makes the group shorter and it re-centers (options move up with
  it) instead of leaving a dead row of space. `#opts` keeps a 2-row min-height since every question
  has 4 options.
- The dig `#cv` canvas uses `width/height: 100%` so it always fills the full-screen wrapper.
- `#hello` and `#becoming` have `overflow: hidden` to clip the radial light wash (prevents sideways
  scroll on small screens).

## Editable content

Copy is grounded in real facts but intentionally sounds more like Aislinn's `/cooking.html` voice
than a polished portfolio. When updating, keep concrete details, light self-mockery, and useful
specifics. Avoid generic "personal brand" language.

## How to Update Content

- **Copy / sections** → edit the relevant `<section>` in `index.html` (plain HTML, no JS data file).
- **Now section** → edit `#now .now-list` + the `Last updated:` date.
- **Currently block** → edit `#life .currently dl`.
- **Curiosity garden** (now inside `#exploring`) → edit the `GARDEN` array in `script.js`
  (`{ label, stage, note }`, stage = `seed` | `sprout` | `bud` | `bloom`). No markup changes needed.
- **Out in the open** → edit the `OPEN_ITEMS` array in `script.js` (`{ kind, title, blurb, meta?,
  url?, fulltext?, embedUrl?, self? }`; kind = `rednote` | `podcast` | `substack` | `site` | `skill`).
  Add `fulltext` to open a Rednote/Substack post in the reader; set `embedUrl` for an Apple Podcasts
  episode; `self: true` marks this site; `url` gives a Visit ↗ / corner link.
- **Résumé** → replace `assets/resume-en.pdf` (modal opens it from the footer "my CV →" link).
- **GA4** → replace `G-XXXXXXXXXX` in the `<head>`.

## Deploy

```bash
git add -A
git commit -m "your message"
git push origin main
```
Cloudflare Pages auto-deploys on push to main.
