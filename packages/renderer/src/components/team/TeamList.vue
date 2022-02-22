<template>
  <n-card>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <template v-if="title">
          <div class="table-toolbar-left-title">
            {{ title }}
            <n-tooltip trigger="hover" v-if="titleTooltip">
              <template #trigger>
                <n-icon size="18" class="cursor-pointer">
                  <AlertCircle />
                </n-icon>
              </template>
              {{ titleTooltip }}
            </n-tooltip>
          </div>
          <slot name="tableTitle"></slot>
        </template>
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
                <ReloadOutline />
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

<script lang="ts">
import { AlertCircle, ReloadOutline } from '@vicons/ionicons5'
import { NDataTable, useMessage } from 'naive-ui'
import { computed, defineComponent, reactive } from 'vue'
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
const columns = [
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
  reactive({
    title: 'Identity',
    key: 'identity',
    sorter(rowA: any, rowB: any) {
      if (rowA.identity == '管理员') return true
      else return false
    },
  }),
]
export default defineComponent({
  components: {
    AlertCircle,
    ReloadOutline,
  },
  props: {
    ...NDataTable.props,
    title: {
      type: String,
      default: null,
    },
    titleTooltip: {
      type: String,
      default: null,
    },
  },
  emits: ['update:checked-row-keys'],
  setup(props, { emit }) {
    const message = useMessage()
    function reload() {
      message.info('reload')
    }
    function updateCheckedRowKeys(rowKeys: any) {
      emit('update:checked-row-keys', rowKeys)
    }
    return {
      reload,
      updateCheckedRowKeys,
      columns,
      tableData,
    }
  },
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
