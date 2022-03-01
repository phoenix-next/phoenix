<template>
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title">题目的名称</n-h1>
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
import { onMounted, ref, computed } from 'vue'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import { UploadFileInfo } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const problem = ref({
  description: '',
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

const text =
  '## 题目描述 \n ## 题目样例 \n ```python \n print("Hello World") \n hello=1 if false else 2 \n ``` \n $\\sqrt{3x-1}+(1+x)^2$ \n ## 数据范围'

onMounted(() => {
  //TODO: get problem data
  window.utilsBridge.markdownToHTML(text).then((res) => {
    problem.value.description = res
  })
})

const options: SelectMixedOption[] = [
  {
    label: 'C',
    value: 'C',
  },
  {
    label: 'C++',
    value: 'C++',
  },
  {
    label: 'Java',
    value: 'Java',
  },
  {
    label: 'Golang',
    value: 'Golang',
  },
  {
    label: 'JavaScript',
    value: 'JavaScript',
  },
  {
    label: 'Python',
    value: 'Python',
  },
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
