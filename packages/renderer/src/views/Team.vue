<template>
  <!-- TODO: team page -->
  <n-card>
    <n-tabs default-value="team-list" size="large">
      <n-tab-pane name="team-list" tab="成员列表">
        <team-list :teamName="teamName">
          <template #teamDropdownList>
            <n-dropdown
              trigger="click"
              placement="bottom-start"
              :options="teamsName"
              @select="handleSelectTeam"
            >
              <n-button text>{{ teamName }}</n-button>
            </n-dropdown>
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

const teamsName = [
  { label: 'kurino', key: 'kurino' },
  { label: 'phoenix-next', key: 'phoneix' },
  { label: 'Castagna', key: 'castagna' },
]
const teamName = ref(teamsName[0].key)
const handleSelectTeam = (key: string) => {
  teamName.value = key
  message.info('change to ' + key)
}
</script>

<style scoped></style>
-
