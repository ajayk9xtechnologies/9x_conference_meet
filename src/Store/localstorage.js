// localstorage.js
export const localStoragePlugin = (store) => {
    // Subscribe to store mutations
    store.subscribe((mutation, state) => {
      // Save the state to local storage
      localStorage.setItem('videoconference', JSON.stringify(state));
    });
};
  