// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
const CharactersPage = () => import('@/pages/CharactersPage.vue');

const routes = [
  { path: '/', redirect: '/characters' },
  { path: '/characters', name: 'characters', component: CharactersPage },
  { path: '/characters/:file', name: 'character', component: CharactersPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});