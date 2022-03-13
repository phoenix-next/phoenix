<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="新建组织"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
  >
    <n-divider style="margin: 15px auto" />
    <n-input
      v-model:value="newTeamName"
      type="text"
      placeholder="请输入组织名称"
    >
    </n-input>
    <n-input
      v-model:value="newTeamProfile"
      type="textarea"
      placeholder="请输入组织简介"
      style="margin-top: 15px"
    >
    </n-input>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NDivider, NInput } from 'naive-ui'
import { ref } from 'vue'
import { createOrganization } from '../../../api/social'

const emits = defineEmits(['update:team-created'])
const show = ref(false)
const newTeamName = ref('')
const newTeamProfile = ref('')

function handlePositiveClick() {
  if (newTeamName.value == '') {
    window.$message.warning('组织名不能为空')
    return false
  }
  if (newTeamProfile.value == '') {
    window.$message.warning('组织简介不能为空')
    return false
  }
  createOrganization({
    name: newTeamName.value,
    profile: newTeamProfile.value
  }).then((res) => {
    if (res.data.success) {
      emits('update:team-created')
    }
  })
}
function open() {
  show.value = true
}

defineExpose({ open })
</script>

<style scoped></style>
