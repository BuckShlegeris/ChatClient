var socketio = require("socket.io");

var createChat = function (server) {

  var guestNumber = 1;
  var nicknames = {};

  var io = socketio.listen(server);
  var sockets = [];
  io.sockets.on('connection', function (socket) {
    console.log("connection from ", socket.id);
    sockets.push(socket);
    nicknames[socket.id] = "guest_"+guestNumber;
    guestNumber += 1;
    io.sockets.emit('message', {text: " has joined",
                                     nick: nicknames[socket.id]});

    socket.on("create-message", function(data){
      console.log("nicknames are ",nicknames)
      console.log(data);

      io.sockets.emit('message', {text: data.text,
                                    nick: nicknames[socket.id]});
    });

    socket.on("nicknameChangeRequest", function(data) {
      console.log("WERIUAFEIYSCVYIOU")
      var nick = data.nickname;
      if (isLegitNick(nick)) {
        io.sockets.emit('message', {text: "is now named "+nick,
                                    nick: nicknames[socket.id]});
        nicknames[socket.id] = nick;
      } else {
        socket.emit('nicknameChangeRefusal', {});
      }
    });

    socket.on("disconnect", function(){
      var sIndex = sockets.indexOf(socket);
      sockets.splice(sIndex, 1);

      io.sockets.emit('message', {text: " has left",
                                       nick: nicknames[socket.id]});
      delete nicknames[socket.id];
    })
  });
};

var isLegitNick = function (name, nicknames) {
  console.log(name.slice(0,5), nicknames);
  for(var i in nicknames) {
    console.log(i, name)
    if (nicknames[i] === name) {
      return false;
    }
  }
  return (name.slice(0,5) != "guest");
};

module.exports.createChat = createChat;