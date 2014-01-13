var socketio = require("socket.io");

var createChat = function (server) {
  var io = socketio.listen(server);
  var sockets = [];
  io.sockets.on('connection', function (socket) {
    console.log("connection from ", socket.id);
    sockets.push(socket);

    socket.on("create-message", function(data){
      console.log(data);
      io.sockets.emit('message', data)
    });

    socket.on("disconnect", function(){
      var sIndex = sockets.indexOf(socket);
      sockets.splice(sIndex, 1);
    });

  });
};

module.exports.createChat = createChat;