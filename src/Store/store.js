// store.js
import { createStore } from 'vuex';
import { localStoragePlugin } from '@/Store/localstorage';

export default createStore({
  state: {

  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    
  },
  getters: {

  },

  actions: {},
  
  plugins: [localStoragePlugin], // Use the localStoragePlugin to persist state
});
