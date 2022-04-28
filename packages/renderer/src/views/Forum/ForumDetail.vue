<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 700px"
      :title="ModalTitle"
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
          <md-editor
            v-model="formValue.content"
            :preview="false"
            :toolbars="toobarsV3"
            preview-theme="github"
            v-on:upload-img="onUploadImg"
            iconfont-js="https://at.alicdn.com/t/font_2605852_pqekijay2ij.js"
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
    <n-space justify="end"> </n-space>
    <n-divider />
    <n-card style="margin-top: 20px" hoverable>
      <n-thing content-indented>
        <template #avatar>
          <n-avatar
            round
            size="large"
            :src="'https://phoenix.matrix53.top/api/v1/' + creatorAvatar"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </template>
        <template #header>
          <n-space>
            <n-text>{{ creatorName }}</n-text>
            <n-tag type="info"> 楼主 </n-tag>
          </n-space>
        </template>
        <template #header-extra>
          <n-space>
            <n-button @click="handleReply('')">回复</n-button>
            <n-button @click="handleDel" v-if="canDelPost()">删除该帖</n-button>
          </n-space>
        </template>
        <template #description> 最后一次编辑于：{{ updatedAt }} </template>
        <div v-html="content"></div>
      </n-thing>
    </n-card>
    <n-card v-for="comment in comments" style="margin-top: 20px" hoverable>
      <n-thing content-indented>
        <template #avatar>
          <n-avatar
            round
            size="large"
            :src="
              'https://phoenix.matrix53.top/api/v1/' + comment.creatorAvatar
            "
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </template>
        <template #header> {{ comment.creatorName }} </template>
        <template #header-extra>
          <n-space>
            <n-button @click="handleUpdateComment(comment.id, comment.origin)">
              编辑
            </n-button>
            <n-button @click="handleReply('@' + comment.creatorName + '\n')">
              回复
            </n-button>
            <n-button @click="handleDeleteComment(comment.id)"> 删除 </n-button>
          </n-space>
        </template>
        <template #description>
          最后一次编辑于：{{ comment.updatedAt }}
        </template>
        <div v-html="comment.content"></div>
      </n-thing>
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { onMounted, ref, watch } from 'vue'
import MdEditor from 'md-editor-v3'
import { ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {
  createComments,
  deleteComment,
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
  NAvatar,
  NThing,
  NTag,
  NText
} from 'naive-ui'
import { uploadImage } from '../../api/user'

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
const creatorAvatar = ref('')
const updatedAt = ref('')
const comments = ref<Array<any>>([])
const commentID = ref(-1)
const ModalTitle = ref('')
const needChange = ref(false)
const toobarsV3 = ref<Array<ToolbarNames>>([
  'bold',
  'italic',
  '-',
  'strikeThrough',
  'title',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'code',
  'link',
  'image',
  'table',
  'katex',
  '-',
  'preview',
  'catalog'
])

function clickReturn() {
  router.back()
}

async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  const res = await Promise.all(
    Array.from(files).map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('image', file)

        uploadImage(form)
          .then((res: any) => rev(res))
          .catch((error: any) => rej(error))
      })
    })
  )

  callback(
    res.map(
      (item: any) =>
        'https://phoenix.matrix53.top/api/v1/' + item.data.imagePath
    )
  )
}

function handleReply(init: string) {
  ModalTitle.value = '回复帖子'
  formValue.value.content = init
  commentID.value = -1
  showModal.value = true
}

function handleDel() {
  deletePosts({ id: parseInt(route.params.id as string) }).then((res) => {
    if (res.data.success) {
      router.back()
    }
  })
}

function handleUpdateComment(id: number, content: string) {
  ModalTitle.value = '编辑回答'
  formValue.value.content = content
  commentID.value = id
  showModal.value = true
}

function handleDeleteComment(id: number) {
  deleteComment(id).then((res) => {
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
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      if (commentID.value === -1) {
        createComments({
          content: formValue.value.content,
          id: parseInt(route.params.id as string),
          toID: 0
        }).then((res) => {
          formValue.value.content = ''
          showModal.value = false
          needChange.value = !needChange.value
        })
      } else {
        updateComments({
          id: commentID.value,
          content: formValue.value.content
        }).then((res) => {
          formValue.value.content = ''
          showModal.value = false
          needChange.value = !needChange.value
        })
      }
    } else {
      window.$message.error('回复的内容不能为空')
    }
  })
}

onMounted(() => {
  getAllComments(parseInt(route.params.id as string)).then(async (res) => {
    if (res.data.success) {
      comments.value = []
      res.data.comments.forEach((item: any) => {
        window.utilsBridge.markdownToHTML(item.content).then((res) => {
          comments.value.push({
            ...item,
            content: res,
            origin: item.content
          })
        })
      })
    }
  })
  getPosts(parseInt(route.params.id as string)).then((res) => {
    if (res.data.success) {
      title.value = res.data.title
      content.value = res.data.content
      creatorID.value = res.data.creatorID
      creatorName.value = res.data.creatorName
      creatorAvatar.value = res.data.creatorAvatar
      updatedAt.value = res.data.updatedAt
      window.utilsBridge.markdownToHTML(content.value).then((res) => {
        content.value = res
      })
    }
  })
})

watch([needChange], () => {
  getAllComments(parseInt(route.params.id as string)).then((res) => {
    if (res.data.success) {
      comments.value = []
      res.data.comments.forEach((item: any) => {
        window.utilsBridge.markdownToHTML(item.content).then((res) => {
          comments.value.push({
            ...item,
            content: res,
            origin: item.content
          })
        })
      })
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
