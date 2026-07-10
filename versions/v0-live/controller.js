// Iteration cycler for the original Entangled bundle (bundle.min.js untouched).
//
// Iteration = the piece's complete style DNA: one RNG (seed 1024*(iter+1)+7) draws
// EVERY feature at init — palette, motion types, sphere/curl params, reaction-diffusion
// (feed/kill/type), connection twists, main/core geometry, rotation speeds, deform,
// gradient type — plus the instance identity used for window pairing. All of it is
// baked into shaders/systems at startup, so the only 100%-faithful switch is a reload.
// ◀ ▶ / arrow keys reload-step (exact per-iteration look). ▶ autoplay + dwell slider
// persist across reloads in sessionStorage (per window). [ ] keys keep the palette-only
// live swap as a bonus (same particles, skin only — NOT the full iteration).
(function () {
	const params = new URLSearchParams(location.search);
	let iter = parseInt(params.get('fxiteration')) || 1;
	const chainIdx = (params.get('fxchain') || 'ETHEREUM').toLowerCase() === 'tezos' ? 1 : 0;

	const state = JSON.parse(sessionStorage.getItem('cycler') || '{"playing":false,"dwell":6}');
	function saveState () { sessionStorage.setItem('cycler', JSON.stringify(state)); }

	function goTo (n) {
		saveState();
		params.set('fxiteration', ((n - 1 + 256) % 256) + 1);
		if (!params.get('fxchain')) params.set('fxchain', 'ETHEREUM');
		if (!params.get('noshuffle')) params.set('noshuffle', '1');
		location.search = params.toString();
	}

	// autoplay: schedule next step; countdown ring on the play button
	let playTimer = null, playStart = 0;
	function setPlaying (p) {
		state.playing = p; saveState();
		playBtn.textContent = p ? '⏸' : '▶';
		if (playTimer) { clearInterval(playTimer); playTimer = null; }
		if (p) {
			playStart = performance.now();
			playTimer = setInterval(() => {
				const left = state.dwell * 1000 - (performance.now() - playStart);
				playBtn.style.opacity = 0.4 + 0.6 * (left / (state.dwell * 1000));
				if (left <= 0) goTo(iter + 1);
			}, 100);
		} else playBtn.style.opacity = 1;
	}

	// --- bonus: palette-only live swap ([ / ] keys), skin only ---
	const paletteMats = [];
	const Orig = THREE.ShaderMaterial;
	THREE.ShaderMaterial = class extends Orig {
		constructor (...a) {
			super(...a);
			if (this.uniforms && this.uniforms.colors0 && this.uniforms.colors1) paletteMats.push(this);
		}
	};
	let palettes = null, liveIter = iter;
	fetch('./palettes.json').then(r => r.json()).then(p => { palettes = p; });
	function livePalette (d) {
		if (!palettes || !paletteMats.length) return;
		liveIter = ((liveIter - 1 + d + 256) % 256) + 1;
		const schemes = palettes[liveIter - 1];
		const mine = schemes[chainIdx], other = schemes[1 - chainIdx];
		paletteMats.forEach(m => {
			m.uniforms.colors0.value.forEach((c, i) => c.setHex(mine[i]));
			m.uniforms.colors1.value.forEach((c, i) => c.setHex(other[i]));
		});
		document.body.style.background = '#' + new THREE.Color(mine[0]).getHexString();
		label.textContent = liveIter + '*'; // * = skin preview, not the true iteration
	}

	// --- auto-trio: leader window spawns its two siblings, then VERIFIES they connected ---
	if (params.get('auto') === 'trio' && !params.get('spawned')) {
		const sibs = ['fxchain=TEZOS&fxiteration=58', 'fxchain=ETHEREUM&fxiteration=41'];
		const connected = () => { try { return (JSON.parse(localStorage.getItem('windows')) || []).length; } catch (e) { return 1; } };
		const spawned = [];
		const spawnSibs = () => {
			const w = window.innerWidth, h = window.innerHeight, y = window.screenY;
			sibs.forEach((q, i) => {
				const x = window.screenX + (i === 0 ? -(w + 25) : (w + 25));
				const win = window.open('./?' + q + '&noshuffle=1&spawned=1', 'sib' + i,
					`popup=yes,width=${w},height=${h},left=${Math.max(0, x)},top=${y}`);
				if (win) spawned.push(win);
			});
		};
		const o = document.createElement('div');
		o.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;' +
			'z-index:10000;color:#fff;font:16px "Courier New",monospace;background:rgba(0,0,0,.55);cursor:pointer;text-align:center;padding:30px;line-height:1.7';
		o.onclick = () => { spawnSibs(); o.style.display = 'none'; setTimeout(() => { o.style.display = 'flex'; }, 2500); };
		window.addEventListener('DOMContentLoaded', () => {
			spawnSibs();
			setInterval(() => {
				const n = connected();
				if (n >= 3) { o.remove(); return; }
				o.innerHTML = n < 2
					? '🖱 <b>click anywhere to summon the 2 sibling windows</b><br><span style="font-size:13px;color:#bbb">for full automagic: allow pop-ups for this site<br>(Arc/Chrome: blocked-popup icon in the address bar → Always allow)</span>'
					: '⚠️ ' + n + '/3 connected — siblings may have opened as <b>tabs</b><br><span style="font-size:13px;color:#bbb">drag each new tab out into its own window (the effect needs separate windows),<br>or allow pop-ups for this site, then click here to re-summon.</span>';
				if (!o.parentNode && document.body && o.style.display !== 'none') document.body.appendChild(o);
			}, 800);
		});
	}

	// --- overlay ---
	const ui = document.createElement('div');
	ui.style.cssText = 'position:fixed;bottom:14px;left:14px;z-index:9999;display:flex;gap:6px;align-items:center;' +
		'font:13px "Courier New",monospace;color:#ccc;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.2);' +
		'border-radius:8px;padding:6px 10px;user-select:none;backdrop-filter:blur(4px)';
	const mkBtn = (txt, fn, title) => {
		const b = document.createElement('button');
		b.textContent = txt; b.title = title || '';
		b.style.cssText = 'background:none;border:1px solid rgba(255,255,255,.25);color:#ccc;border-radius:5px;cursor:pointer;font:13px "Courier New";padding:2px 8px';
		b.onclick = fn; ui.appendChild(b); return b;
	};
	mkBtn('◀', () => goTo(iter - 1), 'previous iteration — full exact switch (←)');
	const label = document.createElement('span');
	label.textContent = iter; label.style.cssText = 'min-width:34px;text-align:center';
	label.title = 'current iteration (1-256). [ ] = palette-only live preview (*)';
	ui.appendChild(label);
	mkBtn('▶', () => goTo(iter + 1), 'next iteration — full exact switch (→)');
	const playBtn = mkBtn(state.playing ? '⏸' : '▶', () => setPlaying(!state.playing), 'autoplay: step to next iteration after dwell time');
	playBtn.style.marginLeft = '8px';
	const slider = document.createElement('input');
	slider.type = 'range'; slider.min = 2; slider.max = 30; slider.step = 1; slider.value = state.dwell;
	slider.style.cssText = 'width:80px;accent-color:#9fe8b8';
	slider.title = 'seconds per iteration';
	const dwellLabel = document.createElement('span');
	dwellLabel.textContent = state.dwell + 's'; dwellLabel.style.cssText = 'min-width:28px;color:#888';
	slider.oninput = () => { state.dwell = parseInt(slider.value); dwellLabel.textContent = state.dwell + 's'; saveState(); };
	ui.appendChild(slider); ui.appendChild(dwellLabel);

	window.addEventListener('DOMContentLoaded', () => {
		document.body.appendChild(ui);
		if (state.playing) setPlaying(true);
	});
	window.addEventListener('keydown', e => {
		if (e.key === 'ArrowLeft') goTo(iter - 1);
		if (e.key === 'ArrowRight') goTo(iter + 1);
		if (e.key === '[') livePalette(-1);
		if (e.key === ']') livePalette(1);
	});
})();
