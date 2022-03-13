<template>
  <!-- TODO: forum page -->
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="回复讨论"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
      >
        <n-form-item label="编辑你的回复内容" path="content">
          <n-input
            v-model:value="formValue.content"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 7
            }"
            placeholder="输入内容"
          />
        </n-form-item>
        <n-space justify="end">
          <n-button attr-type="button" @click="handleValidateClick">
            发布
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </n-modal>
  <n-card>
    <n-button text class="return" @click="clickReturn">
      <n-icon>
        <arrow-back-circle-outline />
      </n-icon>
    </n-button>
    <n-space justify="center">
      <n-h1 class="title"> 这个帖子的标题大概这么长 </n-h1>
    </n-space>
    <n-space justify="end">
      <n-button @click="handleReply">回复</n-button>
    </n-space>
    <n-divider />
    <n-card
      v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      style="margin-top: 20px"
    >
      第 {{ i }} 个人的名字 <br />
      第 {{ i }} 个人的回复内容
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ArrowBackCircleOutline } from '@vicons/ionicons5'
import { createComments } from '../../api/forum'
import { ref } from 'vue'
import {
  NCard,
  NButton,
  NIcon,
  NSpace,
  NH1,
  NDivider,
  FormInst,
  NModal,
  NFormItem,
  NInput,
  NForm
} from 'naive-ui'

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  content: ''
})
const rules = {
  content: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  }
}

function clickReturn() {
  router.back()
}

function handleReply() {
  window.$message.success('create comment!')
  showModal.value = true
}

function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      createComments({
        content: formValue.value.content,
        id: parseInt(route.params.id as string),
        toID: 0
      }).then((res) => {
        window.$message.success('回复成功')
        formValue.value.content = ''
        showModal.value = false
        console.log(res.data)
      })
    } else {
      window.$message.error('回复的内容不能为空')
    }
  })
}
</script>

<style scoped>
.return {
  position: absolute;
  font-size: 30px;
}
</style>
