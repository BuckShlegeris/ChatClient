(function(root){
  var Chat = root.Chat = (root.Chat || {});

  Chat.sendMessage = function(message, socket) {
    console.log("message", message);
    socket.emit('create-message', { 'text': message });
  };

})(this);