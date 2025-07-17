<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <div class="page-header mb-8" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No props or logic needed for this simple header component
</script>

<style scoped>
.page-header {
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
