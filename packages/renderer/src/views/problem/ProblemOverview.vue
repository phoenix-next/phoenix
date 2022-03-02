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
import { ref, reactive, onMounted } from 'vue'
import { getProblemList } from '../../api/judge'

const { isLogin } = useAuthStore()
const router = useRouter()
const messager = useMessage()

const data = ref<Array<{ id: string; difficulty: number; name: string }>>([])
const loading = ref(false)
const pagination = reactive<PaginationProps>({
  page: 1,
  pageCount: 1,
  pageSize: 10
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
  if (!sorter && !loading.value) {
    loading.value = true
    // query(
    //   paginationReactive.page,
    //   paginationReactive.pageSize,
    //   !sorter ? false : sorter.order,
    //   column2Reactive.filterOptionValues
    // ).then((data) => {
    //   column1Reactive.sortOrder = !sorter ? false : sorter.order
    //   dataRef.value = data.data
    //   paginationReactive.pageCount = data.pageCount
    //   paginationReactive.itemCount = data.total
    //   loadingRef.value = false
    // })
    // TODO: get problem list
  }
}
function handlePageChange(currentPage: number) {
  if (!loading.value) {
    loading.value = true
    // query(
    //   currentPage,
    //   paginationReactive.pageSize,
    //   column1Reactive.sortOrder,
    //   column2Reactive.filterOptionValues
    // ).then((data) => {
    //   dataRef.value = data.data
    //   paginationReactive.page = currentPage
    //   paginationReactive.pageCount = data.pageCount
    //   paginationReactive.itemCount = data.total
    //   loadingRef.value = false
    // })
    // TODO: get problem list
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

const columns: Array<DataTableColumn> = [
  {
    title: '题号',
    key: 'id',
    sorter: true,
    sortOrder: false
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
]
</script>

<style scoped>
.label {
  cursor: default;
}
</style>
