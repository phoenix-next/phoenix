<template>
  <!-- TODO: team page -->
  <TeamList title="成员列表" :titleTooltip="UserName"> </TeamList>
</template>

<script setup lang="ts">
import { computed, h, reactive, ref, unref } from 'vue'
import { useMessage } from 'naive-ui'
import TeamList from '../components/team/TeamList.vue'

const UserName = ref('Kurino')
const tipMessage = computed(() => {
  return UserName.value
})
</script>

<style scoped></style>
