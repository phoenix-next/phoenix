<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
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
          <n-input
            v-model:value="formValue.content"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 7
            }"
            placeholder="输入内容"
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
      <n-gi :span="5">
        <n-h2>
          <n-text type="primary"> 最近讨论 </n-text>
        </n-h2>
      </n-gi>
      <n-gi :span="14" :offset="2">
        <n-input-group>
          <n-button type="primary" class="label">查找帖子</n-button>
          <n-input :style="{ width: '50%' }" />
          <n-button type="primary" ghost>搜索</n-button>
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
    <n-grid>
      <n-gi :span="16">
        <n-grid :x-gap="12" :y-gap="8" :cols="1">
          <n-gi v-if="posts.length === 0">
            <n-empty description="是一个飞机">
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
              <n-layout has-sider>
                <n-layout-sider bordered :width="80">
                  <n-avatar
                    round
                    :size="60"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                  />
                </n-layout-sider>
                <n-layout>
                  <n-layout-content>
                    <n-text @click="handleClick">
                      {{ post.title }}
                    </n-text>
                    <n-button
                      @click="handleDelete(post.id)"
                      size="small"
                      style="position: absolute; right: 0"
                    >
                      删除
                    </n-button>
                    <br />
                    <n-text> {{ post.creatorName }} </n-text>
                    <br />
                    <n-text> Last Mentioned in: {{ post.updatedAt }} </n-text>
                  </n-layout-content>
                </n-layout>
              </n-layout>
            </n-card>
          </n-gi>
          <n-gi v-if="posts.length !== 0">
            <n-pagination
              v-model:page="page"
              :page-size="5"
              :item-count="total"
              show-quick-jumper
            />
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
  NLayout,
  NText,
  NLayoutContent,
  NButton,
  NInput,
  NInputGroup,
  NH2,
  NAvatar,
  NLayoutSider,
  NGi,
  NSpace,
  NSelect,
  NModal,
  FormInst,
  NForm,
  NFormItem,
  NPagination,
  NEmpty
} from 'naive-ui'
import { Airplane } from '@vicons/ionicons5'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'
import { createPosts, deletePosts, getPosts } from '../../api/forum'

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

const posts = ref<Array<any>>([])
const needChange = ref(false)
const type = ref<any>(0)
const page = ref(1)
const total = ref(0)

function handleClick() {
  router.push('/forum/1')
}

function handleSwitch(number: any) {
  type.value = number
  page.value = 1
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
      })
        .then((res) => {
          window.$message.success('发帖成功')
          formValue.value.content = ''
          formValue.value.title = ''
          showModal.value = false
          needChange.value = !needChange.value
        })
        .catch(() => {
          window.$message.error('网络故障, 请检查网络连接')
        })
    } else {
      window.$message.error('请把标题和内容填充完整')
    }
  })
}

function handleDelete(id: any) {
  window.$message.error(id)
  deletePosts({ id: id })
    .then((res) => {
      window.$message.success(res.data.message)
      needChange.value = !needChange.value
    })
    .catch(() => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}

onMounted(() => {
  getUserOrganization()
    .then((res: any) => {
      organization.value = res.data.organization[0].orgID
      res.data.organization.forEach((value: any) => {
        options.value.push({
          label: value.orgName,
          value: value.orgID
        })
      })
    })
    .catch((res: any) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
})

watch(
  [needChange, organization, type, page],
  ([needChange, organization, type, page]) => {
    getPosts({
      id: organization,
      type: type,
      page: page
    }).then((res) => {
      posts.value = res.data.posts
      total.value = res.data.total
    })
  }
)
</script>

<style scoped></style>
