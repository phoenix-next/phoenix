<template>
  <n-card>
    <n-form :rules="rules" :model="data">
      <n-form-item-row label="题目名称" path="name">
        <n-input v-model:value="data.name" placeholder="题目的名称" />
      </n-form-item-row>
      <n-form-item-row label="题目难度" path="difficulty">
        <n-slider v-model:value="data.difficulty" :step="1" :max="10" />
      </n-form-item-row>
      <n-form-item-row label="可读权限" path="readable">
        <n-select v-model:value="data.readable" :options="readOptions" />
      </n-form-item-row>
      <n-form-item-row label="可写权限" path="writable">
        <n-select v-model:value="data.writable" :options="writeOptions" />
      </n-form-item-row>
      <n-form-item-row
        label="绑定组织"
        path="orgnization"
        v-if="organizationVisiable"
      >
        <n-select
          v-model:value="data.organization"
          :options="organizationOptions"
        />
      </n-form-item-row>
    </n-form>
    <n-grid :x-gap="12">
      <n-gi :span="12">
        <n-upload
          :file-list="uploadDescription"
          :default-upload="false"
          class="upload-container"
          @change="handleDescriptionChange"
          :max="1"
        >
          <n-button type="primary" block secondary strong>上传题面</n-button>
        </n-upload>
      </n-gi>
      <n-gi :span="12">
        <n-upload
          :file-list="uploadAnswer"
          :default-upload="false"
          class="upload-container"
          @change="handleAnswerChange"
          :max="1"
        >
          <n-button type="primary" block secondary strong>上传答案</n-button>
        </n-upload>
      </n-gi>
    </n-grid>
    <n-button
      type="primary"
      block
      secondary
      strong
      @click="clickCreate"
      :disabled="!uploadEnable"
    >
      创建题目
    </n-button>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FormRules, UploadFileInfo, useMessage } from 'naive-ui'
import { createProblem } from '../../api/judge'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'

const messager = useMessage()
const uploadDescription = ref<Array<UploadFileInfo>>([])
const uploadAnswer = ref<Array<UploadFileInfo>>([])
const organizationOptions = ref<SelectMixedOption[]>([])
const data = ref({
  name: '',
  difficulty: 5,
  readable: 0,
  writable: 0,
  organization: 0,
})
const organizationVisiable = computed(() => {
  return data.value.readable > 0 || data.value.writable > 0
})
const uploadEnable = computed(() => {
  return (
    uploadDescription.value.length > 0 &&
    uploadAnswer.value.length > 0 &&
    data.value.name !== ''
  )
})

function clickCreate() {
  // TODO: send request
}
function handleAnswerChange(data: { fileList: UploadFileInfo[] }) {
  uploadAnswer.value = data.fileList
}
function handleDescriptionChange(data: { fileList: UploadFileInfo[] }) {
  uploadDescription.value = data.fileList
}

onMounted(() => {
  // TODO: fetch organizations
})

const readOptions: SelectMixedOption[] = [
  {
    label: '仅题目创建者可见',
    value: 0,
  },
  {
    label: '仅创建者和组织管理员可见',
    value: 1,
  },
  {
    label: '仅创建者和组织成员可见',
    value: 2,
  },
  {
    label: '所有人可见',
    value: 3,
  },
]
const writeOptions: SelectMixedOption[] = [
  {
    label: '仅题目创建者可编辑',
    value: 0,
  },
  {
    label: '仅创建者和组织管理员可编辑',
    value: 1,
  },
]
const rules: FormRules = {
  name: {
    required: true,
    message: '请输入题目名称',
    trigger: 'blur',
  },
}
</script>

<style scoped>
.upload-container:deep(.n-upload-trigger) {
  width: 100%;
  height: 100%;
}
</style>
