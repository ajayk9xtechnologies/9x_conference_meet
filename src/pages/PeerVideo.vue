<template>
  <div>
    <video :class="{ 'active': !video }" class="localvideo" ref="localVideo" autoplay muted></video>
    <div class="remote-videos">
      <video :class="{ 'active': !video }" class="localvideo" v-for="(stream, peerId) in remoteStreams" :key="peerId" :ref="'remoteVideo_' + peerId" autoplay></video>
    </div>
    <button @click="videotoggle">Video</button>
    <div>
      <button @click="startCall">Start Call</button>
      <button @click="leaveCall">Leave Call</button>
    </div>
    <div>
      <label for="peerIdInput">Enter Call ID:</label>
      <input type="text" placeholder="Call ID" id="peerIdInput" v-model="callIdInput">
      <button @click="joinCall">Join Call</button>
      <div class="peer-id">
        <span>Your Peer ID: {{ peerId }}</span><i class="copy-icon" @click="copyPeerId" title="Copy and send to friends"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Peer from 'peerjs';

export default {
  data() {
    return {
      peer: null,
      peerId: '',
      localStream: null,
      remoteStreams: {},
      callIdInput: '',
      callId: '',
      video: true,
    };
  },
  mounted() {
    this.initializePeer();
    this.requestUserMedia();
  },
  methods: {
    videotoggle() {
      console.log("false");
      this.video = !this.video;
      this.requestUserMedia();
    },
    leaveCall() {
      if (this.peer) {
        this.peer.disconnect();
        this.remoteStreams = {};
      }
    },
    copyPeerId() {
      navigator.clipboard.writeText(this.peerId)
        .then(() => {
          console.log('Peer ID copied to clipboard');
          // Optionally, you can show a success message to the user
        })
        .catch((error) => {
          console.error('Failed to copy Peer ID:', error);
          // Optionally, you can show an error message to the user
        });
    },
    initializePeer() {
      this.peer = new Peer();
      this.peer.on('open', this.onPeerOpen);
      this.peer.on('error', this.onPeerError);
      this.peer.on('call', this.answerCall);
    },
    onPeerOpen(id) {
      console.log('Peer ID:', id);
      this.peerId = id;
    },
    onPeerError(error) {
      console.error('Peer error:', error);
    },
    async requestUserMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: this.video, audio: true });
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
          this.remoteStreams[call.peer] = remoteStream;
          this.$nextTick(() => {
            this.$refs['remoteVideo_' + call.peer][0].srcObject = remoteStream;
          });
        });
        call.on('close', () => {
          delete this.remoteStreams[call.peer];
        });
      } catch (error) {
        console.error('Error answering call:', error);
      }
    },
    async startCall() {
      if (!this.localStream) return;

      this.callId = this.peerId;
      console.log('Call ID:', this.callId);
    },
    async joinCall() {
      const callId = this.callIdInput.trim();
      console.log('Joining Call:', callId);

      if (callId === '' || !this.localStream) return;

      this.callId = callId;
      const call = this.peer.call(callId, this.localStream);
      call.on('stream', remoteStream => {
        this.remoteStreams[call.peer] = remoteStream;
        this.$nextTick(() => {
          this.$refs['remoteVideo_' + call.peer][0].srcObject = remoteStream;
        });
      });
      call.on('close', () => {
        delete this.remoteStreams[call.peer];
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
    Object.values(this.remoteStreams).forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
  },
};
</script>

<style>
.peer-id {
  display: flex;
  align-items: center;
}

.copy-icon {
  margin-left: 8px;
  cursor: pointer;
}

.copy-icon::before {
  content: '\1F4CB';
  /* Unicode character for clipboard icon */
}

.active {
  background: #000;
}

.localvideo {
  width: 50vw;
  height: 100vh;
}

.remote-videos {
  display: flex;
  flex-wrap: wrap;
}

.remote-videos video {
  width: 300px;
  height: 200px;
  margin: 10px;
}
</style>