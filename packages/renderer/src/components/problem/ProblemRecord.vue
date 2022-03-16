<template>
  <n-modal
    :show="show"
    preset="card"
    title="提交记录"
    @close="show = false"
    style="width: 600px"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <template v-for="record in showedRecord">
        <div class="record">
          <n-grid>
            <n-grid-item span="4" style="display: flex; align-items: center">
              <n-text
                :type="record.result ? 'error' : 'info'"
                strong
                style="font-size: larger"
              >
                {{ getResult(record.result) }}
              </n-text>
            </n-grid-item>
            <n-grid-item span="5" style="display: flex; align-items: center">
              {{ getLanguage(record.language) }}
            </n-grid-item>
            <n-grid-item span="10" style="display: flex; align-items: center">
              {{ record.createdTime }}
            </n-grid-item>
            <n-grid-item>
              <n-button span="5" round>下载代码</n-button>
            </n-grid-item>
          </n-grid>
        </div>
      </template>
    </div>
    <div style="display: flex; justify-content: end">
      <n-pagination
        :page-size="5"
        :page="page"
        :item-count="records.length"
        @update-page="updatePage"
        style="margin-top: 15px; margin-right: 30px"
      />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NPagination, NGrid, NGridItem, NButton, NText } from 'naive-ui'
import { ref, computed } from 'vue'
import { getRecord } from '../../api/judge'
import { useRoute } from 'vue-router'

const route = useRoute()
const show = ref(false)
const page = ref(1)
const records = ref<Array<any>>([])

const showedRecord = computed(() => {
  let start = (page.value - 1) * 5
  let end = Math.min(records.value.length, start + 5)
  return records.value.slice(start, end)
})

function open() {
  show.value = true
  getRecord({ problemID: route.params.id as string }).then((res) => {
    records.value = res.data.resultList
  })
}
function updatePage(newPage: number) {
  page.value = newPage
}
// 0 AC，1 WA，2 TLE，3 RE
function getResult(result: number) {
  switch (result) {
    case 0:
      return 'AC'
    case 1:
      return 'WA'
    case 2:
      return 'TLE'
    default:
      return 'RE'
  }
}
// c, cpp, python, javascript, go, java
function getLanguage(result: string) {
  switch (result) {
    case 'c':
      return 'C'
    case 'cpp':
      return 'C++'
    case 'python':
      return 'Python'
    case 'javascript':
      return 'JavaScript'
    case 'go':
      return 'Golang'
    default:
      return 'Java'
  }
}

defineExpose({ open })
</script>

<style scoped>
.record {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 3px 5px 3px 10px;
  border-radius: 20px;
  margin-top: 7px;
  height: 45px;
  width: 90%;
  background-color: aliceblue;
}
</style>
