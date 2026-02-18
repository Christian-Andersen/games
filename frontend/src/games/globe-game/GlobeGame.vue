<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const containerRef = ref<HTMLDivElement | null>(null)
const score = ref(0)
const timeLeft = ref(30)
const gameOver = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let globe: THREE.Mesh
let targets: THREE.Group
let animationId: number
let controls: OrbitControls

const initThree = () => {
  if (!containerRef.value) return

  const width = containerRef.value.clientWidth
  const height = 500

  // Scene & Camera
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 12

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 6
  controls.maxDistance = 20

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1)
  sunLight.position.set(5, 3, 5)
  scene.add(sunLight)

  // Globe
  const textureLoader = new THREE.TextureLoader()
  const earthTexture = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  const earthBumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png')

  const geometry = new THREE.SphereGeometry(5, 64, 64)
  const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: earthBumpMap,
    bumpScale: 0.05,
    specular: new THREE.Color('grey'),
    shininess: 5,
  })
  globe = new THREE.Mesh(geometry, material)
  scene.add(globe)

  // Stars background
  const starGeometry = new THREE.BufferGeometry()
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff })
  const starVertices = []
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starVertices.push(x, y, z)
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // Targets group
  targets = new THREE.Group()
  scene.add(targets) // Add to scene instead of globe so it doesn't rotate if we added globe rotation back

  spawnTarget()

  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Handle Resize
  window.addEventListener('resize', onWindowResize)
}

const onWindowResize = () => {
  if (!containerRef.value || !camera || !renderer) return
  const width = containerRef.value.clientWidth
  camera.aspect = width / 500
  camera.updateProjectionMatrix()
  renderer.setSize(width, 500)
}

const spawnTarget = () => {
  // Clear existing targets
  targets.clear()

  // Random position on sphere
  const phi = Math.random() * Math.PI * 2
  const theta = Math.random() * Math.PI
  const radius = 5.05 // Just above surface

  const x = radius * Math.sin(theta) * Math.cos(phi)
  const y = radius * Math.cos(theta)
  const z = radius * Math.sin(theta) * Math.sin(phi)

  const targetGeo = new THREE.SphereGeometry(0.15, 16, 16)
  const targetMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.8
  })
  const target = new THREE.Mesh(targetGeo, targetMat)

  // Add a glowing effect/ring around target
  const ringGeo = new THREE.RingGeometry(0.2, 0.25, 32)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.lookAt(new THREE.Vector3(0, 0, 0))
  target.add(ring)

  target.position.set(x, y, z)
  // Make target look away from center
  target.lookAt(x * 2, y * 2, z * 2)

  targets.add(target)
}

const handleCanvasClick = (event: MouseEvent) => {
  if (gameOver.value) return

  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  )

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(targets.children, true)

  if (intersects.length > 0) {
    score.value += 1
    spawnTarget()
  }
}

const startTimer = () => {
  timeLeft.value = 30
  const timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      gameOver.value = true
      clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  initThree()
  startTimer()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  if (renderer) {
    renderer.dispose()
  }
})

const restart = () => {
  score.value = 0
  gameOver.value = false
  spawnTarget()
  startTimer()
}
</script>

<template>
  <div class="globe-game">
    <div class="hud">
      <div class="stat">Pins Found: {{ score }}</div>
      <div class="stat">Time: {{ timeLeft }}s</div>
    </div>

    <div ref="containerRef" class="canvas-container" @mousedown.prevent @click="handleCanvasClick">
      <div v-if="gameOver" class="overlay">
        <h2>MISSION COMPLETE</h2>
        <p>You located {{ score }} targets on Earth!</p>
        <button @click="restart">Launch New Mission</button>
      </div>
    </div>

    <div class="instructions">
      <p><b>Drag</b> to rotate Earth, <b>Scroll</b> to zoom. Find and click the <b>Red Beacons</b>!</p>
    </div>
  </div>
</template>

<style scoped>
.globe-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0a0a1a;
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.hud {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.canvas-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 500px;
  cursor: crosshair;
  background: radial-gradient(circle at center, #1a1a3a 0%, #050510 100%);
  border-radius: 8px;
  overflow: hidden;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.overlay h2 {
  font-size: 3rem;
  color: #ffdd00;
  margin: 0;
}
.overlay button {
  margin-top: 20px;
  padding: 12px 24px;
  background: #42b883;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}
.instructions {
  margin-top: 20px;
  color: #aaa;
}
b {
  color: #ffdd00;
}
</style>
