"use strict";

let Express = require('express.io');
let Router = require('./routes/router');

class Server extends Express {
  constructor(port) {
    super();
    this.http().io();

    let morgan = require('morgan');
    let bodyParser = require('body-parser');
    let cookieParser = require('cookie-parser');
    let session = require('express-session');

    this.use(morgan('dev'));
    this.use(cookieParser());
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({ extended: true }));
    this.use(session({ secret: 'SecretKeyboardRace' }));

    new Router(this.io);

    this.listen(port, function()  {
      console.log("App listening on port " + port);
    });
  }
}

new Server(process.env.PORT || 3000);