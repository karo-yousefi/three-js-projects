// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";


// HTML Elemets
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


// Scene
const scene = new THREE.Scene();


// Fog
const fog = new THREE.Fog("#262837", 3, 10);
scene.fog = fog;


// Camera
const camera = new THREE.PerspectiveCamera(65, size.width / size.height, 0.01, 100);
camera.position.set(-3, 2, 5);
scene.add(camera);


// Lights
const ambientLight = new THREE.AmbientLight("#fff", 0.08);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#aaf", 0.2);
directionalLight.position.set(-3.5, 4, 2.5); 
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLightOne = new THREE.PointLight("#f20045", 0.6, 3, 0.9);
pointLightOne.castShadow = true;
scene.add(pointLightOne);

const pointLightTwo = new THREE.PointLight("#007df2", 0.7, 3, 0.9);
pointLightTwo.castShadow = true;
scene.add(pointLightTwo);

const pointLightThree = new THREE.PointLight("#41f200", 0.5, 3, 0.9);
pointLightThree.castShadow = true;
scene.add(pointLightThree);


// Textures
const screenTexture = textureLoader.load("./src/textures/screen-texture.png");


// Materiald
const wallMaterial = new THREE.MeshStandardMaterial({ color: "#fff" });
const tableOneMaterial = new THREE.MeshStandardMaterial({ color: "#10162e" });
const tableLegsMaterial = new THREE.MeshStandardMaterial({ color: "#12132b" });
const glassMaterial = new THREE.MeshPhysicalMaterial({
	color: "#fff",
	transmission: 0.9,
	opacity: 1,
	transparent: true,
	roughness: 0,
	metalness: 0,
	ior: 1.5,
	thickness: 1, 
	specularIntensity: 1,
	reflectivity: 0.5,
 });
const chairMaterial = new THREE.MeshStandardMaterial({ color: "#217ea6" });
const chairLegMaterial = new THREE.MeshStandardMaterial({ color: "#196485" });
const monitorMaterial = new THREE.MeshStandardMaterial({ color: "#fff" });
const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });


// Geometries
const wallGeometry = new THREE.BoxGeometry(3, 3, 0.1);
const tableOneGeometry = new THREE.BoxGeometry(1.8, 0.05, 1);
const tableLegGeometry = new THREE.BoxGeometry(0.09, 0.8, 0.09);
const chairGeometry = new THREE.BoxGeometry(0.4, 0.04, 0.4);
const chairLegGeometry = new THREE.BoxGeometry(0.04, 0.5, 0.04);
const lightBallGeometry = new THREE.OctahedronGeometry(0.08);
const screenGeometry = new THREE.BoxGeometry(0.53, 0.3, 0.01);
const monitorGeometry = new THREE.BoxGeometry(0.55, 0.32, 0.03);
const monitorBaseOne = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 16, 16);
const monitorBaseTwo = new THREE.BoxGeometry(0.24, 0.01, 0.12);



// Objects
const roomGroup = new THREE.Group();
const tableGroup = new THREE.Group();
const chairGroup = new THREE.Group();
const computerGroup = new THREE.Group();
const lightBallsGroups = new THREE.Group();


// Room
const wallOne = new THREE.Mesh(wallGeometry, wallMaterial);
wallOne.position.set(-1.5, 1.5 ,0);
wallOne.receiveShadow = true;

const wallTwo = new THREE.Mesh(wallGeometry, wallMaterial);
wallTwo.rotation.y = Math.PI / 2;
wallTwo.position.set(0, 1.5, 1.5);
wallTwo.receiveShadow = true;

const floor = new THREE.Mesh(wallGeometry, wallMaterial);
floor.rotation.x = Math.PI / 2;
floor.position.set(-1.5, 0, 1.5)
floor.receiveShadow = true;

roomGroup.add(
	wallOne,
	wallTwo,
	floor,
);

// Table
const tableOne = new THREE.Mesh(tableOneGeometry, tableOneMaterial);
tableOne.position.set(-0.9, 0.8, 0.5);
tableOne.castShadow = true;
tableOne.receiveShadow = true;

const tableOneLegOne = new THREE.Mesh(tableLegGeometry, tableLegsMaterial);
tableOneLegOne.position.set(-1.65, 0.4, 0.9);
tableOneLegOne.castShadow = true;
tableOneLegOne.receiveShadow = true;

const tableOneLegTwo = new THREE.Mesh(tableLegGeometry, tableLegsMaterial);
tableOneLegTwo.position.set(-0.3, 0.4, 0.9);
tableOneLegTwo.castShadow = true;
tableOneLegTwo.receiveShadow = true;

tableGroup.add(
	tableOne,
	tableOneLegOne,
	tableOneLegTwo,
);

// Chair
const chairOne = new THREE.Mesh(chairGeometry, chairMaterial);
chairOne.position.set(-0.9, 0.5, 1.4);
chairOne.castShadow = true;
chairOne.receiveShadow = true;

const chairOneLegOne = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
chairOneLegOne.position.set(-0.756, 0.24, 1.55);
chairOneLegOne.castShadow = true;
chairOneLegOne.receiveShadow = true;

const chairOneLegTwo = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
chairOneLegTwo.position.set(-0.756, 0.24, 1.26);
chairOneLegTwo.castShadow = true;
chairOneLegTwo.receiveShadow = true;

const chairOneLegThree = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
chairOneLegThree.position.set(-1.035, 0.24, 1.55);
chairOneLegThree.castShadow = true;
chairOneLegThree.receiveShadow = true;

const chairOneLegFour = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
chairOneLegFour.position.set(-1.035, 0.24, 1.26);
chairOneLegFour.castShadow = true;
chairOneLegFour.receiveShadow = true;

const chairOneBack = new THREE.Mesh(chairGeometry, chairMaterial);
chairOneBack.rotation.x = Math.PI / 2;
chairOneBack.position.set(-0.9, 0.7, 1.6);
chairOneBack.castShadow = true;
chairOneBack.receiveShadow = true;

chairGroup.add(chairOne,
	chairOneLegOne,
	chairOneLegTwo,
	chairOneLegThree,
	chairOneLegFour,
	chairOneBack,
);

// Light Balls
const lightBallOne = new THREE.Mesh(lightBallGeometry, glassMaterial);
lightBallOne.position.set(-2, 2, 0.1);
pointLightOne.position.set(-2, 2, 0.1);

const lightBallTwo = new THREE.Mesh(lightBallGeometry, glassMaterial);
lightBallTwo.position.set(-0.8, 1.4, 0.1);
pointLightTwo.position.set(-0.8, 1.4, 0.1);

const lightBallThree = new THREE.Mesh(lightBallGeometry, glassMaterial);
lightBallThree.position.set(-0.1, 1.7, 1.5);
pointLightThree.position.set(-0.1, 1.7, 1.5);

lightBallsGroups.add(
	lightBallOne,
	lightBallTwo,
	lightBallThree,
);

// Computer
const computerMonitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
computerMonitor.position.set(-0.9, 1.05, 0.4);

const computerScreen = new THREE.Mesh(screenGeometry, screenMaterial);
computerScreen.position.set(-0.9005, 1.055, 0.415);

const computerBaseOne = new THREE.Mesh(monitorBaseOne, monitorMaterial);
computerBaseOne.position.set(-0.9, 0.85, 0.39);

const computerBaseTwo = new THREE.Mesh(monitorBaseTwo, monitorMaterial);
computerBaseTwo.position.set(-0.9, 0.83, 0.39)

computerGroup.add(
	computerMonitor,
	computerScreen,
	computerBaseOne,
	computerBaseTwo,
);


scene.add(
	roomGroup,
	tableGroup,
	chairGroup,
	lightBallsGroups,
	computerGroup,
);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.02;


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.pixelRatio = window.devicePixelRatio;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.render(scene, camera);


// Updater
(function tick() {


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
