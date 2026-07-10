import {hash12, cnoise4} from './glslNoise.js';
import {PI} from './glslUtils.js';

// posTarget: per-particle attractor. Particles are partitioned across windows;
// each window gets an orb (red core + green/red shell) and, when 2+ windows
// exist, a share of tether particles targeting the segment to the next window.
// .w carries a 0..1 color-mix value (0 = green, 1 = red) read by the material.
function createPosTargetShader ()
{
	return `
		${PI}
		${hash12}

		uniform float time;
		uniform vec3 winCenters[8];
		uniform float winRads[8];
		uniform int numWins;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			int w = int(floor((i / nPoints) * float(numWins)));
			w = clamp(w, 0, numWins - 1);
			vec3 c = winCenters[w];
			float R = winRads[w];

			// uv-seeded hashes: large i seeds quantize hash12 and produce radial spokes
			float h1 = hash12(uv * 127.1);
			float h2 = hash12(uv * 311.7 + 0.17);
			float h3 = hash12(uv * 74.7 + 0.37);
			float h4 = hash12(uv * 269.5 + 0.71);
			float h5 = hash12(uv * 419.2 + 0.93);

			// window's own hue: even windows green (0.0), odd red (1.0)
			float myHue = mod(float(w), 2.0);
			float otherHue = 1.0 - myHue;

			vec3 pos;
			float colorMix;
			float isCore = 0.0;

			if (numWins > 1 && h1 < 0.28)
			{
				// tether: along segment to next window, pinched thin at the middle
				int o = w + 1;
				if (o >= numWins) o = 0;
				vec3 c2 = winCenters[o];
				float tt = h2;
				float pinch = 0.10 + 0.90 * pow(abs(tt - 0.5) * 2.0, 1.6);
				float spread = R * 0.6 * pinch * h4;
				float th = h3 * PI * 2.0;
				float cph = h5 * 2.0 - 1.0;
				float sph = sqrt(1.0 - cph * cph);
				pos = mix(c, c2, tt) + vec3(cos(th) * sph, sin(th) * sph, cph) * spread;
				colorMix = mix(myHue, otherHue, tt);
			}
			else
			{
				float th = h2 * PI * 2.0;
				float cph = h3 * 2.0 - 1.0;
				float sph = sqrt(1.0 - cph * cph);
				vec3 dir = vec3(cos(th) * sph, sin(th) * sph, cph);
				if (h1 > 0.88)
				{
					// dense core, opposite hue
					pos = c + dir * R * 0.38 * pow(h4, 0.5);
					colorMix = otherHue;
					isCore = 1.0;
				}
				else
				{
					// wispy outer shell
					pos = c + dir * R * (0.78 + 0.30 * h4);
					colorMix = myHue;
				}
			}

			// pack: w = colorMix (0..1) + 2 if core; material decodes to dim the core
			gl_FragColor = vec4(pos, colorMix + isCore * 2.0);
		}
	`;
}

function createAccShader ()
{
	return `
		${PI}
		${cnoise4}
		${hash12}

		uniform float time;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec3 a = vec3(0.0);
			vec4 p = texture2D(pos, uv);
			vec4 tar = texture2D(posTarget, uv);

			vec3 turb;
			float t = time * 0.0001;
			float n = hash12(uv * 0.02 + i);
			float s = .2;

			turb.x = cnoise(vec4(p.xyz * 0.006 + n * 35.4, t));
			turb.y = cnoise(vec4(p.xyz * 0.007 + n * 32.3, t));
			turb.z = cnoise(vec4(p.xyz * 0.006 + n * 43.3, t));
			turb *= pow(cnoise(vec4(p.xyz * 0.01, time * 0.0003)), 3.0) * s * 20.0;
			a += turb;

			vec3 back = tar.xyz - p.xyz;
			back *= ((1.0 + pow(cnoise(vec4(tar.xyz * 0.002, time * 0.0001) ), 1.0)) / 2.0) * 0.003;
			a += back;

			gl_FragColor = vec4(a, 1.0);
		}
	`;
}

function createVelShader ()
{
	return `
		${PI}

		uniform float time;

		void main ()
		{
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec4 a = texture2D(acc, uv);
			vec4 v = texture2D(vel, uv);
			v += a;
			v *= .97;

			gl_FragColor = vec4(v.xyz, 1.0);
		}
	`;
}

function createPosShader ()
{
	return `
		${PI}

		uniform float time;
		uniform int frame;

		void main ()
		{
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec4 p;

			if (frame < 2)
			{
				p = texture2D(posTarget, uv);
			}
			else
			{
				p = texture2D(pos, uv);
				p += texture2D(vel, uv);
			}

			gl_FragColor = vec4(p.xyz, 1.0);
		}
	`;
}

export {createPosTargetShader, createAccShader, createVelShader, createPosShader};
