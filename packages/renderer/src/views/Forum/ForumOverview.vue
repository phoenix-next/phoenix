<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 700px"
      title="新建一个帖子"
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
        <n-form-item label="标题" path="title">
          <n-input v-model:value="formValue.title" placeholder="输入标题" />
        </n-form-item>
        <n-form-item label="内容" path="content">
          <md-editor
            v-model="formValue.content"
            :preview="false"
            :toolbars="toobarsV3"
            preview-theme="github"
            v-on:upload-img="onUploadImg"
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
    <n-grid>
      <n-gi :span="4" :offset="1">
        <n-h2>
          <n-text type="primary"> 论坛 </n-text>
        </n-h2>
      </n-gi>
      <n-gi :span="14" :offset="2">
        <n-input-group>
          <n-button type="primary" class="label">查找帖子</n-button>
          <n-input
            :style="{ width: '50%' }"
            v-model:value="keyWord"
            placeholder="请输入关键字"
            @keypress.enter="needChange = !needChange"
          />
          <n-button type="primary" ghost @click="needChange = !needChange">
            搜索
          </n-button>
        </n-input-group>
      </n-gi>
      <n-gi :span="2" :offset="1">
        <n-button
          type="primary"
          block
          secondary
          strong
          @click="showModal = true"
        >
          新建帖子
        </n-button>
      </n-gi>
    </n-grid>
  </n-card>
  <n-card>
    <n-grid>
      <n-gi :span="16">
        <n-grid :x-gap="12" :y-gap="8" :cols="1">
          <n-gi v-if="posts.length === 0">
            <n-empty description="此处空空如也" style="margin-top: 180px">
              <template #icon>
                <n-icon>
                  <airplane />
                </n-icon>
              </template>
              <template #extra>
                <!-- <n-button size="small"> 看看别的 </n-button> -->
              </template>
            </n-empty>
          </n-gi>
          <n-gi v-for="post in posts">
            <n-card>
              <n-space align="center" :wrap="false">
                <n-avatar
                  round
                  :size="48"
                  :src="
                    'https://phoenix.matrix53.top/api/v1/' + post.creatorAvatar
                  "
                />
                <n-space align="start" vertical size="small" :wrap="false">
                  <n-space align="center" :wrap="false">
                    <n-space
                      style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <router-link
                        :to="'/forum/' + post.id"
                        #="{ navigate, href }"
                      >
                        <n-a :href="href" @click="navigate">
                          {{ post.title }}
                        </n-a>
                      </router-link>
                    </n-space>

                    <n-tag type="info"> @ {{ post.updatedAt }} </n-tag>
                  </n-space>
                  <n-text type="strong">
                    Created by: {{ post.creatorName }}
                  </n-text>
                </n-space>
              </n-space>
            </n-card>
          </n-gi>
          <n-gi v-if="posts.length !== 0">
            <n-space justify="end">
              <n-pagination
                v-model:page="page"
                :page-size="5"
                :item-count="total"
                show-quick-jumper
              />
            </n-space>
          </n-gi>
        </n-grid>
      </n-gi>
      <n-gi :span="7" :offset="1">
        <n-card>
          <n-h2>
            <n-text type="primary"> 选择组织 </n-text>
          </n-h2>
          <n-space>
            <n-gi :span="5">
              <n-space>
                <n-select
                  v-model:value="organization"
                  filterable
                  placeholder="努力寻找ing"
                  :options="options"
                />
              </n-space>
            </n-gi>
          </n-space>
          <n-h2>
            <n-text type="primary"> 进入板块 </n-text>
          </n-h2>
          <n-space>
            <n-button
              strong
              secondary
              round
              :type="type === 0 ? 'primary' : 'default'"
              @click="handleSwitch(0)"
            >
              可以这里聊点学术问题
            </n-button>
            <n-button
              strong
              secondary
              round
              :type="type === 1 ? 'primary' : 'default'"
              @click="handleSwitch(1)"
            >
              大家平时都会灌水的吧
            </n-button>
            <n-button
              strong
              secondary
              round
              :type="type === 2 ? 'primary' : 'default'"
              @click="handleSwitch(2)"
            >
              课程有啥公告都在这里
            </n-button>
            <n-button
              strong
              secondary
              round
              :type="type === 3 ? 'primary' : 'default'"
              @click="handleSwitch(3)"
            >
              软件有了bug快来反馈
            </n-button>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NText,
  NButton,
  NInput,
  NInputGroup,
  NH2,
  NAvatar,
  NGi,
  NSpace,
  NSelect,
  NModal,
  FormInst,
  NForm,
  NFormItem,
  NPagination,
  NEmpty,
  NTag,
  NIcon,
  NA
} from 'naive-ui'
import { Airplane } from '@vicons/ionicons5'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'
import { createPosts, deletePosts, getAllPosts } from '../../api/forum'
import { getOrganization } from '../../api/social'
import MdEditor from 'md-editor-v3'
import { ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { uploadImage } from '../../api/user'

const router = useRouter()

const organization = ref<any>(null)
const options = ref<Array<any>>([])
const showModal = ref(false)

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  title: '',
  content: ''
})
const rules = {
  title: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  content: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  }
}

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

const posts = ref<Array<any>>([])
const needChange = ref(false)
const type = ref<any>(0)
const page = ref(1)
const total = ref(0)
const isAdmin = ref(false)
const keyWord = ref('')

function handleSwitch(number: any) {
  keyWord.value = ''
  type.value = number
  page.value = 1
}

async function onUploadImg(
  files: FileList,
  callback: (urls: string[]) => void
) {
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

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      createPosts({
        content: formValue.value.content,
        orgID: organization.value,
        title: formValue.value.title,
        type: type.value
      }).then((res) => {
        if (res.data.success) window.$message.success('发帖成功')
        formValue.value.content = ''
        formValue.value.title = ''
        showModal.value = false
        needChange.value = !needChange.value
      })
    } else {
      window.$message.error('请把标题和内容填充完整')
    }
  })
}

function handleDelete(id: any) {
  window.$message.error(id)
  deletePosts({ id: id }).then((res) => {
    window.$message.success(res.data.message)
    needChange.value = !needChange.value
  })
}

onMounted(() => {
  getUserOrganization().then((res: any) => {
    organization.value = res.data.organization[0].orgID
    res.data.organization.forEach((value: any) => {
      options.value.push({
        label: value.orgName,
        value: value.orgID
      })
    })
  })
})

watch(
  [needChange, organization, type, page],
  ([needChange, organization, type, page]) => {
    getAllPosts({
      id: organization,
      type: type,
      page: page,
      keyWord: keyWord.value
    }).then((res) => {
      posts.value = res.data.posts
      posts.value = []
      res.data.posts.forEach((post: any) => {
        posts.value.push({
          ...post,
          title:
            post.title.length > 15
              ? post.title.slice(0, 13) + '...'
              : post.title
        })
      })
      total.value = res.data.total
    })
    getOrganization(organization).then((res) => {
      isAdmin.value = res.data.isAdmin
    })
  }
)
</script>

<style scoped></style>
