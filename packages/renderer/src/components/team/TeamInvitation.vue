<template>
  <div class="container">
    <template v-for="item in showData">
      <n-alert
        :title="'来自：' + item.orgName + '的邀请'"
        type="info"
        style="margin-top: 6px"
      >
        <div style="display: flex; justify-content: end">
          <n-button style="margin-right: 10px">同意加入</n-button>
          <n-button>拒绝加入</n-button>
        </div>
      </n-alert>
    </template>
    <n-pagination
      :page="pagination.page"
      :item-count="pagination.itemCount"
      :page-size="5"
      @update-page="handlePageChange"
      style="margin-top: 10px; right: 48px; position: absolute"
    />
  </div>
</template>

<script setup lang="ts">
import { NAlert, NPagination, NButton } from 'naive-ui'
import { reactive, ref, computed, onMounted } from 'vue'
import { getUserInvitation } from '../../api/user'

const data = ref([])
const pagination = reactive({
  page: 1,
  itemCount: 1
})
const showData = computed<any[]>(() => {
  let start = (pagination.page - 1) * 5
  let end = Math.min(pagination.page * 5, pagination.itemCount)
  return data.value.slice(start, end)
})

function handlePageChange(currentPage: number) {
  pagination.page = currentPage
}

onMounted(() => {
  getUserInvitation().then((res) => {
    data.value = res.data.organization
    pagination.itemCount = res.data.organization.length
  })
})
</script>

<style scoped></style>
