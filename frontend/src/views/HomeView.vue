<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { games } from '../games/config'

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(games.map((g) => g.category))
  return ['All', ...Array.from(cats)]
})

const filteredGames = computed(() => {
  return games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || game.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="home-container">
    <header>
      <h1>Gaming Portal</h1>
      <p class="subtitle">A collection of web-based games</p>
    </header>

    <div class="controls">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="Search games..." />
      </div>

      <div class="filter-box">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['filter-btn', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="game-grid" v-if="filteredGames.length > 0">
      <RouterLink
        v-for="game in filteredGames"
        :key="game.id"
        :to="{ name: 'game', params: { slug: game.slug } }"
        class="game-card"
      >
        <div class="image-wrapper">
          <img :src="game.thumbnail" :alt="game.name" class="game-thumbnail" />
          <div class="category-badge">{{ game.category }}</div>
        </div>
        <div class="game-info">
          <h3>{{ game.name }}</h3>
          <p>{{ game.description }}</p>
        </div>
      </RouterLink>
    </div>

    <div v-else class="no-results">
      <p>No games found matching your criteria.</p>
      <button @click=";((searchQuery = ''), (selectedCategory = 'All'))" class="reset-btn">
        Clear filters
      </button>
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
  margin-bottom: 50px;
}

h1 {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #888;
  font-size: 1.2rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
  align-items: center;
}

@media (min-width: 768px) {
  .controls {
    flex-direction: row;
    justify-content: space-between;
  }
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  background: #1e1e1e;
  border: 1px solid #333;
  padding: 12px 15px 12px 45px;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  border-color: #42b883;
}

.filter-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  background: #1e1e1e;
  border: 1px solid #333;
  color: #888;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.filter-btn:hover {
  border-color: #555;
  color: #fff;
}

.filter-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
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
  display: flex;
  flex-direction: column;
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
  position: relative;
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

.category-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: #42b883;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(66, 184, 131, 0.3);
}

.game-info {
  padding: 25px;
  flex: 1;
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

.no-results {
  text-align: center;
  padding: 100px 20px;
  color: #888;
}

.reset-btn {
  margin-top: 20px;
  background: transparent;
  border: 1px solid #42b883;
  color: #42b883;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.reset-btn:hover {
  background: rgba(66, 184, 131, 0.1);
}
</style>
