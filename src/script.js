import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// space background
let stars = new Array(0);
for(let i = 100; i < 10000; i++){
  let x = THREE.MathUtils.randFloatSpread(2000);
  let y = THREE.MathUtils.randFloatSpread(2000);
  let z = THREE.MathUtils.randFloatSpread(2000);
  stars.push(x,y,z);
}
const startsGeometry = new THREE.BufferGeometry();
startsGeometry.setAttribute(
  "position", new THREE.Float32BufferAttribute(stars,3)
);
const startsMaterial = new THREE.PointsMaterial({color: 'white'});
const startField = new THREE.Points(startsGeometry, startsMaterial);
scene.add(startField);

// start
const sphereGeometry = new THREE.SphereGeometry(1,32,32);

const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xfff700
})

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);

scene.add(sun);

const earthMaterial = new THREE.MeshBasicMaterial({
  color: 'blue'
})

const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.position.x = 10;

scene.add(earth);

const moonMaterial = new THREE.MeshBasicMaterial({
  color: '#c9c9c9'
})

const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.3);
moon.position.x = 2
earth.add(moon);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

camera.position.z = 100;
camera.position.y = 5;


// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;
//controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// initialize a clock
const clock = new THREE.Clock()

// render the scene
const renderloop = () => {
  const elapsedTime = clock.getElapsedTime();

  // animation
  earth.rotation.y += 0.01;
  earth.position.x = Math.sin(elapsedTime) * 10;
  earth.position.z = Math.cos(elapsedTime) * 10;

  moon.position.x = Math.sin(elapsedTime) * 2;
  moon.position.z = Math.cos(elapsedTime) * 2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
