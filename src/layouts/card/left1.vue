<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import MeterLine from './left1Item/vLineChart.vue'
import Meter from './left1Item/voltmeter.vue'

const ac = useAppCacheStore()
const user = useUserStore()
const voltmeter = computed(() => {
  return [ac.voltmeter[0], ac.voltmeter[1], ac.voltmeter[2]]
})
const isLine = ref(false)

function linSwitch() {
  isLine.value = !isLine.value
  if (ac.currentItem !== '-') {
    if (isLine.value) {
      const now = Math.floor(new Date().getTime() / 1000)
      const tenMinutesAgo = now - 30 * 60
      const sendMesg = `${ac.currentItem}_volLine_${now}_${tenMinutesAgo}`
      publish(ac.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
    }
  }
}

watch(() => ac.currentItem, () => {
  if (isLine.value === true) {
    const now = Math.floor(new Date().getTime() / 1000)
    const tenMinutesAgo = now - 10 * 60
    const sendMesg = `${ac.currentItem}_volLine_${now}_${tenMinutesAgo}`
    publish(ac.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
  }
})
</script>

<template>
  <div class="relative w-100% h-70 bg-transparent overflow-hidden mt-22">
    <!-- 内发光层 -->
    <div class="absolute inset-0 rounded-lg  shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

    <!-- 边缘高光线 -->
    <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

    <!-- 内容 -->
    <div class="z-10 h-100% w-100% flex flex-col bg-blue-500 bg-opacity-30">
      <div class="w-100% h-10  block text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
        {{ ac.currentItem }}电压
      </div>
      <div class=" bg-blue-100 w-8 ml-115 mt-2 shadow" @click.prevent="linSwitch">
        <el-icon size="30" class="h-5 pt-1">
          <SvgIcon name="line" />
        </el-icon>
      </div>

      <div v-if="!isLine" class="text-light-50 flex  items-center justify-center mt-3 mr-5">
        <div v-for="(item, index) in voltmeter" :key="index" class="ml-5">
          <Meter class="flex w-35 h-35" :vol-name="item.volName" :vol-value="item.volValue" />
        </div>
      </div>
      <div v-if="isLine" class="text-light-50 flex items-center justify-center mt-3 mr-5">
        <MeterLine />
      </div>
      <div v-if="!isLine" class="text-center mt--5">
        <h3 class="text-white">
          平均电压：{{ ac.voltmeter[3].volValue }} V
        </h3>
      </div>
    <!-- 内容区 -->
    </div>
  </div>
</template>

  <style>

  </style>
