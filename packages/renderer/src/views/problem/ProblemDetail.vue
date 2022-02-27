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
      <n-button @click="clickSubmit">提交</n-button>
    </n-space>
    <n-divider />
    <div v-html="problem.description"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import { useRouter } from 'vue-router'

const router = useRouter()
const problem = ref({
  description: '',
})
const language = ref(0)

function clickReturn() {
  router.back()
}
function clickSubmit() {
  // TODO: submit logic
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
    value: 0,
  },
  {
    label: 'C++',
    value: 1,
  },
  {
    label: 'Java',
    value: 2,
  },
  {
    label: 'Golang',
    value: 3,
  },
  {
    label: 'Javascript',
    value: 4,
  },
  {
    label: 'Python',
    value: 5,
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
