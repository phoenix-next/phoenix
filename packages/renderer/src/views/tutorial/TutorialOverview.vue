<template>
  <n-card>
    <n-grid>
      <n-gi span="4" offset="1">
        <n-h2>
          <n-text type="primary">教程</n-text>
        </n-h2>
      </n-gi>
      <n-gi span="14" offset="2">
        <n-input-group>
          <n-button type="primary" class="label">查找教程</n-button>
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
          创建教程
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
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import {
  NCard,
  NGrid,
  NGi,
  NInputGroup,
  NDataTable,
  NButton,
  NInput,
  NH2,
  NText
} from 'naive-ui'
import { ref, reactive, onMounted, computed, h } from 'vue'
import { getToturialList } from '../../api/tutorial'

const { isLogin } = useAuthStore()
const router = useRouter()

const data = ref<Array<{ id: string; name: string; creatorName: string }>>([
  { id: 'Loading...', name: 'Loading...', creatorName: 'Loading...' }
])
const loading = ref(true)
const columns = ref<any>([
  {
    title: '教程序号',
    key: 'id',
    sorter: true,
    sortOrder: 'ascend',
    render: (rowData: any) => {
      return h(
        'div',
        {
          onClick: handleClick(rowData.id as string),
          style: { cursor: 'pointer' }
        },
        rowData.id as string
      )
    }
  },
  {
    title: '教程名称',
    key: 'name',
    sorter: true,
    sortOrder: false,
    render: (rowData: any) => {
      return h(
        'div',
        {
          onClick: handleClick(rowData.id as string),
          style: { cursor: 'pointer' }
        },
        rowData.name as string
      )
    }
  },
  {
    title: '创建者',
    key: 'creatorName',
    render: (rowData: any) => {
      return h(
        'div',
        {
          onClick: handleClick(rowData.id as string),
          style: { cursor: 'pointer' }
        },
        rowData.creatorName as string
      )
    }
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
  return (columns.value[index] as any).sortOrder === 'ascend'
    ? index + 1
    : -index - 1
})

function rowKey(rowData: any) {
  return rowData.id
}
function updateData() {
  loading.value = true
  getToturialList({
    page: pagination.page as number,
    sorter: sortMethod.value,
    keyWord: keyWord.value
  })
    .then((res) => {
      data.value = (res.data.tutorialList as Array<any>).map((item) => {
        return { ...item, id: 'T' + item.id }
      })
      pagination.itemCount = res.data.total
    })
    .catch((res) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
    .finally(() => {
      loading.value = false
    })
}
function handleCreate() {
  router.push({ path: '/tutorial/create' })
}
function handleSearch() {
  if (!loading.value) {
    updateData()
  }
}
function handleClick(id: string) {
  return () => {
    router.push({ path: '/tutorial/' + id.substring(1) })
  }
}
function handleSorterChange(sorter: any) {
  // 建立从列名到索引的映射
  const sorterMap: Record<string, number> = {
    id: 0,
    name: 1
  }
  // sorter不为空且不在加载中
  if (sorter && !loading.value) {
    // 设置columns的排序规则
    columns.value[0].sortOrder = false
    columns.value[1].sortOrder = false
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
