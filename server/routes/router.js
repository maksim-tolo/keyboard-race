"use strict";

let Controller = require('../controllers/controller');

module.exports = class {
  constructor(io) {
    let controller = new Controller();

    io.route('findOpponents', controller.findOpponents.bind(controller));
  }
};