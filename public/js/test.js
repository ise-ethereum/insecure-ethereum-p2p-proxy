function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

var myAddress = generateUUID();

var socket = io.connect('http://localhost:8090');

socket.on('connect', function() {
    console.log('Socket connected.');
    console.log('Registering with address:', myAddress);
    socket.emit('register', { address: myAddress});
    document.getElementById('myAddress').innerHTML = myAddress;
});

socket.on('error', function(data) {
    console.error(data);
});

socket.on('receive', function(data) {
    var container = document.getElementById('receivedMessages');
    var item = document.createElement("li");
    var node = document.createTextNode(data.text);
    item.appendChild(node);
    container.appendChild(item);
});

function send() {
    var text = document.getElementById('input').value;
    document.getElementById('input').value = '';
    var to = document.getElementById('toAddress').value;
    socket.emit('send', {to: to, payload: {text: text}});
}