<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { games, standaloneGames } from "../games/config";

const searchQuery = ref("");
const selectedCategory = ref("All");

const allGames = computed(() => [
	...games.map((g) => ({ ...g, isStandalone: false as const })),
	...standaloneGames.map((g) => ({ ...g, isStandalone: true as const })),
]);

const categories = computed(() => {
	const cats = new Set(allGames.value.map((g) => g.category));
	return ["All", ...Array.from(cats)];
});

const filteredGames = computed(() => {
	return allGames.value.filter((game) => {
		const matchesSearch =
			game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			game.description.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesCategory =
			selectedCategory.value === "All" ||
			game.category === selectedCategory.value;
		return matchesSearch && matchesCategory;
	});
});
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 py-16">
    <header class="mb-12 text-center">
      <h1
        class="mb-2 bg-gradient-to-r from-emerald-400 to-slate-500 bg-clip-text text-6xl font-black text-transparent"
      >
        Gaming Portal
      </h1>
      <p class="text-lg text-neutral-400">A collection of web-based games</p>
    </header>

    <div class="mb-12 flex flex-col items-center gap-5 md:flex-row md:justify-between">
      <div class="relative w-full max-w-md">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search games..."
          class="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 pl-11 text-white outline-none focus:border-emerald-500"
        />
      </div>

      <div class="flex flex-wrap justify-center gap-2.5">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'rounded-full border px-5 py-2 font-semibold transition-colors',
            selectedCategory === cat
              ? 'border-emerald-500 bg-emerald-600 text-white'
              : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white',
          ]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div
      v-if="filteredGames.length > 0"
      class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <template v-for="game in filteredGames" :key="game.id">
        <RouterLink
          v-if="!game.isStandalone"
          :to="{ name: 'game', params: { slug: game.slug } }"
          class="flex flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 no-underline text-inherit transition-all duration-300 hover:-translate-y-2.5 hover:border-emerald-500 hover:shadow-2xl hover:shadow-black/40"
        >
          <div class="relative h-48 overflow-hidden bg-black">
            <img
              :src="game.thumbnail"
              :alt="game.name"
              class="h-full w-full object-cover transition-transform duration-500"
            />
            <div
              class="absolute right-3 top-3 rounded-full border border-emerald-500/30 bg-black/70 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-sm"
            >
              {{ game.category }}
            </div>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <h3 class="mb-3 text-2xl font-bold text-white">{{ game.name }}</h3>
            <p class="flex-1 leading-relaxed text-neutral-400">{{ game.description }}</p>
          </div>
        </RouterLink>

        <a
          v-else
          :href="game.href"
          class="flex flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800 no-underline text-inherit transition-all duration-300 hover:-translate-y-2.5 hover:border-emerald-500 hover:shadow-2xl hover:shadow-black/40"
        >
          <div class="relative h-48 overflow-hidden bg-black">
            <img
              :src="game.thumbnail"
              :alt="game.name"
              class="h-full w-full object-cover transition-transform duration-500"
            />
            <div
              class="absolute right-3 top-3 rounded-full border border-emerald-500/30 bg-black/70 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-sm"
            >
              {{ game.category }}
            </div>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <h3 class="mb-3 text-2xl font-bold text-white">{{ game.name }}</h3>
            <p class="flex-1 leading-relaxed text-neutral-400">{{ game.description }}</p>
          </div>
        </a>
      </template>
    </div>

    <div v-else class="px-5 py-24 text-center text-neutral-500">
      <p class="mb-5">No games found matching your criteria.</p>
      <button
        @click=";((searchQuery = ''), (selectedCategory = 'All'))"
        class="cursor-pointer rounded-lg border border-emerald-500 bg-transparent px-6 py-2.5 font-bold text-emerald-500 transition-colors hover:bg-emerald-500/10"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
