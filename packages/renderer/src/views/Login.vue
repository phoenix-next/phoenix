<template>
  <div class="container">
    <n-tabs default-value="signin" size="large" class="tabs">
      <n-tab-pane name="signin" tab="登录">
        <sign-in-form />
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <sign-up-form />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import SignInForm from '../components/login/SignInForm.vue'
import SignUpForm from '../components/login/SignUpForm.vue'
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
