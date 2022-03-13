<template>
  <n-button
    type="primary"
    secondary
    strong
    @click="handleCreate"
    style="position: absolute; right: 24px; top: 32px"
  >
    新建组织
  </n-button>
  <n-data-table />
  <team-add ref="teamAdd" />
</template>

<script setup lang="ts">
import { NDataTable, NButton } from 'naive-ui'
import TeamAdd from './modal/TeamAdd.vue'
import { ref } from 'vue'

const teamAdd = ref<InstanceType<typeof TeamAdd> | null>(null)

function handleCreate() {
  teamAdd.value?.open()
}
</script>

<style scoped></style>
