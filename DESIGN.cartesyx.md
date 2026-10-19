# Cartesyx Studio Design System Specification

> Single source of truth for Cartesyx Studio. Overrides `DESIGN.md` (the mobbin.com reference) and all other guidelines.

---

## 1. Design Thesis

"Flat tints, geometric precision, single typeface, subtle motion — content-forward design inspired by mobbin.com, with zero decorative slop."

---

## 2. Absolute Rules (No Exceptions)

1. **Single Typeface**:
   - Only **Geist Sans** (`@fontsource-variable/geist`, font family: `"Geist Variable", "saans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
   - Monospace (`font-mono`) is banned.
   - Secondary typefaces (`font-serif`, etc.) are banned.
2. **No Gradients Anywhere**:
   - All backgrounds and accents must be flat solid colors or translucent tints.
   - *Single documented exception*: WebKit video clipping bug workaround (`-webkit-mask-image: -webkit-radial-gradient(white, black); /* allow-gradient: safari-mask */`) in `src/tokens.css`.
3. **No Shadows Anywhere**:
   - General drop shadows, elevation shadows, and glow filters are banned.
   - *Single documented exception*: `--shadow-window: 0 10px 30px rgba(20, 20, 20, 0.08);` on `.site-window` in light mode only (`--shadow-window: none;` in `.dark`).
4. **No Blur / Backdrop-Blur**:
   - `backdrop-blur-*` and `filter: blur(...)` are banned. Surfaces must remain crisp, flat, and legible. (Sticky header backdrop blur is permitted via escape hatch `/* design-ok: sticky nav backdrop-blur */`).
5. **No Uppercase Tracking-Widest Style**:
   - Labels and headers must use natural Sentence case or Title case.
   - Banned: `uppercase` combined with `tracking-widest` or `tracking-wider`.
6. **Radius Palette (Exactly 4 Values)**:
   - **Card Radius**: `clamp(20px, 6.2cqw, 32px)` (mobile ~20px to 24px, desktop up to 32px; used on `.service-mobbin-card` and `ProjectCard`).
   - **Media Radius (Phone Screens)**: `clamp(14px, 12.5cqw, 24px) clamp(14px, 12.5cqw, 24px) 0 0` (top corners only; flush with card bottom; used on `.screen-media__screen` in Video Editing and Web Dev carousel).
   - **Window Radius (Desktop Windows)**: `clamp(12px, 3.5cqw, 20px)` (all 4 corners; used on `.site-window` in Motion Graphics and Visual Design).
   - **Badge / Pill Radius**: `9999px` (fully rounded; used on `.btn-pill`, filter pills, and interactive buttons).
7. **Color System**:
   - **Ink**: Light `#141414` | Dark `#F6F6F6`
   - **Canvas**: Light `#FFFFFF` | Dark `#0F0F0F`
   - **Surface Alt**: Light `#404040` | Dark `#1D1D1D`
   - **Surface Tint (Cards)**: Light `rgba(64, 64, 64, 0.08)` | Dark `rgba(255, 255, 255, 0.08)`
   - **Surface Tint Hover**: Light `rgba(64, 64, 64, 0.16)` | Dark `rgba(255, 255, 255, 0.16)`
   - **Card Hover Tint**: Light `rgba(64, 64, 64, 0.12)` | Dark `rgba(255, 255, 255, 0.12)`
   - **Body Text**: Light `#707070` | Dark `#9E9E9E`
   - **Muted Text / Placeholder**: Light `#ADADAD` | Dark `#666666`
   - **Border**: Light `#E3E3E3` | Dark `#353535`
   - **Focus Ring**: Light `#141414` | Dark `#848484`
   - **Brand Accent (Coral)**: `#FF4B1F`
   - **Service Soon Text**: Light `#595959` | Dark `#9E9E9E`

---

## 3. Typography Scale Table

| Token Name | Size (Mobile `<768px`) | Size (Desktop `≥768px`) | Weight | Line Height | Letter Spacing | Used For |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 Hero** (`.type-display-hero`) | `32px` | `44px` (`≥1024px`: `80px`) | `560` | `1.08` (`1.0` at `80px`) | `-0.4px` (`-0.6px`) | Primary page headline |
| **H2 Section** (`.type-display-section`) | `26px` | `36px` (`≥1024px`: `44px`) | `560` | `1.15` (`1.09` at `44px`) | `-0.4px` | Section titles (Services, Selected Work) |
| **Card Label** (`.type-service-card-label`) | `20px` (`--label-size`) | `20px` (`--label-size`) | `500` (`--label-weight`) | `1.2` (`~24px` box) | `0px` | Services card labels (all 4 cards) |
| **Body MD** (`.type-body`, `.type-body-md`) | `16px` | `16px` | `400` | `1.5` | `0px` | Standard narrative copy & descriptions |
| **Badge "Soon"** | `13px` | `13px` | `500` | `1.2` | `0px` | Service card status suffix (baseline aligned) |
| **Button Pill** (`.btn-pill`) | `15px` | `16px` (`≥1024px`) | `500` | `1.38` | `0.2px` | Pill action buttons and filter bar tabs |
| **Meta / Caption** (`.type-meta`) | `14px` | `14px` | `400` | `1.4` | `0.2px` | Project metadata, tags, timecodes |

> **Note on Variable Weights**: Geist Variable supports continuous weights 100-900. We standardize on:
> - `400`: Regular body
> - `500`: Medium (labels, buttons, titles, subtitles, badges)
> - `560`: Display optical weight (matches visual density of Saans 652 on Mobbin)
> - `600`: Semibold
> - `700`: Bold
> *(Weight `450` was an intermediate optical weight and is retired).*

---

## 4. Services Card Geometry Specification

### 4.1 Mobile Specification (`< 768px`)
- **Card Container**: Full container width (e.g. 350px width at 390px viewport, 335px at 375px viewport).
- **Aspect Ratio**: `350 / 331` (ratio `1.057 : 1` width : height).
- **Card Height**: Equal across all 4 cards (`331px` when card width is `350px`).
- **Padding-Top**: `24px` to the label line box.
- **Label Line Box**: `20px` font size * `1.2` line height = `24px` height.
- **Label-to-Media Row Gap**: `max(32px, calc(23.4cqw - 48px))` (always `≥ 32px`).
- **Media Top Offset**: `~80px - 83px` from card top.
- **Card Corner Radius**: `clamp(20px, 6.2cqw, 32px)`.
- **Card-to-Card Gap**: `20px` (`gap-5`).

### 4.2 Desktop Specification (`≥ 768px`)
- **Layout**: 2x2 grid (`grid-cols-2`).
  - Row 1: `Video Editing` (left) | `Web Development` (right)
  - Row 2: `Visual Design` (left) | `Motion Graphics` (right)
- **Aspect Ratio**: `5 / 4` (width : height).
- **Card Padding-Top**: `24px`.
- **Label-to-Media Row Gap**: `32px`.
- **Media Top Offset**: `~78px - 80px`.
- **Card-to-Card Gap**: `24px` (`gap-6`).

### 4.3 Card Breakdown

| Order | Card Name | Media Component | Data Source | Media Aspect Ratio | Unique Behavior |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | **Video Editing** | `<ScreenMedia>` | `SERVICES_DATA[0]` | Phone `9:14` wrapper, `9:16` video | Autoplays muted on scroll/intersection; pauses when off-screen or prefers-reduced-motion; clicking the video does nothing (no visible play button). Width: 45% mobile, 41% desktop. |
| **2** | **Web Development** | `<WebDevCarousel>` | `src/data/webSlides.ts` | Phone `9:14` wrappers, `9:16` content | Smooth, continuous infinite marquee to the left; duplicate set for continuous loop; does **NOT** pause on hover; pauses on touch-hold, keyboard focus, off-screen, or accessible button. |
| **3** | **Visual Design** | `<SiteWindowMedia>` | `src/data/siteCards.ts` | Desktop window `16:10` | Floating browser window (not cropped at bottom) with `--shadow-window` (light mode); looping video preview. |
| **4** | **Motion Graphics** | `<SiteWindowMedia>` | `src/data/siteCards.ts` | Desktop window `16:10` | Floating browser window with looping video preview; linked card navigating to `#work` with Motion filter. |

---

## 5. Accessibility Commitments

1. **Contrast Minimums (WCAG AA)**:
   - Normal text (`≥ 4.5:1`):
     - Light `#141414` on `#FFFFFF` = **16.0 : 1**
     - Light `#707070` on `#FFFFFF` = **4.6 : 1**
     - Dark `#F6F6F6` on `#0F0F0F` = **17.5 : 1**
     - Dark `#9E9E9E` on `#0F0F0F` = **7.5 : 1**
   - Large text / UI elements (`≥ 3.0:1`):
     - Focus rings and borders exceed 3.0:1.
2. **Motion Safety**:
   - All animated elements strictly observe `prefers-reduced-motion: reduce`.
   - In reduced motion mode: marquee halts into a horizontal scrollable rail, video loop transitions disable, CSS transitions collapse to `0.01ms`.
3. **Keyboard Navigation & Focus**:
   - All interactive cards, links, and buttons are keyboard reachable.
   - High-contrast `:focus-visible` ring: `2px solid var(--color-focus-ring)` with `2px` or `8px` offset.
   - Marquee includes a hidden keyboard-accessible toggle button (`.marquee-pause-button`) visible only upon `:focus-visible`.
4. **Screen Reader Semantics**:
   - Decorative media and duplicated marquee sets have `aria-hidden="true"` and `inert`.
   - Informative media has explicit `aria-label` or `alt`.
   - Cards include screen-reader-only descriptive summaries (`.sr-only`) linked via `aria-describedby`.

---

## 6. Dark Mode Strategy

- **Implementation**: Class-based theme toggle via `.dark` on `document.documentElement`.
- **Tint Inversion**:
  - Light canvas `#FFFFFF` $\to$ Dark canvas `#0F0F0F`.
  - Light ink `#141414` $\to$ Dark ink `#F6F6F6`.
  - Light surface tint `rgba(64,64,64,0.08)` $\to$ Dark surface alt `#1D1D1D` with border `1px solid #353535`.
  - Light card border `transparent` $\to$ Dark card border `1px solid var(--color-border)` (`#353535`).
  - Light window shadow `0 10px 30px rgba(20,20,20,0.08)` $\to$ Dark window shadow `none` (clean 1px `#353535` border).

---

## 7. Anti-Slop Checklist for Agents

Before committing any UI code, verify:
- [ ] **No Random Radii**: Only use the 4 approved radii (`clamp(20px, 6.2cqw, 32px)`, `clamp(14px, 12.5cqw, 24px) ...`, `clamp(12px, 3.5cqw, 20px)`, `9999px`).
- [ ] **No Shadows**: No `shadow-*` utility classes or CSS `box-shadow` (except `--shadow-window`).
- [ ] **No Gradients**: No `bg-gradient-*`, `linear-gradient`, or `radial-gradient` (except Safari mask bug).
- [ ] **No Blur**: No `backdrop-blur-*` or CSS `blur()` (except approved header escape hatch).
- [ ] **No Banned Words**: No AI marketing filler ("seamless", "delve", "tapestry", "testament", "elevate", "leverage", "robust", "bespoke", "game-changer", "revolutionary").
- [ ] **No Uppercase + Widest Tracking**: Labels must use standard sentence or title case.
- [ ] **Check Script Passes**: `npm run check:design` passes with 0 errors.

---

## 8. File Manifest

| File Path | Governed Design Decisions |
| :--- | :--- |
| `src/tokens.css` | All design tokens (colors, radii, weights, label tokens, shadow tokens, component geometry classes). |
| `src/components/Services.tsx` | Services section container, header, responsive grid (`grid-cols-1 md:grid-cols-2`), card order. |
| `src/components/ServiceCard.tsx` | Card shell for Visual Design & Motion Graphics, portfolio linking, "Soon" badge alignment. |
| `src/components/VideoEditingCard.tsx` | Video Editing card shell, responsive wrapper width clamp, autoplay and intersection observer. |
| `src/components/WebDevCard.tsx` | Web Development card shell, marquee pause event handlers, keyboard pause toggle. |
| `src/components/WebDevCarousel.tsx` | Web Development infinite marquee implementation, duplicate loop set, reduced motion fallback. |
| `src/components/SiteWindowMedia.tsx` | Floating 16:10 landscape browser window component, video poster, and responsive scaling. |
| `src/components/ui/ScreenMedia.tsx` | Shared phone screen unit with top-corner radius clamp and Safari mask workaround. |
| `src/data/siteCards.ts` | Data source for site window media assets. |
| `src/data/webSlides.ts` | Data source for web development carousel slides. |
| `scripts/check-design.mjs` | Automated CI design linter enforcing tokens, typography, and anti-slop rules. |

---

## 9. Deviation Log

1. **Site Window Shadow (`--shadow-window`)**:
   - **Line**: `src/tokens.css` line 86 (`--shadow-window: 0 10px 30px rgba(20, 20, 20, 0.08);`) and line 632 (`box-shadow: var(--shadow-window);`).
   - **Reason**: Mobbin's "Sites" reference card uses a soft, diffuse window shadow to elevate the floating browser window above the tinted card surface in light mode. In dark mode, `--shadow-window: none;` is used to prevent muddy glows.
2. **Safari Mask Gradient (`/* allow-gradient: safari-mask */`)**:
   - **Line**: `src/tokens.css` line 602 (`-webkit-mask-image: -webkit-radial-gradient(white, black); /* allow-gradient: safari-mask */`).
   - **Reason**: WebKit/Safari engine bug where `border-radius` with `overflow: hidden` fails to clip hardware-accelerated `<video>` textures.

---

## 10. Known Discrepancies (Mobbin Reference vs Implementation)

1. **Infinite Continuous Marquee vs Manual Swipe**:
   - Mobbin "Flows" card uses a manual swipe touch scroller. Cartesyx Studio implements a continuous infinite marquee moving to the left, with hover pause removed per user specification (pauses only on touch hold, keyboard focus, off-screen, or toggle button).
2. **Video Click Behavior**:
   - In Cartesyx Studio, clicking the video on the "Video Editing" card intentionally does nothing (no visible play/pause button, clicks ignored per user specification).
3. **Desktop 768px Label-to-Media Gap**:
   - With label size at 20px (line box 24px) across all viewports and media top at 78px on desktop, at 768px viewport width the card padding (24px) + label box (24px) = 48px, yielding a gap of $78\text{px} - 48\text{px} = 30\text{px}$ (2px under 32px). As instructed, media position is maintained at 78px to preserve exact Mobbin visual proportion without jumping.
4. **Data File Architecture**:
   - Services data is partitioned cleanly into `SERVICES_DATA` (`Services.tsx`), `siteCards.ts`, and `webSlides.ts` for clean separation of concerns.

---

## 11. Verification Recipe

Before shipping any change:
1. `npm run check:design` — Verifies 0 design rule violations.
2. `npm run lint` — Verifies 0 linter warnings or errors.
3. `npm run build` — Verifies clean production bundle compilation.
4. Visual/Playwright verification at 375, 390, 768, 1024, and 1440px viewports.

---

## 12. Change Policy

1. Any proposed design token change **MUST** update `DESIGN.cartesyx.md` first.
2. Never introduce an inline style with raw colors, font sizes, or font weights.
3. Never add drop shadows, background gradients, or blur outside documented deviations.
4. All future agents must treat `DESIGN.cartesyx.md` as the supreme design authority.
