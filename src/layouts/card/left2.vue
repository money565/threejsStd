<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import alineChart from './left2Item/ALineChart.vue'
import ammMeter from './left2Item/ammeter.vue'

const ac = useAppCacheStore()
const user = useUserStore()
const showAmterLine = ref(false)
const acAmmeter = computed(() => {
  return [ac.ammeter[0], ac.ammeter[1], ac.ammeter[2]]
})
function linSwitch() {
  showAmterLine.value = !showAmterLine.value
  if (ac.currentItem !== '-') {
    if (showAmterLine.value === true) {
      const now = Math.floor(new Date().getTime() / 1000)
      const tenMinutesAgo = now - 30 * 60
      const sendMesg = `${ac.currentItem}_amtLine_${now}_${tenMinutesAgo}`
      publish(ac.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
    }
  }
}

watch(() => ac.currentItem, () => {
  if (showAmterLine.value === true) {
    const now = Math.floor(new Date().getTime() / 1000)
    const tenMinutesAgo = now - 30 * 60
    const sendMesg = `${ac.currentItem}_amtLine_${now}_${tenMinutesAgo}`
    publish(ac.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
  }
})
</script>

<template>
  <div class="relative w-100% h-90 bg-transparent overflow-hidden mt-3">
    <!-- 内发光层 -->
    <div
      class="absolute inset-0 rounded-lg
              shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]"
    />

    <!-- 边缘高光线 -->
    <div
      class="absolute inset-0 rounded-lg
              border border-cyan-400/20 pointer-events-none"
    />

    <!-- 内容 -->
    <div class="relative z-10 h-full w-full flex flex-col bg-blue-500 bg-opacity-30">
      <div class="w-100% h-10 flex  block text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
        <div class="mb-5">
          {{ ac.currentItem }}电流
        </div>
      </div>
      <div>
        <div class=" bg-blue-100 w-8 ml-115 mt-2 shadow" @click="linSwitch">
          <el-icon size="30" class="h-5 pt-1">
            <SvgIcon name="line" />
          </el-icon>
        </div>
        <div v-if="!showAmterLine" class="text-light-50 flex items-center justify-center mt--2 mr-8">
          <div v-for="(item, index) in acAmmeter" :key="index" class="ml-2">
            <ammMeter class="flex w-38 h-55" :amm-name="item.ammName" :amm-value="item.ammValue" />
          </div>
        </div>
        <div v-if="!showAmterLine" class="text-center mt--5">
          <h3 class="text-white">
            平均电流：{{ ac.ammeter[3].ammValue }} A
          </h3>
        </div>
        <div v-if="showAmterLine">
          <alineChart />
        </div>
      </div>

    <!-- 内容区 -->
    </div>
  </div>
</template>

  <style>

  </style>
