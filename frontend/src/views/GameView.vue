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
    <!-- Optional: Shared Portal Header -->
    <header class="portal-header">
      <button @click="goHome" class="logo-btn">
        <span class="portal-name">GAMES</span>
      </button>
      <div class="current-game">{{ game.name }}</div>
    </header>

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
  background: #121212;
  overflow: hidden;
}

.portal-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  background: #000;
  border-bottom: 1px solid #333;
  z-index: 100;
}

.logo-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.portal-name {
  color: #42b883;
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: 2px;
}

.current-game {
  margin-left: 30px;
  padding-left: 30px;
  border-left: 1px solid #333;
  color: #aaa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.game-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
