import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // Import your Vue Router configuration

const app = createApp(App);

// Use Vue Router plugin to integrate router configuration
app.use(router);

// Mount the Vue application to the DOM element with the id 'app'
app.mount('#app');
