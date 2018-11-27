var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/* The server will be broadcasting it's public encryption key to the clients 
so the login info and online status can be encrypted
*/
io.on('connection', (socket) => {
    socket.emit('Connected', { message: 'Connected to server' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
