<template>
  <div class="container">
    <n-scrollbar style="max-height: 620px">
      <template v-for="item in data">
        <n-alert
          :title="'来自：' + item.orgName + '的邀请'"
          type="info"
          style="margin-top: 6px"
        >
          <div style="display: flex; justify-content: end">
            <n-button
              style="margin-right: 10px"
              @click="handleAccept(item.orgID)"
            >
              同意加入
            </n-button>
            <n-button @click="handleReject(item.orgID)">拒绝加入</n-button>
          </div>
        </n-alert>
      </template>
    </n-scrollbar>
    <n-empty description="还没有邀请哦" v-if="data?.length == 0"> </n-empty>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NButton, NScrollbar, NEmpty } from 'naive-ui'
import { ref, onMounted } from 'vue'
import { getUserInvitation } from '../../api/user'
import { updateOrganizationMember } from '../../api/social'
import { useRouter } from 'vue-router'

const emit = defineEmits(['reduce'])

const router = useRouter()

const data = ref<Array<{ isAdmin: boolean; orgID: number; orgName: string }>>()

function handleAccept(teamID: number) {
  updateOrganizationMember({ teamID, accept: true }).then(() => {
    reload()
    emit('reduce')
  })
  router.push({ path: '/team/' + teamID })
}
function handleReject(teamID: number) {
  updateOrganizationMember({ teamID, accept: false }).then(() => {
    reload()
    emit('reduce')
  })
}
function reload() {
  getUserInvitation().then((res) => {
    data.value = res.data.organization
  })
}

onMounted(reload)
</script>

<style scoped></style>
