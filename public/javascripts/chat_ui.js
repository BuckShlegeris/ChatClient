var getMessage = function () {
  return $("#message").val()
}

var sendMessage = function(message, socket) {
  Chat.sendMessage(message, socket)
}

var addMessage = function(message) {
  $(".messages").append("<p>"+message+"</p>");
}

$(function() {
  var socket = io.connect();
  socket.on('message', function(data) {
    console.log(data);
    debugger
    addMessage(data.text);
  });

  $("#send-message").on('click', function() {
    sendMessage(getMessage(), socket);
  });
});
