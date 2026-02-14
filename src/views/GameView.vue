<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { games } from '../games/config'

const route = useRoute()
const router = useRouter()

const game = computed(() => {
  return games.find((g) => g.slug === route.params.slug)
})

const gameComponent = shallowRef()

watchEffect(() => {
  if (game.value) {
    gameComponent.value = defineAsyncComponent(game.value.component)
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="game-view" v-if="game">
    <nav class="game-nav">
      <button @click="goHome" class="home-button">← Back to Home</button>
      <span class="game-title">{{ game.name }}</span>
    </nav>
    <main class="game-content">
      <component :is="gameComponent" />
    </main>
  </div>
  <div v-else class="not-found">
    <p>Game not found.</p>
    <button @click="goHome">Go Home</button>
  </div>
</template>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.game-nav {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  gap: 20px;
}

.home-button {
  background: #42b883;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.game-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.game-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
