var app = require('../app');
var debug = require('debug')('CouchTube:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var io = app.io;
var server = http.createServer(app);
io.attach(server);
var connection = require('./connectDB');

/** 
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * INPUT:     List of items in incoming JSON document, e.g. elementClient
 *
 * ACTIVITY:  Description of event activity
 *
 * OUTPUT:    List of items in outgoing JSON document, e.g. elementServer
 *
 * TODO:      What needs to be done
 */

/**
 * Listen for socket events from the client and send them out
 */
io.on('connection', function(socket) {
  
  /*
   * INPUT:     roomNameClient, videoKeyClient
   *
   * ACTIVITY:  Add the video key to the room
   *
   * OUTPUT:    videoKeyServer -> all sockets
   *
   * TODO:
   */
  socket.on('RELOAD', function(data, err) {
    connection(function(db) {
      var roomCollection = db.collection('room_collection');
      roomCollection.findOne({room_name: data.roomNameClient}, function(err, doc) {
        if (doc.room_leader == socket.id) {
          roomCollection.update(
            { 'room_name': data.roomNameClient },
            { 
              $set: {
                room_video: data.videoKeyClient,
                room_playback_time: 0,
                room_playback_state: 2
              }
            }
          );
          io.sockets.in(socket.rooms[0]).emit('RELOAD', {roomVideoServer: data.videoKeyClient});
        }
      });
    });
  });

  /*
   * INPUT:     roomNameClient
   *
   * ACTIVITY:  Add the room to the database, or update if preexisting
   *
   * OUPUT:     userStatusServer, room JSON -> sender socket
   *
   * TODO:      Handle leader change, slave playback time, other misc. updates
   */
  socket.on('JOIN', function(doc) {
    //Case inesensitivity for the roomname
    var roomNameClient = doc.roomNameClient.toUpperCase();
    //Removing user from io room and db room
    socket.leaveAll();
    socket.join(roomNameClient);
    connection(function(db) {
      var roomCollection = db.collection('room_collection');
      roomCollection.update(
        { },
        { 
          $pull: { 
            room_users: { user_socket: socket.id } 
          } 
        }
      );
      roomCollection.findOne({room_name: roomNameClient}, function(err, doc){
        var userStatus;
        /*
         * IF THE ROOM DOES NOT EXIST, CREATE IT IN THE DATABASE
         * 
         * Insert full entry room collection:
         * - name of the room
         * - new user entry: name, role, socketid
         */
        if (!doc) {
          userStatus = 'Leader';
          doc = {
              'room_name': roomNameClient,
              'room_leader': socket.id,
              'room_users': [
                {
                  'user_name': '',
                  'user_role': userStatus,
                  'user_socket': socket.id
                }
              ],
              'room_video': '',
              'room_playback_time': '',
              'room_playback_state': ''
          };
          roomCollection.insert(doc);
        } 
        /*
         * IF THE ROOM DOES EXIST, UPDATE THE USER ENTRIES IN THE DATABASE
         *
         * Insert user entry into proper room collection
         * - new user entry: name, role, socketid
         */
        else {
          userStatus = 'Slave';
          var user = {
            'user_name': '',
            'user_role': userStatus,
            'user_socket': socket.id
          };
          doc.room_users.push(user);
          roomCollection.update(
            { 'room_name': roomNameClient },
            { $push: { room_users: user } }
          );
        }
        doc.userStatusServer = userStatus;
        doc.room_leader = '';
        socket.emit('JOIN', doc);
      });
    });
  });

  /*
   * INPUT:     roomNameClient, playerStateClient, currentTimeClient
   * 
   * ACTIVITY:  Change the player state of the room and update users in room
   * 
   * OUTPUT:    playerStateServer, currentTimeServer -> all sockets
   * 
   * TODO:      Update database
   */
  socket.on('PLAYERSTATE', function(data, err) {
    connection(function(db) {
      var roomCollection = db.collection('room_collection');
      roomCollection.findOne({room_name: data.roomNameClient}, function(err, doc) {
        if (doc.room_leader == socket.id) {
          socket.broadcast.to(socket.rooms[0]).emit('PLAYERSTATE', {playerStateServer: data.playerStateClient, currentTimeServer: data.currentTimeClient});
        }
      });
    });
  });

})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
