// Imports
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { OrbitControls } from "three/examples/jsm/Addons.js";


// HTML elemnts
const canvas = document.querySelector(".webgl");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.querySelector("#progress-bar");


// Constants
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};


// Inits
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
gsap.registerPlugin(ScrollTrigger);

// Scene
const scene = new THREE.Scene();


// Camera
const camera = new THREE.PerspectiveCamera(65, size.width / size.height, 0.01, 100);
camera.position.z = 15;
scene.add(camera);


// Lights



// Geometries
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 32);


// Textures
const matcapTexture = textureLoader.load("./src/textures/matcaps/1.png");


// Materials
const normalMaterial = new THREE.MeshNormalMaterial();


// Objects
for (let i=0; i<1100; i++){
	const donut = new THREE.Mesh(donutGeometry, normalMaterial);

	const posX = (Math.random() - 0.5) * 40;
	const posY = (Math.random() - 0.5) * 40;
	const posZ = (Math.random() - 0.5) * 40;

	const rotationX = (Math.random() - 0.5) * Math.PI;
	const rotationY = (Math.random() - 0.5) * Math.PI;

	const scale = Math.random() + 0.2;

	donut.position.set(posX, posY, posZ);
	donut.rotation.set(rotationX, rotationY, 0);
	donut.scale.set(scale, scale, scale);

	scene.add(donut);
}

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

renderer.render(scene, camera);


// Animation
gsap.timeline({
	scrollTrigger: {
		trigger: canvas,
		start: "top top",
		end: "+=2000",
		scrub: true,
		pin: true,
	}
})
	.to(camera.position, {
		z: -3,
		duration: 5,
		ease: "power2.inOut",
	})

	.to(camera.rotation, {
		y: Math.PI / 2,
		duration: 5,
		ease: "power2.inOut",
	})

	.to(camera.position, {
		x: 10,
		duration: 3,
		ease: "power2.inOut",
	})

	.to(camera.rotation, {
		x: Math.PI / 2,
		duration: 10,
		ease: "power2.inOut",
	})

	.to(camera.position, {
		z: 13,
		y: 10,
		duration: 8,
		ease: "power2.inOut",
	})



// Updater
const clock = new THREE.Clock();
const tick = () => {
	const time = clock.getElapsedTime();


	// controls.update();
	
	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}

tick();

// Misc
window.addEventListener("resize", () => {
	size.width = window.innerWidth;
	size.height = window.innerHeight;

	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();	

	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
})

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	}
	else {
		document.exitFullscreen();
	}
})

loadingManager.onStart = () => {
	progressBarContainer.style.display = "block";
}

loadingManager.onProgress = (_, item, total) => {
	progressBar.value = (item / total) * 100;
}

loadingManager.onLoad = () => {
	progressBarContainer.style.display = "none";
}