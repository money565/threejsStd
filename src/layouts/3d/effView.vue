<script setup lang="ts">
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

// 场景、相机、渲染器等变量
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
let controls: OrbitControls
let animationId: number

// 霓虹线参数
const lineCount = 15
const lines: THREE.Line[] = []
const lineGeometries: THREE.BufferGeometry[] = []
const lineMaterials: THREE.LineBasicMaterial[] = []
const linePoints = 50
const maxHeight = 10
const speed = 0.02
const noiseScale = 0.5

// 颜色数组 - 霓虹色系
const neonColors = [
  new THREE.Color(0xFF00FF), // 粉紫色
  new THREE.Color(0x00FFFF), // 青色
  new THREE.Color(0xFFFF00), // 黄色
  new THREE.Color(0xFF0000), // 红色
  new THREE.Color(0x00FF00), // 绿色
]

// 生成随机霓虹颜色
function getRandomNeonColor(): THREE.Color {
  return neonColors[Math.floor(Math.random() * neonColors.length)].clone()
}

// 创建电流线
function createCurrentLines() {
  for (let i = 0; i < lineCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({
      color: getRandomNeonColor(),
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    })

    // 初始位置数据
    const positions = new Float32Array(linePoints * 3)
    for (let j = 0; j < linePoints; j++) {
      const x = (j / (linePoints - 1)) * 20 - 10
      const y = Math.sin(j * 0.2) * maxHeight * (0.5 + Math.random() * 0.5)
      const z = Math.cos(j * 0.2) * maxHeight * (0.5 + Math.random() * 0.5)
      positions[j * 3] = x
      positions[j * 3 + 1] = y
      positions[j * 3 + 2] = z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const line = new THREE.Line(geometry, material)
    scene.add(line)
    lines.push(line)
    lineGeometries.push(geometry)
    lineMaterials.push(material)
  }
}

// 更新电流线动画
function updateCurrentLines() {
  const time = Date.now() * 0.001

  lines.forEach((line, i) => {
    const geometry = lineGeometries[i]
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute
    const positions = positionAttribute.array as Float32Array

    // 更新每个点的位置
    for (let j = 0; j < linePoints; j++) {
      const x = (j / (linePoints - 1)) * 20 - 10
      const noiseY = Math.sin(time * speed + i * 10 + j * 0.5) * noiseScale
      const noiseZ = Math.cos(time * speed + i * 10 + j * 0.3) * noiseScale

      const y = Math.sin(j * 0.2 + time * speed * 2) * maxHeight * (0.5 + noiseY * 0.5)
      const z = Math.cos(j * 0.2 + time * speed * 2) * maxHeight * (0.5 + noiseZ * 0.5)

      positions[j * 3] = x
      positions[j * 3 + 1] = y
      positions[j * 3 + 2] = z
    }

    positionAttribute.needsUpdate = true

    // 轻微改变颜色亮度
    const color = lineMaterials[i].color
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    hsl.l = 0.7 + Math.sin(time * 0.5 + i) * 0.3
    color.setHSL(hsl.h, hsl.s, hsl.l)
  })
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)
  updateCurrentLines()
  controls.update()
  renderer.render(scene, camera)
}

// 初始化场景
function initScene() {
  if (!container.value)
    return

  // 设置渲染器
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  // 设置相机
  camera.position.z = 30
  camera.position.y = 10
  camera.lookAt(0, 0, 0)

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // 添加点光源增强霓虹效果
  const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // 创建电流线
  createCurrentLines()

  // 开始动画
  animate()

  // 窗口大小调整
  window.addEventListener('resize', handleResize)
}

function handleResize() {
  if (!container.value)
    return

  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

onMounted(() => {
  initScene()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationId)
  if (container.value && renderer.domElement) {
    container.value.removeChild(renderer.domElement)
  }

  // 清理资源
  lines.forEach(line => scene.remove(line))
  lineGeometries.forEach(geom => geom.dispose())
  lineMaterials.forEach(mat => mat.dispose())
})
</script>

<template>
  <div id="mythreejs" ref="container" class="neon-container" />
</template>

  <style scoped>
  .neon-container {
    width: 100%;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
  }
  </style>
