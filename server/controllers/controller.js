"use strict";

module.exports = class {
  constructor() {
    this.availableUsers = {};
    this.rooms = {};
  }
  findOpponents(req) {
    console.log('New user available: ' + req.socket.id);
    this.availableUsers[req.socket.id] = req;
    req.io.on('disconnect', () => delete this.availableUsers[req.socket.id]);
    this.findPlayersWithTheSameNumberOfOpponents();
  }
  findPlayersWithTheSameNumberOfOpponents() {
    let map = {};
    for (let user in this.availableUsers) {
      if (map[this.availableUsers[user].data.numberOfOpponents] === undefined) {
        map[this.availableUsers[user].data.numberOfOpponents] = 0;
      } else {
        map[this.availableUsers[user].data.numberOfOpponents]++;
        if (map[this.availableUsers[user].data.numberOfOpponents] === this.availableUsers[user].data.numberOfOpponents) {
          this.findPlayersByNumberOfOpponentsValue(this.availableUsers[user].data.numberOfOpponents);
        }
      }
    }
  }
  findPlayersByNumberOfOpponentsValue(numberOfOpponents) {
    let opponents = [];
    for (let user in this.availableUsers) {
      if (this.availableUsers[user].data.numberOfOpponents === numberOfOpponents) {
        opponents.push(this.availableUsers[user]);
        delete this.availableUsers[this.availableUsers[user].socket.id];
      }
    }
    this.startGame(opponents);
  }
  startGame(users) {
    let roomId = this.generateUniqueId(this.rooms);

    this.rooms[roomId] = users;
    this.joinRoom(roomId);
    console.log('Created new room: ' + roomId);
  }
  joinRoom(roomId) {
    this.rooms[roomId].forEach((user) => {
      user.io.join(roomId);
      user.io.emit('startGame', {
        data: 'В сети за минувшие сутки: производительность LG Nexus 5X оценили с помощью бенчмарка; Microsoft Lumia 950 XL действительно получит QHD-экран и Qualcomm Snapdragon 810; Nexus 5 и 6 начнут получать Android 6.0 уже 5 октября; LG подтвердила анонс V10 с двойной фронтальной камерой 1 октября; смартфон BlackBerry Venice на Android будет представлен под названием Priv; толщина смартфона Doogee T6 с аккумулятором на 6 000 мАч составляет всего 10,2 мм.'
      });
      user.io.on('updateStatus', (data) => user.io.room(roomId).broadcast('updateStatus', data));
      user.io.on('disconnect', () => this.endGame(user, roomId));
    });
  }
  endGame(leavedUser, roomId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId].forEach((user) => {
        if (user !== leavedUser) {
          user.io.leave(roomId);
          user.io.emit('endGame', {}); //TODO
        }
      });
      delete this.rooms[roomId];
      console.log('Users leaved from the room: ' + roomId);
    }
  }
  generateUniqueId(rooms) {
    let roomId = Date.now().toString();
    while (rooms[roomId]) {
      roomId = Date.now().toString();
    }
    return roomId;
  }
};