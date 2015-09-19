"use strict";

module.exports = class {
  constructor(users) {
    this.users = users;
    this.roomId = this.generateId();
  }
  generateId() {
    return Date.now();
  }
  joinRoom() {
    this.users.forEach((user) => {
      user.io.join(this.roomId);
      user.io.emit('startGame', {
        roomId: this.roomId
      });
    });
  }
  leaveRoom() {
    this.users.forEach((user) => {
      user.io.leave(this.roomId);
      user.io.emit('endGame', {}); //TODO
    });
  }
  updateStatus(user, data) {
    user.io.room(this.roomId).broadcast('updateStatus', data)
  }
};