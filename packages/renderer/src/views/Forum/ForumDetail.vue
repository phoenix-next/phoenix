<template>
  <!-- TODO: forum page -->
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 900px"
      title="回复讨论"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
      >
        <n-form-item label="编辑你的回复内容" path="content">
          <mavon-editor
            v-model="formValue.content"
            :subfield="false"
            :toolbars="toolbars"
            style="width: 100%"
          />
        </n-form-item>
        <n-space justify="end">
          <n-button attr-type="button" @click="handleValidateClick">
            发布
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title"> {{ title }} </n-h1>
    </n-space>
    <n-space justify="end">
      <n-button @click="handleDel" v-if="canDelPost()">删除</n-button>
      <n-button @click="handleReply">回复</n-button>
    </n-space>
    <n-space justify="center">
      <n-h5 class="title"> {{ content }} </n-h5>
    </n-space>
    <n-divider />
    <n-card v-for="comment in comments" style="margin-top: 20px">
      <n-space>
        Replyed by: {{ comment.creatorName }}
        <n-button>删除</n-button>
      </n-space>
      <div v-html="comment.content"></div>
      <mavon-editor
        v-model="comment.origin"
        :boxShadow="false"
        :subfield="false"
        defaultOpen="preview"
        :editable="false"
        :toolbarsFlag="false"
      />
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowBackCircleOutline,
  Push,
  ThermometerOutline
} from '@vicons/ionicons5'
import { onMounted, ref, watch } from 'vue'
import {
  createComments,
  deletePosts,
  getAllComments,
  getPosts,
  updateComments
} from '../../api/forum'
import {
  NCard,
  NButton,
  NIcon,
  NSpace,
  NH1,
  NDivider,
  FormInst,
  NModal,
  NFormItem,
  NForm,
  messageDark,
  idID,
  dataTableDark
} from 'naive-ui'
import { isTemplateNode } from '@vue/compiler-core'

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  content: ''
})
const rules = {
  content: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  }
}

const isAdmin = ref(false)
const title = ref('')
const content = ref('')
const creatorID = ref(0)
const creatorName = ref('')
const comments = ref<Array<any>>([])
const needChange = ref(false)
const toolbars = {
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: true, // 上角标
  subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: false, // 全屏编辑
  readmodel: false, // 沉浸式阅读
  htmlcode: false, // 展示html源码
  help: true, // 帮助
  /* 1.3.5 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: false, // 清空
  save: false, // 保存（触发events中的save事件）
  /* 1.4.2 */
  navigation: true, // 导航目录
  /* 2.1.8 */
  alignleft: false, // 左对齐
  aligncenter: false, // 居中
  alignright: false, // 右对齐
  /* 2.2.1 */
  subfield: false, // 单双栏模式
  preview: true // 预览
}

function clickReturn() {
  router.back()
}

function handleReply() {
  window.$message.success('create comment!')
  showModal.value = true
}

function handleDel() {
  window.$message.success('delete')
  deletePosts({ id: parseInt(route.params.id as string) }).then((res) => {
    if (res.data.success) {
      window.$message.success('删除成功')
      router.back()
    }
  })
}

function handleUpdateComment(id: number, content: string) {
  window.$message.success('update comment')
  updateComments({
    id: id,
    content: content
  }).then((res) => {
    if (res.data.success) {
      needChange.value = !needChange.value
    }
  })
}

function canDelPost() {
  if (isAdmin.value) return true
  if (creatorID.value == parseInt(localStorage.getItem('userID') as string))
    return true
  return false
}

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      createComments({
        content: formValue.value.content,
        id: parseInt(route.params.id as string),
        toID: 0
      }).then((res) => {
        window.$message.success('回复成功')
        formValue.value.content = ''
        showModal.value = false
        needChange.value = !needChange.value
      })
    } else {
      window.$message.error('回复的内容不能为空')
    }
  })
}

onMounted(() => {
  getAllComments(parseInt(route.params.id as string)).then(async (res) => {
    if (res.data.success) {
      comments.value = []
      res.data.comments.forEach((item) => {
        console.log((item.content as string).replace('\n', '\n\n'))
        window.utilsBridge
          .markdownToHTML((item.content as any).replaceAll('\n', '\n\n'))
          .then((res) => {
            comments.value.push({
              ...item,
              content: res,
              origin: item.content
            })
          })
      })
      window.$message.success(res.data.message)
    }
  })
  getPosts(parseInt(route.params.id as string)).then((res) => {
    if (res.data.success) {
      title.value = res.data.title
      content.value = res.data.content
      creatorID.value = res.data.creatorID
      creatorName.value = res.data.creatorName
    }
  })
})

watch([needChange], () => {
  getAllComments(parseInt(route.params.id as string)).then((res) => {
    if (res.data.success) {
      comments.value = []
      res.data.comments.forEach((item) => {
        console.log((item.content as string).replace('\n', '\n\n'))
        window.utilsBridge
          .markdownToHTML((item.content as any).replaceAll('\n', '\n\n'))
          .then((res) => {
            comments.value.push({
              ...item,
              content: res,
              origin: item.content
            })
          })
      })
      window.$message.success(res.data.message)
    }
  })
})
</script>

<style scoped>
.return {
  position: absolute;
  font-size: 30px;
}
</style>
