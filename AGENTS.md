# Agent Instructions
1. Design authority: DESIGN.cartesyx.md > DESIGN.md > antislop skills.
2. Run `npm run check:design` before and after any UI change. Must pass.
3. No gradients, no shadows (except --shadow-window), no blur, one font (Geist).
4. No uppercase-tracking labels. Sentence or title case only.
5. All layout/geometry values for Services must come from DESIGN.cartesyx.md.
6. Check accessibility: prefers-reduced-motion, keyboard focus, contrast.
7. Media & CDN rules:
   - External videos on Cloudinary MUST include `/upload/f_auto,q_auto/` in the URL path for edge caching and dynamic format compression (AV1/WebM/MP4).
   - All `<video>` elements MUST provide a valid `.webp` poster to prevent layout shift and blank delay.
   - Local videos in `public/` must remain lightweight (< 2MB) with `+faststart` flag.
   - Non-critical images below the fold must use `loading="lazy" decoding="async"`.
