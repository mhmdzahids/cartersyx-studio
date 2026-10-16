---
version: alpha
name: Mobbin
description: |
  Mobbin's design system embodies a clean, content-focused aesthetic with a
  professional yet approachable tone. The brand prioritizes clarity and
  usability through restrained color choices, confident typography, and generous
  whitespace. The visual identity feels contemporary and minimal—a design
  library for design libraries—with strong emphasis on deep blacks and pure
  whites creating high contrast that guides the eye to featured content.
  Interactive elements use subtle color shifts and opacity changes rather than
  bold transformations, maintaining visual coherence across a vast library of
  mobile and web app screenshots.
source:
  url: "https://mobbin.com/"
  pagesAnalyzed: 1
  extractedAt: 2026-10-16
  tokensMeasured: true
colors:
  primary: "#141414"
  canvas: "#FFFFFF"
  surface-alt: "#404040"
  ink: "#141414"
  body: "#707070"
  muted: "#ADADAD"
typography:
  display-xl:
    fontFamily: saans
    fontSize: 80px
    fontWeight: 652
    lineHeight: 1
    letterSpacing: -0.6px
  display-lg:
    fontFamily: saans
    fontSize: 64px
    fontWeight: 652
    lineHeight: 1
    letterSpacing: -0.6px
  display-md:
    fontFamily: saans
    fontSize: 44px
    fontWeight: 652
    lineHeight: 1.09
    letterSpacing: -0.4px
  body-xl:
    fontFamily: saans
    fontSize: 24px
    fontWeight: 652
    lineHeight: 1.25
    letterSpacing: 0px
  body-lg:
    fontFamily: saans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0px
  body-md:
    fontFamily: saans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-md-strong:
    fontFamily: saans
    fontSize: 16px
    fontWeight: 456
    lineHeight: 1.38
    letterSpacing: 0.2px
  body-md-tight:
    fontFamily: saans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.38
    letterSpacing: 0.2px
  body-sm:
    fontFamily: saans
    fontSize: 14px
    fontWeight: 456
    lineHeight: 1.43
    letterSpacing: 0.2px
  caption-xs:
    fontFamily: saans
    fontSize: 12px
    fontWeight: 456
    lineHeight: 1.33
    letterSpacing: 0.2px
  caption-xs-strong:
    fontFamily: saans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0.2px
rounded:
  none: 0px
  xs: "20%"
  sm: "30%"
  md: 32px
  full: 9999px
spacing:
  xxs: 8px
  xs: 20px
  sm: 24px
  md: 32px
  lg: 40px
  xl: 44px
  xxl: 48px
  xxxl: 64px
  section: 80px
  band: 160px
borderWidths:
  thin: 1px
elevationStrategy: color-blocking
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#FFFFFF"
    surface: "#404040"
    surfaceRaised: "#3E3E3E"
    text: "#141414"
    textMuted: "#707070"
    border: "#E3E3E3"
    accent: "#141414"
    accentFg: "#FFFFFF"
    focusRing: "#141414"
    elevation: shadow
  dark:
    bg: "#0F0F0F"
    surface: "#1D1D1D"
    surfaceRaised: "#292929"
    text: "#F6F6F6"
    textMuted: "#9E9E9E"
    border: "#353535"
    accent: "#848484"
    accentFg: "#0B0B0C"
    focusRing: "#666666"
    elevation: "border+surface"
  contrastFailures:
    - "light: text on surface = 1.78:1 (needs 4.5:1)"
components:
  button-secondary:
    typography: "{typography.body-md-tight}"
    textColor: "{colors.ink}"
    height: 44px
    padding: "0px 16px 0px 16px"
    rounded: "{rounded.full}"
    backgroundColor: "rgba(64, 64, 64, 0.08)"
  button-primary:
    typography: "{typography.body-md-tight}"
    textColor: "{colors.canvas}"
    height: 44px
    padding: "0px 16px 0px 16px"
    rounded: "{rounded.full}"
    backgroundColor: "{colors.primary}"
  button-icon:
    typography: "{typography.display-xl}"
    textColor: "{colors.ink}"
    height: 68px
    rounded: "{rounded.xs}"
  card:
    typography: "{typography.body-md}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  navigation:
    typography: "{typography.body-md}"
    textColor: "{colors.ink}"
    height: 92px
    backgroundColor: "color(srgb 1 1 1 / 0.9)"
  footer:
    typography: "{typography.body-md}"
    textColor: "{colors.canvas}"
    padding: "160px 0px 40px 0px"
    backgroundColor: "{colors.primary}"
  link:
    typography: "{typography.body-md}"
    textColor: "{colors.ink}"
    padding: "40px 40px 40px 40px"
    rounded: 24px
    backgroundColor: "{colors.canvas}"
  link-sm:
    typography: "{typography.body-md-tight}"
    textColor: "{colors.ink}"
    padding: "0px 12px 0px 12px"
states:
  other-focus:
    target: other
    state: focus
    outline: "rgba(0, 0, 0, 0) solid 2px"
    outlineColor: "rgba(0, 0, 0, 0)"
    outlineWidth: 2px
  input-disabled:
    target: input
    state: disabled
    opacity: 1
  other-hover:
    target: other
    state: hover
    opacity: 1
  other-focus-visible:
    target: other
    state: focus-visible
    rounded: 8px
  button-focus-visible:
    target: button
    state: focus-visible
    outline: "currentcolor solid 2px"
    outlineColor: currentcolor
    outlineWidth: 2px
breakpoints:
  - width: 375
    containerWidth: 335
    gridColumns: 2
    navLinksVisible: 1
    menuToggleVisible: true
    headingPx: 40
    bodyPx: 16
    sectionPaddingX: 20
  - width: 768
    containerWidth: 728
    gridColumns: 3
    navLinksVisible: 7
    menuToggleVisible: false
    headingPx: 44
    bodyPx: 16
    sectionPaddingX: 20
  - width: 1024
    containerWidth: 984
    gridColumns: 3
    navLinksVisible: 7
    menuToggleVisible: false
    headingPx: 56
    bodyPx: 16
    sectionPaddingX: 20
  - width: 1280
    containerWidth: 1083
    gridColumns: 4
    navLinksVisible: 7
    menuToggleVisible: false
    headingPx: 80
    bodyPx: 16
    sectionPaddingX: 20
  - width: 1440
    containerWidth: 1045
    gridColumns: 4
    navLinksVisible: 7
    menuToggleVisible: false
    headingPx: 80
    bodyPx: 16
    sectionPaddingX: 20
coverage:
  statesFound: 39
  gradientsFound: 0
  rolesUnassigned: 0
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: false
  semanticRampDeclared: false
---

# Design System Inspired by Mobbin

## 1. Visual Theme & Atmosphere

Mobbin's design system embodies a clean, content-focused aesthetic with a professional yet approachable tone. The brand prioritizes clarity and usability through restrained color choices, confident typography, and generous whitespace. The visual identity feels contemporary and minimal—a design library for design libraries—with strong emphasis on deep blacks and pure whites creating high contrast that guides the eye to featured content. Interactive elements use subtle color shifts and opacity changes rather than bold transformations, maintaining visual coherence across a vast library of mobile and web app screenshots.

**Key Characteristics**
- High-contrast ink and canvas pairing (`{colors.primary}` and `{colors.canvas}`)
- Generous whitespace with structured section bands
- Pill-shaped primary buttons; sharp edges on links and badges
- Opacity-based hover and disabled states
- Deep black footer anchoring the page
- Precise typographic hierarchy with condensed letter-spacing on display sizes

## 2. Color Palette & Roles

### Primary
- **Primary / Brand / Ink** (`{colors.primary}` — `#141414`): Used for headings, primary CTAs ("Join for free" button), body text, and active states. The defining dark accent of the system, creating high contrast against white surfaces.

### Neutral Scale
- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Default page background and surface for content cards and containers.
- **Surface Alt** (`{colors.surface-alt}` — `#404040`): Alternating section band (e.g., footer background, secondary bands in listings).
- **Body** (`{colors.body}` — `#707070`): Mid-tone gray for body copy and descriptive text.
- **Muted** (`{colors.muted}` — `#ADADAD`): Lighter gray for captions, secondary labels, and de-emphasized content.

## 3. Typography Rules

### Font Family
Primary font: **Saans** — a modern geometric sans-serif with a fallback stack of system fonts.
```
font-family: "saans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display XL | Saans | 80px | 652 | 1.0 | −0.6px | Hero headline; extreme scale, ultra-condensed tracking |
| Display LG | Saans | 64px | 652 | 1.0 | −0.6px | Large page section headline |
| Display MD | Saans | 44px | 652 | 1.09 | −0.4px | Secondary headline, mid-tier call-outs |
| Body XL | Saans | 24px | 652 | 1.25 | 0px | Large emphasis body, subheadings |
| Body LG | Saans | 20px | 600 | 1.3 | 0px | Larger body text, highlights |
| Body MD (Tight) | Saans | 16px | 600 | 1.38 | 0.2px | Button labels, link text (leading link behavior) |
| Body MD (Strong) | Saans | 16px | 456 | 1.38 | 0.2px | Intermediate weight body copy |
| Body MD | Saans | 16px | 400 | 1.5 | 0px | Standard body copy, list items |
| Body SM | Saans | 14px | 456 | 1.43 | 0.2px | Smaller body text, annotations |
| Caption XS (Strong) | Saans | 12px | 600 | 1.33 | 0.2px | Emphasized caption, meta labels |
| Caption XS | Saans | 12px | 456 | 1.33 | 0.2px | Minimal text, footnotes, timestamps |

### Principles
- **Condensed Display:** Display sizes feature negative letter-spacing (−0.4px to −0.6px) creating a tight, premium typographic voice.
- **Weight Hierarchy:** Uses weights 652 (ultra-bold), 600 (semi-bold), 456 (medium), and 400 (regular) to establish visual rank without size changes alone.
- **Generous Line Height on Body:** Body copy maintains 1.3–1.5 line height for readability; display text compresses to 1.0 for visual impact.
- **Subtle Positive Tracking:** Smaller text (caption and body-sm) uses +0.2px letter-spacing for legibility at reduced scale.

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `{colors.primary}` (`#141414`)
- Text Color: `{colors.canvas}` (`#FFFFFF`)
- Font: `{typography.body-md-tight}` (16px, weight 600)
- Padding: 0px 16px (height 44px)
- Border Radius: `{rounded.full}` (9999px — pill shape)
- Box Shadow: none
- Line Height: 22px
- Example: "Join for free" CTA

**Secondary Button**
- Background: `rgba(64, 64, 64, 0.08)` (8% opacity on `{colors.surface-alt}`)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md-tight}` (16px, weight 600)
- Padding: 0px 16px (height 44px)
- Border Radius: `{rounded.full}` (9999px — pill shape)
- Box Shadow: none
- Line Height: 22px
- Example: "See plans" button

**Icon Button**
- Background: transparent (`rgba(0, 0, 0, 0)`)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.display-xl}` (80px, weight 652)
- Padding: 0px (square, 68px × 68px)
- Border Radius: `{rounded.xs}` (20%)
- Box Shadow: none
- Line Height: 80px
- Use: Social media icons, decorative buttons in hero

### Cards & Containers

**Card (Default)**
- Background: `{colors.canvas}` (`#FFFFFF`)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md}` (16px, weight 400)
- Padding: 0px (image-based card with overflow-hidden)
- Border Radius: `{rounded.md}` (32px)
- Box Shadow: none
- Dimensions: 576px × 384px (measured; responsive)
- Line Height: 24px
- Use: Screenshot preview cards, content galleries

**Link Container**
- Background: `{colors.canvas}` (`#FFFFFF`)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md}` (16px, weight 400)
- Padding: `{spacing.lg}` (40px all sides)
- Border Radius: `{rounded.sm}` (30%)
- Box Shadow: none
- Dimensions: 335px × 414.828px (mobile; responsive)
- Line Height: 24px
- Use: Category cards, navigation containers

### Inputs & Forms

**Input (Disabled State)**
- Opacity: 1.0 (disabled state does not reduce opacity)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md}` (16px, weight 400)
- Background: inferred white / transparent
- Border: 1px solid `{colors.muted}` (`#ADADAD`) — thin divider
- No specific focus state styling extracted; see Known Gaps

### Navigation

**Header Navigation (Default)**
- Background: `color(srgb 1 1 1 / 0.9)` (white at 90% opacity — slightly frosted)
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md}` (16px, weight 400)
- Padding: 0px (full viewport width)
- Border Radius: `{rounded.none}` (0px)
- Box Shadow: none
- Height: 92px
- Line Height: 24px
- Dimensions: 1440px width (desktop; responsive)
- Links: Visible at tablet and above; menu toggle at mobile breakpoint

**Footer Navigation (Default)**
- Background: `{colors.primary}` (`#141414`)
- Text Color: `{colors.canvas}` (`#FFFFFF`)
- Font: `{typography.body-md}` (16px, weight 400)
- Padding: `{spacing.band}` (160px) top, `{spacing.lg}` (40px) bottom, 0px horizontal
- Border Radius: `{rounded.none}` (0px)
- Height: 864.375px (measured; includes section content)
- Line Height: 24px
- Dimensions: 1440px width
- Use: Primary footer with category links, branding, and legal text

### Links

**Link (Text / Default)**
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md-tight}` (16px, weight 600, 0.2px letter-spacing)
- Text Decoration: none (underline inferred from context)
- Padding: 0px
- Border Radius: `{rounded.none}` (0px)
- Hover: opacity shifts; no background change for inline links

**Link (Small / Compact)**
- Text Color: `{colors.primary}` (`#141414`)
- Font: `{typography.body-md-tight}` (16px, weight 600, 0.2px letter-spacing)
- Padding: 0px 12px (height 44px, aligned as touch target)
- Border Radius: `{rounded.none}` (0px)
- Box Shadow: none
- Line Height: 22px
- Use: Filter links, category tags, secondary navigation

## 5. Layout Principles

### Spacing System
Base unit: 8px. Scale applied consistently across padding, margins, and gaps.
- **Tight spacing:** `{spacing.xxs}` (8px) — component internal gaps
- **Compact:** `{spacing.xs}` (20px) — padding within containers; section padding on mobile
- **Comfortable:** `{spacing.sm}` (24px) — vertical gaps between list items
- **Standard:** `{spacing.md}` (32px) — horizontal content padding on tablet
- **Generous:** `{spacing.lg}` (40px) — card padding, large margin top/bottom
- **Large:** `{spacing.xl}` (44px) — offset sections
- **Extra Large:** `{spacing.xxl}` (48px) — prominent spacing
- **Massive:** `{spacing.xxxl}` (64px) — display section gaps
- **Page Section:** `{spacing.section}` (80px) — vertical rhythm between major sections
- **Band Width:** `{spacing.band}` (160px) — hero and footer top padding for emphasis

### Grid & Container
- **Desktop (1280px+):** 4-column layout, 1083px content width, 20px section padding-x
- **Tablet (768px–1024px):** 3-column layout, 728px content width, 20px section padding-x
- **Mobile (375px):** 2-column layout, 335px content width, 20px section padding-x
- **Max Container Width:** 1083px (measured on 1280px viewport)
- **Responsive Behavior:** Content width stays fixed; horizontal padding adjusts. Header spans full viewport.

### Whitespace Philosophy
Whitespace is a primary design tool. Hero section uses `{spacing.band}` (160px) top padding to establish breathing room. Section separators leverage neutral background shifts (e.g., alternating `{colors.canvas}` and `{colors.surface-alt}`) rather than divider lines. Card galleries use consistent gaps to create rhythm without visual noise.

### Border Radius Scale
- **None:** `{rounded.none}` (0px) — buttons, links, footer, header (sharp architectural edges)
- **Extra Small:** `{rounded.xs}` (20% — 13px on 68px element) — icon buttons
- **Small:** `{rounded.sm}` (30% — ~17px on 56px element) — image thumbnails, link containers
- **Medium:** `{rounded.md}` (32px) — screenshot cards, modular content boxes
- **Full:** `{rounded.full}` (9999px) — pill-shaped primary and secondary buttons, avatars

### Border Widths
- **Thin:** 1px (divider lines, input borders, minimal visual weight)

## 6. Depth & Elevation

The design system prioritizes **color-blocking** for depth; elevation is achieved through background color shifts rather than shadows.

| Level | Treatment | Use |
|---|---|---|
| Base (Flat) | `{colors.canvas}` (`#FFFFFF`) background | Cards, content surfaces, default state |
| Secondary Band | `{colors.surface-alt}` (`#404040` / dark gray) background | Alternating sections, footer, visual separation |
| Inverse (Darkest) | `{colors.primary}` (`#141414`) background | Footer, dark overlays, maximum contrast |

**Elevation Philosophy:**
Box shadows are absent from the extracted component data—the system relies entirely on color contrast. The footer's dark background (`{colors.primary}`) elevates it visually; card containers use `{rounded.md}` to signal containment. This creates a clean, print-like aesthetic with minimal visual depth.

### Opacity Levels
Opacity shifts are used for subtle state changes and visual hierarchy:
- **8% opacity** (0.08) — Light overlay or disabled tint
- **16% opacity** (0.16) — Secondary emphasis, hover state
- **27% opacity** (0.27) — Moderate accent overlay
- **40% opacity** (0.40) — Half-tone overlay
- **54% opacity** (0.54) — Medium emphasis
- **92% opacity** (0.92) — Near-opaque (header frosted glass effect uses 90%)

### Z-index / Layering
- **Base Layer (z: 1–3):** Default content, cards, sections
- **Dropdown Layer (z: 10–99):** Navigation menus, filter panels, overlays (z: 10, 72, 83, 99 variants for stacking context)
- **Modal Layer (z: 9999):** Full-screen overlays, modal dialogs, top-most interaction surface

## 7. Do's and Don'ts

### Do
- Use the pill-shaped button (`{rounded.full}`) for all primary and secondary CTAs; it is Mobbin's signature interaction element.
- Maintain strong contrast between `{colors.primary}` and `{colors.canvas}` for accessibility and visual hierarchy.
- Apply opacity shifts (8%, 16%, 27%, 40%) for hover, focus, and disabled states rather than color changes.
- Leverage `{spacing.section}` (80px) to separate major content areas; use `{spacing.band}` (160px) for hero and footer emphasis.
- Use `{rounded.md}` (32px) for content cards to signal modularity; `{rounded.none}` (0px) for top-level layout (header, footer).
- Keep typography weight-driven; use 652 for display, 600 for emphasis, 400 for body.
- Apply negative letter-spacing (−0.4px to −0.6px) on display text to reinforce premium typographic voice.
- Use color-blocking (background shifts) instead of shadows for depth signaling.

### Don't
- Add shadows or blur to buttons, cards, or containers; Mobbin's system relies on color contrast and shape.
- Use a gradient or mesh background; the system maintains solid color blocks only.
- Round button edges beyond 9999px (pill); sharp or 32px corners signal content containers, not actions.
- Reduce opacity on disabled inputs below 100%; the system keeps disabled elements fully opaque and relies on color/text shifts.
- Mix serif or script fonts; Saans is the only typeface used across the entire system.
- Apply letter-spacing on body text above +0.2px; body hierarchy depends on size and weight, not tracking.
- Use decorative icons or emojis in place of semantic UI (buttons, links); icon buttons are reserved for social/utility actions only.

## 8. Responsive Behavior

### Breakpoints

| Viewport | Content Width | Grid Columns | Nav Links Visible | Menu Toggle | Display Heading | Body Text | Section Padding-X |
|---|---|---|---|---|---|---|---|
| 375px (Mobile) | 335px | 2 | 1 link | yes | 40px (`display-md`) | 16px | 20px |
| 768px (Tablet) | 728px | 3 | 7 links | no | 44px (`display-md`) | 16px | 20px |
| 1024px (Tablet L) | 984px | 3 | 7 links | no | 56px (measured; intermediate) | 16px | 20px |
| 1280px (Desktop) | 1083px | 4 | 7 links | no | 80px (`display-xl`) | 16px | 20px |
| 1440px (Desktop L) | 1045px | 4 | 7 links | no | 80px (`display-xl`) | 16px | 20px |

### Touch Targets
- **Button Height:** 44px (primary, secondary, small links) — exceeds WCAG AA minimum of 44×44px
- **Icon Button:** 68px × 68px (social media, utility icons) — generous tap area
- **Card Tap Zone:** Full card surface clickable; 576px × 384px desktop, responsive down to mobile
- **Link Padding:** 12px horizontal on compact links to expand touch zone

### Collapsing Strategy
- **Mobile (< 768px):** Single-column or 2-column grid; display heading shrinks to 40px; header nav collapses into menu toggle; section padding stays 20px.
- **Tablet (768px–1024px):** 3-column grid activates; display heading increases to 44px; full nav visible (7 links); content width expands to 728px.
- **Desktop (1024px+):** 4-column grid; display heading reaches 80px; full horizontal nav maintained; content width maxes at 1083px.
- **Padding Consistency:** Section padding-x remains 20px across all breakpoints; vertical spacing scales with `{spacing.section}` and `{spacing.band}` tokens.

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Primary / Brand / Ink (`{colors.primary}` — `#141414`)
- **Page Background:** Canvas (`{colors.canvas}` — `#FFFFFF`)
- **Heading Text:** Primary / Brand / Ink (`{colors.primary}` — `#141414`)
- **Body Text:** Body (`{colors.body}` — `#707070`)
- **Secondary Text / Captions:** Muted (`{colors.muted}` — `#ADADAD`)
- **Section Alt Band:** Surface Alt (`{colors.surface-alt}` — `#404040`)
- **Footer Background:** Primary / Brand / Ink (`{colors.primary}` — `#141414`)

### Iteration Guide

1. **All buttons are pill-shaped.** Primary buttons use `{colors.primary}` background with `{colors.canvas}` text (16px, weight 600). Secondary buttons use 8% tinted `{colors.surface-alt}` background with `{colors.primary}` text. Both measure 44px tall with 9999px border-radius.

2. **Typography always uses Saans.** Display sizes (80px, 64px, 44px) use weight 652 and negative letter-spacing (−0.6px, −0.4px). Body sizes (24px, 20px, 16px, 14px, 12px) scale with weights 652, 600, 456, 400 and 0 or +0.2px letter-spacing.

3. **Cards and containers use color-blocking.** Content cards sit on `{colors.canvas}` with 32px border-radius. Footer uses `{colors.primary}` background. Depth comes from background shifts, never shadows.

4. **Spacing is grid-based on 8px.** Section gaps use `{spacing.section}` (80px); hero/footer emphasis uses `{spacing.band}` (160px). Card padding uses `{spacing.lg}` (40px). Consistent gaps create visual rhythm.

5. **Opacity powers interactivity.** Hover states shift elements to 70–80% opacity or add 8–16% tinted overlays. Disabled states remain 100% opaque but with muted text color. Focus states use a 2px transparent outline.

6. **Responsive grids collapse predictably.** At 768px, menu toggle disappears and nav links become visible (7 links max). At 375px, menu toggle reappears; grid drops to 2 columns. Content width scales; section padding-x stays 20px throughout.

7. **Interaction focus has minimal visual feedback.** Buttons and links show transparent 2px outline on focus. Hover applies opacity or background tint. Active states deepen the tint. No color shifts or shadows; consistency with flat aesthetic.

## 10. Known Gaps

- **No error/success/warning colors defined.** The extraction found no semantic status palette; the site does not expose error, success, or warning color roles. Any warning/error UI should reuse primary or muted colors with semantic text labels.
- **No gradients or decorative meshes observed.** Backgrounds are solid color blocks throughout; no background images or gradient overlays were detected in the measured styles.
- **Hover, active, focus, and disabled states are partially inferred.** The extraction captured CSS rulesets for these states, but not all interaction paths on the page may have been visited. Mobile touch states and keyboard focus behaviors may differ from documented CSS.
- **Surfaces behind authentication not visited.** The design system may have additional component styles in logged-in areas; this analysis covers only the public landing page.
- **Shadow/elevation strategies not present.** No box-shadow values were extracted; the system appears to rely entirely on color-blocking and shape for depth signaling. Any 3D lift or glassmorphism effects are absent from the measured data.
- **Gradation of interactive states unclear.** While opacity shifts are defined (0.7, 0.8, 8%, 16%, etc.), the exact application to each component variant (button hover vs. link hover vs. card hover) may vary beyond what was measured.
- **Typography role coverage incomplete.** Display size 56px (measured on 1024px viewport) was not formalized as a token; it may be a hybrid or intermediate size not consistently applied across all breakpoints.
- **Animations and transitions not captured.** No animation durations, easing functions, or transition timings were extracted. Interactions may include subtle motion not visible in static screenshots.