var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(1337);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on("jiha", function(data) {
        console.log(data);
        io.sockets.emit("w00t", data);
    });
});
