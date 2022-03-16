<template>
  <n-card class="container">
    <div class="step-container">
      <n-steps :current="current">
        <n-step title="填写信息" />
        <n-step title="选择题目" />
        <n-step title="完成创建" style="flex-grow: 0.5" />
      </n-steps>
    </div>
    <div class="content-container">
      <n-form :model="data" v-if="current == 1" :rules="rules">
        <n-form-item path="name" label="比赛名称">
          <n-input v-model:value="data.name" placeholder="比赛的名称" />
        </n-form-item>
        <n-form-item path="profile" label="比赛简介">
          <n-input
            v-model:value="data.profile"
            type="textarea"
            placeholder="比赛的简介"
          />
        </n-form-item>
        <n-form-item path="orgID" label="绑定组织">
          <n-select
            v-model:value="data.orgID"
            :options="orgOptions"
            placeholder="选择创建比赛的组织"
          />
        </n-form-item>
        <n-form-item path="readable" label="可读权限">
          <n-select v-model:value="data.readable" :options="readOptions" />
        </n-form-item>
        <n-grid cols="24" x-gap="12">
          <n-form-item-gi path="startTime" label="开始时间" span="12">
            <n-date-picker
              type="datetime"
              class="date-picker"
              v-model:value="data.startTime"
              placeholder="选择比赛开始时间"
            />
          </n-form-item-gi>
          <n-form-item-gi path="endTime" label="结束时间" span="12">
            <n-date-picker
              type="datetime"
              class="date-picker"
              v-model:value="data.endTime"
              placeholder="选择比赛结束时间"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <div v-else style="display: flex; justify-content: center">
        <n-transfer
          class="transfer"
          source-title="可选题目"
          target-title="已选题目"
          filterable
          source-filter-placeholder="根据关键词搜索"
          target-filter-placeholder="根据关键词搜索"
          :options="sourceList"
          v-model:value="problemList"
          size="large"
        />
      </div>
    </div>
    <div class="footer-container">
      <n-button style="margin-right: 20px" @click="handleNext">确定</n-button>
      <n-button @click="handleCancel">取消创建</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NSteps,
  NStep,
  NCard,
  NForm,
  NInput,
  NDatePicker,
  NFormItem,
  NFormItemGi,
  NGrid,
  NSelect,
  NButton,
  NTransfer
} from 'naive-ui'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'
import { getOrgProblems, createContest } from '../../api/contest'

const router = useRouter()
const current = ref(1)
const orgOptions = ref<Array<any>>([])
const sourceList = ref<Array<any>>([])
const problemList = ref<Array<any>>([])
const data = reactive({
  name: '',
  profile: '',
  startTime: new Date().getTime(),
  endTime: new Date().getTime() + 24 * 60 * 60 * 1000,
  orgID: null,
  readable: 0
})

function handleNext() {
  if (current.value === 1) {
    if (
      !data.name ||
      !data.profile ||
      !data.startTime ||
      !data.endTime ||
      !data.orgID
    ) {
      window.$message.warning('请先完成所有信息的填写')
      return
    }
    getOrgProblems({ id: data.orgID }).then((res) => {
      sourceList.value = (res.data.problemList as Array<any>).map((item) => {
        return {
          value: item.id,
          label: `T${item.id} - ${item.name}`
        }
      })
      current.value += 1
    })
  } else {
    if (problemList.value.length > 10 || problemList.value.length < 2) {
      window.$message.warning('一场比赛应具有2到10道题目')
      return
    }
    createContest({
      ...data,
      problemIDs: problemList.value,
      endTime: new Date(data.endTime).toISOString(),
      startTime: new Date(data.startTime).toISOString()
    } as any).then((res) => {
      current.value += 2
      router.back()
    })
  }
}
function handleCancel() {
  router.back()
}

onMounted(() => {
  getUserOrganization().then((res) => {
    orgOptions.value = (res.data.organization as Array<any>)
      .filter((item) => item.isAdmin)
      .map((item) => {
        return { label: item.orgName, value: item.orgID }
      })
  })
})

const rules = {
  name: {
    required: true,
    message: '请输入比赛名称',
    trigger: 'blur'
  },
  profile: {
    required: true,
    message: '请输入比赛简介',
    trigger: 'blur'
  }
}
const readOptions = [
  {
    label: '仅组织管理员可见',
    value: 0
  },
  {
    label: '仅组织成员可见',
    value: 1
  },
  {
    label: '所有人可见',
    value: 2
  }
]
</script>

<style scoped>
.container {
  height: 100%;
}
.container:deep(.n-card__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-container {
  width: 50%;
  height: 50px;
  margin-top: 20px;
}
.content-container {
  width: 75%;
  margin-top: 20px;
  height: 480px;
}
.footer-container {
  width: 75%;
  display: flex;
  justify-content: end;
}
.date-picker {
  width: 100%;
}
.transfer {
  width: 100%;
  height: 470px;
}
</style>
