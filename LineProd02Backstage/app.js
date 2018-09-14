var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var query_data = require('./routes/query_data');
var query_view = require('./routes/query_view');

var find_conversation = require('./routes/find_conversation');
var line_messages = require('./routes/line_messages');
var flows = require('./routes/flows');
var error_check = require('./routes/error_check');
var duplicate = require('./routes/duplicate');
var response_time = require('./routes/response_time');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', find_conversation);
app.use('/line_messages', line_messages);
app.use('/flows', flows);
app.use('/error_check', error_check);
app.use('/duplicate', duplicate);
app.use('/response_time', response_time);

//app.use('/users', users);
app.use('/query_data', query_data);
app.use('/query_view', query_view);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
