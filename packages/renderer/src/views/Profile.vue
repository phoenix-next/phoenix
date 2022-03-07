<template>
  <!-- TODO: profile page -->
  Profile
</template>

<script setup lang="ts">
import { getProfile } from '../api/user'

getProfile({ id: '2' }).then((res) => console.log(res.data))
</script>

<style scoped></style>
