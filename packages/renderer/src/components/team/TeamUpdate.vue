<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="更新组织信息"
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
import { onMounted, ref } from 'vue'
import { updateOrganization } from '../../api/social'
const props =
  defineProps<{ teamId: number; teamName: string; teamProfile: string }>()
const emits = defineEmits(['update:show', 'update:team-profile'])

const newTeamName = ref('')
const newTeamProfile = ref('')
const show = ref(false)

onMounted(() => {
  newTeamName.value = props.teamName
  newTeamProfile.value = props.teamProfile
})

function handlePositiveClick() {
  updateOrganization(
    { name: newTeamName.value, profile: newTeamProfile.value },
    props.teamId
  )
    .then((res) => {
      if (res.data.success) {
        emits('update:team-profile')
        window.$message.info('组织信息已更改')
      } else {
        window.$message.warning('组织信息更改失败')
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}
</script>

<style scoped></style>
