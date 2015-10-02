"use strict";

let request = require('request');

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

      //@TODO: numberOfWords to variable
      this.getText(20, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let text = body.slice(3, -4).trim(),
              words = text.split(' ');

          user.io.emit('startGame', {
            text: text,
            words: words,
            numberOfWords: words.length,
            numberOfPlayers: this.rooms[roomId].length
          });
        }
      });
      user.io.on('updateStatus', (data) => user.io.room(roomId).broadcast('updateStatus', data));
      user.io.on('message', (data) => user.io.room(roomId).broadcast('message', data));
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
  getText(numberOfWords, callback) {
    request.post('http://online-generators.ru/ajax.php', {
      form: {
        paragraph: '1',
        word: numberOfWords,
        type: 'prose',
        processor: 'text'
      }
    }, callback);
  }
};