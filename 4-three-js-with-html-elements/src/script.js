// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";


// HTML Elements
const canvas = document.querySelector(".webgl");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.querySelector("#progress-bar");


// Inits
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gui = new GUI({ width: 350 });
const cameraGroup = new THREE.Group();


// Constants
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const meshes = [];

const debugObj = {
	SHAPES_ROTATION_MLTIPLIER: 0.4,
	MOUSE_MOVE_MLTIPLIER: 0.8,
	EASE_MLTIPLIER: 6,
	PARTICLES_Z_VALUE: 0.5,
	PARTICLES_SIZE: 0.01,
	PARTICLES_COUNT: 1500,
	PARTICLES_COLOR: "#ffffff",
};

let previousSection = 0;


// Cursor
const cursorPositionOnScreen = {
	x: 0,
	y: 0,
};

let scroll = window.scrollY;


// Scene
const scene = new THREE.Scene();
scene.add(cameraGroup);

// Fog
const fog = new THREE.Fog("#262837", 3, 10);
// scene.fog = fog;


// Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.01, 100);
camera.position.set(0, 0, 4);
cameraGroup.add(camera);


// Lights
const ambientLight = new THREE.AmbientLight("#fff", 0.1);
scene.add(ambientLight);


// Textures
const doorTexture = textureLoader.load("./src/textures/color.jpg");


// Materials
const normalMaterial = new THREE.MeshNormalMaterial({ flatShading: true });




// Geometries
const sphereGeometry = new THREE.OctahedronGeometry(0.8, 2);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.7, 0.2, 64, 32);
const torusGeometry = new THREE.TorusGeometry(0.7, 0.32, 32, 32);



// Objects
const octa = new THREE.Mesh(sphereGeometry, normalMaterial);
octa.position.set(1.5, 0, 0);

const torusKnot = new THREE.Mesh(torusKnotGeometry, normalMaterial);
torusKnot.position.set(-1.5, -4.4, 0);

const torus = new THREE.Mesh(torusGeometry, normalMaterial);
torus.position.set(1.5, -8.6, 0);

meshes.push(octa, torusKnot, torus);
scene.add(torusKnot, octa, torus);



// Particles
let particleMaterial = null;
let particles = null;
let particleGeometry = null;

const generateParticles = () => {
	// Remove
	if (particles !== null) {
		scene.remove(particles);
	}

	if (particleMaterial !== null) {
		particleMaterial.dispose();
	}

	if (particleGeometry !== null) {
		particleGeometry.dispose();
	}

	// Material
	particleMaterial =	new THREE.PointsMaterial({ size: debugObj.PARTICLES_SIZE, sizeAttenuation: true, color: debugObj.PARTICLES_COLOR });
	
	// Geometry
	const particleCount = debugObj.PARTICLES_COUNT;
	
	const positionData = new Float32Array(particleCount * 3);

	for(let i=0; i<particleCount; i++) {
		const i3 = i * 3;
	
		positionData[i3 + 0] = (Math.random() - 0.5) * 10;
		positionData[i3 + 1] = (Math.random() - 0.5) * 30;
		positionData[i3 + 2] = (Math.random() - debugObj.PARTICLES_Z_VALUE) * 10;
	};
	
	particleGeometry = new THREE.BufferGeometry();
	particleGeometry.setAttribute("position", new THREE.BufferAttribute(positionData, 3));
	
	particles = new THREE.Points(particleGeometry, particleMaterial);

	scene.add(particles);
}

generateParticles();



// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.dampingFactor = 0.02;


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.pixelRatio = window.devicePixelRatio;
renderer.render(scene, camera);


// Updater and Animation

// Mouse Movement
window.addEventListener("mousemove", (e) => {
	cursorPositionOnScreen.x = ((e.clientX / size.width) - 0.5) * debugObj.MOUSE_MOVE_MLTIPLIER;
	cursorPositionOnScreen.y = ((e.clientY / size.height) - 0.5) * debugObj.MOUSE_MOVE_MLTIPLIER;
});


// Scroll
window.addEventListener("scroll", () => {
	scroll = window.scrollY;

	const currentSection = Math.round(scroll / size.height);
	
	console.log(currentSection);
	if (currentSection !== previousSection) {
		previousSection = currentSection;

		gsap.to(meshes[currentSection].rotation, {
			y: "+=8	",
			x: "+=6",
			duration: 2,
			ease: "power3.inOut",
		})

	}
});



const clock = new THREE.Clock();
let previousTime = 0;

(function tick() {
	const time = clock.getElapsedTime();
	const deltaTime = time - previousTime;
	previousTime = time;


	// Rotation animation
	torusKnot.rotation.y += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;
	torusKnot.rotation.x += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;

	octa.rotation.y += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;
	octa.rotation.x += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;


	torus.rotation.y += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;
	torus.rotation.x += deltaTime * debugObj.SHAPES_ROTATION_MLTIPLIER;

	// Camera scroll
	camera.position.y = (-scroll * 4.3) / size.height; // Bigger number instead of 4.3 makes the shapes scroll faster


	//Mouse move
	cameraGroup.position.x += (-cursorPositionOnScreen.x - cameraGroup.position.x) * debugObj.EASE_MLTIPLIER * deltaTime;
	cameraGroup.position.y += (cursorPositionOnScreen.y - cameraGroup.position.y) * debugObj.EASE_MLTIPLIER * deltaTime;


	// controls.update();
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

// Debug UI
gui.add(debugObj, "EASE_MLTIPLIER")
	.min(3).max(30).step(1).name("Ease Mltiplier");

gui.add(debugObj, "MOUSE_MOVE_MLTIPLIER")
	.min(0.01).max(4).step(0.01).name("Shape Movement Mltiplier");

gui.add(debugObj, "SHAPES_ROTATION_MLTIPLIER")
	.min(0.1).max(2).step(0.01).name("Shape Rotation Mltiplier");

gui.add(debugObj, "PARTICLES_SIZE")
	.min(0.01).max(0.1).step(0.01).name("Particles Size").onChange(generateParticles);

gui.add(debugObj, "PARTICLES_Z_VALUE")
	.min(0.1).max(1).step(0.01).name("Particles Z Value").onChange(generateParticles);

gui.add(debugObj, "PARTICLES_COUNT")
	.min(1000).max(50000).step(100).name("Particles Count").onFinishChange(generateParticles);

gui.addColor(debugObj, "PARTICLES_COLOR")
.name("Particles Color").onChange(generateParticles);
