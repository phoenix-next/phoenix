<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="更新组织信息"
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
      placeholder="请输入组织信息"
      style="margin-top: 15px"
    >
    </n-input>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NDivider, NInput } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { updateOrganization, getOrganization } from '../../../api/social'
import { useRoute } from 'vue-router'

const emits = defineEmits(['update:team-profile'])

const route = useRoute()
const show = ref(false)
const newTeamName = ref('')
const newTeamProfile = ref('')

function handlePositiveClick() {
  updateOrganization(
    { name: newTeamName.value, profile: newTeamProfile.value },
    route.params.id as string
  ).then((res) => {
    if (res.data.success) {
      window.$message.info('组织信息已更改')
      emits('update:team-profile')
    }
  })
}
function open() {
  show.value = true
}

onMounted(() => {
  getOrganization(route.params.id as string).then((res) => {
    newTeamName.value = res.data.name
    newTeamProfile.value = res.data.profile
  })
})

defineExpose({ open })
</script>

<style scoped></style>
