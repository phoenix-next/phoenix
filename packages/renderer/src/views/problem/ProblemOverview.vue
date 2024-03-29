<template>
  <n-card>
    <n-grid>
      <n-gi span="4" offset="1">
        <n-h2>
          <n-text type="primary">题库</n-text>
        </n-h2>
      </n-gi>
      <n-gi span="14" offset="2">
        <n-input-group>
          <n-button type="primary" class="label">查找题目</n-button>
          <n-input
            :style="{ width: '50%' }"
            v-model:value="keyWord"
            placeholder="请输入关键字"
            @keypress.enter="handleSearch"
          />
          <n-button type="primary" ghost @click="handleSearch">搜索</n-button>
        </n-input-group>
      </n-gi>
      <n-gi span="2" offset="1">
        <n-button
          type="primary"
          block
          secondary
          strong
          :disabled="!isLogin"
          @click="handleCreate"
        >
          创建题目
        </n-button>
      </n-gi>
    </n-grid>
  </n-card>
  <n-card style="height: 662px">
    <n-data-table
      remote
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      :single-line="false"
      @update:sorter="handleSorterChange"
      @update:page="handlePageChange"
    />
  </n-card>
</template>

<script setup lang="tsx">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import {
  DataTableColumn,
  NCard,
  NGrid,
  NGi,
  NInputGroup,
  NDataTable,
  NButton,
  NInput,
  NH2,
  NText,
  NIcon,
  NProgress
} from 'naive-ui'
import { ref, reactive, onMounted, computed } from 'vue'
import { getProblemList } from '../../api/judge'
import { CheckmarkDoneOutline, Close, RemoveSharp } from '@vicons/ionicons5'

const { isLogin } = useAuthStore()
const router = useRouter()

const data = ref<Array<any>>([
  {
    result: 0,
    problemID: 'ID',
    difficulty: 1,
    problemName: 'Loading...'
  }
])
const loading = ref(true)
const columns = ref<Array<DataTableColumn>>([
  {
    title: '状态',
    key: 'result',
    width: '53px',
    render: (rowData) => (
      <div
        onClick={handleClick(rowData.problemID as number)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {rowData.result === 0 ? (
          <NIcon size='20' color='#626262'>
            <RemoveSharp />
          </NIcon>
        ) : (rowData.result as number) > 0 ? (
          <NIcon size='20' color='#0e7a0d'>
            <CheckmarkDoneOutline />
          </NIcon>
        ) : (
          <NIcon size='20' color='#FF3939'>
            <Close />
          </NIcon>
        )}
      </div>
    )
  },
  {
    title: '题号',
    key: 'problemID',
    width: '100px',
    align: 'center',
    sorter: true,
    sortOrder: 'ascend',
    render: (rowData) => (
      <div
        onClick={handleClick(rowData.problemID as number)}
        style={{ cursor: 'pointer' }}
      >
        P{rowData.problemID}
      </div>
    )
  },
  {
    title: '题目名称',
    key: 'problemName',
    sorter: true,
    sortOrder: false,
    align: 'center',
    render: (rowData) => (
      <div
        onClick={handleClick(rowData.problemID as number)}
        style={{ cursor: 'pointer' }}
      >
        {rowData.problemName}
      </div>
    )
  },
  {
    title: '难度',
    key: 'difficulty',
    align: 'center',
    sorter: true,
    sortOrder: false,
    render: (rowData) => (
      <div
        onClick={handleClick(rowData.problemID as number)}
        style={{ cursor: 'pointer' }}
      >
        <NProgress
          percentage={(rowData.difficulty as number) * 10}
          showIndicator={false}
          status={(function () {
            if ((rowData.difficulty as number) > 8) return 'error'
            else if ((rowData.difficulty as number) > 5) return 'warning'
            else if ((rowData.difficulty as number) > 3) return 'success'
          })()}
        />
      </div>
    )
  }
])
const keyWord = ref('')

const pagination = reactive({
  page: 1,
  itemCount: 1,
  pageSize: 10
})
const sortMethod = computed(() => {
  let index = columns.value.findIndex((item: any) => {
    return item.sortOrder !== false
  })
  // 该数字为后端API的要求
  return (columns.value[index] as any).sortOrder === 'ascend' ? index : -index
})

function rowKey(rowData: any) {
  return rowData.problemID
}
function updateData() {
  loading.value = true
  getProblemList({
    page: pagination.page as number,
    sorter: sortMethod.value,
    keyWord: keyWord.value
  })
    .then((res) => {
      data.value = res.data.problemList
      pagination.itemCount = res.data.total
    })
    .finally(() => {
      loading.value = false
    })
}
function handleCreate() {
  router.push({ path: '/problem/create' })
}
function handleSearch() {
  if (!loading.value) {
    updateData()
  }
}
function handleClick(id: number) {
  return () => {
    router.push({ path: '/problem/' + id })
  }
}
function handleSorterChange(sorter: any) {
  // 建立从列名到索引的映射
  const sorterMap: Record<string, number> = {
    problemID: 1,
    problemName: 2,
    difficulty: 3
  }
  // sorter不为空且不在加载中
  if (sorter && !loading.value) {
    // 设置columns的排序规则
    columns.value.forEach((item: any) => {
      item.sortOrder = false
    })
    ;(columns.value[sorterMap[sorter.columnKey]] as any).sortOrder =
      sorter.order ? sorter.order : 'descend'
    // 发起请求
    updateData()
  }
}
function handlePageChange(currentPage: number) {
  if (!loading.value) {
    pagination.page = currentPage
    updateData()
  }
}

onMounted(updateData)
</script>

<style scoped>
.label {
  cursor: default;
}
</style>
