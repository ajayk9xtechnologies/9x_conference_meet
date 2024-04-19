// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import VideoChat from '../pages/VideoChat.vue';



const routes = [
  { path: '/', component: VideoChat, name: 'VideoChat' },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;