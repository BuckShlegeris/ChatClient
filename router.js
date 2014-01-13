var fs = require("fs");

var dealWithRequest = function(request, response) {
  console.log(request.url);
  response.encoding = 'utf8';
  if (request.url === "/") {
    serveHomePage(response);
  } else {
    fs.readFile("public" + request.url, function(err, data) {
      if (data) {
        serveStaticPage(response, data);
      } else {
        serve404(response);
      }
    });
  }
};

var serve404 = function(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end("404");
};

var serveStaticPage = function(response, data) {
  response.write(data);
  response.end();
};

var serveHomePage = function(response) {
  fs.readFile("public/index.html", function(err, data) {
    response.write(data);
    response.end();
  });
};

module.exports.dealWithRequest = dealWithRequest;