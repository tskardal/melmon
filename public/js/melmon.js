document.addEventListener('DOMContentLoaded', function () {
    var status = {};
    function updateStatus(data){
        document.getElementById("status").innerHTML = "";
        for(var key in data) {
            var p = document.createElement('p');
            p.innerHTML = key;
            p.classList.add('well-small');
            var state = document.createElement('span');
            state.innerHTML = data[key];
            state.classList.add('label');
            state.classList.add('label-info');
            state.classList.add('state');
            p.appendChild(state);
            document.getElementById("status").appendChild(p);
        }
    }

    var r = new XMLHttpRequest();
    r.open("GET", "status", true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        status = JSON.parse(r.responseText);
        updateStatus(status);
    };
    r.send();       

    var socket = io.connect('http://localhost');
    socket.on('w00t', function (data) {
        var p = document.createElement('p');
        p.innerHTML = data.msg;
        document.getElementById('log').appendChild(p);
    });
    socket.on('status update', function (data) {
        status[data.host] = data.status;
        updateStatus(status);
    });

    function send() {
        socket.emit('jiha', {msg: document.forms['chat'].elements['message'].value});
    }
    document.forms['chat'].elements['send'].addEventListener('click', send);
});
