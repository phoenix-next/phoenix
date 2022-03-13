<template>
  <n-button
    type="primary"
    secondary
    strong
    @click="handleCreate"
    style="position: absolute; right: 24px; top: 32px"
  >
    新建组织
  </n-button>
  <n-data-table
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    @update:page="handlePageChange"
  />
  <team-add ref="teamAdd" />
</template>

<script setup lang="tsx">
import { NDataTable, NButton, DataTableColumn } from 'naive-ui'
import TeamAdd from './modal/TeamAdd.vue'
import { ref, reactive, onMounted } from 'vue'
import { getUserOrganization } from '../../api/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
const data = ref([])
const teamAdd = ref<InstanceType<typeof TeamAdd> | null>(null)
const columns = ref<Array<DataTableColumn>>([
  {
    title: '组织编号',
    key: 'orgID',
    width: '250px',
    render: (rowData) => {
      return (
        <div
          onClick={handleClick(rowData.orgID as number)}
          style={{ cursor: 'pointer' }}
        >
          {'O' + rowData.orgID}
        </div>
      )
    }
  },
  {
    title: '组织名称',
    key: 'orgName',
    render: (rowData) => {
      return (
        <div
          onClick={handleClick(rowData.orgID as number)}
          style={{ cursor: 'pointer' }}
        >
          {rowData.orgName}
        </div>
      )
    }
  },
  {
    title: '身份',
    key: 'isAdmin',
    width: '200px',
    render: (rowData) => {
      return (
        <div
          onClick={handleClick(rowData.orgID as number)}
          style={{ cursor: 'pointer' }}
        >
          {rowData.isAdmin ? '管理员' : '组员'}
        </div>
      )
    }
  }
])
const pagination = reactive({
  page: 1,
  itemCount: 1,
  pageSize: 10
})

function handleCreate() {
  teamAdd.value?.open()
}
function handleClick(id: number) {
  return () => {
    router.push({ path: '/team/' + id })
  }
}
function handlePageChange(currentPage: number) {
  pagination.page = currentPage
}
function rowKey(rowData: any) {
  return rowData.orgID
}

onMounted(() => {
  getUserOrganization().then((res) => {
    data.value = res.data.organization
    pagination.itemCount = res.data.organization.length
    loading.value = false
  })
})
</script>

<style scoped></style>
