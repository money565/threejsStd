<script setup lang="ts">
import VConsole from 'vconsole'
import { RouterView } from 'vue-router'

const vConsole = new VConsole()
vConsole.setOption({ log: { maxLogNumber: 5000 } })
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
