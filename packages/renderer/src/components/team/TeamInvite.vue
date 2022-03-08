<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="添加成员"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
    @update-show="$emit('update:show')"
  >
    <n-divider />
    <n-space>
      <n-select
        v-model:value="userIdentity"
        :options="identityOptions"
        default-value="组员"
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
import { useMessage, NModal, NDivider, NSelect, NInput, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { createInvitation } from '../../api/social'

const props = defineProps({
  show: {
    type: Boolean,
    default: null
  },
  teamId: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:show'])

const message = useMessage()

const userEmail = ref()
const userIdentity = ref()

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
    { email: userEmail.value, isAdmin: userIdentity.value },
    props.teamId
  )
    .then((res) => {
      if (res.data.success) {
        message.info('已发送邀请')
      } else {
        message.error('邀请发送失败')
      }
    })
    .catch((res) => {
      message.error('网络故障, 请检查网络连接')
    })
}
</script>
