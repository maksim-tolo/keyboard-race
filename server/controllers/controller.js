"use strict";

let Room = require('./room');

module.exports = class {
  constructor() {
    this.availableUsers = [];
    this.rooms = [];
  }
  joinToAvailableRoom(req) {
    console.log('New user available: ' + req.socket.id);
    this.availableUsers.push(req);
    if (this.availableUsers.length === 2) {
      this.startGame(this.availableUsers);
      //this.availableUsers.splice(this.availableUsers.length - 2, 2);
    }
  }
  updateStatus(req) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === req.data.roomId) {
        this.rooms[i].updateStatus(req, req.data.statusData);
        return this.rooms[i];
      }
    }
  }
  startGame(users) {
    let room = new Room(users);
    console.log('Created new room: ' + room.roomId);
    room.joinRoom();
    this.rooms.push(room);
  }
  endGame(roomId) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === roomId) {
        let leavedRoom = this.rooms.splice(this.rooms.length - 1, 1)[0];
        leavedRoom.leaveRoom();
        return leavedRoom;
      }
    }
  }
};