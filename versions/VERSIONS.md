# Saved versions

Each folder is self-contained — serve repo root (`python3 -m http.server 8888`) and open `http://localhost:8888/versions/<name>/?clear=true` in 2+ windows.

## v1-cosmic-spheres (saved 2026-07-10)
Best-looking version so far (user verdict: "very nice, but not the original").
Source: ShinoKana/multipleWindow3dScene pre-commit-27788d6 `main.js`, patched by us:
- THREE.Geometry -> BufferGeometry (starfield + 35k-point particle shells)
- THREE.VertexColors -> vertexColors: true
- THREE r124 CDN global import added to index.html
Look: per window one layered orb — inner/outer icosahedron wireframes + translucent glass spheres + 2x35k particle shells, HSL pulse (red outer / amber inner), 5000-star background.
NOT the target: target is Bjorn Staal's "Entangled" wispy GPGPU-particle nebula with smooth tether arm between windows (see YouTube 4LwHH3r2qNY).

## v2-entangled-gpu (built 2026-07-10) — the real engine
Bjorn Staal's OWN published particle engine (github.com/bgstaal/gpuparticles — the code he
"cleaned up and posted" after the viral video) fused with his WindowManager.
Engine verbatim (GPUComputationRenderer 4-pass: posTarget/acc/vel/pos + 4D simplex turbulence,
additive soft points); new: multi-window posTarget shader (orb shell + red core + pinched tether
to next window), Entangled palette (green/red per window, velocity whitening), ortho screen-space
camera + world offset from WindowManager.
Open: http://localhost:8888/versions/v2-entangled-gpu/ in 2+ windows (add ?clear=true once to reset state).
262k particles (TEX_SIZE=512 in main.js; 1024 = 1M like Staal's original).

## candidate-gpuparticles (reference, verbatim clone)
github.com/bgstaal/gpuparticles — Staal's official single-window 1M-particle demo. Step branches.

## candidate-ore-entangled (reference, verbatim clone)
github.com/ore-codes/entangled — community recreation (BroadcastChannel, sparse dots). Functional, crude.

## v0-original-entangled (recovered 2026-07-10) — THE ORIGINAL
Bjorn Staal's actual "Entangled" artwork code, recovered from the blockchain (fxhash VERTEX
release, onchfs on-chain filesystem, generator dir onchfs://3ae3e86c6561875429ff3fdba726768fac7b9ea40981af9468d86c8066d9dd5b,
gateway onchfs.fxhash2.xyz). bundle.min.js is his production code (minified) — contains the same
localStorage "windows"/"count" WindowManager and the GPGPU particle system from the viral video.
Open: http://localhost:8888/versions/v0-original-entangled/ in 2+ windows.
fxhash.min.js auto-generates a token hash per window; iterations pair/interact per the artwork rules.

### v0 usage — recreating the video's red/green pair
Bundle switches palette/role on `?fxchain=` (ETHEREUM default / TEZOS); `?noshuffle=1` makes
iteration pairing identity, so same fxiteration on both chains = an entangled pair:
  /versions/v0-original-entangled/?fxchain=TEZOS&fxiteration=7&noshuffle=1
  /versions/v0-original-entangled/?fxchain=ETHEREUM&fxiteration=7&noshuffle=1
256 iterations per chain, each a unique edition. Debug flags found in bundle: noshuffle.

### v0 color map (derived 2026-07-10 by replicating the bundle's WASM squares RNG offline)
Iteration -> palette table: versions/v0-original-entangled/ITERATION_COLORS.txt (derivation:
scheme_map.js + scheme_slice.js in same dir; bundle's scheme shuffle is hash-independent, seed-fixed).
THE VIDEO PALETTE = scheme #43 (darkNavy bg, green+red):
  iter 253 = GREEN orb / RED core     iter 58 = RED orb / GREEN core
Launcher has a "VIDEO COLORS" preset (eth-253 + tez-58). Debug flags in bundle: ?debug=1|2
(console state dump, 2 adds pairs+palettes), ?noshuffle=1 (identity pairing), ?disableWindowing=1.

## v0-live (built 2026-07-10) — original + live style cycler
Copy of v0-original-entangled (bundle untouched) + controller.js: hooks THREE.ShaderMaterial
before the bundle loads, catches the composite material (colors0/colors1 uniform arrays of
THREE.Color), and mutates them in place from precomputed palettes.json (256 iterations, derived
offline from the bundle's own seed-fixed WASM RNG). UI: ◀ ▶ buttons / [ ] keys = live palette
swap (same particles keep flowing); ⟳ / shift-enter = full reload with that iteration (applies
motion/shape params too). Launcher points all v0 buttons here; pristine copy stays in
v0-original-entangled/.

## 2026-07-10 — HOLY GRAIL CONFIRMED (user screenshot: GRAIL.png, repo root)
v0-live, iterations 253 (green/red) + 58 (red/green), two windows: wispy green orb w/ red core,
red orb w/ green core, organic particle tether — the exact viral-video composition, running on
Staal's own recovered artwork code. Recipe = launcher "VIDEO COLORS" button.

### v0-live v2 (2026-07-10) — exact switching + autoplay
Iteration = complete style DNA (single RNG seed 1024*(iter+1)+7 draws every feature at init).
Controller now: ◀ ▶ / arrow keys = full exact switch (reload-step, identical to fresh load);
▶/⏸ + dwell slider (2-30s) = autoplay, persists across reloads (sessionStorage, per window);
[ ] keys = palette-only live preview (label shows N*). Full feature inventory in commit msg +
the bundle itself logs "DETAILED FEATURES" JSON to console every load.

### 2026-07-10 — the 2-entity limit (user-discovered, code-confirmed)
Staal's bundle supports exactly TWO first-class particle entities (instanceShape[2],
colors0/colors1, instanceIndex 0|1 = one pair per iteration). Any additional window renders
the shared world + a radial COLOR WASH (unpairedColors[10]) — a ghost presence, not a particle
orb. True 3rd entity in the original = minified-sim surgery (3-way particle partition +
compositor arrays + pairing) — open mission. v2 does N real entities natively (verified:
3 windows = orb with two arms; test-seed3.html is the headless harness).
