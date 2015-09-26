"use strict";

var io = io.connect('http://localhost:3000');

class App {
  constructor(io, $) {
    let me = this;

    io.on('startGame', function(data) {
      console.log(data);
    });
    io.on('updateStatus', function(data) {
      console.log(data);
    });
    $('#qwe').on('click', function() {
      io.emit('findOpponents', {
        numberOfOpponents: 1
      });
    });
    $('#asd').on('click', function() {
      io.emit('updateStatus', {
        qwe: 'qwe'
      });
    });
  }
}

new App(io, $);