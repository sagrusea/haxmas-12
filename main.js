import * as THREE from 'three';
import './style.css';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setSize(window.innerWidth, window.innerHeight);

// --- POST PROCESSING (BLOOM) ---
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.1);
composer.addPass(bloomPass);

// --- OBJECTS ---
const donut_geo = new THREE.TorusGeometry(10, 3, 16, 100);
// toneMapped: false is key for the glow!
const donut_tex = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
const donut = new THREE.Mesh(donut_geo, donut_tex);
scene.add(donut);

// Add Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

camera.position.z = 30;

// --- MOUSE MOVEMENT (UNIQUE FEATURE) ---
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) / 100;
  mouseY = (e.clientY - window.innerHeight / 2) / 100;
});

// --- ANIMATION LOOP ---
function animate() {
  requestAnimationFrame(animate);

  donut.rotation.x += 0.01;
  donut.rotation.y += 0.01;

  // Camera subtly follows the mouse for a 3D parallax effect
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  composer.render(); // Use composer instead of renderer
}

animate();