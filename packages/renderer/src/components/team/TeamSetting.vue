<template>
  <n-space vertical size="large">
    <n-descriptions label-placement="left" :column="1" separator="   ">
      <n-descriptions-item label="组织名称">
        {{ teamName }}
        <n-button text @click="showUpdateModal = true">
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
    <n-button text @click="showQuitModal = true"> 退出组织 </n-button>
    <n-button text v-if="isAdmin" @click="showDeleteModal = true">
      解散组织
    </n-button>
  </n-space>
  <team-update
    :show="showUpdateModal"
    :id="props.teamId"
    :name="teamName"
    :profile="teamProfile"
    @update:show="showUpdateModal = false"
    @update:team-profile="reload"
  ></team-update>
  <n-modal
    v-model:show="showQuitModal"
    preset="dialog"
    title="确认退出"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleQuitClick"
  >
    确认退出当前组织吗
  </n-modal>
  <n-modal
    v-model:show="showDeleteModal"
    preset="dialog"
    title="确认解散"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleDeleteClick"
  >
    确认解散当前组织吗
  </n-modal>
</template>

<script setup lang="ts">
import {
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NSpace,
  NIcon,
  NModal
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import {
  deleteOrganization,
  deleteOrganizationMember,
  getOrganization
} from '../../api/social'
import { PencilOutline } from '@vicons/ionicons5'
import TeamUpdate from './modal/TeamUpdate.vue'
import { useRouter } from 'vue-router'
const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  },
  teamId: {
    type: Number,
    default: null
  }
})

const router = useRouter()

const teamName = ref('')
const teamProfile = ref('')
const showUpdateModal = ref(false)
const showQuitModal = ref(false)
const showDeleteModal = ref(false)

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

function handleQuitClick() {
  const userId = localStorage.getItem('userID') as string
  deleteOrganizationMember(props.teamId, parseInt(userId))
    .then((res) => {
      if (res.data.success) {
        router.push({ path: '/profile' })
      } else {
        window.$message.warning('退出组织失败')
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}

function handleDeleteClick() {
  deleteOrganization(props.teamId)
    .then((res) => {
      if (res.data.success) {
        router.push({ path: '/profile' })
      } else {
        window.$message.warning('解散组织失败')
      }
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
}

onMounted(reload)
</script>

<style scoped></style>
