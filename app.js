var express = require('express'),
    socketIO = require('socket.io'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser')
    
var routes = require('./routes/index'),
    users = require('./routes/users')

var app = express()
    app.io = socketIO()

var connection = require('./bin/connectDB')
    connection(function(db){})    

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    next(err)
  })
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  next(err)
})

module.exports = app