<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { games } from '../games/config'
</script>

<template>
  <div class="home-container">
    <header>
      <h1>My Game Collection</h1>
    </header>

    <div class="game-grid">
      <RouterLink 
        v-for="game in games" 
        :key="game.id" 
        :to="{ name: 'game', params: { slug: game.slug } }"
        class="game-card"
      >
        <img :src="game.thumbnail" :alt="game.name" class="game-thumbnail" />
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
  padding: 40px 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.game-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.game-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-info {
  padding: 15px;
}

.game-info h3 {
  margin: 0 0 10px 0;
  color: #42b883;
}

.game-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}
</style>
