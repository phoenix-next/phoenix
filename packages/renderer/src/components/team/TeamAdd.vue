<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="新建组织"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
    @update-show="$emit('update:show')"
  >
    <n-divider />
    <n-input
      v-model="newTeamName"
      type="text"
      placeholder="请输入组织名称"
    ></n-input>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  show: {
    type: Boolean,
    default: null
  }
})
defineEmits(['update:show', 'update:team-created'])

const newTeamName = ref()
const handlePositiveClick = () => {}
</script>

<style scoped></style>
