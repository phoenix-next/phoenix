<template>
  <n-space vertical size="large">
    <n-descriptions label-placement="left" :column="1" separator="   ">
      <n-descriptions-item label="组织名称">
        {{ teamName }}
        <n-button text @click="teamUpdate?.open">
          <template #icon>
            <n-icon><pencil-outline /></n-icon>
          </template>
        </n-button>
      </n-descriptions-item>
      <n-descriptions-item label="组织信息">
        {{ teamProfile }}
      </n-descriptions-item>
      <n-descriptions-item label="组织编号">
        {{ route.params.id }}
      </n-descriptions-item>
    </n-descriptions>
    <n-button text @click="showQuitModal = true"> 退出组织 </n-button>
    <n-button text v-if="isAdmin" @click="showDeleteModal = true">
      解散组织
    </n-button>
  </n-space>
  <team-update ref="teamUpdate" @update:team-profile="reload" />
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
import { deleteOrganization, getOrganization } from '../../api/social'
import { quitOrganization } from '../../api/user'
import { PencilOutline } from '@vicons/ionicons5'
import TeamUpdate from './modal/TeamUpdate.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isAdmin = ref(false)
const teamName = ref('')
const teamProfile = ref('')
const showQuitModal = ref(false)
const showDeleteModal = ref(false)
const teamUpdate = ref<InstanceType<typeof TeamUpdate> | null>(null)

function reload() {
  getOrganization(route.params.id as string).then((res) => {
    if (res.data.success) {
      isAdmin.value = res.data.isAdmin
      teamName.value = res.data.name
      teamProfile.value = res.data.profile
    } else {
      window.$message.info('组织信息获取失败')
    }
  })
}
function handleQuitClick() {
  quitOrganization({ id: route.params.id as string }).then((res) => {
    if (res.data.success) {
      router.push({ path: '/profile' })
    } else {
      window.$message.warning('退出组织失败')
    }
  })
}
function handleDeleteClick() {
  deleteOrganization(route.params.id as string).then((res) => {
    if (res.data.success) {
      router.push({ path: '/profile' })
    } else {
      window.$message.warning('解散组织失败')
    }
  })
}

onMounted(reload)
</script>

<style scoped></style>
