var socketio = require("socket.io");

var createChat = function (server) {

  var guestNumber = 1;
  var nicknames = {};
  var currentRooms = {};

  var io = socketio.listen(server);
  var sockets = [];
  io.sockets.on('connection', function (socket) {
    console.log("connection from ", socket.id);
    sockets.push(socket);
    nicknames[socket.id] = "guest_"+guestNumber;
    // currentRooms[socket.id] = 'lobby';
    joinRoom(currentRooms, socket, 'lobby')
    guestNumber += 1;
    var room = currentRooms[socket.id];

    io.sockets.in(room).emit('message', {text: " has joined",
                                     nick: nicknames[socket.id]});
    updateNames(nicknames, io.sockets);

    socket.on("create-message", function(data){
      console.log("nicknames are ",nicknames)
      console.log(data);

      var room = currentRooms[socket.id];

      io.sockets.in(room).emit('message', {text: data.text,
                                    nick: nicknames[socket.id]});
    });

    socket.on("nicknameChangeRequest", function(data) {
      var nick = data.nickname;
      if (isLegitNick(nick)) {
        io.sockets.emit('message', {text: "is now named "+nick,
                                    nick: nicknames[socket.id]});
        nicknames[socket.id] = nick;
        updateNames(nicknames, io.sockets);
      } else {
        socket.emit('nicknameChangeRefusal', {});
      }
    });

    socket.on("roomChangeRequest", function(data) {
      var nick = nicknames[socket.id];
      var oldRoom = currentRooms[socket.id];
      var room = data.room;
      io.sockets.in(oldRoom).emit('message', {text: "is leaving " + oldRoom,
                                  nick: nick });
      updateRoomUsers(nicknames, io.sockets, oldRoom);
      joinRoom(currentRooms, socket, room);
      io.sockets.in(room).emit('message', {text: "is entering " + room,
                                  nick: nick });
      updateRoomUsers(nicknames, io.sockets, room);
    });


    socket.on("disconnect", function(){
      var sIndex = sockets.indexOf(socket);
      sockets.splice(sIndex, 1);

      var room = currentRooms[socket.id];

      io.sockets.in(room).emit('message', {text: " has left",
                                       nick: nicknames[socket.id]});
      delete nicknames[socket.id];
      updateNames(nicknames, io.sockets);
    })
  });
};

var joinRoom = function (currentRooms, socket, room) {
  var currentRoom = currentRooms[socket.id];
  if (currentRoom) {
    socket.leave(currentRoom);
  }
  currentRooms[socket.id] = room;
  socket.join(room);
  socket.emit("changeRoom", {roomName : room});
};

var userNameList = function (nicknames) {
  var names = [];
  for(var key in nicknames) {
    names.push(nicknames[key]);
  }
  return names;
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

var updateNames = function(nicknames, sockets) {
  sockets.emit('changeUsers', { userList: userNameList(nicknames)})
}

var updateRoomUsers = function(nicknames, sockets, room) {
  var usersArray = sockets.clients(room);
  var nicksArray = [];
  for (var i = 0; i < usersArray.length; i++) {
    nicksArray.push(nicknames[usersArray[i]]);
  }
  io.sockets.in(room).emit('changeRoomUsers',{userList: nicksArray});
}

module.exports.createChat = createChat;