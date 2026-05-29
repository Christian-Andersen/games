<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { games } from "../games/config";

const route = useRoute();
const router = useRouter();

const game = computed(() => {
	return games.find((g) => g.slug === route.params.slug);
});

const gameComponent = shallowRef();

watchEffect(() => {
	if (game.value) {
		gameComponent.value = defineAsyncComponent(game.value.component);
	}
});

const goHome = () => {
	router.push("/");
};
</script>

<template>
  <div v-if="game" class="flex h-screen w-screen flex-col overflow-hidden bg-neutral-900">
    <header class="flex h-15 items-center border-b border-neutral-700 bg-black px-6 z-50">
      <button @click="goHome" class="cursor-pointer border-none bg-transparent p-0">
        <span class="text-2xl font-black tracking-wider text-emerald-500">GAMES</span>
      </button>
      <div class="ml-8 border-l border-neutral-700 pl-8 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        {{ game.name }}
      </div>
    </header>

    <main class="relative flex-1 overflow-hidden">
      <component :is="gameComponent" />
    </main>
  </div>

  <div v-else class="flex h-screen flex-col items-center justify-center bg-neutral-900 text-white">
    <p class="text-neutral-400">Game not found.</p>
    <button
      @click="goHome"
      class="mt-5 cursor-pointer rounded-lg border border-emerald-500 bg-transparent px-6 py-2.5 font-bold text-emerald-500 transition-colors hover:bg-emerald-500/10"
    >
      Go Home
    </button>
  </div>
</template>
