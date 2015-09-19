"use strict";

var io = io.connect('http://localhost:3000');
var roomId;
io.emit('available');
io.on('startGame', function(data) {
  roomId = data.roomId;
  console.log(data);
});
io.on('updateStatus', function(data) {
  console.log(data);
});
setTimeout(function() {
  io.emit('updateStatus', {
    roomId: roomId,
    statusData: {
      qwe: 'qwe'
    }
  });
}, 1000);