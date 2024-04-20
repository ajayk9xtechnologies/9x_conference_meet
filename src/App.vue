<template>
  <div>
  <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
  </router-view>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'

</script>

<style>
 

</style>
