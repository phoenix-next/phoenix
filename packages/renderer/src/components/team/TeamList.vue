<template>
  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <div>
        共有
        <span class="table-tool-bar-number">{{ teamUsersNumber }}</span
        >个成员，
        <span class="table-tool-bar-number">{{ teamAdminsNumber }}</span
        >个管理员
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
            :style="{ width: '100%' }"
            placeholder="请输入搜索的用户名"
            v-model:value="searchUserInfo"
          />
          <n-button type="primary" ghost @click="handleFilterSearch">
            搜索
          </n-button>
        </n-input-group>

        <n-button text @click="showAddModal = true">
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
    <team-invite
      v-model:show="showAddModal"
      @update:show="showAddModal = false"
    />
  </div>
  <div class="table-context">
    <n-data-table
      ref="table"
      :columns="columns"
      :data="tableData"
      :loading="isReloading"
      :pagination="pagination"
      :style="{ height: '620px' }"
    >
    </n-data-table>

    <n-button @click="addUserInfoTable"> 测试添加 </n-button>
  </div>
</template>

<script setup lang="tsx">
import {
  AlertCircle,
  ReloadOutline,
  SearchOutline,
  AddCircleOutline
} from '@vicons/ionicons5'
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
import { onMounted, ref, reactive, h, computed, unref } from 'vue'
import {
  deleteOrganizationAdmin,
  deleteOrganizationMember,
  getOrganizationMember,
  updateOrganizationAdmin
} from '../../api/social'
import TeamInvite from './TeamInvite.vue'

const props = defineProps<{ teamId: number; isAdmin: boolean | undefined }>()

onMounted(reload)

const teamUsersId = ref<Array<number>>([])
const tableData = ref<Array<any>>([])
const showAddModal = ref(false)
const requestData = ref()
const isReloading = ref(false)
const searchUserInfo = ref()
const teamUsersNumber = computed(() => tableData.value.length)
const teamAdminsNumber = computed(() => {
  var count = 0
  tableData.value.forEach((element: any) => {
    if (element.identity == '管理员') count++
  })
  return count
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
          disabled={props.isAdmin}
          onClick={() => {
            handleDeleteMember(rowData.key)
          }}
        >
          踢出组织
        </NButton>
        <NButton
          size='small'
          disabled={props.isAdmin}
          type={rowData.identity === '管理员' ? 'primary' : 'tertiary'}
          onClick={() => {
            handleUpdateAdmin(rowData.key)
          }}
        >
          管理员
        </NButton>
        <NButton
          size={'small'}
          disabled={props.isAdmin}
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
  deleteOrganizationMember(props.teamId, teamUsersId.value.at(rowKey) as number)
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
    { id: teamUsersId.value.at(rowKey)?.toString() as string },
    props.teamId
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
    props.teamId
  ).then((res) => {
    if (res.data.success) {
      tableData.value.at(rowKey).identity = '组员'
    } else {
      window.$message.warning('切换组员失败')
    }
  })
}

function reload() {
  isReloading.value = true
  getOrganizationMember(requestData.value).then((res) => {
    if (res.data.success) {
      var counter = 0
      res.data.members.forEach((element: any) => {
        tableData.value.push({
          key: counter,
          name: element.name,
          email: element.email,
          identity: element.isAdmin ? '管理员' : '组员'
        })
        teamUsersId.value.push(element.id)
        counter++
      })
    } else {
      window.$message.error('列表加载失败')
    }
    isReloading.value = false
  })
}

function addUserInfoTable() {
  var currentCounter = tableData.value.length
  tableData.value.push({
    key: currentCounter,
    name: currentCounter.toString(),
    email: currentCounter.toString(),
    identity: '组员'
  })
  pagination.itemCount += 1
}
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
