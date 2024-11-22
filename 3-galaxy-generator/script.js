// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";


// HTML Elements
const canvas = document.querySelector(".webgl");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.querySelector("#progress-bar");


// Inits
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gui = new GUI();


// Constants
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const debugObj = {
	count: 40000,
	size: 0.01,
	radius: 3,
	branchCount: 6,
	spin: 1,
	rotationSpeed: 0.3,
	randomness: 1.1,
	centeralPower: 3,
	insideColor: "#ff0059",
	outsideColor: "#0062ff",
};

// Scene
const scene = new THREE.Scene();


// Fog
const fog = new THREE.Fog("#262837", 3, 10);
// scene.fog = fog;


// Camera
const camera = new THREE.PerspectiveCamera(65, size.width / size.height, 0.01, 100);
camera.position.set(0, 2, 3);
scene.add(camera);


// Lights



// Textures
const particleTexture = textureLoader.load("./src/textures/particles.png");


// Materials
const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = debugObj.size;
particleMaterial.sizeAttenuation = true;
particleMaterial.depthWrite = false;
particleMaterial.belnding = THREE.AdditiveBlending;
particleMaterial.vertexColors = true;



// Galaxy
let randomGeometry = null;
let particles = null;


const generateNewGalaxy = () => {

	if (randomGeometry !== null) {
		randomGeometry.dispose();
	}
	
	if (particles !== null) {
		scene.remove(particles);
	}

	const positionData = new Float32Array(debugObj.count * 3);
	const colorData = new Float32Array(debugObj.count * 3);

	const insideColor = new THREE.Color(debugObj.insideColor);
	const outsideColor = new THREE.Color(debugObj.outsideColor);


	
	const angle = (Math.PI * 2) / debugObj.branchCount;
	for (let i=0; i<debugObj.count; i++) {

		// Position
		const branchAngle = angle * i;
		const randomRadius = Math.random() * debugObj.radius;

		const spinAngle = randomRadius * debugObj.spin;

		const randomY = ((Math.random() - 0.5) * debugObj.randomness) ** debugObj.centeralPower * (Math.random < 0.5 ? 1 : -1);
		const randomZ = ((Math.random() - 0.5) * debugObj.randomness) ** debugObj.centeralPower * (Math.random < 0.5 ? 1 : -1);
		const randomX = ((Math.random() - 0.5) * debugObj.randomness) ** debugObj.centeralPower * (Math.random < 0.5 ? 1 : -1);

		positionData[3*i + 0] = (Math.cos(branchAngle + spinAngle)  * randomRadius) + randomX;// X
		positionData[3*i + 1] = (Math.random() < 0.5 ? randomY : -randomY); // Y
		positionData[3*i + 2] = (Math.sin(branchAngle + spinAngle) * randomRadius) + randomZ;// Z

		
		// Color

		const mixedColor = insideColor.clone()
		mixedColor.lerp(outsideColor, randomRadius / debugObj.radius);

		colorData[3*i + 0] = mixedColor.r;
		colorData[3*i + 1] = mixedColor.g;
		colorData[3*i + 2] = mixedColor.b;
	}
	
	randomGeometry = new THREE.BufferGeometry();
	randomGeometry.setAttribute("position", new THREE.BufferAttribute(positionData, 3));
	randomGeometry.setAttribute("color", new THREE.BufferAttribute(colorData, 3));


	particles = new THREE.Points(randomGeometry, particleMaterial);
	scene.add(particles);
};

generateNewGalaxy();



gui.add(debugObj, "count")
	.min(500).max(100000).step(100).onFinishChange(generateNewGalaxy);

gui.add(debugObj, "size")
	.min(0.01).max(0.09).step(0.01).onChange(() => {
		particleMaterial.size = debugObj.size;
	});

gui.add(debugObj, "radius")
	.min(0.5).max(15).step(0.5).onChange(generateNewGalaxy);

gui.add(debugObj, "branchCount")
	.min(2).max(16).step(1).onChange(generateNewGalaxy);

gui.add(debugObj, "spin")
	.min(-5).max(5).step(0.1).onChange(generateNewGalaxy);

gui.add(debugObj, "rotationSpeed")
	.min(-3).max(3).step(0.1);

gui.add(debugObj, "randomness")
	.min(0).max(1.6).step(0.1).onChange(generateNewGalaxy);

gui.add(debugObj, "centeralPower")
	.min(1).max(10).step(1).onChange(generateNewGalaxy);

gui.addColor(debugObj, "insideColor")
	.onFinishChange(generateNewGalaxy);

gui.addColor(debugObj, "outsideColor")
	.onFinishChange(generateNewGalaxy);



// Geometries



// Points



// Objects



// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.02;


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.pixelRatio = window.devicePixelRatio;
renderer.render(scene, camera);


// Updater
const clock = new THREE.Clock();
(function tick() {
	const time = clock.getElapsedTime();

	particles.rotation.y = time * debugObj.rotationSpeed;

	controls.update();
	renderer.render(scene, camera);

	requestAnimationFrame(tick);
})();


// Misc

// Handling resizes
loadingManager.onStart = () => {
	progressBarContainer.style.display = "block";
}

loadingManager.onProgress = (_, item, total) => {
	progressBar.value = (item / total) * 100;
}

loadingManager.onLoad = () => {
	progressBarContainer.style.display = "none";
}


window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	}
	else {
		document.exitFullscreen();
	}
});

// Double click = fullscreen
window.addEventListener("resize", () => {
	size.width = window.innerWidth;
	size.height = window.innerHeight;

	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();

	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio = window.devicePixelRatio;
})
