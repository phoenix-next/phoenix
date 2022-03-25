<template>
  <n-button
    type="primary"
    secondary
    strong
    @click="handleCreate"
    style="position: absolute; right: 24px; top: 32px"
  >
    新建组织
  </n-button>

  <n-scrollbar style="max-height: 620px">
    <div v-for="(item, index) in data" style="margin-top: 4px">
      <n-card>
        <n-thing>
          <template #avatar>
            <n-avatar
              round
              :size="35"
              :src="item.avatar"
              style="margin-right: 10px; margin-top: 10px"
            >
            </n-avatar>
          </template>
          <template #header>{{ item.orgName }}</template>
          <template #header-extra>
            <n-button
              size="small"
              secondary
              round
              type="info"
              @click="handleClick(item.orgID)"
            >
              详细信息
            </n-button>
          </template>
          <template #description>
            <n-button size="tiny" secondary round style="pointer-events: none">
              {{ item.isAdmin ? '管理员' : '组员' }}
            </n-button>
          </template>
        </n-thing>
      </n-card>
    </div>
  </n-scrollbar>
  <n-empty description="还没有加入组织哦" v-if="data?.length == 0"> </n-empty>
  <team-add ref="teamAdd" @update:team-created="reload" />
</template>

<script setup lang="tsx">
import { NButton, NThing, NScrollbar, NCard, NEmpty, NAvatar } from 'naive-ui'
import { ref, onMounted } from 'vue'
import TeamAdd from './modal/TeamAdd.vue'
import { getUserOrganization } from '../../api/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const teamAdd = ref<InstanceType<typeof TeamAdd> | null>(null)
type teamInfo = {
  avatar: string
  isAdmin: boolean
  orgID: number
  orgName: string
}
const data = ref<Array<teamInfo>>()
const teamsNum = ref(0)
const loading = ref(false)

function handleCreate() {
  teamAdd.value?.open()
}
function handleClick(id: number) {
  router.push({ path: '/team/' + id })
}

function reload() {
  getUserOrganization().then((res) => {
    data.value = res.data.organization
    data.value?.forEach((element) => {
      element.avatar = element.avatar
        ? 'https://phoenix.matrix53.top/api/v1/' + element.avatar
        : 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
    })
    teamsNum.value = res.data.organization.length
    loading.value = false
  })
}

onMounted(reload)
</script>

<style scoped></style>
