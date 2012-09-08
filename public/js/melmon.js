document.addEventListener('DOMContentLoaded', function () { 
    var r = new XMLHttpRequest();
    r.open("GET", "status", true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return; 
        (function (data){
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
        })(JSON.parse(r.responseText));
    };
    r.send();       

    var socket = io.connect('http://localhost');
    socket.on('w00t', function (data) {
        var p = document.createElement('p');
        p.innerHTML = data.msg;
        document.getElementById('log').appendChild(p);
    });

    function send() {
        socket.emit('jiha', {msg: document.forms['chat'].elements['message'].value});
    }
    document.forms['chat'].elements['send'].addEventListener('click', send);
});
