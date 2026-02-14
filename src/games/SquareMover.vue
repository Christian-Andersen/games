<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const GAME_WIDTH = 600
const GAME_HEIGHT = 400
const PLAYER_WIDTH = 40
const INVADER_SIZE = 30

const playerX = ref(GAME_WIDTH / 2 - PLAYER_WIDTH / 2)
const bullets = ref<{ x: number, y: number }[]>([])
const invaders = ref<{ x: number, y: number, id: number }[]>([])
const score = ref(0)
const gameOver = ref(false)

let invaderDirection = 1
let lastTime = 0

const initInvaders = () => {
  invaders.value = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      invaders.value.push({
        x: col * (INVADER_SIZE + 20) + 50,
        y: row * (INVADER_SIZE + 20) + 50,
        id: row * 10 + col
      })
    }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (gameOver.value) return
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    playerX.value = Math.max(0, playerX.value - 20)
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    playerX.value = Math.min(GAME_WIDTH - PLAYER_WIDTH, playerX.value + 20)
  } else if (e.key === ' ' || e.key === 'ArrowUp') {
    bullets.value.push({ x: playerX.value + PLAYER_WIDTH / 2 - 2, y: GAME_HEIGHT - 40 })
  }
}

const gameLoop = (time: number) => {
  if (gameOver.value) return
  const delta = time - lastTime
  
  // Update bullets
  bullets.value = bullets.value
    .map(b => ({ ...b, y: b.y - 5 }))
    .filter(b => b.y > 0)

  // Update invaders
  let shouldShiftDown = false
  invaders.value.forEach(inv => {
    inv.x += invaderDirection * (delta * 0.05)
    if (inv.x > GAME_WIDTH - INVADER_SIZE || inv.x < 0) {
      shouldShiftDown = true
    }
  })

  if (shouldShiftDown) {
    invaderDirection *= -1
    invaders.value.forEach(inv => {
      inv.y += 20
      if (inv.y > GAME_HEIGHT - 60) gameOver.value = true
    })
  }

  // Collisions
  bullets.value.forEach((bullet, bIdx) => {
    invaders.value.forEach((inv, iIdx) => {
      if (
        bullet.x > inv.x && bullet.x < inv.x + INVADER_SIZE &&
        bullet.y > inv.y && bullet.y < inv.y + INVADER_SIZE
      ) {
        invaders.value.splice(iIdx, 1)
        bullets.value.splice(bIdx, 1)
        score.value += 10
      }
    })
  })

  if (invaders.value.length === 0) {
    initInvaders() // Next wave
  }

  lastTime = time
  requestAnimationFrame(gameLoop)
}

onMounted(() => {
  initInvaders()
  window.addEventListener('keydown', handleKeydown)
  requestAnimationFrame(gameLoop)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const restart = () => {
  score.value = 0
  gameOver.value = false
  playerX.value = GAME_WIDTH / 2 - PLAYER_WIDTH / 2
  bullets.value = []
  initInvaders()
  requestAnimationFrame(gameLoop)
}
</script>

<template>
  <div class="space-invaders">
    <div class="hud">Score: {{ score }}</div>
    
    <div class="game-board" :style="{ width: GAME_WIDTH + 'px', height: GAME_HEIGHT + 'px' }">
      <!-- Player -->
      <div class="player" :style="{ left: playerX + 'px' }"></div>
      
      <!-- Bullets -->
      <div v-for="(b, i) in bullets" :key="'b'+i" class="bullet" :style="{ left: b.x + 'px', top: b.y + 'px' }"></div>
      
      <!-- Invaders -->
      <div v-for="inv in invaders" :key="inv.id" class="invader" :style="{ left: inv.x + 'px', top: inv.y + 'px' }"></div>

      <!-- Game Over Overlay -->
      <div v-if="gameOver" class="overlay">
        <h2>GAME OVER</h2>
        <p>Final Score: {{ score }}</p>
        <button @click="restart">Play Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-invaders {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}
.hud {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.5rem;
  margin-bottom: 10px;
}
.game-board {
  position: relative;
  background: #111;
  border: 2px solid #333;
  overflow: hidden;
}
.player {
  position: absolute;
  bottom: 10px;
  width: 40px;
  height: 20px;
  background: #42b883;
}
.bullet {
  position: absolute;
  width: 4px;
  height: 10px;
  background: #ff0;
}
.invader {
  position: absolute;
  width: 30px;
  height: 30px;
  background: #ff5f5f;
  border-radius: 4px;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.overlay h2 { color: #ff5f5f; font-size: 3rem; margin: 0; }
.overlay button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #42b883;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
</style>
