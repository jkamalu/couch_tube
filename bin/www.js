var app = require('../app');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);

var io = require('socket.io')();
io.attach(server);

var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://user:pass@ds057862.mongolab.com:57862/couchtube';

MongoClient.connect(mongoURI, function(err, db) {

})

server.listen(port);

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
  socket.on('loadVideoByID', function(data, err) {
    MongoClient.connect(mongoURI, function(err, db) {
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
          io.sockets.in(socket.rooms[0]).emit('loadVideoByID', {roomVideoServer: data.videoKeyClient});
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
    MongoClient.connect(mongoURI, function(err, db) {
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
    MongoClient.connect(mongoURI, function(err, db) {
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