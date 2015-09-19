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

/*var multer  = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');

var apiRoutes = require('./routes/apiRoutes');
var mainRoutes = require('./routes/mainRoutes');
var apiController = require('./controllers/apiController');*/

/*var database = require('./config/database.js');

mongoose.connect(database.url);

require('./config/passport')(passport);

app.use(multer({
  	dest: './public/uploads/',
  	rename: function (fieldname, filename) {
    	return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  	},
  	limits: {
  		fieldSize: 500
	},
	onFileUploadComplete: apiController.addFileToTask
}));

app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', mainRoutes);
app.use('/api', apiRoutes);

app.io.route('listRooms', function(req) {
	for (var i = 0; i < req.data.length; i++) {
		req.io.join(req.data[i]);
	}
});

app.io.route('leaveListRoom', function(req) {
	req.io.leave(req.data);
});

app.io.route('userRooms', function(req) {
	req.io.join(req.data);
});

app.io.route('update', function(req) {
    req.io.room(req.data).broadcast('updateUser', {
    	message: 'update'
    });
});*/

new Server(3000);