<template>
  <n-card>
    <n-grid>
      <n-gi :span="14" :offset="7">
        <n-input-group>
          <n-button type="primary" class="label">查找题目</n-button>
          <n-input :style="{ width: '50%' }" />
          <n-button type="primary" ghost>搜索</n-button>
        </n-input-group>
      </n-gi>
      <n-gi :span="2" :offset="1">
        <n-button
          type="primary"
          block
          secondary
          strong
          :disabled="!isLogin"
          @click="clickCreate"
        >
          创建题目
        </n-button>
      </n-gi>
    </n-grid>
  </n-card>
  <n-card>
    <n-data-table
      remote
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      @update:sorter="handleSorterChange"
      @update:page="handlePageChange"
    />
  </n-card>

  <n-button
    type="primary"
    block
    secondary
    strong
    @click="test"
    style="margin-top: 10px"
  >
    评测题目的测试
  </n-button>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { DataTableColumn, PaginationProps, useMessage } from 'naive-ui'
import { ref, reactive, onMounted, computed } from 'vue'
import { getProblemList } from '../../api/judge'

const { isLogin } = useAuthStore()
const router = useRouter()
const messager = useMessage()

const data = ref<Array<{ id: string; difficulty: number; name: string }>>([])
const loading = ref(false)
const columns = ref<Array<DataTableColumn>>([
  {
    title: '题号',
    key: 'id',
    sorter: true,
    sortOrder: 'ascend'
  },
  {
    title: '题目名称',
    key: 'name',
    sorter: true,
    sortOrder: false
  },
  {
    title: '难度',
    key: 'difficulty',
    sorter: true,
    sortOrder: false
  }
])

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10
})
const sortMethod = computed(() => {
  let index = columns.value.findIndex((item: any) => {
    return item.sortOrder !== false
  })
  // 该数字为后端API的要求
  return (columns.value[index] as any).sortOrder === 'ascend'
    ? index + 1
    : -index - 1
})

function clickCreate() {
  router.push({ path: '/problem/create' })
}
function test() {
  router.push({ path: '/problem/1' })
}
function rowKey(rowData: any) {
  return rowData.id
}
function handleSorterChange(sorter: any) {
  // 建立从列名到索引的映射
  const sorterMap: Record<string, number> = {
    id: 0,
    name: 1,
    difficulty: 2
  }
  // sorter不为空且不在加载中
  if (sorter && !loading.value) {
    // 设置为在加载中
    loading.value = true
    // 设置columns的排序规则
    columns.value.forEach((item: any) => {
      item.sortOrder = false
    })
    ;(columns.value[sorterMap[sorter.columnKey]] as any).sortOrder =
      sorter.order ? sorter.order : 'descend'
    // 发起请求
    getProblemList({
      page: pagination.page as number,
      sorter: sortMethod.value
    })
      .then((res) => {
        data.value = (res.data.problemList as Array<any>).map((item) => {
          return { ...item, id: 'P' + item.id }
        })
        // TODO: pagination.pageCount = res.data.total
        // 设置为不在加载中
        loading.value = false
      })
      .catch((res) => {
        messager.error('网络故障, 请检查网络连接')
        // 设置为不在加载中
        loading.value = false
      })
  }
}
function handlePageChange(currentPage: number) {
  if (!loading.value) {
    loading.value = true
    pagination.page = currentPage
    getProblemList({
      page: currentPage,
      sorter: sortMethod.value
    })
      .then((res) => {
        data.value = (res.data.problemList as Array<any>).map((item) => {
          return { ...item, id: 'P' + item.id }
        })
        // TODO: pagination.pageCount = res.data.total
        // 设置为不在加载中
        loading.value = false
      })
      .catch((res) => {
        messager.error('网络故障, 请检查网络连接')
        // 设置为不在加载中
        loading.value = false
      })
  }
}

onMounted(() => {
  getProblemList({ page: 1, sorter: 1 })
    .then((res) => {
      data.value = (res.data.problemList as Array<any>).map((item) => {
        return { ...item, id: 'P' + item.id }
      })
    })
    .catch((res) => {
      messager.error('网络故障, 请检查网络连接')
    })
})
</script>

<style scoped>
.label {
  cursor: default;
}
</style>
