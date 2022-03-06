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
      <n-input-group>
        <n-input :style="{ width: '50%' }" />
        <n-button type="primary" ghost> 搜索 </n-button>
      </n-input-group>
      <div class="table-toolbar-right-icon">
        <n-button text @click="showAddModal = true">
          <template #icon>
            <n-icon size="20"> <add-circle-outline /> </n-icon>
          </template>
        </n-button>
        <n-button text @click="reload">
          <template #icon>
            <n-icon size="20"><reload-outline /> </n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <team-search
      v-model:show="showAddModal"
      @update:show="showAddModal = false"
      @update:user-info="addUserInfoTable"
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
      :remote="true"
    >
    </n-data-table>
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
  useMessage,
  DataTableBaseColumn,
  DataTableColumns,
  NTooltip,
  NInputGroup,
  NInput
} from 'naive-ui'
import { onMounted, ref, reactive, h, watch, computed } from 'vue'
import { getOrganizationMember } from '../../api/social'
import TeamSearch from './TeamInvite.vue'

const props = defineProps({
  teamName: {
    type: String,
    default: null
  },
  teamId: {
    type: Number,
    default: null
  },
  titleTooltip: {
    type: String,
    default: null
  }
})

watch(
  () => props.teamId,
  (newTeamId: number, oldTeamId: number) => {
    requestData.value = newTeamId
    reload()
  }
)
onMounted(() => reload())

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
      message.error('列表加载失败')
    }
    isReloading.value = false
  })
}
const message = useMessage()
const tableDataRef = ref<Array<object>>([])
const showAddModal = ref(false)
const requestData = ref()
const isReloading = ref(false)
const addUserInfoTable = (userInfo: { name: string; email: string }) => {
  var currentCounter = tableDataRef.value.length
  tableDataRef.value.push({
    key: currentCounter + 1,
    name: userInfo.name,
    email: userInfo.email,
    identity: '组员'
  })
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

const columns: DataTableColumns = reactive<DataTableColumns>([
  {
    title: '姓名',
    key: 'name',
    sorter(rowA: any, rowB: any) {
      return rowA.name.length - rowB.name.length
    }
  },
  {
    title: '邮箱',
    key: 'email'
  },
  identityColumn
])

const paginationReactive = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [5, 10, 20],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
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
.table-toolbar-right-icon {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
