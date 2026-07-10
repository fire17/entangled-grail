// Replicates Entangled's iteration -> color scheme mapping (bundle lines 181-498)
const fs = require('fs');
const b64 = "AGFzbQEAAAABBgFgAX8BfAMDAgAABQMBAAAHHwMGbWVtb3J5AgAHc3F1YXJlcwAACHNxdWFyZXM0AAEKjgECPwECfiAArULHuuXf9tjQm2p+IgEgASABfnxCIIoiAiACfiABQse65d/22NCbanx8QiCKIgIgAn4gAXxCIIi6C0wBAn4gAK1Cx7rl3/bY0JtqfiIBQse65d/22NCbanwiAiABIAIgASABIAF+fEIgiiIBIAF+fEIgiiIBIAF+fEIgiiIBIAF+fEIgiLoL";
const inst = new WebAssembly.Instance(new WebAssembly.Module(Buffer.from(b64, 'base64')));
const P = inst.exports.squares;
function F(e) { return P(e) / 4294967296; }
class M {
	#e; #n; #t = 0;
	constructor(e, n = false) { this.#n = e; this.#e = n; }
	random_dec() { let e = F(this.#n + this.#t); this.#t++; return e; }
	random_num(e, n) { return e + (n - e) * this.random_dec(); }
	random_int(e, n) { return Math.floor(this.random_num(e, n + 1)); }
	random_bool(e) { return this.random_dec() < e; }
	random_choice(e) { return e[this.random_int(0, e.length - 1)]; }
	random_shuffle(e) { let n, t = e.length; while (t > 0) { n = Math.floor(this.random_dec() * t); t--; [e[t], e[n]] = [e[n], e[t]]; } return e; }
}
let ie, se, le;
eval(fs.readFileSync(process.argv[2], 'utf8'));

const names = { 197384: 'darkNavy', 16777215: 'white', 15723490: 'cream', 14736598: 'lightGray', 9144968: 'gray', 3552822: 'charcoal', 1907996: 'nearBlack', 1052689: 'ink', 937983: 'BLUE', 71679: 'deepBlue', 2707: 'navy', 201894: 'blue2', 15039511: 'ORANGE', 14325564: 'amber', 12743201: 'copper', 16711686: 'RED', 9043972: 'darkRed', 7340294: 'maroon', 16725065: 'redPink', 11144468: 'crimson', 1039424: 'GREEN', 218915: 'darkGreen', 757052: 'green2', 155936: 'forest', 65793: 'black2' };
const nm = c => names[c] || ('#' + c.toString(16).padStart(6, '0'));
const fmt = s => s.map(v => '[' + v.map(nm).join(',') + ']').join(' | ');

// per-iteration schemes (pe): schemes[0]=eth window, schemes[1]=tezos window
for (let iter = 1; iter <= 256; iter++) {
	const n = se[iter - 1];
	const s0 = n[0], s1 = n.length > 1 ? n[1] : n[0];
	const line = `iter ${String(iter).padStart(3)}  scheme#${String(ie[iter-1]).padStart(2)}  eth:[${s0.map(nm)}]  tez:[${s1.map(nm)}]`;
	console.log(line);
}
