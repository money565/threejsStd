<script setup lang="ts">
interface IProps {
  psname: string
  psparam: string
}
const props = withDefaults(defineProps<IProps>(), {
  psname: '',
  psparam: '',
})
</script>

<template>
  <div class="flex gap-2">
    <div>{{ props.psname }}</div>
    <div>{{ props.psparam }}</div>
  </div>
</template>

<style scoped>

</style>
