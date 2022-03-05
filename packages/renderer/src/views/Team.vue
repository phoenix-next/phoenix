<template>
  <!-- TODO: team page -->
  <n-card>
    <n-select
      placeholder="请选择当前组织"
      size="large"
      v-model:value="teamName"
      :options="teamsNameRef"
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
    ></team-add>
    <n-card>
      <n-tabs default-value="team-list" size="large">
        <n-tab-pane name="team-list" tab="成员列表">
          <team-list
            :teamName="teamName"
            :teamId="teamId"
            :title-tooltip="isTeamAdmin ? '您当前是管理员' : ''"
          >
          </team-list>
        </n-tab-pane>
        <n-tab-pane name="team-setting" tab="组织设定">
          <team-setting> </team-setting>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import TeamList from '../components/team/TeamList.vue'
import TeamSetting from '../components/team/TeamSetting.vue'
import { getOrganization } from '../api/social'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import TeamAdd from '../components/team/TeamAdd.vue'

const message = useMessage()

const teamsIdDic = new Map<string, number>()
const teamsNameRef = ref<SelectMixedOption[]>([])
const isTeamsAdminDic = new Map<string, boolean>()

const teamId = ref()
const teamName = ref()
const isTeamAdmin = ref<boolean | undefined>(false)

const showAddTeamModal = ref(false)
const requestData = ref()

onMounted(() => {
  getOrganization({ id: localStorage.getItem('userID') || '' }).then(
    (res: {
      data: {
        success: boolean
        organization: {
          id: number
          isAdmin: boolean
          name: string
        }[]
      }
    }) => {
      if (res.data.success) {
        res.data.organization.forEach((element) => {
          teamsNameRef.value.push({
            label: element.name,
            value: element.name
          })
          isTeamsAdminDic.set(element.name, element.isAdmin)
          teamsIdDic.set(element.name, element.id)
        })
        teamName.value = teamsNameRef.value[0].label
        isTeamAdmin.value = res.data.organization[0].isAdmin
      }
    }
  )
})

const handleSelectTeam = (value: string) => {
  if (teamName.value != value) {
    teamName.value = value
    isTeamAdmin.value = isTeamsAdminDic.get(value)
    teamId.value = teamsIdDic.get(value)
  }
}
</script>

<style scoped></style>
