<template>
  <div class="container">
    <n-tabs :value="tabValue" size="large" @update-value="handleUpdate">
      <n-tab-pane name="myTeam" tab="我的组织">
        <team-list />
      </n-tab-pane>
      <n-tab-pane name="invitation" :tab="organizationInvitation">
        <team-invitation @reduce="handleReduce" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="tsx">
import { NTabs, NTabPane, NBadge } from 'naive-ui'
import TeamList from '../../components/team/TeamList.vue'
import TeamInvitation from '../../components/team/TeamInvitation.vue'
import { onMounted, ref } from 'vue'
import { getUserInvitation } from '../../api/user'

const invitationNum = ref(0)
const tabValue = ref('myTeam')

const organizationInvitation = () => (
  <NBadge value={invitationNum.value} color='#18a058'>
    <div
      style={{
        color: tabValue.value === 'myTeam' ? 'rgb(51,54,57)' : '#18a058'
      }}
    >
      组织邀请
    </div>
  </NBadge>
)

function handleUpdate(newValue: string) {
  tabValue.value = newValue
}
function handleReduce() {
  invitationNum.value -= 1
}

onMounted(() =>
  getUserInvitation().then((res) => {
    if (res.data.organization === undefined) {
      invitationNum.value = 0
    } else {
      invitationNum.value = res.data.organization.length
    }
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
