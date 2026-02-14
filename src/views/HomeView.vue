<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { games } from '../games/config'
</script>

<template>
  <div class="home-container">
    <header>
      <h1>Gaming Portal</h1>
    </header>

    <div class="game-grid">
      <RouterLink
        v-for="game in games"
        :key="game.id"
        :to="{ name: 'game', params: { slug: game.slug } }"
        class="game-card"
      >
        <div class="image-wrapper">
          <img :src="game.thumbnail" :alt="game.name" class="game-thumbnail" />
        </div>
        <div class="game-info">
          <h3>{{ game.name }}</h3>
          <p>{{ game.description }}</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

header {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.game-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-10px);
  border-color: #42b883;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #000;
}

.game-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .game-thumbnail {
  transform: scale(1.1);
}

.game-info {
  padding: 25px;
}

.game-info h3 {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  color: #fff;
}

.game-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #aaa;
  line-height: 1.5;
}
</style>
