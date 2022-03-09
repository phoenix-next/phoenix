<template>
  <n-space vertical size="large">
    <n-descriptions label-placement="left" :column="1" separator="   ">
      <n-descriptions-item label="组织名称">
        {{ teamName }}
        <n-button text>
          <template #icon>
            <n-icon><pencil-outline /></n-icon>
          </template>
        </n-button>
      </n-descriptions-item>
      <n-descriptions-item label="组织信息">
        {{ teamProfile }}
      </n-descriptions-item>
      <n-descriptions-item label="组织ID">
        {{ props.teamId }}
      </n-descriptions-item>
    </n-descriptions>
    <n-button text> 退出组织 </n-button>
    <n-button text v-if="isAdmin"> 解散组织 </n-button>
  </n-space>
  <team-update
    :team-id="props.teamId"
    :teamName="teamName"
    :teamProfile="teamProfile"
    @update:show="showUpdateModal = false"
    @update:team-profile="reload"
  ></team-update>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import {
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NSpace,
  NIcon
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { getOrganization } from '../../api/social'
import { PencilOutline } from '@vicons/ionicons5'
import TeamUpdate from './TeamUpdate.vue'
const props = defineProps({
=======
import { NDescriptions, NDescriptionsItem } from 'naive-ui'
defineProps({
>>>>>>> 0130ed8b0a34f68bc9542dedc1208e9315923f4f
  isAdmin: {
    type: Boolean,
    default: false
  },
  teamId: {
    type: Number,
    default: null
  }
})

const teamName = ref('')
const teamProfile = ref('')
const showUpdateModal = ref(false)

const reload = () => {
  getOrganization(props.teamId)
    .then((res) => {
      if (res.data.success) {
        teamName.value = res.data.name
        teamProfile.value = res.data.profile
      } else {
        window.$message.info('组织信息获取失败')
      }
    })
    .catch((res) => {
      window.$message.info('网络故障, 请检查网络连接')
    })
}

onMounted(reload)
</script>

<style scoped></style>
