var getMessage = function () {
  return $("#message").val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var sendMessage = function(message, socket) {
  Chat.sendMessage(message, socket);
}

var addMessage = function(message, nick) {
  $(".messages").append("<p>"+nick+": "+message+"</p>");
}

$(function() {
  var socket = io.connect();
  socket.on('message', function(data) {
    console.log(data);
    addMessage(data.text, data.nick);
  });

  // socket.on('message', function(data) {
  //   console.log(data);
  //   addMessage(data.text, data.nick);
  // });

  $("#send-message").on('click', function() {
    var message = getMessage();
    if (message[0] === "/") {
      var messageArray = message.split(" ");
      var command = messageArray[0];
      var args = messageArray.slice(1);
      processCommand(command, args, socket);
    } else {
      sendMessage(message, socket);
    }
  });
});

var sendNicknameChangeRequest = function (nickname, socket) {
  socket.emit('nicknameChangeRequest', { 'nickname': nickname });
}

var processCommand = function (command, args, socket) {
  if (command === "/nick") {
    sendNicknameChangeRequest(args.join(" "), socket);
  }
};