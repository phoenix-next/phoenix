<template>
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title">{{ problem.name }}</n-h1>
    </n-space>
    <n-space justify="end">
      <n-select
        v-model:value="language"
        :options="options"
        :consistent-menu-width="false"
      />
      <n-upload
        :default-upload="false"
        :max="1"
        :disabled="pending"
        @change="handleProgramChange"
        :file-list="program"
        :show-file-list="false"
      >
        <n-button>提交</n-button>
      </n-upload>
    </n-space>
    <n-divider />
    <div v-html="problem.description"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import {
  UploadFileInfo,
  NCard,
  NButton,
  NIcon,
  NSpace,
  NH1,
  NSelect,
  NUpload,
  NDivider
} from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getProblem } from '../../api/judge'

const router = useRouter()
const route = useRoute()

const problem = reactive({
  description: '<h2>题目描述</h2><h2>题目样例</h2><h2>数据范围</h2>',
  name: '题目名称'
})
const language = ref('C')
const program = ref<Array<UploadFileInfo>>([])
const pending = ref(true)

function clickReturn() {
  router.back()
}
function handleProgramChange(data: { fileList: UploadFileInfo[] }) {
  if (!pending.value) {
    program.value = data.fileList
    pending.value = true
    const url = data.fileList[0].file?.path ?? ''
    if (program.value.length > 0) {
      window.utilsBridge
        .judgeProblem(url, route.params.id as string, language.value)
        .then((res) => {
          if (res === 'AC') {
            window.$message.success('AC')
          } else {
            window.$message.warning(res)
          }
          program.value = []
          pending.value = false
        })
    }
  }
}

onMounted(() => {
  getProblem({ problemID: Number(route.params.id) })
    .then((res) => {
      problem.name = res.data.name
      return window.utilsBridge.downloadProblem(
        route.params.id as string,
        res.data.input,
        res.data.output,
        res.data.description,
        localStorage.getItem('token') || ''
      )
    })
    .then((res) => {
      problem.description = res
      pending.value = false
    })
})

const options: any[] = [
  {
    label: 'C',
    value: 'C'
  },
  {
    label: 'C++',
    value: 'C++'
  },
  {
    label: 'Java',
    value: 'Java'
  },
  {
    label: 'Golang',
    value: 'Golang'
  },
  {
    label: 'JavaScript',
    value: 'JavaScript'
  },
  {
    label: 'Python',
    value: 'Python'
  }
]
</script>

<style scoped>
.return {
  position: absolute;
  font-size: 30px;
}

.title {
  margin-bottom: 0;
}
</style>
