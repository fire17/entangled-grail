# Immaterial Fornebu

Generative 3D art visualizer that creates unique procedural geometric compositions seeded by cryptographic hashes. Each visualization is a one-of-a-kind artwork deterministically derived from token data, featuring flowing ribbons, layered gradients, and dynamic mesh transformations.

![Immaterial Fornebu — live generation](media/hero.gif)

## Preview

Six curated generations (each seeded by a different token hash):

| | | |
|---|---|---|
| ![pink and red](media/pink-red.png) | ![yellow](media/yellow.png) | ![dense red](media/dense-red.png) |
| ![green with frame](media/green-frame.png) | ![blue beige](media/blue-beige.png) | ![white and black](media/white-black.png) |

**Motion clips** (the meshes flow continuously — every page load with no `hash` param is a brand-new generation):

- [Montage — 8 generations back-to-back, ~48s](media/montage.mp4)
- Individual ~6s clips: [pink-red](media/clips/clip-pink-red.mp4) · [yellow](media/clips/clip-yellow.mp4) · [dense-red](media/clips/clip-dense-red.mp4) · [green-frame](media/clips/clip-green-frame.mp4) · [blue-beige](media/clips/clip-blue-beige.mp4) · [white-black](media/clips/clip-white-black.mp4) · [random #1](media/clips/clip-random-1.mp4) · [random #2](media/clips/clip-random-2.mp4)

## What it is

This is a browser-based generative art engine that transforms cryptographic hashes into mesmerizing 3D visualizations. Given any hash (typically from NFT token data), it produces a unique composition with procedurally-generated meshes, flowing geometry, and carefully curated color gradients. Perfect for on-chain art, generative collectibles, or interactive gallery experiences.

### Stack
- **Language(s):** JavaScript (ES6+)
- **Framework / runtime:** Vanilla JavaScript + Three.js r124 (WebGL/3D graphics)
- **Notable libraries:** 
  - Three.js — 3D scene management, mesh generation, WebGL rendering
  - Tweakpane 3.1.8 — interactive parameter tuning UI
  - SFC32 PRNG — deterministic seeding from hash for reproducible randomness

## How it's organized

```
index.html             Main visualization entry point; loads Three.js bundle
fornebu.html          Gallery wrapper with auto-refresh; loads index.html in iframe
features-script.js    Feature generator; derives visual parameters from token hash
bundle.min.js         Compiled Three.js scene renderer (55+ KB minified)
three.r124.min.js     Three.js library (653 KB minified)
.gitignore            Standard git ignore rules
```

**How it fits together:**

1. **Hash input** — User provides a token hash (via URL query param or random generation).
2. **Feature derivation** — `features-script.js` seeds a deterministic PRNG from the hash, then generates scene parameters: gradient indices, mesh complexity, rotation angles, colors, and transformations.
3. **3D rendering** — `index.html` loads the scene into Three.js and renders it to a WebGL canvas, applying the derived parameters to procedurally-generated geometry.
4. **Gallery mode** — `fornebu.html` wraps the visualization in an iframe and auto-refreshes at a configurable interval for gallery/display use.

## How to run it

### Quick start

1. Clone the repository:
   ```bash
   git clone https://github.com/bgstaal/immaterial-fornebu.git
   cd immaterial-fornebu
   ```

2. Serve locally (any HTTP server will do):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or with Node http-server
   npx http-server
   ```

3. Open in browser:
   - Main visualizer: `http://localhost:8000/index.html`
   - Gallery with auto-refresh: `http://localhost:8000/fornebu.html`

> **Note:** `index.html` imports `goerli-hashes.js` (curated hash list for Arrow-Up/Down navigation) and `tweakpane-3.1.8.js` (dev tuning UI). This repo ships a minimal `goerli-hashes.js` with the curated hashes and a no-op Tweakpane stub so the page and its `?hash=` parameter work out of the box — swap in the full originals if you have them.

### URL parameters

**For `index.html`:**
- `hash` — Hex hash to visualize (e.g., `?hash=0x123abc...`). If omitted, generates a random hash.
- `aspectRatio` — Override canvas aspect ratio (default: `0.1875` for 16:1 ultra-wide).
- `scale` — Scale multiplier for output (default: `1`).

**For `fornebu.html`:**
- `interval` — Refresh interval in seconds (default: `180`). Use `?interval=30` for 30-second updates.
- `ratio` — Aspect ratio passed to embedded iframe (default: `0.1875`).
- `scale` — Scale multiplier passed to iframe (default: `1`).

### Example workflows

**View a specific token:**
```
http://localhost:8000/index.html?hash=0xccc47817901deb20d9405e17c2ad371d6c77d1065a7d7caac38bad554b4214aa
```

**Gallery display (auto-refresh every 2 minutes):**
```
http://localhost:8000/fornebu.html?interval=120
```

**Ultra-wide gallery display with custom refresh:**
```
http://localhost:8000/fornebu.html?interval=60&ratio=0.1875&scale=1.5
```

## Rendering clips & images programmatically

A companion CLI (the `/immaterial-art` skill, `~/.claude/skills/immaterial-art/scripts/immaterial.mjs`) renders this engine headless on the Metal GPU with full seed provenance — numbered batches, parametric duration/aspect/zoom, same-seed framing variations, style-matched seed mining, and `identify` (any rendered file → the exact seed that made it, embedded in mp4 metadata + sidecar JSON):

```bash
node ~/.claude/skills/immaterial-art/scripts/immaterial.mjs batch --count 10 --duration 120 --out ./renders
node ~/.claude/skills/immaterial-art/scripts/immaterial.mjs identify renders/007_ab12cd34.mp4
node ~/.claude/skills/immaterial-art/scripts/immaterial.mjs similar --from renders/007_ab12cd34.mp4 --style --count 5
```

## Architecture notes

### Deterministic generation

The core innovation is the seeded PRNG. The first 32 hex chars of the hash seed one RNG, the second 32 seed another. These generators are then "warmed up" by calling them 1,000,000 times to avoid poor statistical properties of early outputs. All downstream randomness—mesh complexity, colors, angles, transformations—flows deterministically from these seeded generators.

### Visual features

The feature generator computes:
- **Gradients** (26 curated palettes: coal, fire, lavender, ocean, blood, etc.)
- **Color schemes** (48+ combinations of gradients, selected by hash-derived randomness)
- **Geometry** (mesh line count, step resolution, zoom level, rotation angles)
- **Transformations** (swirl, bend, flip, hole patterns, noise amplitude)

These are exported as human-readable features (fidelity, fluidity, color scheme, direction, frame, etc.) for metadata or analytics.

## Try asking

- How are the 26 color gradients defined and how do they combine in the 48+ color schemes?
- What is the relationship between the mesh `nLines`, `nSteps`, and the final geometry complexity in the 3D renderer?
- How does the `circleDistroAlgo` affect particle distribution along the curves, and what's the difference between algo 0 and 1?
