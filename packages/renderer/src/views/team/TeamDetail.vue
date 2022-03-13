<template>
  <div class="container">
    <n-tabs default-value="team-list" size="large">
      <n-tab-pane name="team-list" tab="成员列表">
        <member-list />
      </n-tab-pane>
      <n-tab-pane name="team-setting" tab="组织设定">
        <team-setting />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import MemberList from '../../components/team/MemberList.vue'
import TeamSetting from '../../components/team/TeamSetting.vue'
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 20px 24px;
  box-sizing: border-box;
}
</style>
