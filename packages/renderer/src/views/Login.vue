<template>
  <div class="container">
    <n-tabs size="large" class="tabs" :value="tab" @update-value="handleUpdate">
      <n-tab-pane name="signin" tab="登录">
        <sign-in-form />
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <sign-up-form @finish-register="finishRegister" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import SignInForm from '../components/login/SignInForm.vue'
import SignUpForm from '../components/login/SignUpForm.vue'
import { ref } from 'vue'

const tab = ref('signin')

function finishRegister() {
  tab.value = 'signin'
}
function handleUpdate(value: any) {
  tab.value = value
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
.tabs {
  width: 42%;
  margin-top: 5%;
}
</style>
