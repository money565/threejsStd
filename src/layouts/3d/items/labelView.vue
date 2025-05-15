<!-- eslint-disable vue/custom-event-name-casing -->
<script setup lang="ts">
// import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import type { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { useAppCacheStore } from '@/stores/appCache'
import * as THREE from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const props = defineProps({
  position: {
    type: Object as () => THREE.Vector3,
    required: true,
  },
  offset: {
    type: Object as () => THREE.Vector3,
    default: () => new THREE.Vector3(0, 0.2, 0), // 默认在物体上方0.5个单位
  },
  text: {
    type: String,
    default: '',
  },
  itemID: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'item-clicked', name: string): void
}>()
const dataLight = ref(false)
const acs = useAppCacheStore()
const labelRef = ref<HTMLElement | null>(null)
const css3DObject = ref<CSS3DObject | null>(null)
const isOnline = computed(() => {
  for (const i in acs.ItemOnline) {
    if (props.itemID === acs.ItemOnline[i].itemName) {
      return acs.ItemOnline[i].result
    }
  }
  return 0
})

function initLabel() {
  if (!labelRef.value)
    return null

  // 创建CSS3D对象
  css3DObject.value = new CSS3DSprite(labelRef.value)
  updatePosition()
  css3DObject.value.scale.set(0.05, 0.05, 0.05)

  return css3DObject.value
}

function updatePosition() {
  if (!css3DObject.value)
    return

  // 计算最终位置（物体位置 + 偏移量）
  const finalPosition = props.position.clone().add(props.offset)
  css3DObject.value.position.copy(finalPosition)
  css3DObject.value.position.y += 1
}

function labelClicked() {
  emit('item-clicked', props.text)
}

defineExpose({
  initLabel,
  updatePosition,
})

watch(() => acs.readData.refresh, () => {
  if (props.itemID === acs.readData.item) {
    dataLight.value = true
  }
  setTimeout(() => {
    dataLight.value = false
  }, 1000)
})
</script>

<template>
  <div>
    <div ref="labelRef" class="css3d-label text-center justify-center items-center opacity-70" @click.prevent="labelClicked">
      <div>
        {{ text }}
      </div>
      <div class="flex grid-cols-1">
        <div
          class="led w-1 h-1 rounded-full transition-all duration-300 ml-2"
          :class="[isOnline === 1 ? 'bg-green-500 rd-full b-1 b-white' : ' bg-red rd-full b-1 b-white']"
        />
        <div
          class="led w-1 h-1 rounded-full transition-all duration-300 ml-1"
          :class="[dataLight ? 'bg-green-500 rd-full b-1 b-white' : ' bg-white rd-full b-1 b-white']"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.css3d-label {
  width:30px;
  height: 20px;
  color: white;
  font-size: 10px;
  background: linear-gradient(90deg, rgba(0,96,255,0.2) 0%, rgba(0,228,255,0.6) 100%);
  border: 1px solid #00F0FF;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0,240,255,0.5);
  font-family: 'Orbitron', sans-serif;
  backdrop-filter: blur(5px);
}
</style>
