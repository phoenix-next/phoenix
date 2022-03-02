<template>
  <!-- TODO: team page -->
  <n-card>
    <n-tabs default-value="team-list" size="large">
      <n-tab-pane name="team-list" tab="成员列表">
        <team-list
          :teamName="teamName"
          :title-tooltip="isTeamManager ? '您当前是管理员' : ''"
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
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import TeamList from '../components/team/TeamList.vue'
import TeamSetting from '../components/team/TeamSetting.vue'

const message = useMessage()

// const organization
const teamsNameRef = ref([{ label: '', value: '' }])
const teamName = ref('')

const isTeamManager = ref(false)
const handleSelectTeam = (value: string) => {
  teamName.value = value
  message.info('change to ' + value)
}
</script>

<style scoped></style>
-
