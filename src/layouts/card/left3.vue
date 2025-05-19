<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import itemPower from './left3Item/itemPower.vue'
import PowerLine from './left3Item/power.vue'
import mesgView from './right2Item/mesg.vue'

const user = useUserStore()
const acs = useAppCacheStore()
const pfValue = computed(() => {
  if (acs.power.pf > 1) {
    return 1
  }
  return acs.power.pf.toFixed(3)
})
const showPowerLine = ref(false)
function linSwitch() {
  showPowerLine.value = !showPowerLine.value
  if (showPowerLine.value) {
    const now = Math.floor(new Date().getTime() / 1000)
    const tenMinutesAgo = now - 30 * 60
    const sendMesg = `${acs.currentItem}_powerLine_${now}_${tenMinutesAgo}`
    publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
  }
}
</script>

<template>
  <div class="relative w-100% h-80 bg-transparent overflow-hidden mt-3">
    <!-- 内发光层 -->
    <div class="absolute inset-0 shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

    <!-- 边缘高光线 -->
    <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />
    <div class="w-100% h-10  block text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
      功率
    </div>

    <!-- 内容 -->
    <div class="z-10 h-100% w-100% flex flex-col items-center justify-center bg-blue-500 bg-opacity-30">
      <div class=" bg-blue-100 w-8 h-8 shadow flex fixed z-11 ml-112 mt--65" @click="linSwitch">
        <el-icon size="30" class="h-5 pt-1">
          <SvgIcon name="line" />
        </el-icon>
      </div>
      <div v-if="!showPowerLine" class="flex w-100% h-5 justify-end mb-8 mr-30 mt--2">
        <h4 class="text-white">
          PF:
        </h4>
        <mesgView class="mt-6" />
        <h4 class="text-white ml--8">
          {{ pfValue }}
        </h4>
      </div>
      <div v-if="!showPowerLine" class="flex text-light-50 flex w-100% h-180 block">
        <itemPower />
      </div>
      <div v-if="showPowerLine" class="flex text-light-50 flex w-100% h-180 block">
        <PowerLine />
      </div>
    <!-- 内容区 -->
    </div>
  </div>
</template>

  <style>

  </style>
