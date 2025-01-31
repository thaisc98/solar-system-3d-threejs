import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// textureLoader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/');

// adding textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const moonTexture = textureLoader.load('/textures/2k_moon.jpg');
const jupiterTexture = textureLoader.load('/textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('/textures/2k_saturn.jpg');
const ringSaturnTexture = textureLoader.load('/textures/2k_saturn_ring_alpha.png');
const uranusTexture = textureLoader.load("/textures/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("/textures/2k_neptune.jpg");

const backgroundCubeMap = cubeTextureLoader.load(
  [
  'px.png',
  'nx.png',
  'py.png',
	'ny.png',
  'pz.png',
	'nz.png'
]);
// ad background
scene.background = backgroundCubeMap;

// add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({map: mercuryTexture});
const venusMaterial = new THREE.MeshStandardMaterial({map: venusTexture});
const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture});
const marsMaterial = new THREE.MeshStandardMaterial({map: marsTexture});
const jupiterMaterial = new THREE.MeshStandardMaterial({map: jupiterTexture});
const saturnMaterial = new THREE.MeshStandardMaterial({map: saturnTexture});
const ringSaturnMaterial = new THREE.MeshStandardMaterial({map: ringSaturnTexture});
ringSaturnMaterial.side = THREE.DoubleSide;
const uranusMaterial = new THREE.MeshStandardMaterial({map: uranusTexture});
const neptuneMaterial = new THREE.MeshStandardMaterial({map: neptuneTexture});

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
});

// geometry
const sphereGeometry = new THREE.SphereGeometry(1,32,32);
const ringGeometry = new THREE.RingGeometry(3, 6, 32);

var pos = ringGeometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count + 1; i++){
    v3.fromBufferAttribute(pos, i);
    ringGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
}

const sunMaterial = new THREE.MeshBasicMaterial({
 map: sunTexture
})

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);

scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.4,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
    ring: null,
  },
  {
    name: "Venus",
    radius: 0.5,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
    ring: null,
  },
  {
    name: 'Earth',
    radius: 0.8,
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
    ],
    ring: null,
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
    ring: null,
  },
  {
    name: "Jupiter",
    radius: 2,
    distance: 35,
    speed: 0.002,
    material: jupiterMaterial,
    moons: [],
    ring: null,
  },
  {
    name: "Saturn",
    radius: 1.6,
    distance: 43,
    speed: 0.0010,
    material: saturnMaterial,
    moons: [],
    ring: 
    {
      material: ringSaturnMaterial,
      movement: 30
    }
  },
  {
    name: "Uranus",
    radius: 1.2,
    distance: 50,
    speed: 0.0007,
    material: uranusMaterial,
    moons: [],
    ring: null,
  },
  {
    name: "Neptune",
    radius: 1.1,
    distance: 60,
    speed: 0.0002,
    material: neptuneMaterial,
    moons: [],
    ring: null,
  }
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

  if(planet.ring){
    const ringMesh = new  THREE.Mesh(ringGeometry, planet.ring.material)
    ringMesh.scale.setScalar(0.4);
    ringMesh.rotation.x = -30; 
    planetMesh.add(ringMesh)
  }

  return planetMesh;
})

const ambientLightPane = pane.addFolder({
  title: 'Ambient Light',
  expanded: true
});

const pointLightPane = pane.addFolder({
  title: 'Point Light',
  expanded: true
});

// add lights
const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
ambientLightPane.addBinding(ambientLight, 'intensity',{ min: 0.05, max: 1, step: 0.01});
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffcc6c,200);
pointLightPane.addBinding(pointLight, 'intensity',{ min: 1, max: 500, step: 0.01});
scene.add(pointLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);

camera.position.z = 200;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 500;
controls.minDistance = 20;
//controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// render the scene
const renderloop = () => {
  // animation
  sun.rotation.y += 0.000460;

  planetMeshes.forEach((planet, planetIndex) => {
    planet.rotation.y += planets[planetIndex].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;
    
    planet.children.forEach((element, elementIndex) => {
      if(element.geometry.type === "SphereGeometry"){
        element.rotation.y += planets[planetIndex].moons[elementIndex].speed
        element.position.x = Math.sin(element.rotation.y) * planets[planetIndex].moons[elementIndex].distance
        element.position.z = Math.cos(element.rotation.y) * planets[planetIndex].moons[elementIndex].distance
      } else { 
        element.rotation.x = Math.sin(planets[planetIndex].ring.movement) * 2;
        element.rotation.z = Math.cos(-(planets[planetIndex].ring.movement)) * 2;
      }

    })
  })

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
