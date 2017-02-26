var app = require("../app");
var http = require("http");
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
var server = http.createServer(app);

var io = require("socket.io")();
io.attach(server);

var MongoClient = require("mongodb").MongoClient;
var mongoURI = "mongodb://user:pass@ds057862.mongolab.com:57862/couchtube";

server.listen(port);

io.on("connection", function(socket) {
    
    socket.on("video-req", function(data, err) {
        console.log(data)
        MongoClient.connect(mongoURI, function(err, db) {
            var roomCollection = db.collection("room_collection");
            roomCollection.findOne({roomKey: data.roomKey}, function(err, doc) {
                if (doc.roomLeader == socket.id) {
                    roomCollection.update(
                        { "roomKey": data.roomKey },
                        { 
                            $set: {
                                videoKey: data.videoKey,
                                playerTime: 0,
                                playerState: 2
                            }
                        }
                    );
                    var res = {
                        videoKey: data.videoKey
                    }
                    io.sockets.in(socket.rooms[0]).emit("video-res", res);
                }
            });
        });
    });

    socket.on("join-req", function(data, err) {
        console.log(data)
        var roomKey = data.roomKey.toUpperCase();
        socket.leaveAll();
        socket.join(roomKey);
        MongoClient.connect(mongoURI, function(err, db) {
            var roomCollection = db.collection("room_collection");
            roomCollection.update(
                { },
                { $pull: 
                    { 
                        roomUsers: { userSocket: socket.id } 
                    } 
                }
            );
            roomCollection.findOne({roomKey: roomKey}, function(err, doc){
                if (doc) {  
                    roomCollection.update(
                        { "roomKey": roomKey },
                        { $push: 
                            { roomUsers: {
                                "userKey": "",
                                "userStatus": "Slave",
                                "userSocket": socket.id
                                } 
                            } 
                        }
                    );
                } else {
                    roomCollection.insert({
                            "roomKey": roomKey,
                            "roomLeader": socket.id,
                            "roomUsers": [
                                {
                                    "userKey": "",
                                    "userStatus": "Leader",
                                    "userSocket": socket.id
                                }
                            ],
                            "videoKey": "",
                            "playerTime": "",
                            "playerState": ""
                    });
                }
                var res = {
                    roomKey: roomKey,
                    userStatus: doc ? "Slave" : "Leader"
                }
                socket.emit("join-res", res);
            });
        });
    });

    socket.on("stream-req", function(data, err) {
        console.log(data)
        MongoClient.connect(mongoURI, function(err, db) {
            var roomCollection = db.collection("room_collection");
            roomCollection.findOne({roomKey: data.roomKey}, function(err, doc) {
                if (doc.roomLeader == socket.id) {
                    var res = {
                        playerState: data.playerState, 
                        playerTime: data.playerTime
                    };
                    socket.broadcast.to(socket.rooms[0]).emit("stream-res", res);
                }
            });
        });
    });

})

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