import type { Component } from "vue";

export interface Game {
	id: string;
	name: string;
	slug: string;
	description: string;
	thumbnail: string;
	category: "Action" | "Puzzle" | "Skill";
	component: () => Promise<{ default: Component }>;
}

export const games: Game[] = [
	{
		id: "clicker",
		name: "CPS Test",
		slug: "cps-test",
		description:
			"How many times can you click per second? 5-second rolling average.",
		thumbnail: "https://placehold.co/400x300?text=CPS+Test",
		category: "Skill",
		component: () => import("./cps-test/ClickerGame.vue"),
	},
	{
		id: "space-invaders",
		name: "Space Invaders",
		slug: "space-invaders",
		description:
			"Protect the earth from falling blocks! Use Arrows/WASD to move and Space to shoot.",
		thumbnail: "https://placehold.co/400x300?text=Space+Invaders",
		category: "Action",
		component: () => import("./space-invaders/SpaceInvaders.vue"),
	},
	{
		id: "globe-hunter",
		name: "Globe Hunter",
		slug: "globe-hunter",
		description:
			"Hunt for gold pins on a rotating 3D globe. Test your reflexes!",
		thumbnail: "https://placehold.co/400x300?text=Globe+Hunter",
		category: "Skill",
		component: () => import("./globe-game/GlobeGame.vue"),
	},
];

export interface StandaloneGame {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	category: "Action" | "Puzzle" | "Skill";
	href: string;
}

export const standaloneGames: StandaloneGame[] = [
	{
		id: "house-price-guesser",
		name: "House Price Guesser",
		description:
			"Guess the sale price of recently sold Australian homes. Within 5% wins!",
		thumbnail: "https://placehold.co/400x300?text=House+Price+Guesser",
		category: "Puzzle",
		href: "./games/house-price-guesser/",
	},
];
