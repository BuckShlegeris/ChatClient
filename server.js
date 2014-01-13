var http = require('http');
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var router = require("./router");
var chatServer = require("./lib/chat_server")

var server = http.createServer(function(request, response) {
  router.dealWithRequest(request, response);
}).listen(8080);

chatServer.createChat(server);

console.log("server started");