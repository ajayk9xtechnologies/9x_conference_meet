import { createApp } from 'vue'; // Import the createApp function from Vue
import router from './router'; // Import your Vue Router configuration
import App from './App.vue'; // Import your main App component
import './style.css'; // Import your global CSS styles
import store from './Store/store';

// Get the stored data from local storag
// Get the stored data from local storage
const storedData = localStorage.getItem('videoconference');
// console.log(storedData);
if (storedData) {
  store.replaceState(JSON.parse(storedData));
}
// Create a new Vue application instance
const app = createApp(App);

// Use Vue Router plugin to integrate router configuration
app.use(router);

// Mount the Vue application to the DOM element with the id 'app'
app.mount('#app');
