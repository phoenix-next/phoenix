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
    <upload-button ref="fileRef">选择文件</upload-button>
    <n-button
      type="primary"
      block
      secondary
      strong
      @click="clickCreate"
      :disabled="!uploadEnable"
    >
      创建教程
    </n-button>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  FormRules,
  NForm,
  NInput,
  NButton,
  NSelect,
  NFormItemRow,
  NCard,
  NSlider
} from 'naive-ui'
import { createTutorial } from '../../api/tutorial'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import UploadButton from '../../components/problem/UploadButton.vue'
import { useRouter } from 'vue-router'
import { getOrganization } from '../../api/user'

const router = useRouter()

const fileRef = ref<InstanceType<typeof UploadButton> | null>(null)
const organizationOptions = ref<SelectMixedOption[]>([])
const data = reactive({
  name: '',
  difficulty: 5,
  readable: 0,
  writable: 0,
  organization: 0
})

const organizationVisiable = computed(() => {
  return data.readable > 0 || data.writable > 0
})
const uploadEnable = computed(() => {
  return fileRef.value?.file && data.name !== ''
})

function clickCreate() {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, String(data[key as keyof typeof data]))
  })
  formData.append('creator', localStorage.getItem('userID') as string)
  formData.append('file', fileRef.value?.file as File, 'file')
  createTutorial(formData)
    .then((res) => {
      if (res.data.success) {
        window.$message.success(res.data.message)
        router.back()
      } else {
        window.$message.warning(res.data.message)
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}

onMounted(() => {
  getOrganization({ id: localStorage.getItem('userID') || '' })
    .then((res) => {
      organizationOptions.value = (res.data.organizations as Array<any>).map(
        (item) => {
          return { label: item.name, value: item.id }
        }
      )
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
})

const readOptions: SelectMixedOption[] = [
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
const writeOptions: SelectMixedOption[] = [
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

<style scoped></style>
