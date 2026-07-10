import WindowManager from './WindowManager.js';
import {createPointsMaterial} from './materials.js';
import GPUComputationRenderer from './GPUComputationRenderer.js';
import {createPosTargetShader, createAccShader, createVelShader, createPosShader} from './computeShaders.js';

// Staal's gpuparticles engine married to his multipleWindow3dScene WindowManager:
// one shared world in screen coordinates, each window renders it offset by its
// own screen position; particle targets come from live window centers.

const TEX_SIZE = 1024; // full million, like Staal's original
const MAX_WINS = 8;

const t = THREE;
let camera, scene, renderer, world;
let points;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let sceneOffsetTarget = {x: 0, y: 0};
let sceneOffset = {x: 0, y: 0};
let time = new Date().getTime();
let internalTime = 0;
let frame = 0;
let gpu, posTargetVar, accVar, velVar, posVar;
let fadeScene, fadeCam;
let windowManager;
let initialized = false;

let winCenters = [];
let winRads = [];
for (let i = 0; i < MAX_WINS; i++) { winCenters.push(new t.Vector3()); winRads.push(200); }

// unlike the original repo, ?clear=true resets state AND still renders
if (new URLSearchParams(window.location.search).get("clear"))
{
	localStorage.clear();
}

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState != 'hidden' && !initialized) init();
});

window.onload = () => {
	if (document.visibilityState != 'hidden') init();
};

function init ()
{
	initialized = true;

	setTimeout(() => {
		setupScene();
		createPoints();
		setupGpuComputation();
		windowManager = new WindowManager();
		windowManager.setWinShapeChangeCallback(() => updateWindowShape());
		windowManager.setWinChangeCallback(() => {});
		windowManager.init({});
		updateWindowShape(false);
		resize();
		render();
		window.addEventListener('resize', resize);
	}, 500);
}

function setupScene ()
{
	camera = new t.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, -10000, 10000);
	camera.position.z = 2.5;

	scene = new t.Scene();
	scene.background = new t.Color(0.0);
	scene.add(camera);

	renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true, preserveDrawingBuffer: true});
	renderer.setPixelRatio(pixR);
	// trails: never clear color; a translucent black quad fades the last frame instead
	renderer.autoClearColor = false;

	fadeScene = new t.Scene();
	fadeCam = new t.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	fadeScene.add(new t.Mesh(
		new t.PlaneGeometry(2, 2),
		new t.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.18, depthTest: false, depthWrite: false})
	));

	world = new t.Object3D();
	scene.add(world);

	renderer.domElement.setAttribute("id", "scene");
	document.body.appendChild(renderer.domElement);
}

function createPoints ()
{
	let geometry = new t.BufferGeometry();
	let n = TEX_SIZE * TEX_SIZE;
	geometry.setAttribute('position', new t.BufferAttribute(new Float32Array(n * 3), 3));

	points = new t.Points(geometry, createPointsMaterial(TEX_SIZE, TEX_SIZE));
	points.frustumCulled = false;
	world.add(points);
}

function setupGpuComputation ()
{
	gpu = new GPUComputationRenderer(TEX_SIZE, TEX_SIZE, renderer);

	posTargetVar = gpu.addVariable("posTarget", createPosTargetShader(), gpu.createTexture());
	accVar = gpu.addVariable("acc", createAccShader(), gpu.createTexture());
	velVar = gpu.addVariable("vel", createVelShader(), gpu.createTexture());
	posVar = gpu.addVariable("pos", createPosShader(), gpu.createTexture());

	gpu.setVariableDependencies(posTargetVar, [posTargetVar]);
	gpu.setVariableDependencies(accVar, [posTargetVar, posVar, accVar]);
	gpu.setVariableDependencies(velVar, [accVar, velVar]);
	gpu.setVariableDependencies(posVar, [accVar, velVar, posVar, posTargetVar]);

	posTargetVar.material.uniforms.winCenters = {value: winCenters};
	posTargetVar.material.uniforms.winRads = {value: winRads};
	posTargetVar.material.uniforms.numWins = {value: 1};
	posTargetVar.material.uniforms.time = {value: 0};

	let error = gpu.init();
	if (error !== null) console.error(error);
}

function updateWindowShape (easing = true)
{
	sceneOffsetTarget = {x: -window.screenX, y: -window.screenY};
	if (!easing) sceneOffset = sceneOffsetTarget;
}

function render ()
{
	let now = new Date().getTime();
	internalTime += now - time;
	time = now;

	windowManager.update();

	let falloff = .05;
	sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
	sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);
	world.position.x = sceneOffset.x;
	world.position.y = sceneOffset.y;

	let wins = windowManager.getWindows();
	let numWins = Math.min(wins.length, MAX_WINS);
	for (let i = 0; i < numWins; i++)
	{
		let s = wins[i].shape;
		winCenters[i].set(s.x + s.w * .5, s.y + s.h * .5, 0);
		winRads[i] = Math.min(s.w, s.h) * 0.22;
	}

	let u = posTargetVar.material.uniforms;
	u.time.value = internalTime;
	u.numWins.value = Math.max(numWins, 1);

	accVar.material.uniforms.time = {value: internalTime};
	posVar.material.uniforms.time = {value: internalTime};
	posVar.material.uniforms.frame = {value: frame};

	gpu.compute();

	let pu = points.material.uniforms;
	pu.time.value = internalTime;
	pu.posTarget = {value: gpu.getCurrentRenderTarget(posTargetVar).texture};
	pu.acc = {value: gpu.getCurrentRenderTarget(accVar).texture};
	pu.vel = {value: gpu.getCurrentRenderTarget(velVar).texture};
	pu.pos = {value: gpu.getCurrentRenderTarget(posVar).texture};

	renderer.render(fadeScene, fadeCam);
	renderer.render(scene, camera);
	requestAnimationFrame(render);
	frame++;
}

function resize ()
{
	let w = window.innerWidth;
	let h = window.innerHeight;

	camera = new t.OrthographicCamera(0, w, 0, h, -10000, 10000);
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}
