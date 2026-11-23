# AURAVÉ — Figma-ready design specification

> **Status:** this is a handoff spec. **No native `.fig` file has been created** — the Figma connector was not authorised in this session. Build the file from this document (about half a day for one designer); every value below matches the implemented React code (`src/styles/tokens.css` and component CSS), so the site is the source of truth.

## 0. File setup

File name: `AURAVÉ — Web`. Eight pages, in this order:

1. Cover & Brand Identity  2. Design System  3. Components  4. Homepage — Desktop  5. Homepage — Mobile  6. Collection — Desktop  7. Collection — Mobile  8. Three.js Hero Experience

Layout grids: Desktop 1440 — 12 columns, margin 56, gutter 24 (content max 1360). Tablet 768 — 8 col, margin 32, gutter 20. Mobile 390 — 4 col, margin 16, gutter 12.

## 1. Design tokens (Figma Variables)

**Collection `Color`** (single mode)

| Variable | Hex | Use |
|---|---|---|
| `navy` | #0B3068 | headings, primary button, announcement bar |
| `royal` | #1E4D8A | links, accent, hover |
| `ice` | #EAF2FF | image backdrops, hero, tints |
| `white` | #FFFFFF | surfaces |
| `grey` | #F3F5F9 | alternate sections |
| `text` | #263449 | body |
| `text-soft` | #5B6A80 | secondary text (4.9:1 on white) |
| `line` | #D9E1EE | borders, dividers |
| `midnight` | #06142E | footer, 3D stage |
| `danger` | #B3261E | form errors |

**Gradients (Paint styles):** `hero-ice` 180° #EAF2FF → #F7FAFF → #FFFFFF · `stage-night` radial #14438C → #0B2B5E (40%) → #050F24 · `campaign` 120° #0B3068 → #06142E · `silver` linear, stops #F6F9FD / #7F90AB / #E3E9F2 / #566A8A / #C5D0E0.

**Text styles**

| Style | Font | Size / line | Weight | Tracking |
|---|---|---|---|---|
| `Display` | Playfair Display | 90 / 94 (mobile 42 / 44) | 500, italic accent line 400 | −1% |
| `H1` | Playfair Display | 58 / 64 (mobile 34 / 38) | 500 | −1% |
| `H2` | Playfair Display | 42 / 48 (mobile 27 / 32) | 500 | −1% |
| `H3` | Playfair Display | 20 / 24 | 500 | 0 |
| `Body` | Inter | 15 / 24 | 400 | 0 |
| `Body-sm` | Inter | 13 / 20 | 400 | 0 |
| `Eyebrow` | Inter | 11.5 / 16 | 500, uppercase | +22% |
| `Button` | Inter | 12.5 / 16 | 500, uppercase | +14% |
| `Nav` | Inter | 12.5 / 16 | 500, uppercase | +14% |
| `Price` | Inter | 15 / 20 (PDP 26) | 500 | 0 |
| `Wordmark` | Playfair Display | 25 (mobile 21) | 500 | +26% |

**Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 112. Section vertical padding: 112 desktop / 56 mobile. **Radius:** 2 (buttons, inputs), 0 (images), 50% (icon buttons, avatars); bottom sheet top corners 14. **Shadow:** `elev-1` 0 18 50 −20 rgba(11,48,104,.35). **Motion:** ease `cubic-bezier(.22,.61,.36,1)`, 300 ms UI / 800 ms reveal / 900 ms image zoom.

## 2. Components (Figma Components + Variants)

All use Auto Layout; names use `Group/Component/Variant` slash paths.

- **Button** — props `Variant` = primary / secondary / light / outline-light, `Size` = sm 40h / md 48h / lg 54h, `State` = default / hover / pressed / disabled. Horizontal AL, padding 0 × 30 (lg 38, sm 20), gap 10, centre. Primary: fill navy, text white; hover fill royal. Secondary: 1 px navy stroke; hover fill navy. Min tap height 40–54.
- **Logo** — sparkle glyph (4-point star, 16 px, navy) + wordmark, gap 9. Variants `Dark` / `Light`.
- **Announcement bar** — 100% × ~40, fill navy, centred Eyebrow-style text white 12 px, tracking +14%, close icon 44×44 hit area right.
- **Header / Desktop** — 1440 × 72, fill white 96%, bottom stroke `line` appears on scroll. Three zones: left nav (5 items, gap 38), centre logo, right icons (search, wishlist, account, bag; 44×44 each, gap 2). Badge: 17 px pill, navy, white 10.5 px. Variant `Scrolled` adds bottom stroke + shadow.
- **Header / Mobile** — 390 × 60: menu icon (left), centred logo (21 px), search + bag (right). Wishlist and account move into the drawer.
- **Mega menu** — 1440 × ~300, white, top/bottom stroke. Left: eyebrow + 2-column list of six categories (H3 20 px, caption 12 px, bottom hairline). Right: ice card 460 × auto with 150×188 image, eyebrow, H3 24, link-arrow.
- **Nav drawer (mobile)** — 340 wide, left; items in H2-ish 26 px Playfair with hairlines, then 2-column category grid.
- **Product card** — width flexible (hug 4-col: 312). Image 4:5, fill `ice`. Overlay: badge (top-left, 12 offset), wishlist icon button (40 circle, white 88%, top-right 8). Quick-view bar (46h, white 94%, slides up on hover; mobile: 40 circle bottom-right). Info stack gap 4: name (Inter 14.5/500), price row (price, struck MRP 13 `text-soft`, “% off” 12 royal). Variants: `Default` / `Hover` (second image) / `Wishlisted` (heart filled #C2335F).
- **Badge** — `New` (navy fill, white text) / `Sale` (white fill, navy text); 10.5 px uppercase, tracking +16%, padding 5×10.
- **Category card** — image 4:5 + row: H3 21 + caption 13 + arrow-up-right icon 20.
- **Filter group** — legend (Eyebrow, navy) + checkbox rows 40h (18 px square, 1 px #9DB0CC; checked fill navy with white tick) + optional count. **Colour swatch chip** 40h, 16 px dot, 1 px `line`; selected: navy stroke + ice fill.
- **Sidebar filter** — 240 wide, sticky; header “Filters” H3 + Clear all link; groups: Category, Price, Style, Colour, Availability.
- **Filter bottom sheet** — 390 × up to 88% height, 14 px top radius; header, scroll body, sticky footer with `Clear all` (secondary) + `Show N pieces` (primary), 1 : 1.5.
- **Sort select** — 44h, 1 px `line`, chevron right, navy 500 text.
- **Filter chip** — 36h, ice fill, label + × icon.
- **Quantity** — 48h, 1 px `line`, − / value / +, buttons 44 wide.
- **Cart drawer** — 440 wide right. Header; shipping progress (ice strip + 3 px bar); line items (84 × 105 thumb, name, price, quantity 40h, delete); footer subtotal, note, primary lg button. Variant `Empty`.
- **Quick-view modal** — 980 max, 2 columns (gallery with 3 thumbs / info), close button top-right.
- **Form / Newsletter** — input 48h white, 1 px `line`, + primary button; Error (danger 13 px text, danger stroke) and Success states.
- **Testimonial card** — 1 px `line`, padding 28, quote Playfair 18/26, avatar initial 34 circle. Includes a visible “Demo testimonial” label.
- **Footer** — midnight, 5 columns (brand 1.6 / Shop / About / Help / Contact), social 44 circles with 1 px white 25%, bottom bar with copyright.
- **Toast** — navy, white 13 px, padding 12×20.

## 3. Pages and frames

### 3.1 Homepage — Desktop (1440 × ~6200, vertical Auto Layout, gap 0)

| Section | Height | Layout |
|---|---|---|
| Announcement bar | 40 | full width |
| Header | 72 | sticky |
| Hero | 720 | 2 columns 1.05 : 1, `hero-ice` fill. Left: eyebrow, Display (“Pure Silver. / *Lasting Stories.*”, second line italic, royal), body copy max 34ch, two lg buttons (primary + secondary), gap 32. Right: 560 × 653 ice-radial frame with the pendant illustration, floating label card (“The Blue Stone Pendant · Demo piece”, white, elev-1) overlapping left edge by −24 |
| Trust strip | 96 | 4 items: icon 24 (stroke 1.4) + title 13.5/500 + caption 12; hairline under |
| Cinematic 3D section | 640 | full-bleed `stage-night`; copy block left (eyebrow, H1 white, 1 paragraph, outline-light button) over the 3D frame — see §3.8 |
| Shop by category | ~1100 | section head (eyebrow + H2 + “View all”), 3 × 2 grid, gap 28 / 40 |
| New arrivals | ~620 | `grey` fill, 4-up product grid |
| Bestsellers | ~620 | 4-up scroll-snap carousel, prev/next 44 buttons |
| Editorial campaign | 560 | `campaign` fill; left copy (H1 “More Than Jewellery. / It’s a Feeling.”, paragraph, light lg button), right two 4:5-ish dark artwork tiles |
| Brand story | ~760 | `grey`; image 4:5 left, copy right: eyebrow, H2, 2 paragraphs, 3 pillars (H3 + 14 px text) |
| Testimonials | ~520 | head + “Demo testimonials” tag; 3 cards |
| Newsletter | 360 | `ice`; 2 columns: copy / form; note “demo form” |
| Footer | ~480 | midnight |

### 3.2 Homepage — Mobile (390 × ~9000)

Announcement (wraps to 2 lines) → header 60 → hero (centred text, stacked full-width buttons, image 358 wide 6:7 below, label centred) → trust 2 × 2 → 3D stage 380 high, copy below (not overlaid) → categories 2-col → new arrivals 2-col → bestsellers swipe carousel (2 visible) → editorial (tiles 260 high, then copy) → story → testimonials stacked → newsletter stacked → footer (brand full row, 2-col links).

### 3.3 Collection — Desktop (1440)

Banner 300 high: left ice panel with breadcrumb, eyebrow, H1, 46ch description; right half dark artwork. Body: 240 sidebar + 3-col grid (gap 44 / 24), toolbar above grid (count left, sort select right), active filter chips row, “Showing X of Y” + progress + Load more (secondary) below the grid. **Empty state:** grey panel, H2, text, “Clear all filters” button.

### 3.4 Collection — Mobile (390)

Compact banner (text only). Toolbar: count on its own row; `Filters (n)` button and Sort select side by side (equal width). 2-col grid. Filters open the bottom sheet (§2).

### 3.5 Product page (frame to add under page 6)

Breadcrumb; 2 columns: gallery (76 px thumb rail + 4:5 main) / info (eyebrow, H1, demo rating, price, tax note, description, spec table with Material / Size / Style / Colour, quantity + Add to bag (lg) + Save). Related: `grey` band with 4-up grid. Mobile: gallery stacked with thumbs below the image.

### 3.8 Three.js Hero Experience (page 8)

Frames: **Desktop 1440 × 640**, **Mobile 390 × 450**, **Loading state**, **Fallback (no WebGL)**, **Reduced motion**.

- Background: `stage-night`, vignette to rgba(3,9,22,.55) at edges.
- Subject: silver round pendant (satin back disc Ø1.44, polished bezel ring, 18 beads, 8-facet blue gem, bail, link chain rising out of frame). Centre-right on desktop (x ≈ 62%), centre on mobile; ~45% of frame height.
- Orbital rings: two hairlines (desktop) / one (mobile), 1 px, #8FB4EE at 55% / #BCD3FA at 35%, tilted.
- Light: cool white soft boxes left and right, ring light top-back, blue floor bounce; one moving point light = “light sweep” (slow, 12 s cycle).
- Particles: 90 (mobile 36), 2 px, #CFE0FF at 65%.
- Motion notes (annotate): pendant sways ±31° over 16 s, 0.7 Hz-ish float of 5 cm; no spin past 60°; rings rotate 3°/s.
- States: Loading — fallback still + “Preparing the atelier…” (Inter 11.5 uppercase, +20%, pulsing); Fallback — still image + caption “Showing a still image: 3D is unavailable on this device.”; Reduced motion — single static frame.

## 4. Responsive rules (constraints)

Breakpoints: 700 (3-col grids), 900 (desktop header / hero 2-col), 1000 (filter sidebar), 1100 (4-col). Header: left/right zones `Left & Right`, logo `Centre`. Images: `Scale`/fill with 4:5 ratio lock. Test frames: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920.

## 5. Assets

All product artwork is original vector (see `src/components/ProductImage`) so there are no licensing issues; export each as SVG per product × 3 views (front, close-up, evening). Replace with licensed photography before launch (keep 4:5). No third-party 3D model is used; the pendant is generated from geometry.

## 6. Accessibility annotations

Contrast: navy on white 12.9:1, `text-soft` on white 4.9:1, white on navy 12.9:1. Focus ring 2 px royal, 3 px offset on all interactive elements. Icon-only buttons need labels (listed in the code). Motion: honour reduced-motion. Tap targets ≥ 40 px.
