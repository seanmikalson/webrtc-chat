var WebRtc = {

  connectToSignallingService: function() {
    var socket = io.connect('http://localhost:3000');
    return new Promise(function(resolve,reject) {
      socket.on('connect', function() {
        resolve(socket);
      });
    });
  },
  sendSessionDescription: function(peerConnection, socket, userId) {
    socket.emit('session-description', {
      id: userId,
      sessionDescription: peerConnection.localDescription
    });
  },
  initializeWebRtc: function(socket, userId) {
    var config = {
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302'
        }
      ]
    };
    var peerConnection = new webkitRTCPeerConnection(config);

    peerConnection.onicecandidate = function(event) {
      if(event.candidate) {
        socket.emit('ice-candidate', {
          id: userId,
          candidate: event.candidate
        })
      }
    };

    socket.on('ice-candidate', function(candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate.candidate));
    });

    socket.on('session-description', function(data) {
      if(!peerConnection.remoteDescription.sdp) {
        peerConnection.setRemoteDescription(data.sessionDescription).then(function() {
          if(peerConnection.remoteDescription.type === 'offer') {
            peerConnection.createAnswer().then(function(sdp) {
              return peerConnection.setLocalDescription(sdp);
            }).then(WebRtc.sendSessionDescription.bind(this, peerConnection, socket, userId));
          }
        });
      }
    });

    return peerConnection;
  },
  requestPeerConnection: function(peerConnection, socket, userid) {
    peerConnection.createOffer().then(function(sdp) {
      return peerConnection.setLocalDescription(sdp);
    }).then(WebRtc.sendSessionDescription.bind(this, peerConnection, socket, userid));
  }
};

export default WebRtc;
