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
          <n-select v-model:value="data.orgID" />
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
            />
          </n-form-item-gi>
          <n-form-item-gi path="endTime" label="结束时间" span="12">
            <n-date-picker
              type="datetime"
              class="date-picker"
              v-model:value="data.endTime"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <div v-else style="display: flex; justify-content: center">
        <n-transfer
          class="transfer"
          source-title="已选题目"
          target-title="可选题目"
          filterable
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'
import { getOrgProblems } from '../../api/contest'

const router = useRouter()
const current = ref(1)
const problemList = ref([])
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
    current.value += 1
    console.log(data)
  } else {
    current.value += 2
    router.back()
  }
}
function handleCancel() {
  router.back()
}

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
  },
  orgID: {
    required: true,
    message: '请选择绑定的组织',
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
