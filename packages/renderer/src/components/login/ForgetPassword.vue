<template>
  <n-modal :show="open">
    <n-card style="width: 50%">
      <n-form :model="data">
        <n-grid x-gap="12">
          <n-form-item-grid-item label="邮箱" path="email" span="24">
            <n-input placeholder="请输入您的邮箱" v-model:value="data.email" />
          </n-form-item-grid-item>
          <n-form-item-grid-item label="新密码" path="password" span="24">
            <n-input
              placeholder="请输入新密码"
              v-model:value="data.password"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item
            label="重复密码"
            path="repeatPassword"
            span="24"
          >
            <n-input
              placeholder="请重复输入新密码"
              v-model:value="data.repeatPassword"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item label="验证码" path="captcha" span="12">
            <n-input placeholder="请输入验证码" v-model:value="data.captcha" />
          </n-form-item-grid-item>
          <n-form-item-grid-item span="12">
            <n-button type="primary" block secondary strong>
              发送验证码
            </n-button>
          </n-form-item-grid-item>
        </n-grid>
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
  NModal,
  NInput,
  NForm,
  NGrid,
  NFormItemGridItem,
  NButton,
  NCard,
  NSpace
} from 'naive-ui'
import { ref, reactive } from 'vue'

const open = ref(false)
const data = reactive({
  captcha: '',
  email: '',
  password: '',
  repeatPassword: ''
})

function clickConfirm() {
  // TODO
}
function clickCancel() {
  data.captcha = ''
  data.email = ''
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
