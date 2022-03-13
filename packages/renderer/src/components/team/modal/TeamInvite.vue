<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="添加成员"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
  >
    <n-divider />
    <n-space>
      <n-select
        v-model:value="userIdentity"
        :options="identityOptions"
        style="width: 100px"
      >
      </n-select>
      <n-input
        v-model:value="userEmail"
        type="text"
        placeholder="请输入添加的成员邮箱"
        style="width: 275px"
      />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NDivider, NSelect, NInput, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { createInvitation } from '../../../api/social'
import { useRoute } from 'vue-router'

const route = useRoute()
const userEmail = ref('')
const userIdentity = ref('组员')
const show = ref(false)

const identityOptions = [
  {
    label: '组员',
    value: '组员'
  },
  {
    label: '管理员',
    value: '管理员'
  }
]

function handlePositiveClick() {
  createInvitation(
    {
      email: userEmail.value,
      isAdmin: userIdentity.value === '管理员'
    },
    route.params.id as string
  ).then((res) => {
    if (res.data.success) {
      window.$message.info('已发送邀请')
    } else {
      window.$message.error('邀请发送失败')
    }
  })
}
function open() {
  show.value = true
}

defineExpose({ open })
</script>
