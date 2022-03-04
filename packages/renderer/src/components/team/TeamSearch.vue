<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="添加成员"
    size="medium"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handlePositiveClick"
    @negative-click="handleNegativeClick"
    @update-show="$emit('update:show')"
  >
    <n-divider />
    <n-input-group>
      <n-input type="text" placeholder="请输入添加的成员邮箱"></n-input>
      <n-button type="primary"> 搜索 </n-button>
    </n-input-group>
    <n-card>
      <n-skeleton v-if="isLoading"></n-skeleton>
      <template v-else>
        <n-descriptions
          v-if="showUserInfo"
          label-placement="top"
          bordered
          :column="2"
        >
          <n-descriptions-item label="姓名">
            {{ userInfo.name }}
          </n-descriptions-item>
          <n-descriptions-item label="邮箱">
            {{ userInfo.email }}
          </n-descriptions-item>
        </n-descriptions>
        <n-h4 v-else>heelo</n-h4>
      </template>
    </n-card>

    <user-info-card :name="userInfo.name" :email="userInfo.email" />
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMessage } from 'naive-ui'

const props = defineProps({
  show: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['update:show', 'update:user-info'])
const message = useMessage()
const userInfo = reactive({ name: 'kurino', email: 'gejingze@163.com' })
const showUserInfo = ref(false)
const isLoading = ref(true)

function handlePositiveClick() {
  emit('update:user-info', userInfo)
}
function handleNegativeClick() {}
</script>
