# Entangled — the Holy Grail, recovered

The viral "two browser windows, two particle orbs, one tether" demo — **Bjørn Staal's
_Entangled_** — recovered, running locally, and fully explorable.

![The Holy Grail — green/red pair with tether](images/03-grail-green-red.png)

## The hunt

The famous video ([youtube.com/watch?v=4LwHH3r2qNY](https://www.youtube.com/watch?v=4LwHH3r2qNY),
Bjørn Staal's Nov 2023 X post) was never open-sourced: the repo everyone found
([bgstaal/multipleWindow3dScene](https://github.com/bgstaal/multipleWindow3dScene)) renders
wireframe **cubes**. Every fork just remixed the cubes.

The trail that led here:

1. Staal's own [gpuparticles](https://github.com/bgstaal/gpuparticles) repo — the engine
   he "cleaned up and posted" after the video (1M GPGPU particles, 4-pass compute).
2. _Entangled_ was released in 2024 as an [fxhash VERTEX piece](https://www.fxhash.xyz/vertex/entangled)
   stored on **onchfs** — an on-chain filesystem. The production generator
   (`bundle.min.js`, his real artwork code, WindowManager included) was extracted
   directly from the chain: `onchfs://3ae3e86c6561875429ff3fdba726768fac7b9ea40981af9468d86c8066d9dd5b`.
3. The bundle's feature RNG is hash-independent (WASM "squares", fixed seeds) — replicating
   it offline mapped all **256 iterations → palettes** and pinned the video's exact look:
   **iteration 253** (green orb / red core) + **iteration 58** (red orb / green core).

![First contact — the original orbs tethering across windows](images/01-first-contact.png)

## Quickstart

```bash
python3 -m http.server 8888
# open http://localhost:8888/  →  click "🎬 VIDEO COLORS"
```

The launcher opens every version one click each; windows come pre-positioned side by side —
drag them and watch the tether hold.

![Launcher + paired windows](images/02-pair-tether.png)

## How it works

- Windows discover each other through `localStorage` (same origin); each window is a
  **camera** into one shared, screen-coordinate world.
- Same chain + iteration = a second lens on the *same* simulation. Different chain or
  iteration = a separate instance — and instances interact (tethers, mixing, mirroring).
- `?fxchain=ETHEREUM|TEZOS` picks the collection role, `?fxiteration=1..256` picks the
  edition, `?noshuffle=1` makes pairing identity (iteration N pairs with N).
- **Iteration is the complete style DNA**: one RNG seeded `1024*(iter+1)+7` draws palette,
  motion types (noise spheres / Gray–Scott reaction-diffusion), curl parameters,
  connection twists, core geometry (sphere/icosahedron/cube/octahedron), rotation speeds,
  deform strengths, gradient type — everything. Full palette map:
  [`versions/v0-live/ITERATION_COLORS.txt`](versions/v0-live/ITERATION_COLORS.txt).

## The live cycler (v0-live)

The original bundle, untouched, plus a small overlay: ◀ ▶ (or ←/→) switch iterations
**exactly** (full re-init), ▶/⏸ + slider auto-plays through iterations at your chosen
dwell time, and `[` `]` preview palettes live without disturbing the particles.

![Iteration cycler running iteration 3](images/04-iteration-cycler.png)

## Versions catalog

| Version | What |
|---|---|
| `versions/v0-live/` | 🏆 the original + live iteration cycler |
| `versions/v0-original-entangled/` | pristine recovered artwork code + palette derivation scripts |
| `versions/v2-entangled-gpu/` | faithful recreation: Staal's gpuparticles engine + WindowManager + tether shader + trails |
| `versions/v1-cosmic-spheres/` | earlier pretty-but-wrong find (layered wireframe/glass orbs) |
| `versions/gpuparticles-step01…05/` | Staal's tutorial branches, cube → finished 1M-particle sim |
| `versions/candidate-*` | reference clones |

Full notes: [`versions/VERSIONS.md`](versions/VERSIONS.md).

## Credits & provenance

- **All artwork code: © [Bjørn Staal](https://www.nonfigurativ.com/) (@_nonfigurativ_)** —
  _Entangled_ (2024, fxhash VERTEX), recovered verbatim from the public on-chain
  filesystem. The gpuparticles engine and multipleWindow3dScene are his MIT-licensed repos.
- Recovery, launcher, palette map, and cycler tooling built with Claude (2026-07-10).
- This is a preservation/study project. Before any public redistribution of
  `bundle.min.js`, confirm the VERTEX open-source terms.
