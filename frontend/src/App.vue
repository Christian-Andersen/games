<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #1e1e1e;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
