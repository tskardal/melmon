var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var url = require('url');

server.listen(1337);

var status = {};

// routing
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/status', function (req, res) {
    res.end(JSON.stringify(status));
});

io.sockets.on('connection', function(socket) {
    socket.on("jiha", function(data) {
        console.log(data);
        io.sockets.emit("w00t", data);
    });
});

function checkStatus(host) {
    var parsed = url.parse(host);
    var mode = http;
    if (parsed.protocol == 'https:') {
        mode = https;
    }

    function onStatus(host, newStatus) {
        if (status[host] !== newStatus) {
            status[host] = newStatus;
            io.sockets.emit('status update', { "host": host, "status": newStatus });
        }
    }

    mode.get({host: parsed.host, path: parsed.path}, function(res) {
        if (res.statusCode == 301) {
            var redirect = res.headers.location;
            console.log("redirect: " + host + " --> " + redirect);
            checkStatus(redirect);
        } else {
            onStatus(host, res.statusCode);
        }
    }).on('error', function(e) {
        console.log("URL: " + host);
        console.log("Got error: " + e.message);
        onStatus(host, "-");
    }); 
}

function readConfig() {
    fs.readFile(__dirname + '/settings.txt', 'utf-8', function(err, data) {
        var services = data.split('\n');
        for (var i=0; i < services.length - 1; i++) {
           checkStatus(services[i]); 
        }
    });
}
readConfig();
setInterval(readConfig, 15000);

