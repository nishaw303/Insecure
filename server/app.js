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
  socket.on("userInfo", (userInfo) => {
    console.log("User connected: " + userInfo.email + " " + userInfo.id);
  });
  socket.emit('securityWebsites', [
    "www.google.com",
    "www.youtube.com"
  ]);
  socket.on('Login', (loginInfo) => {
    console.log("Login detected: " + loginInfo);
  })
  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});
