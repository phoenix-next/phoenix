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
          <team-list :teamId="teamId" :isAdmin="isTeamAdmin"> </team-list>
        </n-tab-pane>
        <n-tab-pane name="team-setting" tab="组织设定">
          <team-setting :teamId="teamId" :isAdmin="isTeamAdmin"> </team-setting>
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

const teamId = ref()
const teamName = ref()
const isTeamAdmin = ref(false)

const showAddTeamModal = ref(false)

onMounted(reload)

function handleSelectTeam(value: string) {
  if (teamName.value != value) {
    teamName.value = value
    isTeamAdmin.value = isTeamsAdminDic.get(value) as boolean
    teamId.value = teamsIdDic.get(value)
  }
}

function reload() {
  getUserOrganization()
    .then((res) => {
      if (res.data.success) {
        res.data.organizations.forEach((element: any) => {
          options.value.push({
            label: element.name,
            value: element.name
          })
          isTeamsAdminDic.set(element.name, element.isAdmin)
          teamsIdDic.set(element.name, element.id)
        })
        teamName.value = options.value[0].label
        isTeamAdmin.value = res.data.organizations[0].isAdmin
      } else {
        window.$message.error('加载组织失败')
      }
    })
    .catch(() => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}
</script>

<style scoped></style>
