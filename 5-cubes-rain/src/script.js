// Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import CANNON, { Vec3 } from "cannon";


// HTML Elements
const canvas = document.querySelector(".webgl");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.querySelector("#progress-bar");


// Inits
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gui = new GUI({ width: 350 });
const world = new CANNON.World();


// Constants
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const objectsToUpdate = [];

const hitSound = new Audio("./src/audio/hit.mp3");


// Physics
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;


// Materials
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, { friction: 0.2, restitution: 0.6 });


// Shapes
const sphereShape = new CANNON.Sphere(1);
const planeShape = new CANNON.Plane();
const wallShape = new CANNON.Box(new CANNON.Vec3(5, 2.5, 0.1));


// Bodies

const planeBody = new CANNON.Body({ mass: 0, shape: planeShape, material: defaultMaterial });
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

const wallBodyOne = new CANNON.Body({ mass: 0, shape: wallShape, material: defaultMaterial });
wallBodyOne.position.set(0, 2.5, -5);

const wallBodyTwo = new CANNON.Body({ mass: 0, shape: wallShape, material: defaultMaterial });
wallBodyTwo.position.set(5, 2.5, 0);
wallBodyTwo.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);

const wallBodyThree = new CANNON.Body({ mass: 0, shape: wallShape, material: defaultMaterial });
wallBodyThree.position.set(-5, 2.5, 0);
wallBodyThree.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);



// Adding to the world
world.addBody(planeBody);
world.addContactMaterial(defaultContactMaterial);
world.addBody(wallBodyOne);
world.addBody(wallBodyTwo);
world.addBody(wallBodyThree);


// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog("#262837", 3, 10);
// scene.fog = fog;


// Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.01, 100);
camera.position.set(0, 3, 5);
scene.add(camera);


// Lights
const ambientLight = new THREE.AmbientLight("#fff", 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 7, 20, 1)
pointLight.position.set(5, 4, 5);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);


// Textures
const doorTexture = textureLoader.load("./src/textures/color.jpg");


// Materials
const basicMaterial = new THREE.MeshBasicMaterial({ color: "#fff" });

const standardMaterial = new THREE.MeshStandardMaterial({ color: "#fff" });

const shapeMaterial = new THREE.MeshStandardMaterial({ color: "#f09" });
shapeMaterial.roughness = 0.1;


// Geometries
const boxGeometry = new THREE.BoxGeometry();
const wallGeometry = new THREE.BoxGeometry(10, 5, 0.2);
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(10, 10);


// Objects
const plane = new THREE.Mesh(planeGeometry, standardMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;


const wallOne = new THREE.Mesh(wallGeometry, standardMaterial);
wallOne.position.set(0, 2.5, -5);
wallOne.receiveShadow = true;

const wallTwo = new THREE.Mesh(wallGeometry, standardMaterial);
wallTwo.position.set(5, 2.5, 0);
wallTwo.rotation.y = Math.PI / 2;
wallTwo.receiveShadow = true;

const wallThree = new THREE.Mesh(wallGeometry, standardMaterial);
wallThree.position.set(-5, 2.5, 0);
wallThree.rotation.y = Math.PI / 2;
wallThree.receiveShadow = true;


scene.add(plane, wallOne, wallTwo, wallThree);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.02;


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.shadowMap.enabled = true;
renderer.pixelRatio = window.devicePixelRatio;
renderer.render(scene, camera);


// Utils
const playHitSound = (collision) => {
	hitSound.currentTime = 0;

		const impactStrength = collision.contact.getImpactVelocityAlongNormal();

		// Chaging the impact sound based on the collision speed
		if (impactStrength < 0.8) {
			hitSound.volume = 0;
		}

		else if (impactStrength < 1.5 && impactStrength > 0.8){
			hitSound.volume = 0.15;
		}

		else if (impactStrength < 3 && impactStrength > 1.5) {
			hitSound.volume = 0.3;
		}

		else if (impactStrength < 5 && impactStrength > 3) {
			hitSound.volume = 0.6;
		}

		else if (impactStrength < 8 && impactStrength > 5) {
			hitSound.volume = 0.8;
		}
		else {
			hitSound.volume = 1;
		}

		hitSound.play();
};

const boxGenerator = (x, y, z, position) => {
	// Mesh
	const mesh = new THREE.Mesh(boxGeometry, shapeMaterial);
	mesh.scale.set(z, y, z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position.copy(position);

	scene.add(mesh);


	// Physics
	const body = new CANNON.Body({
		mass: 1,
		shape: new CANNON.Box(new CANNON.Vec3(x/2, y/2, z/2)),
		material: defaultMaterial
	});
	body.position.copy(position);

	world.addBody(body); 
	objectsToUpdate.push({ mesh, body }); // Saving both the mesh and the body in an array


	// Handling collision sound
	body.addEventListener("collide", playHitSound);
};

// Debug gui
const debugObj = {
	createSphere: () => {
	boxGenerator(
		Math.random() / 2 + 0.2,
		Math.random() / 2 + 0.2,
		Math.random() / 2 + 0.2,
		{
		x: (Math.random() - 0.5) * 2,
		y: 5,
		z: (Math.random() - 0.5) * 2,
		});
	},
	reset: () => {
		objectsToUpdate.forEach((object) => {
			object.body.removeEventListener("collide", playHitSound);
			scene.remove(object.mesh);
			world.remove(object.body);
		})
	},
};


gui.add(debugObj, "createSphere");
gui.add(debugObj, "reset");


// Updater and Animation
const clock = new THREE.Clock();
let previousTime = 0;

(function tick() {
	const time = clock.getElapsedTime();
	const deltaTime = time - previousTime;
	previousTime = time;


	// Updating the physicss
	world.step(1/60, deltaTime, 3);

	objectsToUpdate.forEach((object) => {
		object.mesh.position.copy(object.body.position);
		object.mesh.quaternion.copy(object.body.quaternion);
	})

	// Updating the controls
	controls.update();

	// Updating the renderer
	renderer.render(scene, camera);

	requestAnimationFrame(tick);
})();


// Misc

// Loading manager
loadingManager.onStart = () => {
	progressBarContainer.style.display = "block";
}

loadingManager.onProgress = (_, item, total) => {
	progressBar.value = (item / total) * 100;
}

loadingManager.onLoad = () => {
	progressBarContainer.style.display = "none";
}

// Double click = fullscreen
// window.addEventListener("dblclick", () => {
// 	if (!document.fullscreenElement) {
// 		canvas.requestFullscreen();
// 	}
// 	else {
// 		document.exitFullscreen();
// 	}
// });


// Handling resizes
window.addEventListener("resize", () => {
	size.width = window.innerWidth;
	size.height = window.innerHeight;

	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();

	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio = window.devicePixelRatio;
})