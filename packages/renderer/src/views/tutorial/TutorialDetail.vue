<template>
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title">{{ tutorial.name }}</n-h1>
    </n-space>
    <n-divider />
    <div v-html="tutorial.detail" id="detail"></div>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { NCard, NButton, NIcon, NSpace, NH1, NDivider } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { getTutorial } from '../../api/tutorial'
import { addEditorAction, createEditor } from '../../utils/code'

const router = useRouter()
const route = useRoute()

const tutorial = reactive({
  detail: '<h2>前言</h2><h2>内容</h2><h2>结语</h2>',
  name: '教程名称'
})
const pending = ref(true)

function clickReturn() {
  router.back()
}

onMounted(() => {
  getTutorial({ tutorialID: Number(route.params.id) })
    .then((res) => {
      tutorial.name = res.data.name
      return window.utilsBridge.downloadTutorial(
        route.params.id as string,
        res.data.tutorialPath,
        localStorage.getItem('token') || ''
      )
    })
    .then((res) => {
      tutorial.detail = res
      pending.value = false
    })
    .then(() => {
      const detail = document.getElementById('detail')
      detail?.querySelectorAll('code').forEach((item) => {
        if (item.className.includes('editor')) {
          ;(item.parentElement as HTMLElement).style.width = '100%'
          const editor = createEditor(item, item.className.substring(16))
          addEditorAction(editor)
        }
      })
    })
})
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
