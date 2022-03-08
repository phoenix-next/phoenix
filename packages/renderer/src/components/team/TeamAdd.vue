<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="新建组织"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
    @update-show="$emit('update:show')"
  >
    <n-divider />
    <n-input
      v-model:value="newTeamName"
      type="text"
      placeholder="请输入组织名称"
    >
    </n-input>
    <n-input
      v-model:value="newTeamProfile"
      type="textarea"
      placeholder="请输入组织信息"
    >
    </n-input>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NDivider, NInput } from 'naive-ui'
import { ref } from 'vue'
import { createOrganization } from '../../api/social'

defineProps({
  show: {
    type: Boolean,
    default: null
  }
})

defineEmits(['update:show', 'update:team-created'])

const newTeamName = ref('')
const newTeamProfile = ref('')

function handlePositiveClick() {
  if (newTeamName.value == '') {
    window.$message.warning('组织名不能为空！')
    return false
  } else if (newTeamProfile.value == '') {
    window.$message.warning('组织信息不能为空！')
    return false
  } else {
    const requestData = {
      name: newTeamName.value,
      profile: newTeamProfile.value
    }
    createOrganization(requestData)
      .then((res) => {
        if (res.data.success) {
          window.$message.info('组织创建成功')
        } else {
          window.$message.error('组织创建失败')
        }
      })
      .catch(() => {
        window.$message.error('网络故障, 请检查网络连接')
      })
  }
}
</script>

<style scoped></style>
