import routes from 'virtual:generated-pages';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './app.vue';

import 'the-new-css-reset/css/reset.css';
import 'virtual:windi.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');