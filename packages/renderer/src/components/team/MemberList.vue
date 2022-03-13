<template>
  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <div>
        共有
        <span class="table-tool-bar-number">
          {{ tableData.length }}
        </span>
        个成员，
        <span class="table-tool-bar-number">
          {{ teamAdminsNumber }}
        </span>
        个管理员
      </div>
      <n-tooltip trigger="hover" v-if="isAdmin">
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
            style="width: 100%"
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
  updateOrganizationAdmin
} from '../../api/social'
import TeamInvite from './modal/TeamInvite.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userID = parseInt(localStorage.getItem('userID') as string)

const tableData = ref<Array<any>>([])
const isReloading = ref(false)
const isAdmin = ref(false)
const searchUserInfo = ref('')
const teamInvite = ref<InstanceType<typeof TeamInvite> | null>(null)

const teamAdminsNumber = computed(() => {
  return tableData.value.filter((item) => item.isAdmin).length
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
          disabled={!isAdmin || rowData.id === userID}
          onClick={() => {
            handleDeleteMember(rowData)
          }}
        >
          踢出组织
        </NButton>
        <NButton
          size='small'
          disabled={!isAdmin}
          type={rowData.isAdmin ? 'primary' : 'tertiary'}
          onClick={() => {
            handleUpdateAdmin(rowData)
          }}
        >
          管理员
        </NButton>
        <NButton
          size={'small'}
          disabled={!isAdmin}
          type={rowData.isAdmin ? 'tertiary' : 'primary'}
          onClick={() => {
            handleDeleteAdmin(rowData)
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
function handleDeleteMember(rowData: any) {
  deleteOrganizationMember(route.params.id as string, rowData.id)
    .then((res) => {
      if (res.data.success) {
        window.$message.info('踢出成功')
      }
    })
    .finally(reload)
}
function handleUpdateAdmin(rowData: any) {
  if (rowData.isAdmin) return
  updateOrganizationAdmin({ id: rowData.id }, route.params.id as string).then(
    (res) => {
      if (res.data.success) {
        tableData.value.at(rowData.key).identity = '管理员'
      }
    }
  )
}
function handleDeleteAdmin(rowData: any) {
  if (!rowData.isAdmin) return
  deleteOrganizationAdmin(rowData.id, route.params.id as string).then((res) => {
    if (res.data.success) {
      tableData.value.at(rowData.key).identity = '组员'
    }
  })
}
function reload() {
  isReloading.value = true
  getOrganizationMember(route.params.id as string).then((res) => {
    if (res.data.success) {
      tableData.value = res.data.Members.map((item: any, index: number) => {
        if (userID === item.id && item.isAdmin) {
          isAdmin.value = true
        }
        return {
          ...item,
          key: index,
          identity: item.isAdmin ? '管理员' : '组员'
        }
      })
    }
    isReloading.value = false
  })
}

onMounted(reload)
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
