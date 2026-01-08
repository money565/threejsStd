<script setup lang="ts">
import VConsole from 'vconsole'
import { RouterView } from 'vue-router'

onMounted(() => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD
  const isTest = import.meta.env.MODE === 'test'
  console.log('当前环境:', import.meta.env.MODE) // 'development' | 'production' | 'test'
  console.log('是否是开发环境:', isDevelopment) // true/false
  console.log('是否是生产环境:', isProduction) // true/false
  console.log('是否是测试环境:', isTest) // true/false
  if (isDevelopment) {
    const vConsole = new VConsole()
    vConsole.setOption({ log: { maxLogNumber: 5000 } })
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
/* 在 assets/styles/global.css 或类似文件中 */
::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

html {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
}

body {
  overflow: -moz-scrollbars-none; /* 旧版 Firefox */
  margin: 0;
  padding: 0;
}
</style>
