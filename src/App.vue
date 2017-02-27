<template>
  <div id="app">
    <connect-user @waitforusers="waitforusers=true" v-if="haveSocket && !waitforusers && !useravailable" :socket="socket"></connect-user>
    <conversation v-if="useravailable || waitforusers" :waitforusers="waitforusers" :userinfo="userinfo" :socket="socket"></conversation>
  </div>
</template>

<script>
import ConnectUser from './components/connect-user';
import Conversation from './components/conversation';
import WebRtc from './web-rtc/web-rtc';

export default {
  name: 'app',
  components: {
    ConnectUser, Conversation
  },
  data: function() {
    return {
      socket: null,
      haveSocket: false,
      waitforusers: false,
      useravailable: false,
      userinfo: null
    }
  },
  mounted: function() {
    var component = this;
    WebRtc.connectToSignallingService().then(function(socket) {
      component.haveSocket = true;
      component.socket = socket;

      socket.on('useravailable', function(user) {
        component.useravailable = true;
        component.userinfo = user;
      });
    });
  }
}
</script>

<style>

</style>
