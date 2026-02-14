export interface Game {
  id: string
  name: string
  slug: string
  description: string
  thumbnail: string
  component: () => Promise<any>
}

export const games: Game[] = [
  {
    id: 'clicker',
    name: 'CPS Test',
    slug: 'cps-test',
    description: 'How many times can you click per second? 5-second rolling average.',
    thumbnail: 'https://placehold.co/400x300?text=CPS+Test',
    component: () => import('./ClickerGame.vue'),
  },
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    slug: 'space-invaders',
    description: 'Protect the earth from falling blocks! Use Arrows/WASD to move and Space to shoot.',
    thumbnail: 'https://placehold.co/400x300?text=Space+Invaders',
    component: () => import('./SquareMover.vue'),
  },
]
