<template>
  <n-card>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <slot name="teamSelectList"></slot>
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
          <n-button text @click="showAddPanel = true">
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

      <n-modal v-model:show="showAddPanel" preset="card">
        <template #header>
          <n-h3>添加成员</n-h3>
          <n-divider />
          <n-tabs default-value="add-one" size="medium">
            <n-tab-pane name="add-one" tab="单个添加">
              <n-input type="text" placeholder="请输入添加的成员邮箱"></n-input>
            </n-tab-pane>
            <n-tab-pane name="add-batch" tab="批量添加">
              <n-input
                type="textarea"
                placeholder="请每行输入一个添加的成员邮箱"
              ></n-input>
            </n-tab-pane>
          </n-tabs>
          <n-button type="primary" @click="">确认</n-button>
        </template>
      </n-modal>
    </div>
    <div class="table-context">
      <n-data-table
        ref="table"
        :columns="columns"
        :data="tableDataRef"
        :pagination="paginationReactive"
        :style="{ height: '600px' }"
      >
      </n-data-table>
    </div>
  </n-card>
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
  DataTableColumn,
  DataTableBaseColumn,
  DataTableColumns
} from 'naive-ui'
import { onMounted, ref, reactive, h } from 'vue'

const props = defineProps({
  teamName: {
    type: String,
    default: null
  },
  titleTooltip: {
    type: String,
    default: null
  }
})
const message = useMessage()
const tableDataRef = ref<Array<Object>>([])
const showAddPanel = ref(false)

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
    title: '学号',
    key: 'number',
    sorter(rowA: any, rowB: any) {
      return rowA.number - rowB.numb
    }
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

function reload() {
  message.info('reload')
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
