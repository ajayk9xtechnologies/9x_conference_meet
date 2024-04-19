<template>
    <div>
      <h2>Project</h2>
      <video ref="localVideo" autoplay muted></video>
      <video ref="remoteVideo" autoplay></video>
      <div>
        <label for="peerIdInput">Enter Peer ID:</label>
        <input type="text" id="peerIdInput" v-model="peerIdInput">
        <button @click="connectToPeer">Connect</button>
      </div>
    </div>
  </template>
  
  <script>
  import Peer from 'peerjs';
  
  export default {
    data() {
      return {
        peer: null,
        localStream: null,
        remoteStream: null,
        peerIdInput: '',
      };
    },
    mounted() {
      this.initializePeer();
      this.requestUserMedia();
    },
    methods: {
      initializePeer() {
        this.peer = new Peer();
        this.peer.on('open', this.onPeerOpen);
        this.peer.on('error', this.onPeerError);
        this.peer.on('call', this.answerCall);
      },
      onPeerOpen(id) {
        console.log('Peer ID:', id);
      },
      onPeerError(error) {
        console.error('Peer error:', error);
      },
      async requestUserMedia() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          this.localStream = stream;
          this.$refs.localVideo.srcObject = this.localStream;
        } catch (error) {
          console.error('Error accessing media devices:', error);
        }
      },
      async answerCall(call) {
        try {
          call.answer(this.localStream);
          call.on('stream', remoteStream => {
            this.remoteStream = remoteStream;
            this.$refs.remoteVideo.srcObject = this.remoteStream;
          });
        } catch (error) {
          console.error('Error answering call:', error);
        }
      },
      async connectToPeer() {
        const peerId = this.peerIdInput.trim();
        console.log('Peer ID:', peerId);
        console.log('Local Stream:', this.localStream);
        if (peerId === '' || !this.localStream) return;
  
        const call = this.peer.call(peerId, this.localStream);
        console.log('Call Object:', call);
        if (!call) {
          console.error('Failed to create call object');
          return;
        }
  
        call.on('stream', remoteStream => {
          console.log('Remote Stream:', remoteStream);
          this.remoteStream = remoteStream;
          this.$refs.remoteVideo.srcObject = this.remoteStream;
        });
        call.on('close', () => {
          console.log('Call closed');
          this.remoteStream = null;
          this.$refs.remoteVideo.srcObject = null;
        });
        call.on('error', error => {
          console.error('Call error:', error);
        });
      },
    },
    beforeUnmount() {
      if (this.peer) {
        this.peer.destroy();
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add your component styles here */
  </style>