<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import { useUserStore } from '@/stores/user'
import { publish } from '@/views/items/datas/mqtt'
import deviceEnvironment from './right1Item/deviceEnvironment.vue'
import deviceTempLine from './right1Item/deviceTempLine.vue'
import environment from './right1Item/environment.vue'
import temperature from './right1Item/temperature.vue'

const size = ref(250)
const acs = useAppCacheStore()
const user = useUserStore()
const templine = ref(false)

function showData() {
  templine.value = !templine.value
  if (templine.value) {
    const now = Math.floor(new Date().getTime() / 1000)
    const tenMinutesAgo = now - 30 * 60
    const sendMesg = `${acs.currentItem}_tempLine_${now}_${tenMinutesAgo}`
    publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
  }
}

function right1Clicked() {

}

watch(() => acs.currentItem, () => {
  if (templine.value) {
    const now = Math.floor(new Date().getTime() / 1000)
    const tenMinutesAgo = now - 30 * 60
    const sendMesg = `${acs.currentItem}_tempLine_${now}_${tenMinutesAgo}`
    publish(acs.mqttClient, `spot_client/${user.userInfo.userInfo.clientID}`, sendMesg)
  }
})
</script>

<template>
  <div>
    <div class="relative w-100% h-60 bg-transparent overflow-hidden mt-22" @click="right1Clicked">
      <!-- 内发光层 -->
      <div class="absolute inset-0 shadow-[inset_0_0_10px_2px_rgba(56,182,255,0.5)]" />

      <!-- 边缘高光线 -->
      <div class="absolute inset-0 rounded-lg border border-cyan-400/20 pointer-events-none" />

      <!-- 内容 -->
      <div class="z-10 h-60 w-100% flex flex-col bg-blue-500 bg-opacity-30">
        <div class="flex w-100% h-9 pt-2 text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
          {{ acs.allOverView ? "环境" : "设备" }}
        </div>
        <div v-if="acs.allOverView " class="flex w-100% h-51">
          <div class="flex text-light-50 w-50%">
            <environment :size="size" />
          </div>
          <div class="flex w-60% mt-5">
            <temperature
              :min="-10"
              :max="60"
              :warning-threshold="40"
            />
          </div>
        </div>
        <div v-else>
          <div v-if="templine">
            <deviceTempLine @show-data="showData" />
          </div>
          <div v-else>
            <deviceEnvironment @show-data="showData" />
          </div>
        </div>
        <!-- 内容区 -->
      </div>
    </div>
  </div>
</template>

  <style>

  </style>
