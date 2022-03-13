<template>
  <div class="container">
    <return-button />
    <n-form :rules="rules" :model="data" style="width: 45%; margin-top: 80px">
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
      <n-grid :x-gap="12">
        <n-gi :span="8">
          <upload-button ref="descriptionRef">选择题面</upload-button>
        </n-gi>
        <n-gi :span="8">
          <upload-button ref="inputRef">选择输入</upload-button>
        </n-gi>
        <n-gi :span="8">
          <upload-button ref="outputRef">选择输出</upload-button>
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
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  FormRules,
  NForm,
  NInput,
  NGi,
  NGrid,
  NButton,
  NSelect,
  NFormItemRow,
  NSlider
} from 'naive-ui'
import { createProblem } from '../../api/judge'
import UploadButton from '../../components/problem/UploadButton.vue'
import ReturnButton from '../../components/problem/ReturnButton.vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'

const router = useRouter()

const descriptionRef = ref<InstanceType<typeof UploadButton> | null>(null)
const inputRef = ref<InstanceType<typeof UploadButton> | null>(null)
const outputRef = ref<InstanceType<typeof UploadButton> | null>(null)
const organizationOptions = ref<Array<any>>([])
const data = reactive({
  name: '',
  difficulty: 5,
  readable: 0,
  writable: 0,
  organization: null
})

const organizationVisiable = computed(() => {
  return (data.readable > 0 && data.readable < 3) || data.writable > 0
})
const uploadEnable = computed(() => {
  return (
    descriptionRef.value?.file &&
    inputRef.value?.file &&
    outputRef.value?.file &&
    (!organizationVisiable.value || data.organization !== null) &&
    data.name !== ''
  )
})

function clickCreate() {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, String(data[key as keyof typeof data]))
  })
  formData.append('input', inputRef.value?.file as File)
  formData.append('output', outputRef.value?.file as File)
  formData.append('description', descriptionRef.value?.file as File)
  if (formData.get('organization') === 'null') {
    formData.set('organization', '0')
  }
  createProblem(formData).then((res) => {
    if (res.data.success) {
      router.back()
    }
  })
}

onMounted(() => {
  getUserOrganization().then((res) => {
    organizationOptions.value = (res.data.organization as Array<any>).map(
      (item) => {
        return { label: item.orgName, value: item.orgID }
      }
    )
  })
})

const readOptions = [
  {
    label: '仅题目创建者可见',
    value: 0
  },
  {
    label: '仅创建者和组织管理员可见',
    value: 1
  },
  {
    label: '仅创建者和组织成员可见',
    value: 2
  },
  {
    label: '所有人可见',
    value: 3
  }
]
const writeOptions = [
  {
    label: '仅题目创建者可编辑',
    value: 0
  },
  {
    label: '仅创建者和组织管理员可编辑',
    value: 1
  }
]
const rules: FormRules = {
  name: {
    required: true,
    message: '请输入题目名称',
    trigger: 'blur'
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
