import {cnoise3, hash12} from './glslNoise.js';
import {uvFromIndex} from './glslUtils.js';

// Staal's gpuparticles point material, recolored to the Entangled palette:
// posTarget.w (0..1) mixes green shell -> red core/tether; velocity whitens.
function createPointsMaterial (nX, nY)
{
	let vert = `

		${cnoise3}
		${hash12}
		${uvFromIndex}

		uniform sampler2D posTarget;
		uniform sampler2D acc;
		uniform sampler2D vel;
		uniform sampler2D pos;
		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main()
		{
			int i = gl_VertexID;
			ivec2 size = ivec2(${nX}, ${nX});
			vec2 uv = uvFromIndex(i, size);
			vec4 posTarget = texture2D(posTarget, uv);
			vec4 pos = texture2D(pos, uv);

			float n = hash12(vec2(float(i), 0.0));
			float ps = pow(n, 2.0);
			alpha = .05 + pow(n, 20.0) * .1;
			ps *= 2.0;

			if (n > .999)
			{
				ps *= 1.1;
				alpha *= 2.0;
			}

			vec3 p = pos.xyz;

			vec4 a = texture2D(vel, uv);
			float isCore = step(1.5, posTarget.w);
			float colorMix = posTarget.w - isCore * 2.0;
			vec3 green = vec3(0.15, 1.0, 0.45);
			vec3 red = vec3(1.0, 0.06, 0.18);
			col = mix(green, red, colorMix);
			float s = pow(length(a) / 1.5, 5.0) * 1.5;
			s = clamp(s, 0.0, 1.0);
			col = mix(col, vec3(1.0, 0.95, 0.85), s * 0.22);
			// cores pack thousands of additive points into a small disc; dim to keep hue
			alpha *= mix(1.0, 0.3, isCore);

			gl_PointSize = ps;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
		}
	`;

	let frag = `
		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main()
		{
			gl_FragColor = vec4(col.rgb, alpha);
		}
	`;

	const material = new THREE.ShaderMaterial(
	{
		uniforms:
		{
			time: { value: 1.0 },
		},

		vertexShader: vert,
		fragmentShader: frag,
		transparent: true,
		depthWrite: false,
		depthTest: false,
		blending: THREE.AdditiveBlending
	});

	return material;
}

export {createPointsMaterial};
