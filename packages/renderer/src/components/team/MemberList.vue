<template>
  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <div>
        共有
        <span class="table-tool-bar-number">
          {{ teamUsersNumber }}
        </span>
        个成员，
        <span class="table-tool-bar-number">
          {{ teamAdminsNumber }}
        </span>
        个管理员
      </div>
      <n-tooltip trigger="hover" v-if="teamInfo.isAdmin">
        <template #trigger>
          <n-icon size="18" class="cursor-pointer">
            <alert-circle />
          </n-icon>
        </template>
        您是当前组织的管理员
      </n-tooltip>
    </div>
    <div class="table-toolbar-right">
      <n-space justify="space-between">
        <n-input-group>
          <n-input
            :style="{ width: '100%' }"
            placeholder="请输入搜索的用户名"
            v-model:value="searchUserInfo"
          />
          <n-button type="primary" ghost @click="handleFilterSearch">
            搜索
          </n-button>
        </n-input-group>
        <n-button text @click="teamInvite?.open">
          <template #icon>
            <n-icon size="25"> <add-circle-outline /> </n-icon>
          </template>
        </n-button>
        <n-button text @click="reload">
          <template #icon>
            <n-icon size="25"><reload-outline /> </n-icon>
          </template>
        </n-button>
      </n-space>
    </div>
  </div>
  <div class="table-context">
    <n-data-table
      ref="table"
      :columns="columns"
      :data="tableData"
      :loading="isReloading"
      :pagination="pagination"
      style="height: 620px"
    >
    </n-data-table>
  </div>
  <team-invite ref="teamInvite" />
</template>

<script setup lang="tsx">
import { AlertCircle, ReloadOutline, AddCircleOutline } from '@vicons/ionicons5'
import {
  NDataTable,
  NIcon,
  NSpace,
  NButton,
  NButtonGroup,
  DataTableBaseColumn,
  DataTableColumns,
  NTooltip,
  NInputGroup,
  NInput
} from 'naive-ui'
import { onMounted, ref, reactive, computed, unref } from 'vue'
import {
  deleteOrganizationAdmin,
  deleteOrganizationMember,
  getOrganizationMember,
  updateOrganizationAdmin,
  getOrganization
} from '../../api/social'
import TeamInvite from './modal/TeamInvite.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const teamUsersId = ref<Array<number>>([])
const tableData = ref<Array<any>>([])
const isReloading = ref(false)
const searchUserInfo = ref()
const teamInvite = ref<InstanceType<typeof TeamInvite> | null>(null)
const teamUsersNumber = computed(() => tableData.value.length)
const teamAdminsNumber = computed(() => {
  return tableData.value.filter((item) => {
    item.identity == '管理员'
  }).length
})

const teamInfo = reactive({
  isAdmin: false,
  isValid: false,
  name: '',
  profile: ''
})
const nameColumn = reactive<DataTableBaseColumn>({
  title: '姓名',
  key: 'name',
  sorter(rowA: any, rowB: any) {
    return rowA.name.length - rowB.name.length
  },
  filter: 'default',
  filterOptionValue: null
})
const buttomColumn = reactive<DataTableBaseColumn>({
  title: '操作',
  key: 'actions',
  width: '200px',
  render(rowData: any) {
    return (
      <NButtonGroup>
        <NButton
          size='small'
          disabled={
            !teamInfo.isAdmin ||
            teamUsersId.value[rowData.key] ===
              parseInt(localStorage.getItem('userID') as string)
          }
          onClick={() => {
            handleDeleteMember(rowData.key)
          }}
        >
          踢出组织
        </NButton>
        <NButton
          size='small'
          disabled={!teamInfo.isAdmin}
          type={rowData.identity === '管理员' ? 'primary' : 'tertiary'}
          onClick={() => {
            handleUpdateAdmin(rowData.key)
          }}
        >
          管理员
        </NButton>
        <NButton
          size={'small'}
          disabled={!teamInfo.isAdmin}
          type={rowData.identity === '组员' ? 'primary' : 'tertiary'}
          onClick={() => {
            handleDeleteAdmin(rowData.key)
          }}
        >
          组员
        </NButton>
      </NButtonGroup>
    )
  }
})
const columns = reactive<DataTableColumns>([
  nameColumn,
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '身份',
    key: 'identity',
    sorter: 'default'
  },
  buttomColumn
])
const pagination = reactive({
  page: 1,
  itemCount: unref(tableData).length,
  pageSize: 10,
  onChange: (page: number) => {
    pagination.page = page
  }
})

function handleFilterSearch() {
  nameColumn.filterOptionValue = searchUserInfo.value
}
function handleDeleteMember(rowKey: number) {
  deleteOrganizationMember(
    route.params.id as string,
    teamUsersId.value.at(rowKey) as number
  )
    .then((res) => {
      if (res.data.success) {
        window.$message.info('踢出成功')
      } else {
        window.$message.warning('踢出失败')
      }
    })
    .finally(reload)
}
function handleUpdateAdmin(rowKey: number) {
  if (tableData.value.at(rowKey).identity == '管理员') return
  updateOrganizationAdmin(
    { id: teamUsersId.value.at(rowKey) || 0 },
    route.params.id as string
  ).then((res) => {
    if (res.data.success) {
      tableData.value.at(rowKey).identity = '管理员'
    } else {
      window.$message.warning('切换管理员失败')
    }
  })
}
function handleDeleteAdmin(rowKey: number) {
  if (tableData.value.at(rowKey).identity == '组员') return
  deleteOrganizationAdmin(
    teamUsersId.value.at(rowKey) as number,
    route.params.id as string
  ).then((res) => {
    if (res.data.success) {
      tableData.value.at(rowKey).identity = '组员'
    } else {
      window.$message.warning('切换组员失败,失败原因:' + res.data.message)
    }
  })
}
function reload() {
  isReloading.value = true
  getOrganizationMember(route.params.id as string).then((res) => {
    if (res.data.success) {
      teamUsersId.value = []
      tableData.value = res.data.Members.map((item: any, index: number) => {
        teamUsersId.value.push(item.id)
        return {
          key: index,
          name: item.name,
          email: item.email,
          identity: item.isAdmin ? '管理员' : '组员'
        }
      })
    } else {
      window.$message.error('列表加载失败')
    }
    isReloading.value = false
  })
}

onMounted(() => {
  getOrganization(route.params.id as string).then((res) => {
    teamInfo.isAdmin = res.data.isAdmin
    teamInfo.isValid = res.data.isValid
    teamInfo.name = res.data.name
    teamInfo.profile = res.data.profile
    reload()
  })
})
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0 0 16px 0;
}

.table-toolbar-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}
.table-tool-bar-number {
  color: #18a058;
}

.table-toolbar-left-title {
  color: #18a058;
  font-size: 20px;
}

.cursor-pointer {
  color: gray;
}

.table-toolbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
