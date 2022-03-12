<template>
  <n-card>
    <n-select
      placeholder="请选择当前组织"
      size="large"
      v-model:value="teamName"
      :options="options"
      @update-value="handleSelectTeam"
    >
      <template #action>
        <n-button quaternary type="success" @click="showAddTeamModal = true">
          新建组织
        </n-button>
      </template>
    </n-select>
    <team-add
      v-model:show="showAddTeamModal"
      @update-show="showAddTeamModal = false"
      @update:team-created="reload"
    ></team-add>
    <n-card>
      <n-tabs default-value="team-list" size="large">
        <n-tab-pane name="team-list" tab="成员列表">
          <team-list :team-id="teamId" :is-admin="isTeamAdmin"> </team-list>
        </n-tab-pane>
        <n-tab-pane name="team-setting" tab="组织设定">
          <team-setting
            :team-id="teamId"
            :is-admin="isTeamAdmin"
            @update:team-setting="reload"
          >
          </team-setting>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NCard, NSelect, NButton, NTabs, NTabPane } from 'naive-ui'
import TeamList from '../components/team/TeamList.vue'
import TeamSetting from '../components/team/TeamSetting.vue'
import { getUserOrganization } from '../api/user'
import TeamAdd from '../components/team/modal/TeamAdd.vue'

const teamsIdDic = new Map<string, number>()
const options = ref<any>([])
const isTeamsAdminDic = new Map<string, boolean>()

const teamId = ref(0)
const teamName = ref()
const isTeamAdmin = ref(false)

const showAddTeamModal = ref(false)

onMounted(reload)

function handleSelectTeam(value: string) {
  if (teamName.value != value) {
    teamName.value = value
    isTeamAdmin.value = isTeamsAdminDic.get(value) as boolean
    teamId.value = teamsIdDic.get(value) as number
  }
}

function reload() {
  getUserOrganization().then((res) => {
    if (res.data.success) {
      options.value.length = []
      res.data.organization.forEach((element: any) => {
        options.value.push({
          label: element.orgName,
          value: element.orgName
        })
        isTeamsAdminDic.set(element.orgName, element.isAdmin)
        teamsIdDic.set(element.orgName, element.orgID)
      })
      teamName.value = options.value[0].label
      isTeamAdmin.value = res.data.organization[0].isAdmin
      teamId.value = res.data.organization[0].orgID
    } else {
      window.$message.error('加载组织失败')
    }
  })
}
</script>

<style scoped></style>
