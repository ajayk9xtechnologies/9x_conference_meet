<template>
  <div>
    <h1>PeerJS One-to-One Connection</h1>
    <peer-vid/> <!-- Correct usage -->
  </div>
</template>

<script>
import PeerVid from './PeerVideo.vue'; // Correct import

export default {
  components: {
    'peer-vid': PeerVid // Register component with kebab-case name
  }
}
</script>

<style>
/* Add your component styles here */
</style>
