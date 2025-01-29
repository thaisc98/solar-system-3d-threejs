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

// textureLoader
const textureLoader = new THREE.TextureLoader();

// adding textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg')
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg')
const marsTexture = textureLoader.load('/textures/2k_mars.jpg')
const moonTexture = textureLoader.load('/textures/2k_moon.jpg')

// add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture
});

const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture
});

const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture
});

const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture
});

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
});

// start
const sphereGeometry = new THREE.SphereGeometry(1,32,32);

const sunMaterial = new THREE.MeshBasicMaterial({
 map: sunTexture
})

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);

scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.3,
        distance: 2,
        speed: 0.015,
      }
    ]
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
]

const createPlanet = (planet) => {
  // create the mesh and add it to the scene
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material)

  // set the scale
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance

  return planetMesh
}

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh

}

const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);

  scene.add(planetMesh);

  //loop thought each moon and create a the moon
  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  })

  return planetMesh;
})

console.log(planetMeshes);

// add lights
const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight)

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

  // // animation
  // earth.rotation.y += 0.01;
  // earth.position.x = Math.sin(elapsedTime) * 10;
  // earth.position.z = Math.cos(elapsedTime) * 10;

  // moon.position.x = Math.sin(elapsedTime) * 2;
  // moon.position.z = Math.cos(elapsedTime) * 2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
