## unreleased — 2026-07-10 (local only)
- immaterial-fornebu: README + captured media (stills/GIF/montage/clips), goerli-hashes + tweakpane stubs (fixes silent `?hash=` breakage).
- immaterial-renders/ranking-batch-001: 10 seeded clips for ranking (local-only, 160MB).
- New /immaterial-art skill: batch/generate/similar/identify/features render pipeline with seed provenance.

# Changelog

## v0.1.2 — 2026-07-10
- ⚡ AUTO-TRIO: open ONE window (`?auto=trio`) and it self-spawns its two siblings,
  pre-positioned left/right. Popup-blocked first run degrades to a single click
  ("click anywhere to summon"); with popups allowed it's fully automatic.

## v0.1.1 — 2026-07-10
- TRIO support: third entity via a third window with its own iteration (the artwork's
  unpaired-instance channel — up to 10 extra entities). Launcher: "🔺 TRIO" preset
  (green/red 253 + red/green 58 + blue 41) and a v2 TRIO button (v2 tethers ring natively,
  3 windows = triangle).

## v0.1.0 — 2026-07-10
- Recovered Bjørn Staal's original Entangled generator from onchfs (on-chain filesystem).
- Launcher SPA: one click to every version; pre-positioned window pairs.
- Derived the full iteration→palette map (256 editions) by replicating the bundle's WASM RNG offline; pinned the viral video's palette (iterations 253 + 58).
- v0-live: exact iteration switching (◀▶/arrows), autoplay with dwell slider, palette-only live preview ([ ] keys).
- v2: faithful recreation on Staal's own gpuparticles engine (WindowManager + tether target shader + trails, 1M particles).
- Full hunt story + user-confirmed grail screenshots.
