<script setup lang="ts">
import environment from './right1Item/environment.vue'
import temperature from './right1Item/temperature.vue'

const size = ref(250)

function right1Clicked() {

}
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
        <div class="flex w-100% h-9  text-white text-center justify-center pt-1 bg-[linear-gradient(to_right,rgba(59,130,246,0.9),transparent)] backdrop-blur-sm">
          环境
        </div>
        <div class="flex w-100% h-51">
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
        <!-- 内容区 -->
      </div>
    </div>
  </div>
</template>

  <style>

  </style>
