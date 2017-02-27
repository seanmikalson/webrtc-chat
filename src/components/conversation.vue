<template>
  <div>
    <div v-if="waiting">
      Waiting for users...
    </div>
    <div v-else>
      <span>{{userinfo.name}} wants to chat!</span>
      <button @click="chatAccepted">Start Chatting</button>
      <button @click="chatDeclined">No thanks</button>
      <input @keyup.enter="sendMessage"></input>
    </div>
    <div>
      <ul id="example-1">
        <li v-for="message in messages">
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import WebRTC from '../web-rtc/web-rtc';

export default {
  name: 'conversation',
  props: ['socket', 'userinfo', 'waitforusers'],
  data: function() {
    return {
      messages: [],
    }
  },
  methods: {
    chatAccepted: function() {
      var component = this;
      var onDataChannel = function(evt) {
        evt.channel.onmessage = function(data) {
          this.messages.push(data);
        }
      };

      var webRtcObjects = WebRTC.initializeWebRtc(this.socket, this.userinfo.id, onDataChannel);
      this.peerConnection = webRtcObjects.peerConnection;
      this.datachannel = webRtcObjects.dataChannel;

      this.peerConnection.ondatachannel = function(evt) {
        evt.channel.onmessage = function() {
          component.messages.push(event.data);
        }
      };

      if(!this.waitforusers) {
        this.socket.emit('acceptmeeting', this.userinfo);
      } else {
        WebRTC.requestPeerConnection(this.peerConnection, this.socket, this.userinfo.id);
      }
    },
    chatDeclined: function() {

    },
    sendMessage: function(message) {
      this.messages.push(message.target.value);
      this.datachannel.send(message.target.value);
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
