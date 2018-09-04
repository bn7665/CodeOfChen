var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var pershing_index = require('./routes/pershing_index');
var users = require('./routes/users');
var send_messages = require('./routes/send_messages');
var after_watson = require('./routes/after_watson');
var user_profile = require('./routes/user_profile');

var send_messages_prev = require('./routes/send_messages_prev');
var after_watson_prev = require('./routes/after_watson_prev');
var user_profile_prev = require('./routes/user_profile_prev');

var query_data = require('./routes/query_data');
var query_view = require('./routes/query_view');

var fb_query_conversations = require('./routes/fb_query_conversations');
var fb_query_messages = require('./routes/fb_query_messages');
var my_query = require('./routes/my_query');

var index = require('./routes/index');
var my_ip = require('./routes/my_ip');
var stt_service = require('./routes/stt_service');
var tts_service = require('./routes/tts_service');
var statistic = require('./routes/statistic');


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
app.use('/pershing_index', pershing_index);

app.use('/users', users);
app.use('/send_messages', send_messages);
app.use('/after_watson', after_watson);
app.use('/user_profile', user_profile);

app.use('/after_watson_prev', after_watson_prev);
app.use('/send_messages_prev', send_messages_prev);
app.use('/user_profile_prev', user_profile_prev);

app.use('/query_data', query_data);
app.use('/query_view', query_view);

app.use('/fb_query_conversations', fb_query_conversations);
app.use('/fb_query_messages', fb_query_messages);

app.use('/stt_service', stt_service);
app.use('/tts_service', tts_service);
app.use('/statistic', statistic);
app.use('/my_ip', my_ip);

app.use('/my_query', my_query);

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
