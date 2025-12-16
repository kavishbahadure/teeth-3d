import * as THREE from "https://cdn.skypack.dev/three@0.152.2"
import { OrbitControls } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/controls/OrbitControls.js"
import { RGBELoader } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/loaders/RGBELoader.js"
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.152.2/examples/jsm/loaders/GLTFLoader.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 6)

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// ENVIRONMENT (chrome)
new RGBELoader()
  .load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr", (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = hdr
  })

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.15))

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(5, 5, 5)
scene.add(dirLight)

// LOAD MODEL
const loader = new GLTFLoader()
loader.load("./tooth2.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 1.3,
      })
    }
  })
  scene.add(gltf.scene)
})

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

})
