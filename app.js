var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var memwatch = require('memwatch-next');

var routes = require('./routes/index');
var users = require('./routes/users');
var tables = require('./routes/tables');
var assets = require('./routes/assets');

var TableRepo = require('./models/tableRepo');
var passport = require('./passport');
var sessionMiddleware = require('./middleware');
var IoServer = require('./socket_io/socketIoServer');
var logger = require("./log4js").getLogger('mem_watch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/tables', tables);
app.use('/assets', assets);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.ready = function (server) {
    IoServer.init(server);
    TableRepo.init();
    var hd;
    memwatch.on('stats', function(stats) {
        if (!hd) {
            hd = new memwatch.HeapDiff();
        } else {
            var diff = hd.end();
            logger.info(JSON.stringify(diff));
            hd = null;
        }
    });
};

module.exports = app;
