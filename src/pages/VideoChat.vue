<template>
  <div>
    <h1 class="title">9X MEET</h1>
    <p id="notification" v-if="showNotification">{{ notification }}</p>
    <div class="entry-modal" id="entry-modal" v-if="showModal">
      <p>Create or Join Meeting</p>
      <input id="room-input" class="room-input" placeholder="Enter Room ID" v-model="roomId">
      <div>
        <button @click="createRoom">Create Room</button>
        <button @click="joinRoom">Join Room</button>
      </div>
    </div>
    <div class="meet-area">
      <video id="remote-video" ref="remoteVideo"></video>
      <video id="local-video" ref="localVideo"></video>
      <div class="meet-controls-bar">
        <button @click="startScreenShare">Screen Share</button>
        <button @click="decline">Decline</button>
        <button @click="endCall">End Call</button>
      </div>
    </div>
  </div>
</template>

<script>
import Peer from 'peerjs';

const PRE = "DELTA";
const SUF = "MEET";

export default {
  name:'VideoChat',
  data() {
    return {
      roomId: '',
      peer: null,
      currentPeer: null,
      localStream: null,
      screenStream: null,
      screenSharing: false,
      showModal: true,
      showNotification: false,
      notification: '',
    };
  },
  beforeUnmount() {
    this.endCall();
    if (this.peer) {
      this.peer.destroy();
    }
  },
  methods: {
    createRoom() {
      console.log("Creating Room");
      if (this.roomId === '' || this.roomId === ' ') {
        alert("Please enter room number");
        return;
      }
      const roomId = PRE + this.roomId + SUF;
      this.peer = new Peer(roomId);
      this.peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id);
        this.showModal = false;
        this.getUserMedia({ video: true, audio: true }, (stream) => {
          this.localStream = stream;
          this.setLocalStream(this.localStream);
        }, (err) => {
          console.log(err);
        });
        this.notify("Waiting for peer to join.");
      });
      this.peer.on('call', (call) => {
        call.answer(this.localStream);
        call.on('stream', (stream) => {
          this.setRemoteStream(stream);
        });
        this.currentPeer = call;
      });
    },
    joinRoom() {
      console.log("Joining Room");
      if (this.roomId === '' || this.roomId === ' ') {
        alert("Please enter room number");
        return;
      }
      const roomId = PRE + this.roomId + SUF;
      this.showModal = false;
      this.peer = new Peer();
      this.peer.on('open', (id) => {
        console.log("Connected with Id: " + id);
        this.getUserMedia({ video: true, audio: true }, (stream) => {
          this.localStream = stream;
          this.setLocalStream(this.localStream);
          this.notify("Joining peer");
          let call = this.peer.call(roomId, stream);
          call.on('stream', (stream) => {
            this.setRemoteStream(stream);
          });
          this.currentPeer = call;
        }, (err) => {
          console.log(err);
        });
      });
    },
    getUserMedia(constraints, success, error) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(success)
        .catch(error);
    },
    setLocalStream(stream) {
      this.$refs.localVideo.srcObject = stream;
      this.$refs.localVideo.muted = true;
      this.$refs.localVideo.play();
    },
    setRemoteStream(stream) {
      this.$refs.remoteVideo.srcObject = stream;
      if (this.$refs.remoteVideo.readyState === this.$refs.remoteVideo.HAVE_ENOUGH_DATA) {
        this.$refs.remoteVideo.play();
      } else {
        this.$refs.remoteVideo.addEventListener('loadedmetadata', () => {
          this.$refs.remoteVideo.play();
        });
      }
    },
    notify(msg) {
      this.notification = msg;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    startScreenShare() {
      if (this.screenSharing) {
        this.stopScreenSharing();
      }
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then((stream) => {
          this.screenStream = stream;
          let videoTrack = this.screenStream.getVideoTracks()[0];
          videoTrack.onended = () => {
            this.stopScreenSharing();
          };
          if (this.peer) {
            let sender = this.currentPeer.peerConnection.getSenders().find(function (s) {
              return s.track.kind === videoTrack.kind;
            });
            sender.replaceTrack(videoTrack);
            this.screenSharing = true;
          }
          console.log(this.screenStream);
        });
    },
    stopScreenSharing() {
      if (!this.screenSharing) return;
      let videoTrack = this.localStream.getVideoTracks()[0];
      if (this.peer) {
        let sender = this.currentPeer.peerConnection.getSenders().find(function (s) {
          return s.track.kind === videoTrack.kind;
        });
        sender.replaceTrack(videoTrack);
      }
      this.screenStream.getTracks().forEach(function (track) {
        track.stop();
      });
      this.screenSharing = false;
    },
    decline() {
      if (this.currentPeer) {
        this.currentPeer.close();
        this.currentPeer = null;
        this.resetStreams();
        this.showModal = true;
        this.notify("Call declined.");
      }
    },
    endCall() {
      if (this.currentPeer) {
        this.currentPeer.close();
        this.currentPeer = null;
        this.resetStreams();
        this.showModal = true;
        this.notify("Call ended.");
      }
    },
    resetStreams() {
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(track => track.stop());
        this.screenStream = null;
      }
      this.$refs.localVideo.srcObject = null;
      this.$refs.remoteVideo.srcObject = null;
    },
  },
};
</script>