<template>
  <n-card>
    <n-tabs default-value="signin" size="large">
      <n-tab-pane name="signin" tab="登录">
        <sign-in-form />
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <sign-up-form />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane } from 'naive-ui'
import SignInForm from '../components/login/SignInForm.vue'
import SignUpForm from '../components/login/SignUpForm.vue'
</script>

<style scoped></style>
