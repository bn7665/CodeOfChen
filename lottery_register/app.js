var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var register_data = require('./routes/register_data');
var view_register = require('./routes/view_register');
var query_data = require('./routes/query_data');
var my_ip = require('./routes/my_ip');
var ht_trace_log = require('./routes/ht_trace_log');
var my_log = require('./routes/my_log');

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

app.use('/', index);
app.use('/register/registry_data', register_data);
app.use('/view_register', view_register);
app.use('/query_data', query_data);
app.use('/my_ip', my_ip);
app.use('/ht_trace_log', ht_trace_log);
app.use('/api/ytff',my_log);

//app.use('/users', users);

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
  //res.render('error');
  res.render('index');
});

module.exports = app;
