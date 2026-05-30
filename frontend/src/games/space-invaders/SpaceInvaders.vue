<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_WIDTH = 40;
const INVADER_SIZE = 30;

const playerX = ref(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
const bullets = ref<{ x: number; y: number }[]>([]);
const invaders = ref<{ x: number; y: number; id: number }[]>([]);
const score = ref(0);
const gameOver = ref(false);

let invaderDirection = 1;
let lastTime = 0;
let lastFireTime = 0;
let animationFrameId = 0;

const initInvaders = () => {
	invaders.value = [];
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 8; col++) {
			invaders.value.push({
				x: col * (INVADER_SIZE + 20) + 50,
				y: row * (INVADER_SIZE + 20) + 50,
				id: row * 10 + col,
			});
		}
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (gameOver.value) return;
	if (e.key === "ArrowLeft" || e.key === "a") {
		playerX.value = Math.max(0, playerX.value - 20);
	} else if (e.key === "ArrowRight" || e.key === "d") {
		playerX.value = Math.min(GAME_WIDTH - PLAYER_WIDTH, playerX.value + 20);
	} else if (e.key === " " || e.key === "ArrowUp") {
		const now = Date.now();
		if (now - lastFireTime < 200) return;
		lastFireTime = now;
		bullets.value.push({
			x: playerX.value + PLAYER_WIDTH / 2 - 2,
			y: GAME_HEIGHT - 40,
		});
	}
};

const gameLoop = (time: number) => {
	if (gameOver.value) return;
	const delta = Math.min(time - lastTime, 50);

	bullets.value = bullets.value
		.map((b) => ({ ...b, y: b.y - 5 }))
		.filter((b) => b.y > 0);

	let shouldShiftDown = false;
	invaders.value.forEach((inv) => {
		inv.x += invaderDirection * (delta * 0.05);
		if (inv.x > GAME_WIDTH - INVADER_SIZE || inv.x < 0) {
			shouldShiftDown = true;
		}
	});

	if (shouldShiftDown) {
		invaderDirection *= -1;
		invaders.value.forEach((inv) => {
			inv.y += 20;
			if (inv.y > GAME_HEIGHT - 60) gameOver.value = true;
		});
	}

	for (let bIdx = bullets.value.length - 1; bIdx >= 0; bIdx--) {
		const bullet = bullets.value[bIdx];
		if (!bullet) continue;
		for (let iIdx = invaders.value.length - 1; iIdx >= 0; iIdx--) {
			const inv = invaders.value[iIdx];
			if (!inv) continue;
			if (
				bullet.x > inv.x &&
				bullet.x < inv.x + INVADER_SIZE &&
				bullet.y > inv.y &&
				bullet.y < inv.y + INVADER_SIZE
			) {
				invaders.value.splice(iIdx, 1);
				bullets.value.splice(bIdx, 1);
				score.value += 10;
				break;
			}
		}
	}

	if (invaders.value.length === 0) {
		initInvaders();
	}

	lastTime = time;
	animationFrameId = requestAnimationFrame(gameLoop);
};

onMounted(() => {
	initInvaders();
	window.addEventListener("keydown", handleKeydown);
	animationFrameId = requestAnimationFrame(gameLoop);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
	cancelAnimationFrame(animationFrameId);
});

const restart = () => {
	score.value = 0;
	gameOver.value = false;
	playerX.value = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
	bullets.value = [];
	invaders.value = [];
	lastTime = 0;
	initInvaders();
	cancelAnimationFrame(animationFrameId);
	animationFrameId = requestAnimationFrame(gameLoop);
};
</script>

<template>
  <div class="flex flex-col items-center rounded-lg bg-black p-5 text-white">
    <div class="mb-2 font-mono text-2xl">Score: {{ score }}</div>

    <div
      class="relative overflow-hidden border-2 border-neutral-700 bg-neutral-950"
      :style="{ width: GAME_WIDTH + 'px', height: GAME_HEIGHT + 'px' }"
    >
      <div
        class="absolute bottom-2.5 h-5 w-10 bg-emerald-500"
        :style="{ left: playerX + 'px' }"
      ></div>

      <div
        v-for="(b, i) in bullets"
        :key="'b' + i"
        class="absolute h-2.5 w-1 bg-yellow-300"
        :style="{ left: b.x + 'px', top: b.y + 'px' }"
      ></div>

      <div
        v-for="inv in invaders"
        :key="inv.id"
        class="absolute h-[30px] w-[30px] rounded-sm bg-red-400"
        :style="{ left: inv.x + 'px', top: inv.y + 'px' }"
      ></div>

      <div
        v-if="gameOver"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
      >
        <h2 class="m-0 text-5xl text-red-400">GAME OVER</h2>
        <p class="mb-5 mt-4 text-xl">Final Score: {{ score }}</p>
        <button
          @click="restart"
          class="cursor-pointer border-none bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-500"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>
