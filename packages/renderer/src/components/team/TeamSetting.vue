<template>
  <n-descriptions label-placement="left" :column="1" separator=":">
    <n-descriptions-item label="组织名称"> 苹果 </n-descriptions-item>
    <n-descriptions-item label="组织信息"> 苹果 </n-descriptions-item>
    <n-descriptions-item label="午餐"> 苹果 </n-descriptions-item>
    <n-descriptions-item label="组织ID"> 苹果 </n-descriptions-item>
    <n-descriptions-item label="退出组织"> </n-descriptions-item>
    <n-descriptions-item label="删除组织"> 苹果 </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  }
})
</script>
<style scoped></style>
