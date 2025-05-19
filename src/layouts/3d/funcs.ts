import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import * as THREE from 'three'
import { Line } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const acs = useAppCacheStore()
const user = useUserStore()
const moveSpeed = 0.3
const activeKeys = {
  w: false,
  a: false,
  s: false,
  d: false,
}
const canBeClickedItem = acs.canBeClickedItem

export function onKeyDown(event: KeyboardEvent) {
  switch (event.key.toLowerCase()) {
    case 'w': activeKeys.w = true
      break
    case 'a': activeKeys.a = true
      break
    case 's': activeKeys.s = true
      break
    case 'd': activeKeys.d = true
      break
  }
}
// 处理键盘释放
export function onKeyUp(event: KeyboardEvent) {
  switch (event.key.toLowerCase()) {
    case 'w': activeKeys.w = false
      break
    case 'a': activeKeys.a = false
      break
    case 's': activeKeys.s = false
      break
    case 'd': activeKeys.d = false
      break
  }
}
export function updateCameraPosition(camera: { getWorldDirection: (arg0: any) => void, position: { addScaledVector: (arg0: any, arg1: number) => void } }, controls: { target: { addScaledVector: (arg0: any, arg1: number) => void }, update: () => void }) {
// 获取相机的前向向量（不包括垂直分量）
  const forward = new THREE.Vector3()
  camera.getWorldDirection(forward)
  forward.y = 0
  forward.normalize()

  // 获取相机的右向向量
  const right = new THREE.Vector3()
  right.crossVectors(new THREE.Vector3(0, 1, 0), forward)

  if (activeKeys.w) { // 向前移动
    camera.position.addScaledVector(forward, moveSpeed)
    controls.target.addScaledVector(forward, moveSpeed)
  }
  if (activeKeys.s) { // 向后移动
    camera.position.addScaledVector(forward, -moveSpeed)
    controls.target.addScaledVector(forward, -moveSpeed)
  }
  if (activeKeys.a) { // 向左移动
    camera.position.addScaledVector(right, moveSpeed)
    controls.target.addScaledVector(right, moveSpeed)
  }
  if (activeKeys.d) { // 向右移动
    camera.position.addScaledVector(right, -moveSpeed)
    controls.target.addScaledVector(right, -moveSpeed)
  }

  // 更新OrbitControls
  controls.update()
}

export function addLights(scene: { add: (arg0: THREE.PointLight | THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>) => void }) {
  const lightCount = [16, 8]
  const distance = [-35, -15]
  const lightY = [12, 12]
  const lightZ = [11, -10]
  const intensity = 0.5
  const lightRow = 2
  for (let t = 0; t < lightRow; t++) {
    for (let i = 0; i < lightCount[t]; i++) {
      const lightPosit = [i * distance[t] / lightCount[t] - distance[t] / 4, lightY[t], lightZ[t]]
      const light = new THREE.PointLight(0xFFFFFF, intensity, 0, 0.2)
      light.castShadow = true
      light.position.set(lightPosit[0], lightPosit[1], lightPosit[2])
      scene.add(light)

      // const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
      // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      // sphere.position.set(lightPosit[0], lightPosit[1], lightPosit[2])
      // scene.add(sphere)
    }
  }
}

export interface targetPositonOpt {
  name: string
  position: THREE.Vector3
  visible: boolean
  object: THREE.Object3D
}
const targetPositon = ref<targetPositonOpt[]>([])

export function importObjects(scene: any) {
  // 初始化后处理器
  return new Promise((reactive, reject) => {
    const loader2 = new GLTFLoader()
    try {
      loader2.load(
        '/public/pdf.glb',
        // 加载完成回调
        (gltf) => {
        // 模型加载完成后，场景中添加模型

          const model = gltf.scene
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
            // 允许接收和投射阴影
              child.castShadow = true
              child.receiveShadow = true
              if (child.parent !== null) {
                if (canBeClickedItem.includes(child.parent.name)) {
                  let noFlag = false
                  for (const i in targetPositon.value) {
                    if (targetPositon.value[i].name === child.parent.name) {
                      noFlag = true
                    }
                  }
                  if (!noFlag) {
                    const position = new THREE.Vector3()
                    child.getWorldPosition(position)
                    targetPositon.value.push({
                      name: child.parent.name,
                      position,
                      visible: true,
                      object: child,
                    })
                  }
                }
              }
            }
          })
          model.position.set(-25, 0, 13)
          scene.add(model)
          reactive(targetPositon.value)
        // 可以访问模型中的各个部分
        // 例如：gltf.scene, gltf.scenes, gltf.cameras, gltf.animations, gltf.asset
        },
      )
    }
    catch (error) {
      reject(error)
    }
  })
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let downItemName = ''

export function onMouseDown(event: any, camera: THREE.Camera, scene: { children: THREE.Object3D<THREE.Object3DEventMap>[] }) {
  mouse.x = (event!.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event!.clientY / window.innerHeight) * 2 + 1
  // 通过相机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 计算射线与场景中物体的交点
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects[0]) {
    if ('object' in intersects[0]) {
      downItemName = intersects[0].object.parent!.name
    }
  }
}

let lines: any[] = []
let objects: any = []
export function deleteSelect() {
  if (lines.length > 0 && objects.length > 0 && objects.length === lines.length) {
    for (const index_t in objects) {
      const index = Number(index_t)
      objects[index_t].remove(lines[index])
      // 从父对象中移除
      lines[index].geometry.dispose() // 释放几何体内存
      lines[index].material.dispose() // 释放材质内存
    }
    objects = []
    lines = []
  }
}

export function selectItem(scene: { traverse: (arg0: (object: any) => void) => void }, targetItem: string) {
  if (lines.length > 0 && objects.length > 0 && objects.length === lines.length) {
    for (const index_t in objects) {
      const index = Number(index_t)
      objects[index_t].remove(lines[index])
      // 从父对象中移除
      lines[index].geometry.dispose() // 释放几何体内存
      lines[index].material.dispose() // 释放材质内存
    }
    objects = []
    lines = []
  }
  scene.traverse((object: any) => {
    if (object.parent) {
      if (object.parent.name === targetItem && object.isMesh) {
        objects.push(object)
      }
    }
  })
  for (const x in objects) {
    const edges = new THREE.EdgesGeometry(objects[x].geometry)
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 2 }),
    )
    objects[x].add(line)
    lines.push(line)
  }
  if(acs.currentItem !== targetItem){
      acs.currentItem = targetItem
      acs.resetData()
      publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, `${targetItem}_init`)
    }
}

export function onMouseUp(event: any, camera: THREE.Camera, scene: any) {
  mouse.x = (event!.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event!.clientY / window.innerHeight) * 2 + 1
  // 通过相机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 计算射线与场景中物体的交点
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects[0]) {
    if ('object' in intersects[0]) {
      const itemName = intersects[0].object.parent!.name
      if (itemName === downItemName && canBeClickedItem.includes(itemName)) {
        if (intersects[0].object instanceof THREE.Mesh || intersects[0].object instanceof Line) {
          selectItem(scene, itemName)
        }
        else {
          console.warn('Object does not have geometry:', intersects[0].object)
        }

        // outlinePass.selectedObjects = clickedItem.value
      }
    }
  }
}

export function onMouseUpAndDown(event: any, camera: THREE.Camera, scene: any) {
  mouse.x = (event!.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event!.clientY / window.innerHeight) * 2 + 1
  // 通过相机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera)
  // 计算射线与场景中物体的交点
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects[0]) {
    if ('object' in intersects[0]) {
      const itemName = intersects[0].object.parent!.name
      return itemName
    }
  }
  return ''
}
