<template>
  <n-upload
    :file-list="fileList"
    :default-upload="false"
    class="upload-container"
    @change="handleFileChange"
    :max="1"
  >
    <n-button type="primary" block secondary strong>
      <slot></slot>
    </n-button>
  </n-upload>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UploadFileInfo } from 'naive-ui'

const fileList = ref<UploadFileInfo[]>([])

const file = computed(() => {
  return fileList.value.length === 0 ? null : fileList.value[0].file
})

function handleFileChange(data: { fileList: UploadFileInfo[] }) {
  fileList.value = data.fileList
}
function clearFile() {
  fileList.value = []
}

defineExpose({ file, clearFile })
</script>

<style scoped>
.upload-container:deep(.n-upload-trigger) {
  width: 100%;
  height: 100%;
}
</style>
