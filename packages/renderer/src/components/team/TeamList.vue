<template>
  <n-card>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <div class="table-toolbar-left-title">
          <slot name="teamDropdownList"></slot>
          <n-tooltip trigger="hover" v-if="titleTooltip">
            <template #trigger>
              <n-icon size="18" class="cursor-pointer">
                <alert-circle />
              </n-icon>
            </template>
            {{ titleTooltip }}
          </n-tooltip>
        </div>
      </div>
      <div class="table-toolbar-right">
        <slot name="tableToolbar"></slot>
        <n-input-group>
          <n-input :style="{ width: '50%' }" />
          <n-button type="primary" ghost> 搜索 </n-button>
        </n-input-group>
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="table-toolbar-right-icon" @click="reload">
              <n-icon size="18">
                <reload-outline />
              </n-icon>
            </div>
          </template>
        </n-tooltip>
      </div>
    </div>
    <div class="table-context">
      <n-data-table ref="table" :columns="columns" :data="tableData">
      </n-data-table>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { AlertCircle, ReloadOutline } from '@vicons/ionicons5'
import { NDataTable, useMessage, DataTableColumn } from 'naive-ui'

defineProps({
  teamName: {
    type: String,
    default: null,
  },
  titleTooltip: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['update:checked-row-keys'])

const message = useMessage()

const tableData = [
  {
    key: 0,
    name: 'John Brown',
    class: 32,
    loginTime: '2019-1-31',
    identity: '管理员',
  },
  {
    key: 1,
    name: 'Jim Green',
    class: 42,
    loginTime: '2022-12-19',
    identity: '组员',
  },
  {
    key: 2,
    name: 'Joe Black',
    class: 32,
    loginTime: '2021-3-4',
    identity: '组员',
  },
  {
    key: 3,
    name: 'Jim Red',
    class: 32,
    loginTime: '2022-1-28',
    identity: '组员',
  },
]
const columns: Array<DataTableColumn> = [
  {
    title: 'Name',
    key: 'name',
    sorter(rowA: any, rowB: any) {
      return rowA.name.length - rowB.name.length
    },
  },
  {
    title: 'Class',
    key: 'class',
    sorter(rowA: any, rowB: any) {
      return rowA.class - rowB.class
    },
  },
  {
    title: 'LastLogin',
    key: 'loginTime',
    sorter: 'default',
  },
  {
    title: 'Identity',
    key: 'identity',
    sorter(rowA: any, rowB: any) {
      return rowA.class - rowA.class
    },
  },
]

function reload() {
  message.info('reload')
}
function updateCheckedRowKeys(rowKeys: any) {
  emit('update:checked-row-keys', rowKeys)
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
</style>
