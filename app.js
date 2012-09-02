var app = require('express')();
var http = require('http')
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs')

server.listen(1337);

var status = {};

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/status', function (req, res) {
    res.send(JSON.stringify(status));
});

io.sockets.on('connection', function(socket) {
    socket.on("jiha", function(data) {
        console.log(data);
        io.sockets.emit("w00t", data);
    });
});

function checkStatus(url) {
    http.get(url, function(res) {
        status[url] = res.statusCode;               
        //console.log("Status: \n" + JSON.stringify(status));
    }).on('error', function(e) {
        console.log("URL: " + url);
        console.log("Got error: " + e.message);
    }); 
}

setInterval(function() {
    fs.readFile(__dirname + '/settings.txt', 'utf-8', function(err, data) {
        var services = data.split('\n');
        for (var i=0; i < services.length - 1; i++) {
           checkStatus(services[i]); 
        }
    });
}, 1000);
