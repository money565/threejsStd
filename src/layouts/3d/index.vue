<!-- eslint-disable antfu/consistent-list-newline -->
<script setup lang="ts">
import type { targetPositonOpt } from './funcs'
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { addLights, deleteSelect, importObjects, onKeyDown, onKeyUp, selectItem, updateCameraPosition } from './funcs'
import labelView from './items/labelView.vue'

const user = useUserStore()
const acs = useAppCacheStore()
const container = ref<HTMLElement | null>(null)
const css3dRenderer = new CSS3DRenderer()
const css3dContainer = ref<HTMLElement | null>(null)
const labelRefs = ref<InstanceType<typeof labelView>[] | any>([])
const labelsItem = ref<targetPositonOpt[]>([])
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 启用抗锯齿
  alpha: true,
})

// renderer.setPixelRatio(window.devicePixelRatio * 1.2)
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

const controls = new OrbitControls(camera, renderer.domElement)
const lookAtPoint = new THREE.Vector3(0, 0, 0)
// const axesHelper = new THREE.AxesHelper(5)

function initCSS3D() {
  css3dRenderer.setSize(window.innerWidth, window.innerHeight)
  css3dRenderer.domElement.style.position = 'absolute'
  css3dRenderer.domElement.style.top = '0'
  css3dRenderer.domElement.style.pointerEvents = 'none'
  if (css3dContainer.value !== null) {
    css3dContainer.value.appendChild(css3dRenderer.domElement)
  }
}
const css3dScene = new THREE.Scene()
const scaleGroup = new THREE.Group()
scaleGroup.scale.set(1, 1, 1) // 整体缩小
css3dScene.add(scaleGroup)

onMounted(() => {
  // 初始化场景
  scene.background = new THREE.Color(0x8B8378)

  // 初始化相机
  camera.position.x = -13
  camera.position.z = -13
  camera.position.y = 12
  camera.lookAt(lookAtPoint)
  renderer.shadowMap.enabled = false
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value?.appendChild(renderer.domElement)
  addLights(scene)
  initCSS3D()
  importObjects(scene).then((res: any) => {
    labelsItem.value = res
    nextTick(() => {
      labelRefs.value.forEach((label: { initLabel: () => any }) => {
        if (label) {
          const css3DObject = label.initLabel()
          if (css3DObject) {
            scaleGroup.add(css3DObject)
            // scene.add(css3DObject)
          }
        }
      })
    })
  })
  // scene.add(axesHelper)
  // 初始化轨道控制器
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = true

  // controls.autoRotate = true
  const animate = () => {
    updateCameraPosition(camera, controls)
    requestAnimationFrame(animate)
    labelsItem.value.forEach((item, index) => {
      item.object.getWorldPosition(item.position)
      if (labelRefs.value[index]) {
        labelRefs.value[index].updatePosition()
      }
    })
    controls.update()
    // composer.render()
    renderer.render(scene, camera)
    css3dRenderer.render(css3dScene, camera)
  }
  animate()
})

const mousePosit = ref<number[]>([])
const mouseDownContent = ref('')
function mousePress(event: any) {
  if (event.target.tagName === 'DIV') {
    if (acs.canBeClickedItem.includes(event.target.textContent))
      mouseDownContent.value = event.target.textContent
  }
  else {
    mousePosit.value = [event.clientX, event.clientY]
  }
}
function mouseRelax(event: any) {
  if (event.target.tagName !== 'DIV') {
    if (event.clientX !== mousePosit.value[0] || event.clientY !== mousePosit.value[1]) {
      // TODO 表示旋转，无需处理
    }
    else {
      if (event.target.hasAttribute('data-engine')) {
        deleteSelect()
        acs.resetData()
        acs.allOverView = true
        acs.currentItem = '-'
        let ids = ''
        for (const i in acs.canBeClickedItem) {
          if (Number(i) === 0) {
            ids = acs.canBeClickedItem[i]
          }
          else {
            ids = `${ids}_${acs.canBeClickedItem[i]}`
          }
        }
        publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, `allInit&${ids}`)
      }
    }
  }
}
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  css3dRenderer.setSize(window.innerWidth, window.innerHeight)
}

function labelClicked(name: string) {
  selectItem(scene, name)
  acs.allOverView = false
}

window.addEventListener('resize', handleResize)

// window.addEventListener('click', onMouseClick)
window.addEventListener('mousedown', mousePress)
window.addEventListener('mouseup', mouseRelax)
window.addEventListener('', mouseRelax)
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
onUnmounted(() => {
  // 清理资源
  renderer.dispose()
  controls.dispose()
})
</script>

<template>
  <div class="relative w-100% h-screen overflow-y-auto scrollbar-none">
    <div ref="container" class="three-container absolute top-0 left-0" />
    <div ref="css3dContainer" class="css3d-container" />
    <!-- 动态生成所有标签 -->
    <template v-for="(item, index) in labelsItem" :key="index">
      <labelView
        v-if="item.visible"
        :ref="el => { if (el) labelRefs[index] = el }"
        :position="item.position"
        :text="item.name"
        :item-i-d="item.name"
        @item-clicked="labelClicked"
      />
    </template>
  </div>
</template>

<style scoped>
.three-container {
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}
.css3d-container {
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
