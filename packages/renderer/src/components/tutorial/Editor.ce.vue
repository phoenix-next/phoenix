<template>
  <div style="height: 100px; width: 100px; background-color: aqua">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<style scoped></style>
