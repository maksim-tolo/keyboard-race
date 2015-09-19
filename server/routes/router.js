"use strict";

let Controller = require('../controllers/controller');

module.exports = class {
  constructor(io) {
    let controller = new Controller();

    io.route('available', controller.joinToAvailableRoom.bind(controller));
    io.route('updateStatus', controller.updateStatus.bind(controller));
  }
};