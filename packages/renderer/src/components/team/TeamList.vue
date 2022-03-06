<template>
  <div class="table-toolbar">
    <div class="table-toolbar-left">
      <div>
        共有
        <span class="table-tool-bar-number">{{ teamUserNumber }}</span
        >个成员，
        <span class="table-tool-bar-number">{{ teamAdminNumber }}</span
        >个管理员
      </div>
      <n-tooltip trigger="hover" v-if="titleTooltip">
        <template #trigger>
          <n-icon size="18" class="cursor-pointer">
            <alert-circle />
          </n-icon>
        </template>
        {{ titleTooltip }}
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
          <n-button
            type="primary"
            ghost
            @click="nameColum.filterOptionValue = searchUserInfo.value"
          >
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
      :data="tableDataRef"
      :loading="isReloading"
      :pagination="paginationReactive"
      :style="{ height: '600px' }"
      :row-props="rowProps"
      remote
    >
    </n-data-table>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="mouseX"
      :y="mouseY"
      :options="dropDownOptions"
      :show="showDropdownRef"
      :on-clickoutside="onClickoutside"
      @select="handleSelectDropDown"
    />

    <n-button @click="addUserInfoTable('kurino', 'kurino@163.com')">
      测试添加
    </n-button>
  </div>
</template>

<script setup lang="ts">
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
  DataTableBaseColumn,
  DataTableColumns,
  DropdownOption
} from 'naive-ui'
import { onMounted, ref, reactive, h, computed, nextTick } from 'vue'
import { getOrganizationMember } from '../../api/social'
import TeamInvite from './TeamInvite.vue'

defineProps<{ teamId: number; titleTooltip: string }>()

onMounted(reload)

const searchUserInfo = ref()
const teamUserNumber = computed(() => tableDataRef.value.length)
const teamAdminNumber = computed(() => {
  var count = 0
  tableDataRef.value.forEach((element: any) => {
    if (element.identity == '管理员') count++
  })
  return count
})

function reload() {
  isReloading.value = true
  getOrganizationMember(requestData.value).then((res) => {
    if (res.data.success) {
      var counter = 0
      res.data.teamList.forEach((element) => {
        counter++
        tableDataRef.value.push({
          key: counter,
          name: element.name,
          email: element.email,
          identity: element.isAdmin ? '管理员' : '组员'
        })
      })
    } else {
      window.$message.error('列表加载失败')
    }
    isReloading.value = false
  })
}

type RowData = {
  key: number
  name: string
  email: string
  identity: string
}
const tableDataRef = ref<Array<RowData>>([])
const showAddModal = ref(false)
const requestData = ref()
const isReloading = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const dropDownOptions: DropdownOption[] = [
  {
    label: '管理身份',
    key: 'edit'
  },
  {
    label: '删除成员',
    key: 'delete'
  }
]
const showDropdownRef = ref(false)
function onClickoutside() {
  showDropdownRef.value = false
}
function handleSelectDropDown() {
  showDropdownRef.value = false
}

const rowProps = (row: RowData) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      window.$message.info(JSON.stringify(row, null, 2))
      e.preventDefault()
      showDropdownRef.value = false
      nextTick().then(() => {
        showDropdownRef.value = true
        mouseX.value = e.clientX
        mouseY.value = e.clientY
      })
    }
  }
}
function addUserInfoTable(name: string, email: string) {
  var currentCounter = tableDataRef.value.length
  tableDataRef.value.push({
    key: currentCounter + 1,
    name: name,
    email: email,
    identity: '组员'
  })
  paginationReactive.page =
    tableDataRef.value.length / paginationReactive.pageSize
  console.log(paginationReactive.page)
}

const identityColumn: DataTableBaseColumn = reactive<DataTableBaseColumn>({
  title: '身份',
  key: 'identity',
  filter: 'default',
  filterOptionValue: null,
  renderFilterIcon: () => {
    return h(NIcon, null, { default: () => h(SearchOutline) })
  },
  renderFilterMenu: ({ hide }) => {
    return h(
      NSpace,
      { style: { padding: '12px' }, vertical: true },
      {
        default: () => [
          h(
            NButton,
            {
              onClick: () => {
                identityColumn.filterOptionValue = '管理员'
              }
            },
            { default: () => '管理员' }
          ),
          h(
            NButton,
            {
              onClick: () => {
                identityColumn.filterOptionValue = '组员'
              }
            },
            { default: () => '组员' }
          ),
          h(
            NButton,
            {
              onClick: () => {
                identityColumn.filterOptionValue = null
                hide()
              }
            },
            { default: () => '所有人' }
          )
        ]
      }
    )
  }
})

const nameColum: DataTableBaseColumn = reactive<DataTableBaseColumn>({
  title: '姓名',
  key: 'name',
  sorter(rowA: any, rowB: any) {
    return rowA.name.length - rowB.name.length
  },
  filter: 'default',
  filterOptionValue: null
})

const columns: DataTableColumns = reactive<DataTableColumns>([
  nameColum,
  {
    title: '邮箱',
    key: 'email'
  },
  identityColumn
])

const paginationReactive = reactive({
  page: 2,
  itemCount: 100,
  pageSize: 5,
  onChange: (page: number) => {
    paginationReactive.page = page
  }
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
