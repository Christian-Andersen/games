<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const clicks = ref<number[]>([])
const cps = ref(0)

const handleClick = () => {
  const now = Date.now()
  clicks.value.push(now)
  updateCPS()
}

const updateCPS = () => {
  const now = Date.now()
  // Only keep clicks from the last 5 seconds
  clicks.value = clicks.value.filter(t => now - t < 5000)
  cps.value = clicks.value.length / 5
}

// Update CPS display every 100ms to handle fading out
const interval = setInterval(updateCPS, 100)

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="game-container">
    <h2>Clicks Per Second</h2>
    <p>Click as fast as you can! (5s average)</p>
    
    <div class="stats">
      <div class="cps-display">{{ cps.toFixed(1) }}</div>
      <div class="label">CPS</div>
    </div>

    <button @click="handleClick" class="click-area">
      CLICK!
    </button>
    
    <div class="total">Total clicks in last 5s: {{ clicks.length }}</div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
}
.stats {
  text-align: center;
  margin: 20px 0;
}
.cps-display {
  font-size: 6rem;
  font-weight: bold;
  color: #42b883;
  line-height: 1;
}
.label {
  font-size: 1.5rem;
  color: #666;
}
.click-area {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  background-color: #35495e;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.05s;
  box-shadow: 0 10px 0 #243447;
}
.click-area:active {
  transform: translateY(5px);
  box-shadow: 0 5px 0 #243447;
}
.total {
  margin-top: 20px;
  color: #888;
}
</style>
