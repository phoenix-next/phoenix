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
      <n-gi :span="8">
        <upload-button ref="descriptionRef">上传题面</upload-button>
      </n-gi>
      <n-gi :span="8">
        <upload-button ref="inputRef">上传输入</upload-button>
      </n-gi>
      <n-gi :span="8">
        <upload-button ref="outputRef">上传输出</upload-button>
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
import UploadButton from '../../components/problem/UploadButton.vue'

const messager = useMessage()

const descriptionRef = ref<InstanceType<typeof UploadButton> | null>(null)
const inputRef = ref<InstanceType<typeof UploadButton> | null>(null)
const outputRef = ref<InstanceType<typeof UploadButton> | null>(null)
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
    descriptionRef.value?.file &&
    inputRef.value?.file &&
    outputRef.value?.file &&
    data.value.name !== ''
  )
})

function clickCreate() {
  // TODO: send request
  createProblem()
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

<style scoped></style>
