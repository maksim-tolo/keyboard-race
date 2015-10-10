// Generated by CoffeeScript 1.4.0
(function() {
  var RoomIO;

  RoomIO = require('./room').RoomIO;

  exports.RequestIO = (function() {

    function RequestIO(socket, request, io) {
      this.socket = socket;
      this.request = request;
      this.manager = io;
    }

    RequestIO.prototype.broadcast = function(event, message) {
      return this.socket.broadcast.emit(event, message);
    };

    RequestIO.prototype.emit = function(event, message) {
      return this.socket.emit(event, message);
    };

    RequestIO.prototype.room = function(room) {
      return new RoomIO(room, this.socket);
    };

    RequestIO.prototype.join = function(room) {
      return this.socket.join(room);
    };

    RequestIO.prototype.route = function(route) {
      return this.manager.route(route, this.request, {
        trigger: true
      });
    };

    RequestIO.prototype.leave = function(room) {
      return this.socket.leave(room);
    };

    RequestIO.prototype.on = function() {
      var args;
      args = Array.prototype.slice.call(arguments, 0);
      return this.socket.on.apply(this.socket, args);
    };

    RequestIO.prototype.disconnect = function(callback) {
      return this.socket.disconnect(callback);
    };

    return RequestIO;

  })();

}).call(this);
