<template>
  <div class="container">
    <n-form style="width: 50%" :model="data">
      <n-grid>
        <n-grid-item span="24">
          <n-h1 type="default">个人资料</n-h1>
        </n-grid-item>
        <n-grid-item span="12">
          <n-form-item label="昵称" path="name">
            <n-input placeholder="请输入您的昵称" v-model:value="data.name" />
          </n-form-item>
          <n-form-item label="邮箱" path="email">
            <n-input disabled v-model:value="data.email" />
          </n-form-item>
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
              @change="clickUpload"
            >
              上传头像
            </upload-button>
          </div>
        </n-grid-item>
        <n-grid-item span="24">
          <n-form-item label="个人简介" path="profile">
            <n-input
              type="textarea"
              placeholder="请输入您的简介"
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
      <n-button type="default" round @click="clickRevise"> 确认修改 </n-button>
      <n-button type="default" round @click="clickChangePassword">
        修改密码
      </n-button>
      <n-button type="default" round @click="clickLogout"> 退出登录 </n-button>
    </n-space>
  </div>
  <change-password ref="modal" />
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NAvatar,
  NGrid,
  NGridItem,
  NFormItem,
  NH1,
  NButton,
  NSpace
} from 'naive-ui'
import UploadButton from '../components/problem/UploadButton.vue'
import ChangePassword from '../components/profile/ChangePassword.vue'
import { getProfile, updateUserProfile } from '../api/user'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { signOut } = useAuthStore()

const upload = ref<InstanceType<typeof UploadButton> | null>(null)
const modal = ref<InstanceType<typeof ChangePassword> | null>(null)
const data = reactive({
  avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  name: 'Loading...',
  email: 'Loading...',
  profile: 'Loading...'
})

function clickUpload() {
  const formData = new FormData()
  formData.append('avatar', upload.value?.file as File)
  updateUserProfile(formData).then(() => {
    upload.value?.clearFile()
    updateData()
  })
}
function clickRevise() {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('profile', data.profile)
  updateUserProfile(formData).then(() => {
    updateData()
  })
}
function clickChangePassword() {
  modal.value?.openModal()
}
function clickLogout() {
  localStorage.removeItem('userID')
  localStorage.removeItem('token')
  signOut()
  window.$message.success('退出账号成功')
  router.push({ name: 'login' })
}
function updateData() {
  getProfile({ id: localStorage.getItem('userID') as string }).then((res) => {
    data.name = res.data.name
    data.avatar = res.data.avatar
      ? 'http://43.143.161.129:8083/api/v1/' + res.data.avatar
      : 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
    data.email = res.data.email
    data.profile = res.data.profile
  })
}

onMounted(updateData)
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
