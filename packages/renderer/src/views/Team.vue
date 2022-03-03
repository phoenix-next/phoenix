<template>
  <!-- TODO: team page -->
  <n-card>
    <n-tabs default-value="team-list" size="large">
      <n-tab-pane name="team-list" tab="成员列表">
        <team-list
          :teamName="teamName"
          :teamId="teamId"
          :title-tooltip="isTeamAdmin ? '您当前是管理员' : ''"
        >
          <template #teamSelectList>
            <n-select
              v-model:value="teamName"
              :options="teamsNameRef"
              @update-value="handleSelectTeam"
            >
            </n-select>
          </template>
        </team-list>
      </n-tab-pane>
      <n-tab-pane name="team-setting" tab="组织设定">
        <team-setting> </team-setting>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import TeamList from '../components/team/TeamList.vue'
import TeamSetting from '../components/team/TeamSetting.vue'
import { getOrganization } from '../api/social'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'

const message = useMessage()

const teamsIdDic = new Map<string, number>()
const teamsNameRef = ref<SelectMixedOption[]>([])
const isTeamsAdminDic = new Map<string, boolean>()

const teamId = ref()
const teamName = ref()
const isTeamAdmin = ref<boolean | undefined>(false)

onMounted(
  () => {
    getOrganization().then(
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
  }
  // () => {
  //   testTeamsData.data.organization.forEach((element) => {
  //     teamsNameRef.value.push({ label: element.name, value: element.name })
  //     isTeamsAdminDic.set(element.name, element.isAdmin)
  //     teamsIdDic.set(element.name, element.id)
  //   })
  //   teamName.value = teamsNameRef.value[0].label
  //   isTeamAdmin.value = testTeamsData.data.organization[0].isAdmin
  //   teamId.value = testTeamsData.data.organization[0].id
  // }
)
// const testTeamsData = {
//   data: {
//     success: true,
//     organization: [
//       {
//         id: 1,
//         name: 'kurino的队伍',
//         isAdmin: true
//       },
//       {
//         id: 2,
//         name: 'phoneix-next',
//         isAdmin: false
//       }
//     ]
//   }
// }

const handleSelectTeam = (value: string) => {
  if (teamName.value != value) {
    teamName.value = value
    isTeamAdmin.value = isTeamsAdminDic.get(value)
    teamId.value = teamsIdDic.get(value)
    message.info('Team change to ' + value)
  }
}
</script>

<style scoped></style>
