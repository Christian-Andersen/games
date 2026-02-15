<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #121212;
  color: #e0e0e0;
}

#app {
  min-height: 100vh;
}

/* Scrollbar styling for dark mode */
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
