import * as THREE from 'three'
import './style.css'

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x020617, 40, 180)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

camera.position.set(0, 5, 50)

const ambient = new THREE.AmbientLight(0x8899aa, 1.2)
scene.add(ambient)

const moonLight = new THREE.PointLight(0xaaccff, 2.5)
moonLight.position.set(30, 50, 30)
scene.add(moonLight)

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(12, 64, 64),
  new THREE.MeshPhysicalMaterial({
    color: 0xcce9ff,
    roughness: 0.05,
    transmission: 1,
    thickness: 1,
    transparent: true,
    opacity: 0.35
  })
)
scene.add(globe)

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(9, 10, 4, 64),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x223355
  })
)
base.position.y = -10
scene.add(base)

const treeGroup = new THREE.Group()

for (let i = 0; i < 4; i++) {
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(4 - i * 0.7, 5, 32),
    new THREE.MeshStandardMaterial({
      color: 0x0b6623
    })
  )
  cone.position.y = -5 + i * 2.8
  treeGroup.add(cone)
}

const trunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 1, 3, 16),
  new THREE.MeshStandardMaterial({ color: 0x4b2e1a })
)
trunk.position.y = -7
treeGroup.add(trunk)

scene.add(treeGroup)

const snowGeometry = new THREE.BufferGeometry()
const snowCount = 4000
const snowPositions = new Float32Array(snowCount * 3)

for (let i = 0; i < snowPositions.length; i += 3) {
  snowPositions[i] = THREE.MathUtils.randFloatSpread(200)
  snowPositions[i + 1] = Math.random() * 150
  snowPositions[i + 2] = THREE.MathUtils.randFloatSpread(200)
}

snowGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(snowPositions, 3)
)

const snow = new THREE.Points(
  snowGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7
  })
)
scene.add(snow)

let clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()

  globe.rotation.y += 0.0015
  treeGroup.rotation.y = Math.sin(t * 0.3) * 0.1

  moonLight.intensity = 2 + Math.sin(t) * 0.5

  const pos = snow.geometry.attributes.position.array
  for (let i = 1; i < pos.length; i += 3) {
    pos[i] -= 0.3
    if (pos[i] < -80) pos[i] = 150
  }
  snow.geometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}

function onScroll() {
  const t = document.body.getBoundingClientRect().top
  camera.position.z = 50 + t * -0.025
  camera.position.y = 5 + t * -0.01
}

window.addEventListener('scroll', onScroll)

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
