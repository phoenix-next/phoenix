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
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['update:show'])
const userInfo = reactive({ name: '', email: '' })
const showUserInfo = ref(false)
const isLoading = ref(true)

function handlePositiveClick() {}
function handleNegativeClick() {}
</script>
