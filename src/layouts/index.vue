<script setup lang="ts">
import type { MqttClient } from 'mqtt'
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { connMqtt, publish, subscribe } from '@/views/items/datas/mqtt'
import thView from './3d/index.vue'
import allOverView from './card/allOverView.vue'
import bottomView from './card/bottom/index.vue'
import left1View from './card/left1.vue'
import left2View from './card/left2.vue'
import left3View from './card/left3.vue'
import right1View from './card/right1.vue'
import right2View from './card/right2.vue'
import topView from './card/top/index.vue'

const user = useUserStore()
const acs = useAppCacheStore()
// 左侧面板状态
const leftOpen = ref(false)
const leftPanelRef = ref<HTMLElement | null>(null)
const leftButtonRef = ref<HTMLElement | null>(null)

// 右侧面板状态
const rightOpen = ref(false)
const rightPanelRef = ref<HTMLElement | null>(null)
const rightButtonRef = ref<HTMLElement | null>(null)

// 面板宽度
const panelWidthLeft = '500px'
const panelWidthRight = '300px'

// 左侧面板计算
const leftPanelOffset = computed(() => {
  return leftOpen.value ? 0 : -Number.parseInt(panelWidthLeft)
})

const leftButtonOffset = computed(() => {
  if (!leftPanelRef.value)
    return 0
  return leftOpen.value ? leftPanelRef.value.offsetWidth : 0
})

// 右侧面板计算（方向相反）
const rightPanelOffset = computed(() => {
  return rightOpen.value ? 0 : Number.parseInt(panelWidthRight)
})

const rightButtonOffset = computed(() => {
  if (!rightPanelRef.value)
    return 0
  return rightOpen.value ? -rightPanelRef.value.offsetWidth : 0
})

// 切换左侧面板
function toggleLeftPanel() {
  leftOpen.value = !leftOpen.value
}

// 切换右侧面板
function toggleRightPanel() {
  rightOpen.value = !rightOpen.value
}

const mqttClient = ref<MqttClient | null | any>(null)

// 初始化
onMounted(() => {
  connMqtt().then((mqtt: MqttClient | any) => {
    mqttClient.value = mqtt
    acs.mqttClient = mqtt
    subscribe(mqttClient.value, `client_${user.userInfo.userInfo.clientID}`)
    let sendMesg = ''
    for (const i in acs.canBeClickedItem) {
      if (String(i) === '0') {
        sendMesg = `${acs.canBeClickedItem[i]}`
      }
      else {
        sendMesg = `${sendMesg}_${acs.canBeClickedItem[i]}`
      }
    }
    sendMesg = `${sendMesg}&online`
    publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
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
  })

  if (leftPanelRef.value) {
    leftPanelRef.value.style.transform = `translateX(${-Number.parseInt(panelWidthLeft)}px)`
  }
  if (rightPanelRef.value) {
    rightPanelRef.value.style.transform = `translateX(${Number.parseInt(panelWidthRight)}px)`
  }
})

// 组件卸载时断开连接
onBeforeUnmount(() => {
  if (mqttClient.value) {
    mqttClient.value.end()
    console.log('MQTT Disconnected')
  }
})
</script>

<template>
  <div>
    <topView />
  </div>

  <div class="relative flex overflow-hidden">
    <!-- 左侧面板 -->
    <div
      ref="leftPanelRef"
      class="fixed flex-col absolute left-0 top-0 h-full shadow-lg transition-all duration-300 ease-in-out z-50"
      :style="{ width: panelWidthLeft, transform: `translateX(${leftPanelOffset}px)` }"
    >
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="acs.allOverView">
          <allOverView />
        </div>
        <div v-else>
          <div>
            <left1View />
          </div>
          <div>
            <left2View />
          </div>
          <div>
            <left3View />
          </div>
        </div>
      </transition>
    </div>

    <!-- 左侧按钮 -->
    <button
      ref="leftButtonRef"
      class="fixed left-0 top-1/2 z-10 h-16 w-6 flex items-center justify-center bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-all duration-300 ease-in-out"
      :style="{
        transform: leftOpen
          ? `translateX(${leftButtonOffset}px) translateY(-50%)`
          : 'translateY(-50%)',
      }"
      @click="toggleLeftPanel"
    >
      <span class="text-xl font-bold">
        {{ leftOpen ? '←' : '→' }}
      </span>
    </button>

    <!-- 右侧面板 -->
    <div
      ref="rightPanelRef"
      class="fixed absolute right-0 top-0 h-full shadow-lg transition-all duration-300 ease-in-out z-50"
      :style="{ width: panelWidthRight, transform: `translateX(${rightPanelOffset}px)` }"
    >
      <div>
        <right1View />
      </div>
      <div>
        <right2View />
      </div>
    </div>

    <!-- 右侧按钮 -->
    <button
      ref="rightButtonRef"
      class="fixed right-0 top-1/2 z-10 h-16 w-6 flex items-center justify-center bg-green-500 text-white rounded-l hover:bg-green-600 transition-all duration-300 ease-in-out"
      :style="{
        transform: rightOpen
          ? `translateX(${rightButtonOffset}px) translateY(-50%)`
          : 'translateY(-50%)',
      }"
      @click="toggleRightPanel"
    >
      <span class="text-xl font-bold">
        {{ rightOpen ? '→' : '←' }}
      </span>
    </button>
    <thView />

    <div>
      <bottomView />
    </div>
  </div>
</template>

  <style>
  /* 如果需要额外的样式可以在这里添加 */
  </style>
