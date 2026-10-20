# Cartesyx Studio — Frontend

Portfolio website for Cartesyx Studio. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

---

## Quick Start

```zsh
# Install dependencies
npm install

# Start local development server (with HMR)
npm run dev

# Run design token & anti-slop linter (must pass with 0 errors)
npm run check:design

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Media & CDN Delivery Guidelines

To ensure the website loads instantaneously for all visitors and mobile users:

1. **Cloudinary Video Optimization**:
   All external videos hosted on Cloudinary must include `/upload/f_auto,q_auto/` in the URL.
   - Example:
     `https://res.cloudinary.com/<cloud_name>/video/upload/f_auto,q_auto/v.../<video>.mp4`
   - `f_auto`: Automatically serves AV1/WebM for modern browsers, and H.264 for Safari.
   - `q_auto`: Dynamic edge compression to save bandwidth without visible loss.

2. **Video Posters**:
   Every `<video>` element must define a valid `.webp` poster (e.g. `/reel/poster.webp`). Cloudinary can auto-generate poster frames by appending `.webp` with `so_0,f_auto,q_auto`.

3. **Local Videos**:
   Videos stored inside `public/` must remain under 2MB. Use `-movflags +faststart` in ffmpeg so streaming begins at byte 0.

4. **Image Formats**:
   Use WebP or SVG. Non-critical images below the viewport should include `loading="lazy"` and `decoding="async"`.

---

## Deployment Guide

This project compiles to a static single-page application inside the `dist/` folder.

- **Vercel / Cloudflare Pages / Netlify**:
  - **Framework Preset**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Node Version**: 18+ (tested on Node 20 & 22)
