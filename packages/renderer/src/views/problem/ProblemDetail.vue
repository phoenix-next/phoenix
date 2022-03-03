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
import { onMounted, ref, computed, reactive, watch } from 'vue'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import { UploadFileInfo, useMessage } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getProblem } from '../../api/judge'

const router = useRouter()
const route = useRoute()
const messager = useMessage()

const problem = reactive({
  description: '## 题目描述 \n ## 题目样例 \n ## 数据范围',
  input: '',
  output: '',
  name: '题目名称'
})
const language = ref('C')
const program = ref<Array<UploadFileInfo>>([])
const pending = computed(() => {
  return program.value.length > 0
})

function clickReturn() {
  router.back()
}
function handleProgramChange(data: { fileList: UploadFileInfo[] }) {
  program.value = data.fileList
  const url = data.fileList[0].file?.path ?? ''
  if (program.value.length > 0) {
    window.utilsBridge
      .judgeProblem(url, route.params.id as string, language.value)
      .then((res) => {
        console.log(res)
        program.value = []
      })
  }
}

watch(
  () => problem.description,
  (data, prevData) => {}
)

onMounted(() => {
  getProblem({ problemID: Number(route.params.id) })
    .then(async (res) => {
      problem.name = res.data.name
      problem.description = await window.utilsBridge.markdownToHTML(
        res.data.description
      )
      problem.input = res.data.input
      problem.output = res.data.output
    })
    .catch((res) => {
      messager.error('网络故障, 请检查网络连接')
    })
})

const options: SelectMixedOption[] = [
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
