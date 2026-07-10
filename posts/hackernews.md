# Show HN draft (DO NOT POST without user go)

Title: Show HN: I recovered the viral "two windows, entangled particle orbs" demo from the blockchain

Body:
In Nov 2023 Bjørn Staal posted a demo of two browser windows with particle orbs tethered
across them. The repo everyone found (18k stars) only contains wireframe cubes — the real
effect was his artwork "Entangled", released later as an fxhash VERTEX piece stored on
onchfs (an on-chain filesystem).

I extracted the production generator from the chain, mapped all 256 editions' palettes by
replicating its WASM RNG offline (it's hash-independent — iteration number is the complete
style DNA: palette, curl params, Gray-Scott reaction-diffusion, geometry), found the exact
two editions from the viral video (253 + 58), and built a launcher + live iteration cycler
around it. Also includes a from-scratch recreation on Staal's own open gpuparticles engine.

All artwork code © Bjørn Staal (provenance in NOTICE.md — happy to take down/re-license on
his word). Interested in the on-chain-recovery technique critique.

https://github.com/fire17/entangled-grail

(placeholder: X thread link)
