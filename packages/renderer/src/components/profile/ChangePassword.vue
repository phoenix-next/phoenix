<template>
  <n-modal :show="open">
    <n-card style="width: 50%">
      <n-form :model="data">
        <n-form-item label="旧密码" path="oldPassword">
          <n-input
            placeholder="请输入旧密码"
            v-model:value="data.oldPassword"
            show-password-on="mousedown"
            type="password"
          />
        </n-form-item>
        <n-form-item label="新密码" path="password">
          <n-input
            placeholder="请输入新密码"
            v-model:value="data.password"
            show-password-on="mousedown"
            type="password"
          />
        </n-form-item>
        <n-form-item label="确认新密码" path="repeatPassword">
          <n-input
            placeholder="请重复输入新密码"
            v-model:value="data.repeatPassword"
            show-password-on="mousedown"
            type="password"
          />
        </n-form-item>
      </n-form>
      <n-space style="width: 100%" justify="end">
        <n-button @click="clickConfirm">确定</n-button>
        <n-button @click="clickCancel">取消</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NButton,
  NForm,
  NModal,
  NFormItem,
  NInput,
  NCard,
  NSpace
} from 'naive-ui'
import { reactive, ref } from 'vue'
import { updateUserProfile } from '../../api/user'

const open = ref(false)
const data = reactive({
  oldPassword: '',
  password: '',
  repeatPassword: ''
})

function clickConfirm() {
  if (!data.oldPassword || !data.password || !data.repeatPassword) {
    window.$message.warning('请完成所有信息的填写')
    return
  }
  if (data.password !== data.repeatPassword) {
    window.$message.warning('重复密码和新密码不相同')
    return
  }
  const formData = new FormData()
  formData.append('oldPassword', data.oldPassword)
  formData.append('password', data.password)
  updateUserProfile(formData).then((res) => {
    if (res.data.success) {
      window.$message.success('修改密码成功')
      data.oldPassword = ''
      data.password = ''
      data.repeatPassword = ''
      open.value = false
    }
  })
}
function clickCancel() {
  data.oldPassword = ''
  data.password = ''
  data.repeatPassword = ''
  open.value = false
}
function openModal() {
  open.value = true
}

defineExpose({ openModal })
</script>

<style scoped></style>
