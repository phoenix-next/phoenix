<template>
  <div class="container">
    <n-tabs default-value="myTeam" size="large">
      <n-tab-pane name="myTeam" tab="我的组织">
        <team-list />
      </n-tab-pane>
      <n-tab-pane name="invitation" :tab="organizationInvitation">
        <team-invitation />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NBadge } from 'naive-ui'
import TeamList from '../../components/team/TeamList.vue'
import TeamInvitation from '../../components/team/TeamInvitation.vue'
import { h, onMounted, ref } from 'vue'
import { getUserInvitation } from '../../api/user'

const invitationNum = ref(0)
const organizationInvitation = () => {
  return h(
    NBadge,
    { value: invitationNum.value, color: '#18a058' },
    { default: () => '组织邀请' }
  )
}

onMounted(() =>
  getUserInvitation().then((res) => {
    invitationNum.value = res.data.organization.length
  })
)
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 24px;
}
</style>
