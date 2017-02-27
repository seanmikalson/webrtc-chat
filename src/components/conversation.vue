<template>
  <div>
    <div v-if="waiting">
      Waiting for users...
    </div>
    <div v-else>
      <span>{{userinfo.name}} wants to chat!</span>
      <button @click="chatAccepted">Start Chatting</button>
      <button @click="chatDeclined">No thanks</button>
    </div>
  </div>
</template>

<script>
import WebRTC from '../web-rtc/web-rtc';

export default {
  name: 'conversation',
  props: ['socket', 'userinfo', 'waitforusers'],
  methods: {
    chatAccepted: function() {
      this.peerConnection = WebRTC.initializeWebRtc(this.socket, this.userinfo.id);
      if(!this.waitforusers) {
        this.socket.emit('acceptmeeting', this.userinfo);
      } else {
        WebRTC.requestPeerConnection(this.peerConnection, this.socket, this.userinfo.id);
      }
    },
    chatDeclined: function() {

    }
  },
  computed: {
    waiting: function() {
      return this.userinfo ? false : true;
    }
  }
}
</script>

<style>
</style>
