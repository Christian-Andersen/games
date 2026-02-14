<script setup lang="ts">
import { ref, computed } from 'vue'
import housesData from './data.json'

interface House {
  id: string
  address: string
  bedrooms: number
  bathrooms: number
  carSpaces: number
  buildingSize: number
  landSize: number
  type: string
  soldDate: string
  description: string
  price: number
  images: string[]
}

const houses = housesData as House[]
const mode = ref<'select' | 'archive-list' | 'playing'>('select')
const playingModeType = ref<'daily' | 'archive'>('daily')

// Selection Logic
const currentHouseIndex = ref(0)
const currentHouse = computed(() => houses[currentHouseIndex.value])

// Game State
const currentImageIndex = ref(0)
const guesses = ref<{ value: number; hint: string }[]>([])
const currentGuess = ref<number | null>(null)
const gameState = ref<'playing' | 'won'>('playing')

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

const startDaily = () => {
  playingModeType.value = 'daily'
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  )
  currentHouseIndex.value = dayOfYear % houses.length
  mode.value = 'playing'
  resetGameState()
}

const openArchiveList = () => {
  mode.value = 'archive-list'
}

const selectArchiveHouse = (index: number) => {
  playingModeType.value = 'archive'
  currentHouseIndex.value = index
  mode.value = 'playing'
  resetGameState()
}

const resetGameState = () => {
  currentImageIndex.value = 0
  guesses.value = []
  currentGuess.value = null
  gameState.value = 'playing'
}

const submitGuess = () => {
  if (currentGuess.value === null || gameState.value !== 'playing' || !currentHouse.value) return

  const guess = currentGuess.value
  const target = currentHouse.value.price
  const margin = target * 0.05

  const hint = guess < target ? 'Higher ↑' : 'Lower ↓'
  guesses.value.unshift({ value: guess, hint })

  if (Math.abs(guess - target) <= margin) {
    gameState.value = 'won'
  }

  currentGuess.value = null
}

const nextImage = () => {
  if (!currentHouse.value) return
  currentImageIndex.value = (currentImageIndex.value + 1) % currentHouse.value.images.length
}

const prevImage = () => {
  if (!currentHouse.value) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + currentHouse.value.images.length) %
    currentHouse.value.images.length
}
</script>

<template>
  <div class="house-game-wrapper">
    <!-- Mode Selection -->
    <div v-if="mode === 'select'" class="mode-select full-center">
      <h2>House Price Guesser</h2>
      <div class="mode-buttons">
        <button @click="startDaily" class="mode-btn daily">
          <span class="icon">📅</span>
          <span class="text">Daily Challenge</span>
        </button>
        <button @click="openArchiveList" class="mode-btn archive">
          <span class="icon">🗄️</span>
          <span class="text">Archive</span>
        </button>
      </div>
    </div>

    <!-- Archive List -->
    <div v-else-if="mode === 'archive-list'" class="archive-list-view">
      <div class="view-header">
        <button @click="mode = 'select'" class="back-link">← Back</button>
        <h2>Archive</h2>
      </div>
      <div class="archive-grid">
        <div
          v-for="(house, index) in houses"
          :key="house.id"
          class="archive-card"
          @click="selectArchiveHouse(index)"
        >
          <img :src="house.images[0]" :alt="house.address" loading="lazy" />
          <div class="card-info">
            <h4>{{ house.address }}</h4>
            <p>{{ house.type }} • {{ house.bedrooms }} Bed</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Game -->
    <div v-else class="game-container">
      <div class="game-header">
        <button
          @click="playingModeType === 'daily' ? (mode = 'select') : (mode = 'archive-list')"
          class="back-btn"
        >
          ← {{ playingModeType === 'daily' ? 'Menu' : 'Archive' }}
        </button>
        <div class="mode-indicator">
          {{ playingModeType === 'daily' ? 'Daily Challenge' : 'Archive' }}
        </div>
      </div>

      <div class="main-layout" v-if="currentHouse">
        <!-- Left/Top Side: Visuals -->
        <div class="visual-side">
          <div class="gallery">
            <img
              :src="currentHouse.images[currentImageIndex]"
              alt="Property image"
              class="main-image"
            />
            <button class="nav-btn prev" @click="prevImage" aria-label="Previous image">❮</button>
            <button class="nav-btn next" @click="nextImage" aria-label="Next image">❯</button>
            <div class="image-counter">
              {{ currentImageIndex + 1 }} / {{ currentHouse.images.length }}
            </div>
          </div>

          <div class="info-strip hidden-mobile">
            <h2 class="address">{{ currentHouse.address }}</h2>
          </div>
        </div>

        <!-- Right/Bottom Side: Guessing & Details -->
        <div class="interaction-side">
          <div class="scroll-container">
            <div class="mobile-address-block hidden-desktop">
              <h2 class="address">{{ currentHouse.address }}</h2>
            </div>

            <!-- Stats Section -->
            <div class="stats-section">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="icon">🛏️</span>
                  <div class="val-group">
                    <span class="val">{{ currentHouse.bedrooms }}</span>
                    <span class="lab">Bed</span>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="icon">🛁</span>
                  <div class="val-group">
                    <span class="val">{{ currentHouse.bathrooms }}</span>
                    <span class="lab">Bath</span>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="icon">🚗</span>
                  <div class="val-group">
                    <span class="val">{{ currentHouse.carSpaces }}</span>
                    <span class="lab">Car</span>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="icon">🏠</span>
                  <div class="val-group">
                    <span class="val">{{ currentHouse.buildingSize }}m²</span>
                    <span class="lab">Build</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Guess Input / Results -->
            <div class="interaction-fixed">
              <div v-if="gameState === 'playing'" class="guess-input-box">
                <div class="input-group">
                  <span class="currency-symbol">$</span>
                  <input
                    v-model="currentGuess"
                    type="number"
                    placeholder="Amount"
                    inputmode="numeric"
                    @keyup.enter="submitGuess"
                  />
                  <button @click="submitGuess" :disabled="!currentGuess">GUESS</button>
                </div>
              </div>

              <div v-else class="result-box">
                <div class="success-icon">🎉</div>
                <h3>CORRECT!</h3>
                <p class="actual-price-val">{{ formatCurrency(currentHouse.price) }}</p>
                <div class="win-stats">Solved in {{ guesses.length }} attempts</div>
              </div>

              <!-- History -->
              <div class="history-section" v-if="guesses.length > 0">
                <h4>HISTORY</h4>
                <div class="guesses-list">
                  <div v-for="(g, index) in guesses" :key="index" class="guess-item">
                    <span class="guess-val">{{ formatCurrency(g.value) }}</span>
                    <span
                      class="guess-hint"
                      :class="{
                        higher: g.hint.includes('Higher'),
                        lower: g.hint.includes('Lower'),
                      }"
                    >
                      {{ g.hint }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="details-section">
              <h3>Description</h3>
              <p class="description">{{ currentHouse.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.house-game-wrapper {
  width: 100vw;
  height: calc(100vh - 60px);
  background: #121212;
  color: #fff;
  overflow: hidden;
}

.full-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Mode Selection */
.mode-select h2 {
  font-size: clamp(2rem, 8vw, 4rem);
  margin-bottom: 30px;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  text-align: center;
}

.mode-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.mode-btn {
  background: #1e1e1e;
  border: 2px solid #333;
  padding: 30px;
  width: 280px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mode-btn:hover {
  transform: translateY(-5px);
  border-color: #42b883;
}

.mode-btn .icon {
  font-size: 3rem;
  margin-bottom: 10px;
}
.mode-btn .text {
  font-size: 1.4rem;
  font-weight: 800;
}

/* Archive List */
.archive-list-view {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  overflow-y: auto;
}

.archive-card {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
}
.archive-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.card-info {
  padding: 12px;
}

/* Active Game */
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

.back-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}
.mode-indicator {
  flex: 1;
  text-align: center;
  font-weight: 700;
  color: #42b883;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
  overflow: hidden;
}

/* Tablet/Desktop Side-by-Side */
@media (min-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr 450px;
    grid-template-rows: 1fr;
  }
}

.visual-side {
  display: flex;
  flex-direction: column;
  background: #000;
  border-bottom: 1px solid #333;
}

@media (min-width: 900px) {
  .visual-side {
    border-bottom: none;
    border-right: 1px solid #333;
  }
}

.gallery {
  position: relative;
  aspect-ratio: 16/9;
  width: 100%;
}

@media (min-width: 900px) {
  .gallery {
    aspect-ratio: auto;
    flex: 1;
  }
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-strip {
  padding: 15px 25px;
  background: #1a1a1a;
}
.address {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.interaction-side {
  background: #1e1e1e;
  overflow-y: auto;
}

.scroll-container {
  padding: 20px;
}

.stats-section {
  background: #252525;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.stat-item .icon {
  font-size: 1.2rem;
}
.val-group .val {
  font-weight: 800;
  font-size: 0.9rem;
  display: block;
}
.val-group .lab {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
}

.guess-input-box {
  margin-bottom: 20px;
}
.input-group {
  display: flex;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 12px;
  padding: 4px;
}

.currency-symbol {
  padding: 8px 12px;
  font-size: 1.2rem;
  color: #888;
  font-weight: 800;
}
.input-group input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  width: 10px;
  outline: none;
}

.input-group button {
  background: #42b883;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;
}

.result-box {
  background: #1b2e25;
  border: 2px solid #42b883;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.history-section h4 {
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 10px;
  letter-spacing: 1.5px;
}
.guess-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #252525;
  border-radius: 8px;
  margin-bottom: 6px;
  font-family: monospace;
  font-size: 1rem;
}

.details-section h3 {
  font-size: 0.75rem;
  color: #42b883;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.description {
  line-height: 1.5;
  color: #ccc;
  font-size: 0.9rem;
}

.hidden-mobile {
  display: none;
}
.hidden-desktop {
  display: block;
}

@media (min-width: 900px) {
  .hidden-mobile {
    display: block;
  }
  .hidden-desktop {
    display: none;
  }
}

/* Image Nav */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  width: 40px;
  height: 50px;
  cursor: pointer;
}

.nav-btn.prev {
  left: 0;
  border-radius: 0 8px 8px 0;
}
.nav-btn.next {
  right: 0;
  border-radius: 8px 0 0 8px;
}
.image-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
}

/* Phone Landscape Optimization */
@media (max-height: 500px) and (orientation: landscape) {
  .game-header {
    height: 40px;
  }
  .main-layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
  .gallery {
    aspect-ratio: auto;
    height: 100%;
  }
  .visual-side {
    border-bottom: none;
    border-right: 1px solid #333;
  }
  .info-strip {
    padding: 10px;
  }
  .address {
    font-size: 1.1rem;
  }
}
</style>
