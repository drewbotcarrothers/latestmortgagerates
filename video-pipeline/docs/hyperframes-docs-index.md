# HyperFrames Documentation Index

> Source: https://hyperframes.mintlify.app/llms.txt

## Quick Links

- [Quickstart](https://hyperframes.mintlify.app/quickstart.md)
- [Prompt Guide](https://hyperframes.mintlify.app/guides/prompting.md)
- [GSAP Animation](https://hyperframes.mintlify.app/guides/gsap-animation.md)
- [Rendering](https://hyperframes.mintlify.app/guides/rendering.md)
- [HTML Schema Reference](https://hyperframes.mintlify.app/reference/html-schema.md)
- [Common Mistakes](https://hyperframes.mintlify.app/guides/common-mistakes.md)
- [Performance](https://hyperframes.mintlify.app/guides/performance.md)
- [Video Editor Cheatsheet](https://hyperframes.mintlify.app/guides/video-editor-cheatsheet.md)

## Useful Blocks (Pre-built Components)

- **Data Chart** — Animated bar + line chart with staggered reveal
- **Logo Outro** — Cinematic logo reveal with glow bloom + tagline
- **YouTube Lower Third** — Subscribe overlay with avatar
- **macOS Notification** — Notification banner overlay
- **Grain Overlay** — Film grain texture
- **Shimmer Sweep** — Light sweep for premium reveals
- **Spotify Now Playing** — Music card overlay
- **Instagram Follow / TikTok Follow** — Social follow overlays
- **X Post Card / Reddit Post Card** — Social post overlays

## Transitions

- Flash Through White, Cinematic Zoom, Glitch, Light Leak
- Whip Pan, Swirl Vortex, Ripple Waves
- 3D Transitions, Blur Transitions, Dissolve Transitions
- Scale Transitions, Push Transitions, Radial Transitions

## Key Concepts

1. **Compositions** — HTML files with timed elements
2. **Data Attributes** — `data-start`, `data-duration`, `data-track-index`
3. **Frame Adapters** — Bring your own animation runtime
4. **Deterministic Rendering** — Same input = identical output
5. **GSAP Timeline** — Must use `{ paused: true }` + register on `window.__timelines`

## Requirements

- Node.js 22+
- FFmpeg
- npm or bun

## CLI Commands

```bash
npx hyperframes init my-video          # Create project
npx hyperframes preview                # Dev server with hot reload
npx hyperframes render --output out.mp4 # Render to MP4
```

## Project Structure

```
my-video/
├── meta.json          # Project metadata
├── index.html         # Root composition
├── compositions/      # Sub-compositions
└── assets/           # Media files
```

## Three Rules for Compositions

1. **Root element**: must have `data-composition-id`, `data-width`, `data-height`
2. **Timed elements**: need `data-start`, `data-duration`, `data-track-index`, and `class="clip"`
3. **GSAP timeline**: created with `{ paused: true }`, registered on `window.__timelines`
