<template>
  <div class="container">
    <n-form style="width: 50%" :model="data">
      <n-grid>
        <n-grid-item span="24">
          <n-h1 type="default">组织资料</n-h1>
        </n-grid-item>
        <n-grid-item span="12">
          <n-form-item label="组织名称" path="name">
            <n-input placeholder="请输入组织名称" v-model:value="data.name" />
          </n-form-item>
          <!-- <n-form-item label="组织ID" path="id">
            {{ route.params.id }}
          </n-form-item> -->
        </n-grid-item>
        <n-grid-item span="12">
          <div class="avatar-container">
            <n-avatar
              round
              :size="100"
              :src="data.avatar"
              style="margin-top: 10px"
            />
            <upload-button
              style="width: 40%; margin-top: 10px"
              :show-file-list="false"
              ref="upload"
              @change="clickUploadAvatar"
            >
              上传组织图标
            </upload-button>
          </div>
        </n-grid-item>
        <n-grid-item span="24">
          <n-form-item label="组织简介" path="profile">
            <n-input
              type="textarea"
              placeholder="请输入组织简介"
              v-model:value="data.profile"
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>
    <n-space
      style="margin-top: 15px; width: 40%"
      justify="space-between"
      :wrap="false"
    >
      <n-button type="default" round @click="clickConfilmUpdate">
        确认修改
      </n-button>
      <n-button type="default" round @click="showQuitModal = true">
        退出组织
      </n-button>
      <n-button type="default" round @click="showDeleteModal = true">
        解散组织
      </n-button>
    </n-space>
  </div>
  <n-modal
    v-model:show="showQuitModal"
    preset="dialog"
    title="确认退出"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleQuitClick"
  >
    确认退出当前组织吗
  </n-modal>
  <n-modal
    v-model:show="showDeleteModal"
    preset="dialog"
    title="确认解散"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleDeleteClick"
  >
    确认解散当前组织吗
  </n-modal>
</template>

<script setup lang="ts">
import {
  NButton,
  NSpace,
  NModal,
  NForm,
  NGrid,
  NGridItem,
  NFormItem,
  NAvatar,
  NH1,
  NInput
} from 'naive-ui'
import { onMounted, ref, reactive } from 'vue'
import {
  deleteOrganization,
  getOrganization,
  updateOrganization
} from '../../api/social'
import { quitOrganization } from '../../api/user'
import { useRouter, useRoute } from 'vue-router'
import UploadButton from '../../components/problem/UploadButton.vue'
import { dateArray } from 'naive-ui/lib/date-picker/src/utils'
const router = useRouter()
const route = useRoute()
const isAdmin = ref(false)
const showQuitModal = ref(false)
const showDeleteModal = ref(false)
const upload = ref<InstanceType<typeof UploadButton> | null>(null)
const data = reactive({
  avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  name: 'Loading...',
  profile: 'Loading...'
})
function clickUploadAvatar() {
  const formData = new FormData()
  formData.append('avatar', upload.value?.file as File)
  updateOrganization(formData, route.params.id as string).then(() => {
    upload.value?.clearFile()
  })
}
function reload() {
  getOrganization(route.params.id as string).then((res) => {
    if (res.data.success) {
      data.avatar = res.data.avatar
        ? 'https://phoenix.matrix53.top/api/v1/' + res.data.avatar
        : 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
      data.name = res.data.name
      data.profile = res.data.profile
      isAdmin.value = res.data.isAdmin
    }
  })
}
function clickConfilmUpdate() {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('profile', data.profile)
  updateOrganization(formData, route.params.id as string)
}

function handleQuitClick() {
  quitOrganization({ id: route.params.id as string }).then((res) => {
    if (res.data.success) {
      router.push({ path: '/profile' })
    }
  })
}
function handleDeleteClick() {
  deleteOrganization(route.params.id as string).then((res) => {
    if (res.data.success) {
      router.push({ path: '/team' })
    }
  })
}
onMounted(reload)
</script>
<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 100px;
}
.avatar-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
