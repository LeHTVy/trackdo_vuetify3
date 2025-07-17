<template>
  <NavBar />
  <v-main style="padding-top: 0 !important;">
    <router-view />
  </v-main>

</template>

<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>
